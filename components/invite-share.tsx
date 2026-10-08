'use client';
import { useEffect, useRef, useState } from 'react';
import { activities, cardUrl, composerUrl, endTimeText, invitationText, inviteUrl, platforms, shareActivity, shareGameTitle, sharePlatform, shareUntil, type Activity, type Platform } from '@/lib/share';
import { SocialIcon } from './socials';

export function InviteShare({ id, invite }: { id: string; invite: string }) {
  const [platform, setPlatform] = useState<Platform>('LINE');
  const [notice, setNotice] = useState('');
  const [activity, setActivity] = useState<Activity>('talk');
  const [gameTitle, setGameTitle] = useState('');
  const [expiresAt, setExpiresAt] = useState<number>();
  const [duration, setDuration] = useState('none');
  const [until, setUntil] = useState<number>();
  const [now, setNow] = useState(() => Date.now());
  const [infoError, setInfoError] = useState('');
  const input = useRef<HTMLInputElement>(null);
  const messageInput = useRef<HTMLTextAreaElement>(null);
  const url = typeof window === 'undefined' ? '' : inviteUrl(window.location.origin, id, invite, platform, activity, until, gameTitle);
  const text = invitationText(activity, until, gameTitle);
  const imageUrl = cardUrl(platform, activity, until, gameTitle);
  const expired = !!expiresAt && now >= expiresAt;
  useEffect(() => {
    const abort = new AbortController();
    const query = new URLSearchParams(window.location.search);
    const sharedUntil = shareUntil(query.get('until'));
    setPlatform(sharePlatform(query.get('share')));
    setActivity(shareActivity(query.get('activity')));
    setGameTitle(shareGameTitle(query.get('game')));
    if (sharedUntil) { setUntil(sharedUntil); setDuration('shared'); }
    fetch('/api/voice/invite', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, invite }), signal: abort.signal }).then(async r => {
      const value = await r.json(); if (!r.ok) throw new Error(value.error || '終了時刻を確認できませんでした。');
      if (abort.signal.aborted) return;
      const expiry = Date.parse(value.expiresAt); if (!Number.isFinite(expiry)) throw new Error('終了時刻を確認できませんでした。');
      setExpiresAt(expiry); setInfoError('');
      if (sharedUntil && sharedUntil > expiry) { setUntil(undefined); setDuration('none'); }
    }).catch(error => { if (!abort.signal.aborted) setInfoError(error instanceof Error ? error.message : '終了時刻を確認できませんでした。'); });
    const timer = window.setInterval(() => setNow(Date.now()), 30000);
    return () => { abort.abort(); window.clearInterval(timer); };
  }, [id, invite]);
  function chooseDuration(value: string) {
    const current = Date.now(); setNow(current); setDuration(value); setNotice('');
    setUntil(value === 'none' || !expiresAt ? undefined : value === 'max' ? expiresAt : Math.min(current + Number(value) * 60000, expiresAt));
  }
  const manual = platform === 'Instagram' || platform === 'Discord';
  async function copy() {
    try { await navigator.clipboard.writeText(url); setNotice('リンクをコピーしました。友達に貼り付けて送れます。'); }
    catch { input.current?.focus(); input.current?.select(); setNotice('リンクを選択しました。長押しなどでコピーしてください。'); }
  }
  async function copyMessage() {
    try { await navigator.clipboard.writeText(`${text}\n${url}`); setNotice('文章とリンクをコピーしました。そのまま貼り付けて送れます。'); }
    catch { messageInput.current?.focus(); messageInput.current?.select(); setNotice('文章を選択しました。長押しなどでコピーしてください。'); }
  }
  return <section className="invite-share-panel" aria-labelledby="invite-share-title">
    <div className="share-heading"><span className="section-label">INVITE YOUR FRIENDS</span><h3 id="invite-share-title">友達を招待しよう</h3><p>どこに送る？カードとリンクを選んでシェア。</p></div>
    <div className="share-platforms" aria-label="投稿先のSNS">{platforms.map(p => <button type="button" key={p} aria-pressed={platform === p} onClick={() => { setPlatform(p); setNotice(''); }}><SocialIcon name={p} /><span>{p}</span></button>)}</div>
    <div className="share-options"><label>今、何してる？<select value={activity} onChange={e => { setActivity(shareActivity(e.target.value)); setNotice(''); }}>{(Object.keys(activities) as Activity[]).map(key => <option key={key} value={key}>{activities[key].label}</option>)}</select></label>{activity === 'game' ? <label className="share-game-title">募集中のゲームタイトル（任意）<input value={gameTitle} maxLength={40} placeholder="例：モンスターハンター、マリオカート" onChange={e => { setGameTitle(e.target.value); setNotice(''); }} /><small>招待文・カード・リンクのプレビューに表示されます。</small></label> : null}<label>あとどのくらいやる予定？<select value={duration} onChange={e => chooseDuration(e.target.value)} disabled={!expiresAt || expired}>{duration === 'shared' ? <option value="shared">共有時に選んだ予定</option> : null}<option value="none">未定・時間を書かない</option>{[15,30,45].map(n => <option key={n} value={n} disabled={!expiresAt || now + n * 60000 > expiresAt}>あと{n}分くらい</option>)}<option value="max">ルーム終了まで（最大1時間）</option></select></label></div>
    <p className="share-time-note" role="status">{expired ? 'このルームは終了時刻を過ぎています。新しいルームを作ってください。' : infoError || (expiresAt ? `ルーム終了：${new Intl.DateTimeFormat('ja-JP', { timeZone: 'Asia/Tokyo', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(expiresAt)}（日本時間）。終了予定は目安です。` : 'ルームの終了時刻を確認中…')}</p>
    <div className={`share-card-preview ${platform === 'Instagram' ? 'share-story' : ''}`}>
      {/* Generated same-origin PNG is also the downloadable/OGP asset. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img key={imageUrl} src={imageUrl} alt={`${platform}用のYO招待カード：${activities[activity].second} ${activity === 'game' ? shareGameTitle(gameTitle) : ''} ${endTimeText(until)}`} width={platform === 'Instagram' ? 1080 : 1200} height={platform === 'Instagram' ? 1920 : 630} />
    </div>
    <p className="share-instruction">{platform === 'Instagram' ? 'カードを保存してストーリーズへ。リンクスタンプやDMに、コピーしたリンクを貼り付けてね。' : platform === 'Discord' ? '送りたいDMやチャンネルにリンクを貼り付けてね。カードは画像としても送れます。' : `${platform}を開いて、送りたい相手や投稿内容を選んでね。`}</p>
    <label className="share-link-label">招待リンク<input ref={input} readOnly value={url} onFocus={e => e.currentTarget.select()} /></label>
    <label className="share-link-label">共有する文章<textarea className="share-message" ref={messageInput} readOnly value={`${text}\n${url}`} rows={5} onFocus={e => e.currentTarget.select()} /></label>
    <div className="invite-actions"><button type="button" className="button primary" disabled={expired} onClick={() => void copyMessage()}>文章＋リンクをコピー</button><button type="button" className="button light" disabled={expired} onClick={() => void copy()}>リンクだけコピー</button>{!expired ? <a className="button light" href={composerUrl(platform, url, text)} target="_blank" rel="noopener noreferrer">{platform}を開く ↗</a> : null}<a className="share-save" href={`${imageUrl}&download=1`} download={`yo-${platform.toLowerCase()}.png`}>カードを保存 ↓</a></div>
    <p className="share-status" role="status">{notice || (manual ? 'リンクは「コピー」してから貼り付けてください。' : 'リンクのプレビューはSNS側の設定・キャッシュで変わる場合があります。')}</p>
    <p className="share-private">招待は作成から1時間。参加してほしい人だけに送ってください。</p>
  </section>;
}
