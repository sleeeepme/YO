import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { inviteUrl, composerUrl, platforms, sharePlatform } from '../lib/share.ts';
import { encodeChat, decodeChat } from '../lib/voice/chat.ts';
test('all share links retain invitation in fragment, including nested composer URLs', () => {
  const secret = 'a'.repeat(43);
  for (const platform of platforms) {
    const url = new URL(inviteUrl('https://yo.example', 'yo-room', secret, platform));
    assert.equal(url.hash, `#${secret}`);
    assert.equal(url.searchParams.get('share'), platform.toLowerCase());
    assert.ok(!url.search.includes(secret));
    if (platform === 'LINE' || platform === 'X') assert.equal(new URL(composerUrl(platform, url.toString())).searchParams.get('url'), url.toString());
  }
  assert.equal(sharePlatform('../private'), 'LINE');
});
test('chat accepts Unicode/newlines as text and rejects malformed, oversized and spoofed packets', () => {
  const packet = { id: randomUUID(), body: 'こんばんは 👋\n<script>alert(1)</script>' };
  assert.deepEqual(decodeChat(encodeChat(packet)), packet);
  for (const body of ['', '  ', 'a'.repeat(501), 'bad\u0000text']) assert.throws(() => encodeChat({ id: randomUUID(), body }));
  for (const value of [{ ...packet, name: 'Host' }, { ...packet, identity: 'host' }, { ...packet, id: '../x' }, null, []]) {
    assert.equal(decodeChat(new TextEncoder().encode(JSON.stringify(value))), null);
  }
  assert.equal(decodeChat(new Uint8Array(4097)), null);
  assert.equal(decodeChat(new Uint8Array([0xff, 0xfe])), null);
  assert.equal(decodeChat(new TextEncoder().encode('{')), null);
});
