'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { Avatar } from './avatar';
import { AVATAR_COUNT, randomAvatar, validAvatar } from '@/lib/avatars';
import { Logo } from './logo';
import { SocialIcon } from './socials';
import { VoiceTest } from './voice-test';
import { UsageGuide } from './usage-guide';
import { rooms, moodLabels, type Mood, type Room } from '@/lib/rooms';

const socials = ['Instagram', 'X', 'Discord', 'LINE'] as const;
export function PreviewApp({ initialRoom }: { initialRoom?: Room }) {
  const [seed, setSeed] = useState(0);
  const [creationMood, setCreationMood] = useState<Mood>(initialRoom?.mood ?? 'drink');
  const [creationVersion, setCreationVersion] = useState(0);
  const [modal, setModal] = useState<'create' | 'about'>('about');
  const [notice, setNotice] = useState('');
  const dialog = useRef<HTMLDialogElement>(null);
  const joinPanel = useRef<HTMLElement>(null);
  const previewDetails = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    let value = Math.floor(Math.random() * AVATAR_COUNT);
    try {
      const saved = localStorage.getItem('yo.avatar.v2');
      const parsed = saved === null ? NaN : Number(saved);
      if (validAvatar(parsed)) value = parsed;
      localStorage.setItem('yo.avatar.v2', String(value));
    } catch { /* Storage is optional. */ }
    setSeed(value);
  }, []);
  function showModal(kind: typeof modal) { setModal(kind); dialog.current?.showModal(); }
  function showAvatar() { if (previewDetails.current) previewDetails.current.open = true; joinPanel.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
  function shuffle() {
    const next = randomAvatar(seed);
    setSeed(next);
    try { localStorage.setItem('yo.avatar.v2', String(next)); setNotice('アバターをこのブラウザに保存しました。'); }
    catch { setNotice('アバターを変更しました。このブラウザでは保存できません。'); }
  }
  return <div className="yo-page home-page">
    <a href="#main" className="skip-link">本文へ移動</a>
    <header className="site-header home-header"><Link href="/" aria-label="YO トップ"><Logo /></Link><span className="brand-tagline">Say YO. Hang out.</span><nav aria-label="メインナビゲーション"><button onClick={() => document.getElementById('room-create')?.scrollIntoView({ behavior: 'smooth' })}>ルーム</button><button onClick={() => showAvatar()}>アバター</button><button onClick={() => showModal('about')}>YOについて</button></nav></header>
    <main id="main" className="home-main" tabIndex={-1}>
      <section className="intro hero" aria-label="YOへようこそ">
        <div className="hero-visual" aria-hidden="true"><Image src="/hero-virtual-v1.webp" alt="" fill priority sizes="100vw" /></div>
        <div className="hero-content"><p className="eyebrow">Say YO. Hang out.</p><h1>これから、ちょっと集まろ。</h1><p className="intro-copy">飲んだり、遊んだり、ただしゃべったり。<br />ひまな時間に、友達とサクッとボイチャ。</p>
          <section id="room-create" className="mood-choices" aria-label="気分を選んでルームを作る">
            <h2 className="mood-prompt">今日はどんな気分？</h2>
            <div className="mood-grid">{rooms.map((room, index) => <button type="button" key={room.mood} className={`mood-choice mood-${room.mood}`} aria-label={`${moodLabels[room.mood]}：ルームを作る`} aria-haspopup="dialog" onClick={() => { setCreationMood(room.mood); setCreationVersion(value => value + 1); showModal('create'); }}>
              <span className="mood-character" style={{ backgroundPosition: `${index * 50}% center` }} aria-hidden="true" />
              <strong>{moodLabels[room.mood]}</strong><span className="mood-subtitle">{room.mood === 'game' ? 'みんなで遊ぼう' : room.title}</span>
              <span className="mood-action">ルームを作る <span aria-hidden="true">＋</span></span>
            </button>)}</div>
          </section>
          <div className="social-path hero-socials">{socials.map(name => <div key={name}><SocialIcon name={name} /><span>{name}</span></div>)}</div>
        </div>
      </section>
      <div className="home-details"><UsageGuide onCreate={() => { setCreationVersion(value => value + 1); showModal('create'); }} />
      <details className="usage-preview-details" ref={previewDetails}><summary>あなたのアバター</summary>
        <section className="join-column home-avatar-tool" ref={joinPanel} aria-label="アバターの変更">
          <div className="join-card avatar"><div className="welcome-art"><p>こんにちは！</p><span className="welcome-spark">✦</span><Avatar seed={seed} /><span className="welcome-spark second">✦</span></div>
            <div className="avatar-body"><p>20種類からランダムに選ばれます。</p><button className="button light" onClick={shuffle}>◇ ランダムで変更</button><p className="card-fine-print">選んだアバターはこのブラウザに保存します。<br />ルームに参加するときも、アバターを変更できます。</p></div>
          </div>
        </section>
      </details>
      <p role="status" aria-live="polite" className="notice">{notice}</p><footer><Logo /><span>これから、ちょっと集まろ。</span><button onClick={() => showModal('about')}>YOについて</button></footer></div>
    </main>
    <dialog ref={dialog} className={`modal ${modal === 'create' ? 'create-modal' : ''}`} aria-labelledby={modal === 'create' ? 'room-dialog-title' : undefined}><button className="modal-close" aria-label="閉じる" onClick={() => dialog.current?.close()}>×</button>{modal === 'create' ? <><h2 id="room-dialog-title">{moodLabels[creationMood]}</h2><VoiceTest key={creationVersion} hero defaultTitle={rooms.find(room => room.mood === creationMood)?.title} /></> : <><Logo /><h2>これから、ちょっと集まろ。</h2><p>YOは、SNSのリンクから友達と集まれる、最大8人のボイスチャット。登録なしでルームを作って、乾杯・雑談・ゲームを楽しめます。</p><div className="form-note">ルームは作成から1時間。招待リンクを知っている人が参加できます。参加してほしい人だけに共有してください。マイクは参加後にONにできます。</div><a className="text-button" href="https://github.com/sleeeepme/YO" target="_blank" rel="noreferrer">プロジェクトを見る ↗</a></> }</dialog>
  </div>;
}
