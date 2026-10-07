import test from 'node:test';
import assert from 'node:assert/strict';
import { signGuest, verifyGuest, validInvite, validRoom, equal, hash } from '../lib/voice/security.ts';
const secret = 'test-only-secret-not-a-production-key';
const now = 1791302400000;
test('guest sessions reject tampering, expiry, changed keys and excessive future lifetimes', () => {
 const token = signGuest(secret, '00000000-0000-4000-8000-000000000001', now);
 assert.equal(verifyGuest(token, secret, now), '00000000-0000-4000-8000-000000000001');
 assert.equal(verifyGuest(token.replace('8000','9000'), secret, now), null);
 assert.equal(verifyGuest(token, secret, now + 86400001), null);
 assert.equal(verifyGuest(token, 'different', now), null);
 assert.equal(verifyGuest(token, secret, now - 86400000), null);
 assert.equal(verifyGuest(token + '.extra', secret, now), null);
 assert.equal(verifyGuest(undefined, secret, now), null);
});
test('sample IDs, weak links and path injection cannot authorize guest rooms', () => {
 assert.equal(validRoom('friday-drink'), false);
 assert.equal(validRoom('yo-00000000-0000-4000-8000-000000000001'), true);
 for (const bad of ['../secret', '<script>', '', 5]) assert.equal(validRoom(bad), false);
 assert.equal(validInvite('a'.repeat(43)), true);
 for (const bad of ['a'.repeat(42), 'a'.repeat(44), 'a'.repeat(42)+'/', 42]) assert.equal(validInvite(bad), false);
 assert.equal(equal(hash('a', secret), hash('b',secret)), false);
 assert.equal(equal('short','longer'), false);
});
