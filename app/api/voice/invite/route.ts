import { NextRequest } from 'next/server';
import { body, failed, getRoom, rate, response, VoiceError } from '@/lib/voice/server';
import { equal, hash, validInvite, validRoom } from '@/lib/voice/security';
export const runtime = 'nodejs';
export async function POST(req: NextRequest) {
  try {
    const input = await body(req);
    if (!validRoom(input.id) || !validInvite(input.invite)) throw new VoiceError('招待リンクを開き直してください。', 403);
    await rate(`invite-info:${input.id}`, 60);
    const room = await getRoom(input.id);
    if (!equal(hash(input.invite, process.env.YO_SESSION_SECRET!), room.invite_hash)) throw new VoiceError('招待リンクが無効です。', 403);
    return response({ expiresAt: room.expires_at, title: room.title });
  } catch (error) { return failed(error); }
}
