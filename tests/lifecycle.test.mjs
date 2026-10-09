import test from 'node:test';
import assert from 'node:assert/strict';
import { terminateRoom } from '../lib/voice/lifecycle.ts';

function fixture({ audioFails = 0, missing = false, dbFails = false, absent = false, slotsFail = false } = {}) {
  const state = { closed: false, slots: 2, attempts: 0, order: [] };
  const db = { from(table) {
    return {
      select() { if (table === 'yo_voice_slots') return { async eq() { return { data: [{ guest_id: 'connected' }, { guest_id: 'reserved' }], error: null }; } }; return { eq() { return { async maybeSingle() {
        return { data: missing ? null : { id: 'room' }, error: null };
      } }; } }; },
      update() { return { async eq() {
        state.order.push('close');
        if (dbFails) return { error: new Error('db down') };
        state.closed = true; return { error: null };
      } }; },
      delete() { return { async eq() {
        assert.equal(table, 'yo_voice_slots');
        state.order.push('release');
        if (slotsFail) { slotsFail = false; return { error: new Error('db down') }; }
        state.slots = 0; return { error: null };
      } }; },
    };
  } };
  const live = {
    async listRooms() { return absent ? [] : [{ name: 'room' }]; },
    async listParticipants() { return [{ identity: 'connected' }]; },
    async removeParticipant(_id, identity, options) {
      assert.equal(state.closed, true);
      assert.ok(options.revokeTokenTs >= BigInt(Math.floor(Date.now() / 1000)));
      state.order.push('revoke:' + identity);
    },
    async deleteRoom() {
    assert.equal(state.closed, true, 'new participation must stop before disconnect');
    state.order.push('disconnect'); state.attempts++;
    if (audioFails-- > 0) throw Object.assign(new Error('provider secret error'), { code: 'unavailable' });
    if (absent) throw Object.assign(new Error('absent'), { code: 'not_found' });
  } };
  return { db, live, state };
}

test('closure retries after audio failure and remains safe to repeat', async () => {
  const f = fixture({ audioFails: 1 });
  await assert.rejects(terminateRoom(f, 'room'), /Audio room termination failed/);
  assert.equal(f.state.closed, true);
  assert.equal(f.state.slots, 2);
  await terminateRoom(f, 'room');
  await terminateRoom(f, 'room');
  assert.equal(f.state.slots, 0);
  assert.equal(f.state.attempts, 3);
  assert.ok(f.state.order.includes('revoke:connected'));
  assert.ok(f.state.order.includes('revoke:reserved'));
});
test('a DB failure never disconnects an open room', async () => {
  const f = fixture({ dbFails: true });
  await assert.rejects(terminateRoom(f, 'room'), /Room closure failed/);
  assert.equal(f.state.attempts, 0);
});
test('already absent audio rooms release reservations; missing DB rows do nothing', async () => {
  const f = fixture({ absent: true });
  await terminateRoom(f, 'room');
  assert.equal(f.state.slots, 0);
  const missing = fixture({ missing: true });
  await terminateRoom(missing, 'room');
  assert.equal(missing.state.attempts, 0);
});
test('slot-cleanup failure can be retried after the audio room is gone', async () => {
  const f = fixture({ slotsFail: true, absent: true });
  await assert.rejects(terminateRoom(f, 'room'), /Room slot cleanup failed/);
  await terminateRoom(f, 'room');
  assert.equal(f.state.slots, 0);
});
