import { NextRequest } from 'next/server';
import { WebhookReceiver } from 'livekit-server-sdk';
import { configured, response, services } from '@/lib/voice/server';
import { validRoom } from '@/lib/voice/security';
export const runtime = 'nodejs';
export async function POST(req: NextRequest) {
  if (!configured()) return response({ error: 'Unavailable' }, 503);
  const raw = await req.text(); if (Buffer.byteLength(raw) > 1048576) return response({ error: 'Too large' }, 413);
  let event;
  try { event = await new WebhookReceiver(process.env.LIVEKIT_API_KEY!, process.env.LIVEKIT_API_SECRET!).receive(raw, req.headers.get('authorization') || undefined); }
  catch { return response({ error: 'Invalid signature' }, 401); }
  const id = event.room?.name; const identity = event.participant?.identity;
  if (!validRoom(id) || !identity || !['participant_joined', 'participant_left'].includes(event.event || '')) return response({ ok: true });
  try {
    const { db, live } = services();
    if (event.event === 'participant_joined') {
      const { data, error } = await db.from('yo_voice_rooms').select('closed, expires_at').eq('id', id).single();
      if (error) throw error;
      // Expired or closed invites cannot be revived with a previously minted token.
      if (!data || data.closed || Date.parse(data.expires_at) <= Date.now()) await live.removeParticipant(id, identity);
    } else {
      const rooms = await live.listRooms([id]);
      const members = rooms.length ? await live.listParticipants(id) : [];
      // Ignore delayed leave events when the same browser has already reconnected.
      if (!members.some(p => p.identity === identity)) { const { error } = await db.rpc('yo_voice_release', { p_room: id, p_guest: identity }); if (error) throw error; }
    }
    return response({ ok: true });
  } catch { return response({ error: 'Retry later' }, 503); }
}
