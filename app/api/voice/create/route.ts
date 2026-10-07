import { randomBytes, randomUUID } from 'node:crypto';
import { NextRequest } from 'next/server';
import { body, failed, guest, rate, response, services, VoiceError } from '@/lib/voice/server';
import { equal, hash } from '@/lib/voice/security';
export const runtime = 'nodejs';
export async function POST(req: NextRequest) {
  try {
    const input = await body(req); const { db, live } = services();
    await rate('create-global', 20);
    if (typeof input.code !== 'string' || !equal(input.code, process.env.YO_TEST_HOST_CODE!)) throw new VoiceError('ホスト用コードが違います。', 403);
    const title = typeof input.title === 'string' ? input.title.trim() : ''; const capacity = input.capacity;
    if (!title || title.length > 40 || typeof capacity !== 'number' || !Number.isInteger(capacity) || capacity < 2 || capacity > 8) throw new VoiceError('名前と定員（2〜8人）を確認してください。');
    const host = await guest(true); await rate(`create:${host}`, 3);
    const id = `yo-${randomUUID()}`; const invite = randomBytes(32).toString('base64url'); const expires = new Date(Date.now() + 3600000).toISOString();
    const { error } = await db.from('yo_voice_rooms').insert({ id, title, capacity, host_id: host, invite_hash: hash(invite, process.env.YO_SESSION_SECRET!), expires_at: expires });
    if (error) throw error;
    try { await live.createRoom({ name: id, maxParticipants: capacity, emptyTimeout: 300, departureTimeout: 60 }); }
    catch (error) { await db.from('yo_voice_rooms').update({ closed: true }).eq('id', id); throw error; }
    return response({ id, title, capacity, url: `/call/${id}#${invite}`, expiresAt: expires }, 201);
  } catch (error) { return failed(error); }
}
