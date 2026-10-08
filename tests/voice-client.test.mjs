import test from 'node:test';
import assert from 'node:assert/strict';
import { withDeadline } from '../lib/voice/client.ts';
test('stalled connections surface an error; fast successes and failures retain their result', async () => {
  await assert.rejects(withDeadline(new Promise(() => {}), 5, '接続できませんでした'), /接続できませんでした/);
  assert.equal(await withDeadline(Promise.resolve('connected'), 100, 'timeout'), 'connected');
  const original = new Error('invalid invitation');
  await assert.rejects(withDeadline(Promise.reject(original), 100, 'timeout'), error => error === original);
});
