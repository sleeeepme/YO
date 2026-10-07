'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Avatar } from './avatar';
import { rooms, moodLabels, type Mood, type Room } from '@/lib/rooms';

type Panel = 'home' | 'tables' | 'avatar';
type Modal = 'create' | 'signup' | 'about';

export function PreviewApp({ initialRoom }: { initialRoom?: Room }) {
  const [panel, setPanel] = useState<Panel>('home');
  const [filter, setFilter] = useState<Mood | 'all'>('all');
  const [seed, setSeed] = useState(0);
  const [selected, setSelected] = useState<Room | undefined>(initialRoom);
  const [custom, setCustom] = useState<Room>();
  const [modal, setModal] = useState<Modal>('about');
  const [notice, setNotice] = useState('');
  const dialog = useRef<HTMLDialogElement>(null);
  const shareInput = useRef<HTMLInputElement>(null);
  const [shareUrl, setShareUrl] = useState('');
  const isSample = selected ? rooms.some(r => r.id === selected.id) : false;

  useEffect(() => {
    let initialSeed = Math.floor(Math.random() * 60);
    try {
      const value = localStorage.getItem('yo.avatar.v1');
      const parsed = value === null ? NaN : Number(value);
      if (Number.isInteger(parsed) && parsed >= 0 && parsed < 60) initialSeed = parsed;
      localStorage.setItem('yo.avatar.v1', String(initialSeed));
    } catch { /* The preview remains usable when browser storage is disabled. */ }
    setSeed(initialSeed);
  }, []);

  useEffect(() => {
    setShareUrl(selected && rooms.some(r => r.id === selected.id) ? `${window.location.origin}/invite/${selected.id}` : '');
    setNotice('');
  }, [selected]);

  function openModal(kind: Modal) { setModal(kind); dialog.current?.showModal(); }
  function shuffle() {
    const next = (seed + 1 + Math.floor(Math.random() * 5)) % 60;
    setSeed(next);
    try { localStorage.setItem('yo.avatar.v1', String(next)); setNotice('アバターをこのブラウザに保存しました。'); }
    catch { setNotice('アバターを変更しました。このブラウザでは保存できません。'); }
  }
  function navigate(next: Panel) { setPanel(next); setSelected(undefined); setNotice(''); }
  function createPreview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const title = String(form.get('title') || '').trim();
    const capacity = Number(form.get('capacity'));
    const mood = String(form.get('mood')) as Mood;
    if (!title || title.length > 40 || !Number.isInteger(capacity) || capacity < 2 || capacity > 8 || !(mood in moodLabels)) return;
    const room: Room = { id: 'local-preview', title, description: 'あなたのテーブルの見え方を確認できます。', count: 1, capacity, mood, minutes: 0, names: ['あなた'], color: 'lavender' };
    setCustom(room); setSelected(room); dialog.current?.close();
  }
  async function copyInvite() {
    if (!shareUrl) return;
    try { await navigator.clipboard.writeText(shareUrl); setNotice('サンプル招待リンクをコピーしました。'); }
    catch { setNotice('コピーできませんでした。下のリンクを選択してコピーしてください。'); shareInput.current?.focus(); shareInput.current?.select(); }
  }

  const allRooms = custom ? [custom, ...rooms] : rooms;
  const visibleRooms = allRooms.filter(r => filter === 'all' || r.mood === filter);

  return <div className="app-shell">
    <a className="skip-link" href="#main">本文へ移動</a>
    <aside className="sidebar">
      <Link href="/" className="brand" aria-label="YO トップ">YO<span>✳</span></Link>
      <p className="brand-caption">GOOD COMPANY,<br />ANYTIME.</p>
      <nav aria-label="メインナビゲーション">
        <button className={panel === 'home' && !selected ? 'nav-item active' : 'nav-item'} onClick={() => navigate('home')}><span aria-hidden="true">⌂</span>ホーム</button>
        <button className={panel === 'tables' && !selected ? 'nav-item active' : 'nav-item'} onClick={() => navigate('tables')}><span aria-hidden="true">◉</span>テーブル</button>
        <button className={panel === 'avatar' && !selected ? 'nav-item active' : 'nav-item'} onClick={() => navigate('avatar')}><span aria-hidden="true">☺</span>アバター</button>
      </nav>
      <div className="sidebar-note"><span className="tiny-star">✳</span><p>話すことがなくても、<br />一緒にいればいい。</p><button onClick={() => openModal('about')}>YOについて ↗</button></div>
      <div className="sidebar-bottom"><Avatar seed={seed} /><div><strong>あなたのアバター</strong><span>公開プレビュー</span></div></div>
    </aside>
    <div className="workspace">
      <header className="topbar"><span className="topbar-label">YOUR LITTLE HANGOUT</span><span className="preview-badge"><i />公開プレビュー</span><button className="login" onClick={() => openModal('signup')}>ログイン <span>↗</span></button></header>
      <main id="main" tabIndex={-1}>
        {selected ? <section className="room-view">
          <button className="back-button" onClick={() => { setSelected(undefined); setPanel('tables'); }}>← テーブルを見る</button>
          <div className="section-eyebrow">INVITATION PREVIEW</div>
          <div className="room-title-line"><h1>{selected.title}</h1><span className={`mood-pill ${selected.color}`}>{moodLabels[selected.mood]}</span></div>
          <p className="lead">{selected.description}</p>
          <div className="sample-warning">{isSample ? 'サンプルのテーブルです。人数・メンバー・残り時間は架空の表示です。' : 'この画面だけのプレビューです。共有ルームはまだ作成されていません。'}</div>
          <div className={`room-stage ${selected.color}`}><span className="stage-note">FRIENDS + FRIENDS</span><div className="room-table">YO<span>take a seat.</span></div>
            {Array.from({ length: selected.capacity }, (_, index) => <div className={`seat seat-${index}`} key={index}>{index < selected.count ? <><Avatar seed={isSample ? index + 1 : seed} /><span>{selected.names[index]}</span></> : <div className="empty-seat">＋<span>空いてます</span></div>}</div>)}
          </div>
          <div className="room-actions"><div><strong>{selected.count} <span>/ {selected.capacity}</span></strong><p>{selected.count === selected.capacity ? 'FULL — 満員です' : `あと${selected.capacity - selected.count}人、座れます`}</p></div>
            <button className="button primary" onClick={() => selected.count === selected.capacity ? openModal('create') : openModal('signup')}>{selected.count === selected.capacity ? '別テーブルを作る' : '参加について見る'} ↗</button></div>
          <div className="room-info"><span>♧ Friends + Friends</span><span>{selected.minutes ? `◷ 残り${selected.minutes}分（サンプル）` : '◷ 制限時間は未設定'}</span><span>◌ 音声通話は準備中</span></div>
          {isSample ? <section className="share-box"><div><h2>この雰囲気を、友達にも。</h2><p>共有されるのはサンプルの招待画面です。</p></div><button className="button secondary" onClick={copyInvite}>リンクをコピー ↗</button><label className="share-field">サンプル招待URL<input ref={shareInput} value={shareUrl} readOnly onFocus={e => e.currentTarget.select()} /></label></section> : null}
        </section> : panel === 'avatar' ? <section className="avatar-view"><div className="section-eyebrow">MAKE YOURSELF AT HOME</div><h1>まずは、そのままのあなたで。</h1><p className="lead">最初のアバターは、ランダムに。あとから気分で変えてみよう。</p><div className="avatar-showcase"><Avatar seed={seed} /><span className="scribble">hello, you! ↙</span></div><button className="button primary" onClick={shuffle}>↻ Shuffle — 着替えてみる</button><p className="muted">このブラウザに保存されます。詳細な Customize は準備中です。</p></section> : <>
          {panel === 'home' ? <section className="hero">
            <div className="hero-copy"><div className="section-eyebrow"><span /> LESS SCROLLING. MORE TALKING.</div><h1>今夜、ちょっと<br /><em>話さない？</em><span className="hero-star" aria-hidden="true">✳</span></h1><p>友達と、友達の友達と。<br />気が向いたら集まれる、小さなテーブル。</p><button className="button primary" onClick={() => { setPanel('tables'); document.getElementById('tables')?.scrollIntoView({ behavior: 'smooth' }); }}>テーブルをのぞく <span>↗</span></button><div className="hero-footnote">登録する前に、まずは雰囲気を。</div></div>
            <div className="hero-art" aria-label="アバターが小さなテーブルに集まるイラスト"><div className="art-grid" /><span className="speech speech-one">今日どうだった？</span><span className="speech speech-two">とりあえず、乾杯。</span><div className="hero-table"><span>good<br />company.</span><i /></div><div className="hero-person person-one"><Avatar seed={0} /></div><div className="hero-person person-two"><Avatar seed={1} /></div><div className="hero-person person-three"><Avatar seed={2} /></div><div className="hero-person person-four"><Avatar seed={3} /></div><span className="art-spark spark-one">✳</span><span className="art-spark spark-two">✦</span><span className="art-label">A LITTLE SPACE FOR YOUR PEOPLE.</span></div>
          </section> : <section className="tables-intro"><div className="section-eyebrow">FIND YOUR TABLE</div><h1>どんな気分で、話そう？</h1><p className="lead">いつもの友達と、いつもより少しだけ近くに。</p></section>}
          <section id="tables" className="tables-section"><div className="section-heading"><div><span className="section-eyebrow">TAKE A SEAT</span><h2>こんなテーブル、どう？ <span>サンプル</span></h2></div><button className="text-button" onClick={() => openModal('create')}>＋ テーブルを試す</button></div>
            <div className="filters" role="group" aria-label="テーブルの気分で絞り込む">{(['all', 'drink', 'chill', 'game'] as const).map(mood => <button key={mood} aria-pressed={filter === mood} onClick={() => setFilter(mood)}>{mood === 'all' ? 'すべて' : moodLabels[mood]}</button>)}</div>
            <div className="table-cards">{visibleRooms.map(room => <button key={room.id} className={`table-card ${room.color}`} onClick={() => setSelected(room)}><div className="card-top"><span>{moodLabels[room.mood]}</span><span className={room.count === room.capacity ? 'capacity full' : 'capacity'}>{room.count === room.capacity ? 'FULL' : `${room.count} / ${room.capacity}`}</span></div><h3>{room.title}</h3><p>{room.description}</p><div className="card-people">{Array.from({ length: Math.min(3, room.count) }, (_, i) => <Avatar key={i} seed={room.id === 'local-preview' ? seed : i + (room.mood === 'drink' ? 0 : 2)} />)}<span>{room.names.slice(0, 2).join(' / ')}{room.count > 2 ? ` / +${room.count - 2}` : ''}</span></div><div className="card-bottom"><span>♧ Friends + Friends</span><span className="card-arrow">↗</span></div></button>)}</div>
            <p className="sample-note">※ サンプルの人数・メンバーです。実際の入室・通話は準備中。</p>
          </section>
          <section className="invite-strip"><div className="strip-icon">↗</div><div><h2>いつものSNSから、同じテーブルへ。</h2><p>「今、話せる？」の一言でいい。</p></div><div className="socials"><span>Instagram</span><span>X</span><span>Discord</span><span>LINE</span></div><span className="strip-caption">SNS連携は順次対応予定</span></section>
        </>}
        <p className="notice" role="status" aria-live="polite">{notice}</p>
        <footer><Link href="/" className="footer-brand">YO<span>✳</span></Link><span>Talk a little. Stay a while.</span><button onClick={() => openModal('about')}>公開プレビューについて ↗</button></footer>
      </main>
    </div>
    <dialog ref={dialog} className="modal">
      <button className="modal-close" aria-label="閉じる" onClick={() => dialog.current?.close()}>×</button>
      {modal === 'create' ? <><div className="section-eyebrow">YOUR TABLE, YOUR MOOD</div><h2>テーブルを試してみよう。</h2><p>名前と人数を決めて、画面の雰囲気を確認できます。<br />このプレビューでは共有ルームは作成されません。</p><form onSubmit={createPreview}><label>テーブルの名前<input name="title" placeholder="例：今夜は、ゆるく。" required maxLength={40} autoFocus /></label><div className="form-row"><label>定員<select name="capacity" defaultValue="8">{[2, 3, 4, 5, 6, 7, 8].map(n => <option key={n} value={n}>{n}人</option>)}</select></label><label>気分<select name="mood" defaultValue="chill">{Object.entries(moodLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label></div><div className="permission-note">♧ Friends + Friends<br /><small>友達・友達の友達は自動入室。それ以外は承認制。<br />実際の関係判定は、認証・通話対応時に有効になります。</small></div><button className="button primary" type="submit">プレビューを作る ↗</button></form></> : modal === 'signup' ? <><span className="modal-star">✳</span><div className="section-eyebrow">COMING TO YOUR TABLE</div><h2>会話は、もう少しだけ待って。</h2><p>今のYOは、登録前に雰囲気を見られる公開プレビューです。<strong>ログイン・友達判定・音声通話はまだ利用できません。</strong></p><p>アバターの変更、テーブルの見え方、サンプル招待リンクの共有を試せます。</p><button className="button primary" onClick={() => { dialog.current?.close(); navigate('avatar'); }}>アバターを試す ↗</button></> : <><span className="modal-star">✳</span><div className="section-eyebrow">A LITTLE SPACE FOR YOUR PEOPLE</div><h2>話すことがなくても、<br />一緒にいればいい。</h2><p>YOは、リアルな友達と気軽に集まるボイスチャット。最大8人のテーブルに、SNSの招待から集まるサービスを目指しています。</p><div className="permission-note">公開プレビュー v0.1<br /><small>サンプルは架空のテーブルです。認証・通話・SNSログイン・共有ルームは準備中。個人情報は収集しません。アバターのみこのブラウザに保存します。</small></div><a className="text-button" href="https://github.com/sleeeepme/YO" target="_blank" rel="noreferrer">プロジェクトを見る ↗</a></>}
    </dialog>
  </div>;
}
