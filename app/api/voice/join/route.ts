import { NextRequest } from 'next/server';
import { AccessToken, TrackSource, RoomConfiguration } from 'livekit-server-sdk';
import { body, failed, getRoom, guest, rate, response, services, VoiceError } from '@/lib/voice/server';
import { equal, hash, validInvite, validRoom } from '@/lib/voice/security';
import { validAvatar } from '@/lib/avatars';
export const runtime = 'nodejs';
export async function POST(req: NextRequest) {
  try {
    const input = await body(req); const { db, live } = services();
    if (!validRoom(input.id) || !validInvite(input.invite)) throw new VoiceError('招待リンクを開き直してください。', 403);
    await rate(`join:${input.id}`, 60);
    const room = await getRoom(input.id);
    if (!equal(hash(input.invite, process.env.YO_SESSION_SECRET!), room.invite_hash)) throw new VoiceError('招待リンクが無効です。', 403);
    const name = typeof input.name === 'string' ? input.name.trim() : ''; const seed = input.seed;
    if (!name || name.length > 20 || /[\x00-\x1f]/.test(name) || !validAvatar(seed)) throw new VoiceError('表示名とアバターを確認してください。');
    const identity = await guest(true); await rate(`token:${identity}`, 10);
    // Re-create an empty room only after invite validation, preserving its configured cap.
    const liveRooms = await live.listRooms([room.id]);
    if (!liveRooms.length) await live.createRoom({ name: room.id, maxParticipants: room.capacity, emptyTimeout: 300, departureTimeout: 60 });
    const connected = (await live.listParticipants(room.id)).map(p => p.identity);
    const { data, error } = await db.rpc('yo_voice_reserve', { p_room: room.id, p_guest: identity, p_connected: connected });
    if (error) throw error;
    if (!data) throw new VoiceError('このルームは満員です。別のルームを作ってください。', 409);
    const token = new AccessToken(process.env.LIVEKIT_API_KEY!, process.env.LIVEKIT_API_SECRET!, { identity, name, metadata: JSON.stringify({ seed }), ttl: 40 });
    token.addGrant({ roomJoin: true, room: room.id, canSubscribe: true, canPublish: true, canPublishSources: [TrackSource.MICROPHONE], canPublishData: true, canUpdateOwnMetadata: false });
    // A late token must never auto-create an uncapped room.
    token.roomConfig = new RoomConfiguration({ name: room.id, maxParticipants: room.capacity });
    return response({ token: await token.toJwt(), serverUrl: process.env.LIVEKIT_URL, title: room.title, capacity: room.capacity, expiresAt: room.expires_at, host: room.host_id === identity });
  } catch (error) { return failed(error); }
}
