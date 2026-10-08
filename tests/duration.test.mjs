import test from 'node:test';
import assert from 'node:assert/strict';
import { ROOM_DURATIONS, roomDuration, durationLabel } from '../lib/voice/duration.ts';
test('room lifetime accepts bounded choices and preserves old callers default', () => {
  assert.equal(roomDuration(undefined), 60);
  for (const n of ROOM_DURATIONS) assert.equal(roomDuration(n), n);
  for (const n of [0, -30, 31, 1440, Infinity, NaN, null, '60', {}, [], true]) assert.equal(roomDuration(n), undefined);
  assert.equal(durationLabel(30), '30分'); assert.equal(durationLabel(360), '6時間');
});
