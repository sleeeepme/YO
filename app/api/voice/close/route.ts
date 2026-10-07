import { NextRequest } from 'next/server';
import { body, failed, getRoom, guest, response, services, VoiceError } from '@/lib/voice/server';
import { validRoom } from '@/lib/voice/security';
export const runtime = 'nodejs';
export async function POST(req: NextRequest) {
  try { const input = await body(req); if (!validRoom(input.id)) throw new VoiceError('ルームが無効です。'); const room = await getRoom(input.id); const identity = await guest();
    if (room.host_id !== identity) throw new VoiceError('ホストだけが終了できます。', 403);
    const { db, live } = services(); const { error } = await db.from('yo_voice_rooms').update({ closed: true }).eq('id', room.id); if (error) throw error;
    if ((await live.listRooms([room.id])).length) { const members = await live.listParticipants(room.id); await Promise.all(members.map(p => live.removeParticipant(room.id, p.identity))); }
    return response({ ok: true });
  } catch (error) { return failed(error); }
}
