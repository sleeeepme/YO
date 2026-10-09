import { start } from 'workflow/api';
import { roomLifecycle } from '@/workflows/room-lifecycle';
import { randomBytes, randomUUID } from 'node:crypto';
import { NextRequest } from 'next/server';
import { body, failed, guest, rate, response, services, VoiceError } from '@/lib/voice/server';
import { hash } from '@/lib/voice/security';
import { roomDuration } from '@/lib/voice/duration';
export const runtime = 'nodejs';
export async function POST(req: NextRequest) {
  try {
    const input = await body(req);
    const duration = roomDuration(input.durationMinutes);
    if (duration === undefined) throw new VoiceError('招待の有効期限を選び直してください。');
    const { db, live } = services();
    await rate('create-global', 20);
    const title = typeof input.title === 'string' ? input.title.trim() : ''; const capacity = input.capacity;
    if (!title || title.length > 40 || typeof capacity !== 'number' || !Number.isInteger(capacity) || capacity < 2 || capacity > 8) throw new VoiceError('名前と定員（2〜8人）を確認してください。');
    const host = await guest(true); await rate(`create:${host}`, 3);
    const id = `yo-${randomUUID()}`; const invite = randomBytes(32).toString('base64url'); const expires = new Date(Date.now() + duration * 60000).toISOString();
    const { error } = await db.from('yo_voice_rooms').insert({ id, title, capacity, host_id: host, invite_hash: hash(invite, process.env.YO_SESSION_SECRET!), expires_at: expires });
    if (error) throw error;
    try { await start(roomLifecycle, [id, expires]); await live.createRoom({ name: id, maxParticipants: capacity, emptyTimeout: 300, departureTimeout: 60 }); }
    catch (error) { console.error(JSON.stringify({ event: 'room_create_setup_failed', roomId: id })); await db.from('yo_voice_rooms').update({ closed: true }).eq('id', id); throw error; }
    return response({ id, title, capacity, url: `/call/${id}#${invite}`, expiresAt: expires }, 201);
  } catch (error) { return failed(error); }
}
