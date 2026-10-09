import { NextRequest } from 'next/server';
import { start } from 'workflow/api';
import { roomLifecycle } from '@/workflows/room-lifecycle';
import { lifecycleServices } from '@/lib/voice/lifecycle-services';
import { equal, validRoom } from '@/lib/voice/security';
import { response } from '@/lib/voice/server';
export const runtime = 'nodejs';
export const maxDuration = 300;

async function maintain(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || secret.length < 32 || !equal(req.headers.get('authorization') || '', 'Bearer ' + secret))
    return response({ error: 'Unauthorized' }, 401);
  try {
    const { db, live } = lifecycleServices();
    const rooms = await live.listRooms();
    let scheduled = 0;
    for (const audioRoom of rooms) {
      if (!validRoom(audioRoom.name)) continue;
      const { data, error } = await db.from('yo_voice_rooms')
        .select('id,closed,expires_at').eq('id', audioRoom.name).maybeSingle();
      if (error) throw new Error('Room lookup failed');
      if (!data) {
        await live.deleteRoom(audioRoom.name);
        continue;
      }
      // Also bootstrap future deadlines for rooms created before this release.
      await start(roomLifecycle, [data.id, data.closed ? undefined : data.expires_at]);
      scheduled++;
    }
    const before = new Date(Date.now() - 86400000).toISOString();
    const { error } = await db.from('yo_voice_limits').delete().lt('window_start', before);
    if (error) throw new Error('Rate-limit cleanup failed');
    console.info(JSON.stringify({ event: 'voice_maintenance_completed', scheduled }));
    return response({ ok: true, scheduled });
  } catch {
    console.error(JSON.stringify({ event: 'voice_maintenance_failed' }));
    return response({ error: 'Maintenance failed' }, 503);
  }
}
export const GET = maintain;
export const POST = maintain;
