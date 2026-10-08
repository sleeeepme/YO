import test from 'node:test';
import assert from 'node:assert/strict';
import { RoomNotifications } from '../lib/voice/notifications.ts';
function replaceGlobal(t, name, value) {
  const original = Object.getOwnPropertyDescriptor(globalThis, name);
  Object.defineProperty(globalThis, name, { value, writable: true, configurable: true });
  t.after(() => { if (original) Object.defineProperty(globalThis, name, original); else delete globalThis[name]; });
}
function fixture(t, vibrate = true) {
  const events = { tones: [], vibrations: [], resumed: 0, closed: 0 };
  class Context {
    state = 'suspended'; currentTime = 1; destination = {};
    resume() { this.state = 'running'; events.resumed++; return Promise.resolve(); }
    close() { this.state = 'closed'; events.closed++; return Promise.resolve(); }
    createOscillator() { return { frequency: { setValueAtTime: n => events.tones.push(n) }, connect() {}, disconnect() {}, start() {}, stop() {} }; }
    createGain() { return { gain: { setValueAtTime() {}, linearRampToValueAtTime() {}, exponentialRampToValueAtTime() {} }, connect() {}, disconnect() {} }; }
  }
  replaceGlobal(t, 'window', { AudioContext: Context });
  replaceGlobal(t, 'navigator', vibrate ? { vibrate: pattern => events.vibrations.push(pattern) } : {});
  return events;
}
test('join and chat have distinct tones; only joins vibrate; bursts are coalesced', t => {
  const events = fixture(t); const alerts = new RoomNotifications();
  alerts.unlock(); alerts.play('join'); alerts.play('join'); alerts.play('chat'); alerts.play('chat');
  assert.deepEqual(events.tones, [660, 880, 1046]);
  assert.deepEqual(events.vibrations, [[80, 50, 80]]);
  assert.equal(events.resumed, 1);
  alerts.dispose();
});
test('muted call suppresses notification audio; disposal stops all further alerts', t => {
  const events = fixture(t); const alerts = new RoomNotifications(); alerts.unlock();
  alerts.play('join', false); alerts.play('chat', false);
  assert.deepEqual(events.tones, []); assert.equal(events.vibrations.length, 1);
  alerts.dispose(); alerts.play('join'); alerts.unlock();
  assert.equal(events.closed, 1); assert.equal(events.vibrations.length, 1);
});
test('missing vibration support and rejected audio unlock never break notifications', t => {
  const events = fixture(t, false); const alerts = new RoomNotifications(); alerts.unlock();
  assert.doesNotThrow(() => alerts.play('join')); assert.equal(events.tones.length, 2); alerts.dispose();
  Object.defineProperty(globalThis, 'window', { configurable: true, value: { AudioContext: class { state = 'suspended'; resume() { return Promise.reject(new Error('blocked')); } close() { return Promise.resolve(); } } } });
  const blocked = new RoomNotifications(); blocked.unlock(); assert.doesNotThrow(() => blocked.play('chat')); blocked.dispose();
});
