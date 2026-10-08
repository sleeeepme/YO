'use client';
import { useRef, useState } from 'react';
import { composerUrl, inviteUrl, platforms, type Platform } from '@/lib/share';
import { SocialIcon } from './socials';

export function InviteShare({ id, invite }: { id: string; invite: string }) {
  const [platform, setPlatform] = useState<Platform>('LINE');
  const [notice, setNotice] = useState('');
  const input = useRef<HTMLInputElement>(null);
  const url = typeof window === 'undefined' ? '' : inviteUrl(window.location.origin, id, invite, platform);
  const manual = platform === 'Instagram' || platform === 'Discord';
  async function copy() {
    try { await navigator.clipboard.writeText(url); setNotice('リンクをコピーしました。友達に貼り付けて送れます。'); }
    catch { input.current?.focus(); input.current?.select(); setNotice('リンクを選択しました。長押しなどでコピーしてください。'); }
  }
  return <section className="invite-share-panel" aria-labelledby="invite-share-title">
    <div className="share-heading"><span className="section-label">INVITE YOUR FRIENDS</span><h3 id="invite-share-title">友達を招待しよう</h3><p>どこに送る？カードとリンクを選んでシェア。</p></div>
    <div className="share-platforms" aria-label="投稿先のSNS">{platforms.map(p => <button type="button" key={p} aria-pressed={platform === p} onClick={() => { setPlatform(p); setNotice(''); }}><SocialIcon name={p} /><span>{p}</span></button>)}</div>
    <div className={`share-card-preview ${platform === 'Instagram' ? 'share-story' : ''}`}>
      {/* Generated same-origin PNG is also the downloadable/OGP asset. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`/api/share/card?platform=${platform.toLowerCase()}`} alt={`${platform}用のYO招待カード`} width={platform === 'Instagram' ? 1080 : 1200} height={platform === 'Instagram' ? 1920 : 630} />
    </div>
    <p className="share-instruction">{platform === 'Instagram' ? 'カードを保存してストーリーズへ。リンクスタンプやDMに、コピーしたリンクを貼り付けてね。' : platform === 'Discord' ? '送りたいDMやチャンネルにリンクを貼り付けてね。カードは画像としても送れます。' : `${platform}を開いて、送りたい相手や投稿内容を選んでね。`}</p>
    <label className="share-link-label">招待リンク<input ref={input} readOnly value={url} onFocus={e => e.currentTarget.select()} /></label>
    <div className="invite-actions"><button type="button" className="button primary" onClick={() => void copy()}>リンクをコピー</button><a className="button light" href={composerUrl(platform, url)} target="_blank" rel="noopener noreferrer">{platform}を開く ↗</a><a className="share-save" href={`/api/share/card?platform=${platform.toLowerCase()}&download=1`} download={`yo-${platform.toLowerCase()}.png`}>カードを保存 ↓</a></div>
    <p className="share-status" role="status">{notice || (manual ? 'リンクは「コピー」してから貼り付けてください。' : 'リンクのプレビューはSNS側の設定・キャッシュで変わる場合があります。')}</p>
    <p className="share-private">招待は作成から1時間。参加してほしい人だけに送ってください。</p>
  </section>;
}
