import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { inviteUrl, composerUrl, platforms, sharePlatform, shareActivity, shareUntil, invitationText, cardUrl } from '../lib/share.ts';
import { encodeChat, decodeChat } from '../lib/voice/chat.ts';
test('all share links retain invitation in fragment, including nested composer URLs', () => {
  const secret = 'a'.repeat(43);
  for (const platform of platforms) {
    const url = new URL(inviteUrl('https://yo.example', 'yo-room', secret, platform));
    assert.equal(url.hash, `#${secret}`);
    assert.equal(url.searchParams.get('share'), platform.toLowerCase());
    assert.equal(url.searchParams.get('openExternalBrowser'), platform === 'LINE' ? '1' : null);
    assert.ok(!url.search.includes(secret));
    if (platform === 'LINE' || platform === 'X') assert.equal(new URL(composerUrl(platform, url.toString())).searchParams.get('url'), url.toString());
  }
  assert.equal(sharePlatform('../private'), 'LINE');
});
test('Japanese sharing text, time and OGP use the same bounded public choices', () => {
  const until = Date.UTC(2026, 9, 8, 14, 30);
  const text = invitationText('game', until);
  assert.match(text, /遊んでるよ！/);
  assert.match(text, /10\/8 23:30ごろまで/);
  assert.match(invitationText('drink'), /飲んでるよ！/);
  assert.ok(!invitationText('talk').includes('ごろまで'));
  assert.equal(shareActivity('<script>'), 'talk');
  assert.equal(shareUntil(String(until)), until);
  for (const value of ['Infinity', 'NaN', '1e12', '-1791469800000', 'x', Date.UTC(2100,0,1), null, ['1','2']]) assert.equal(shareUntil(value), undefined);
  const link = inviteUrl('https://yo.example', 'yo-room', 'secret', 'X', 'game', until);
  assert.equal(new URL(link).searchParams.get('until'), String(until));
  assert.equal(new URL(link).hash, '#secret');
  assert.equal(new URL(composerUrl('X', link, text)).searchParams.get('text'), text);
  assert.equal(new URL(cardUrl('X','game',until), 'https://yo.example').searchParams.get('until'), String(until));
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
