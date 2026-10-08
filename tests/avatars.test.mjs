import test from 'node:test';
import assert from 'node:assert/strict';
import { AVATAR_COUNT, avatarIds, validAvatar, avatarId, randomAvatar } from '../lib/avatars.ts';
test('the same twenty IDs are valid for selection and participant metadata; other values are rejected', () => {
  assert.equal(AVATAR_COUNT, 20);
  assert.deepEqual(avatarIds, Array.from({length:20}, (_, i) => i));
  for (const id of avatarIds) { assert.equal(validAvatar(id), true); assert.equal(avatarId(id), id); }
  for (const value of [-1, 20, 0.5, NaN, Infinity, '19', null, {}]) assert.equal(validAvatar(value), false);
  assert.equal(avatarId(NaN), 0);
  assert.equal(avatarId(-1), 19);
  assert.equal(avatarId(20), 0);
});

test("random changes always produce a different valid avatar and can reach every alternative", t => {
  for (const current of avatarIds) {
    const found = new Set();
    for (let offset = 0; offset < AVATAR_COUNT - 1; offset++) {
      t.mock.method(Math, "random", () => (offset + 0.5) / (AVATAR_COUNT - 1));
      const next = randomAvatar(current);
      assert.equal(validAvatar(next), true);
      assert.notEqual(next, current);
      found.add(next);
      t.mock.restoreAll();
    }
    assert.equal(found.size, AVATAR_COUNT - 1);
  }
});
