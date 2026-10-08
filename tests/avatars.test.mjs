import test from 'node:test';
import assert from 'node:assert/strict';
import { AVATAR_COUNT, avatarIds, validAvatar, avatarId } from '../lib/avatars.ts';
test('the same seventeen IDs are valid for selection and participant metadata; other values are rejected', () => {
  assert.equal(AVATAR_COUNT, 17);
  assert.deepEqual(avatarIds, Array.from({length:17}, (_, i) => i));
  for (const id of avatarIds) { assert.equal(validAvatar(id), true); assert.equal(avatarId(id), id); }
  for (const value of [-1, 17, 0.5, NaN, Infinity, '16', null, {}]) assert.equal(validAvatar(value), false);
  assert.equal(avatarId(NaN), 0);
  assert.equal(avatarId(-1), 16);
  assert.equal(avatarId(17), 0);
});
