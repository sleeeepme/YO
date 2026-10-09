import { sleep, RetryableError } from 'workflow';
import { lifecycleServices } from '@/lib/voice/lifecycle-services';
import { terminateRoom } from '@/lib/voice/lifecycle';

// Persist only the opaque room ID and deadline, never invitations or secrets.
export async function roomLifecycle(id: string, expiresAt?: string) {
  'use workflow';
  if (expiresAt) await sleep(new Date(expiresAt));
  await terminateRoomStep(id);
  // Catch tokens issued just before closure (40s TTL), including auto-created
  // rooms. Webhooks reject late entrants; this is an independent second sweep.
  await sleep('60s');
  await terminateRoomStep(id);
  return { terminated: true };
}

async function terminateRoomStep(id: string) {
  'use step';
  try {
    await terminateRoom(lifecycleServices(), id);
    console.info(JSON.stringify({ event: 'room_terminated', roomId: id }));
  } catch {
    console.error(JSON.stringify({ event: 'room_termination_retry', roomId: id }));
    throw new RetryableError('Room termination unavailable', { retryAfter: '5m' });
  }
}
// Retry temporary outages for up to 24 hours, then surface a failed run.
terminateRoomStep.maxRetries = 288;
