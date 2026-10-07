import { NextRequest } from 'next/server';
import { body, failed, guest, response, services, VoiceError } from '@/lib/voice/server';
import { validRoom } from '@/lib/voice/security';
export const runtime = 'nodejs';
export async function POST(req: NextRequest) {
  try { const input = await body(req); if (!validRoom(input.id)) throw new VoiceError('ルームが無効です。'); const identity = await guest(); const { live, db } = services();
    // Only release the slot after the audio server confirms this identity is absent.
    const found = (await live.listRooms([input.id])).length;
    if (found) { const members = await live.listParticipants(input.id); if (members.some(p => p.identity === identity)) await live.removeParticipant(input.id, identity); }
    const { error } = await db.rpc('yo_voice_release', { p_room: input.id, p_guest: identity }); if (error) throw error;
    return response({ ok: true });
  } catch (error) { return failed(error); }
}
