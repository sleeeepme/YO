import test from 'node:test';
import assert from 'node:assert/strict';
import { AVATAR_COUNT, avatarIds, validAvatar, avatarId } from '../lib/avatars.ts';
test('the same ten IDs are valid for selection and participant metadata; other values are rejected', () => {
  assert.equal(AVATAR_COUNT, 10);
  assert.deepEqual(avatarIds, Array.from({length:10}, (_, i) => i));
  for (const id of avatarIds) { assert.equal(validAvatar(id), true); assert.equal(avatarId(id), id); }
  for (const value of [-1, 10, 0.5, NaN, Infinity, '9', null, {}]) assert.equal(validAvatar(value), false);
  assert.equal(avatarId(NaN), 0);
  assert.equal(avatarId(-1), 9);
  assert.equal(avatarId(10), 0);
});
