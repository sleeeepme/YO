import test from 'node:test';
import assert from 'node:assert/strict';
import { AVATAR_COUNT, avatarIds, validAvatar, avatarId } from '../lib/avatars.ts';
test('the same fourteen IDs are valid for selection and participant metadata; other values are rejected', () => {
  assert.equal(AVATAR_COUNT, 14);
  assert.deepEqual(avatarIds, Array.from({length:14}, (_, i) => i));
  for (const id of avatarIds) { assert.equal(validAvatar(id), true); assert.equal(avatarId(id), id); }
  for (const value of [-1, 14, 0.5, NaN, Infinity, '13', null, {}]) assert.equal(validAvatar(value), false);
  assert.equal(avatarId(NaN), 0);
  assert.equal(avatarId(-1), 13);
  assert.equal(avatarId(14), 0);
});
