import type { SupabaseClient } from '@supabase/supabase-js';
import type { RoomServiceClient } from 'livekit-server-sdk';

export type LifecycleServices = {
  db: SupabaseClient;
  live: Pick<RoomServiceClient, 'deleteRoom' | 'listRooms' | 'listParticipants' | 'removeParticipant'>;
};

// Shared by the host API and durable jobs. Every operation is safe to repeat.
export async function terminateRoom({ db, live }: LifecycleServices, id: string) {
  const { data: room, error: readError } = await db.from('yo_voice_rooms')
    .select('id').eq('id', id).maybeSingle();
  if (readError) throw new Error('Room lookup failed');
  if (!room) return;
  const { error: closeError } = await db.from('yo_voice_rooms')
    .update({ closed: true }).eq('id', id);
  if (closeError) throw new Error('Room closure failed');

  const { data: slots, error: slotsError } = await db.from('yo_voice_slots')
    .select('guest_id').eq('room_id', id);
  if (slotsError) throw new Error('Room reservation lookup failed');
  const identities = new Set<string>((slots || []).map(slot => String(slot.guest_id)));
  if ((await live.listRooms([id])).length) {
    for (const participant of await live.listParticipants(id)) identities.add(participant.identity);
  }
  // LiveKit Cloud refreshes tokens for reconnects. Revoke them explicitly,
  // including unused reservations, without the default one-minute clock buffer.
  const cutoff = BigInt(Math.floor(Date.now() / 1000) + 1);
  const revoked = await Promise.allSettled([...identities].map(async identity => {
    try { await live.removeParticipant(id, identity, { revokeTokenTs: cutoff }); }
    catch (error) {
      if (!(error && typeof error === 'object' && 'code' in error && error.code === 'not_found')) {
        throw new Error('Participant token revocation failed');
      }
    }
  }));
  // Always disconnect even if token revocation needs a later retry.
  // DeleteRoom disconnects everyone. A room already removed by an earlier
  // attempt or LiveKit's empty-room timeout is also a successful termination.
  try { await live.deleteRoom(id); }
  catch (error) {
    if (!(error && typeof error === 'object' && 'code' in error && error.code === 'not_found')) {
      throw new Error('Audio room termination failed');
    }
  }
  if (revoked.some(result => result.status === 'rejected')) throw new Error('Participant token revocation failed');
  const { error: releaseError } = await db.from('yo_voice_slots').delete().eq('room_id', id);
  if (releaseError) throw new Error('Room slot cleanup failed');
}
