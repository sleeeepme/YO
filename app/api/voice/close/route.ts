import { NextRequest } from 'next/server';
import { start } from 'workflow/api';
import { roomLifecycle } from '@/workflows/room-lifecycle';
import { terminateRoom } from '@/lib/voice/lifecycle';
import { lifecycleServices } from '@/lib/voice/lifecycle-services';
import { body, failed, getRoom, guest, response, services, VoiceError } from '@/lib/voice/server';
import { validRoom } from '@/lib/voice/security';
export const runtime = 'nodejs';
export async function POST(req: NextRequest) {
  try {
    const input = await body(req);
    if (!validRoom(input.id)) throw new VoiceError('ルームが無効です。');
    // A closed DB row must remain accessible to its host for an idempotent retry.
    const room = await getRoom(input.id, true, true);
    const identity = await guest();
    if (room.host_id !== identity) throw new VoiceError('ホストだけが終了できます。', 403);
    const { db } = services();
    const { error } = await db.from('yo_voice_rooms').update({ closed: true }).eq('id', room.id);
    if (error) throw new Error('Room closure failed');
    // Queue before attempting the synchronous disconnect so a timeout does not
    // strand participants. The room's expiry job is another independent retry.
    let queued = false;
    try { await start(roomLifecycle, [room.id]); queued = true; }
    catch { console.error(JSON.stringify({ event: 'room_close_queue_failed', roomId: room.id })); }
    try {
      await terminateRoom(lifecycleServices(), room.id);
      return response({ ok: true, pending: false });
    } catch {
      console.error(JSON.stringify({ event: 'room_close_disconnect_failed', roomId: room.id, queued }));
      if (queued) return response({ ok: true, pending: true }, 202);
      throw new VoiceError('新しい参加は停止しました。全員の切断を確認できないため、もう一度終了してください。', 503);
    }
  } catch (error) { return failed(error); }
}
