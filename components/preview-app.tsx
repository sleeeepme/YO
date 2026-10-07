'use client';
import Link from 'next/link';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Avatar } from './avatar';
import { Logo } from './logo';
import { SocialIcon } from './socials';
import { VoiceTest } from './voice-test';
import { rooms, moodLabels, type Mood, type Room } from '@/lib/rooms';

type Step = 'choose' | 'avatar' | 'access';
const socials = ['Instagram', 'X', 'Discord', 'LINE'] as const;
export function PreviewApp({ initialRoom }: { initialRoom?: Room }) {
  const [selected, setSelected] = useState<Room>(initialRoom ?? rooms[0]);
  const [step, setStep] = useState<Step>('choose');
  const [seed, setSeed] = useState(0);
  const [filter, setFilter] = useState<Mood | 'all'>('all');
  const [custom, setCustom] = useState<Room>();
  const [modal, setModal] = useState<'create' | 'about' | 'signup'>('about');
  const [notice, setNotice] = useState('');
  const [shareUrl, setShareUrl] = useState('');
  const dialog = useRef<HTMLDialogElement>(null);
  const shareInput = useRef<HTMLInputElement>(null);
  const joinPanel = useRef<HTMLElement>(null);
  const roomPanel = useRef<HTMLElement>(null);
  const isSample = rooms.some(r => r.id === selected.id);
  const full = selected.count >= selected.capacity;
  const visibleRooms = (custom ? [custom, ...rooms] : rooms).filter(r => filter === 'all' || r.mood === filter);
  useEffect(() => {
    let value = Math.floor(Math.random() * 4);
    try {
      const saved = localStorage.getItem('yo.avatar.v2');
      const parsed = saved === null ? NaN : Number(saved);
      if (Number.isInteger(parsed) && parsed >= 0 && parsed < 4) value = parsed;
      localStorage.setItem('yo.avatar.v2', String(value));
    } catch { /* Storage is optional for this preview. */ }
    setSeed(value);
  }, []);
  useEffect(() => {
    setShareUrl(rooms.some(r => r.id === selected.id) ? `${window.location.origin}/invite/${selected.id}` : '');
    setNotice('');
  }, [selected]);
  function showModal(kind: typeof modal) { setModal(kind); dialog.current?.showModal(); }
  function chooseRoom(room: Room) { setSelected(room); setStep('choose'); document.getElementById('invitation')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  function showStep(next: Step) { setStep(next); joinPanel.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
  function shuffle() {
    const next = (seed + 1 + Math.floor(Math.random() * 3)) % 4;
    setSeed(next);
    try { localStorage.setItem('yo.avatar.v2', String(next)); setNotice('アバターをこのブラウザに保存しました。'); }
    catch { setNotice('アバターを変更しました。このブラウザでは保存できません。'); }
  }
  async function copyInvite() {
    if (!shareUrl) return;
    try { await navigator.clipboard.writeText(shareUrl); setNotice('サンプル招待リンクをコピーしました。'); }
    catch { setNotice('下のリンクを選択してコピーしてください。'); shareInput.current?.focus(); shareInput.current?.select(); }
  }
  function createPreview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const title = String(form.get('title') ?? '').trim();
    const capacity = Number(form.get('capacity'));
    const mood = String(form.get('mood')) as Mood;
    if (!title || title.length > 40 || !Number.isInteger(capacity) || capacity < 2 || capacity > 8 || !(mood in moodLabels)) return;
    const room: Room = { id: 'local-preview', title, description: 'あなたのテーブルの見え方を確認できます。', capacity, mood, count: 1, minutes: 0, names: ['あなた'], color: 'lavender' };
    setCustom(room); chooseRoom(room); dialog.current?.close();
  }
  return <div className="yo-page">
    <a href="#main" className="skip-link">本文へ移動</a>
    <header className="site-header"><Link href="/" aria-label="YO トップ"><Logo /></Link><span className="brand-tagline">今、話せる友達がいる。</span><nav aria-label="メインナビゲーション"><button onClick={() => document.getElementById('tables')?.scrollIntoView({ behavior: 'smooth' })}>テーブル</button><button onClick={() => showStep('avatar')}>アバター</button><button onClick={() => showModal('about')}>YOについて</button></nav><span className="preview-chip"><i />デザインプレビュー</span></header>
    <main id="main" tabIndex={-1}>
      <section className="intro"><div><p className="eyebrow">LINK. JOIN. TALK.</p><h1>今、話せる<span>友達がいる。</span></h1><p className="intro-copy">SNSのリンクから、いつもの友達と同じルームへ。<br />アバターで、気軽に。カスタマイズはあとから。</p></div><div className="social-path">{socials.map((name, i) => <div key={name}><SocialIcon name={name} /><span>{name}</span>{i < 3 ? <b aria-hidden="true">›</b> : null}</div>)}<span className="path-arrow" aria-hidden="true">→</span><Logo /></div></section>
      <div className="preview-note"><span>◉ 公開プレビュー</span><p>下のカードはデザインのサンプルです。実際の通話は「招待ゲスト通話テスト」から参加します。</p></div>
      <VoiceTest />
      <div className="experience-grid">
        <section className="invite-column" id="invitation"><div className="step-heading"><span>1</span><h2>リンクを開く</h2><small>ルームの雰囲気を、先に。</small></div>
          <div className="invite-phone"><div className="scene-cover"><div className="scene-shade" /><Logo /><div className="scene-spark" aria-hidden="true">✦</div></div><div className="invitation-details"><h3>{selected.title}<span aria-hidden="true">{selected.mood === 'drink' ? '🍺' : '✦'}</span></h3><div className="invite-avatar-row">{selected.names.slice(0, 3).map((name, i) => <div className="small-person" key={name}><Avatar seed={isSample ? i : seed} /></div>)}{selected.count > 3 ? <span className="more-people">+{selected.count - 3}</span> : null}</div><p className="occupancy">{selected.count}人で話しています <span>{selected.count} / {selected.capacity}{full ? ' FULL' : ''}</span></p><p className="remaining">{selected.minutes ? `あと${selected.minutes}分` : '制限時間は未設定'}<small>（プレビュー）</small></p><div className="friend-badge"><span>✓</span> Friends + Friends <small>友達とその友達</small></div><div className="named-people">{selected.names.slice(0, 3).map((name, i) => <div key={name}><span className="avatar-circle"><Avatar seed={isSample ? i : seed} /></span><span>{name}</span></div>)}{selected.count > 3 ? <div><span className="more-people">+{selected.count - 3}</span></div> : null}</div><button className="button primary" onClick={() => full ? showModal('create') : showStep('choose')}>{full ? '別テーブルを作る' : '参加方法の画面を見る'} ↗</button><button className="detail-link" onClick={() => showModal('about')}>詳細を見る</button></div></div>
          <p className="column-caption">{isSample ? '人数・メンバー・残り時間はサンプルです。' : 'この画面だけのプレビューです。共有ルームは作成されません。'}</p></section>
        <section className="join-column" ref={joinPanel}><div className="step-heading"><span>2</span><h2>{step === 'choose' ? '参加方法を選ぶ' : step === 'avatar' ? 'アバターを自動設定' : '入室前に確認'}</h2><small>{step === 'choose' ? '登録は、必要なときに。' : step === 'avatar' ? 'まずはそのままで。' : '知ってる友達だけ。'}</small></div>
          <div className={`join-card ${step}`}>
            {step === 'choose' ? <><div className="join-art"><Avatar seed={0} /><Avatar seed={1} /><span className="floating-spark">✦</span></div><div className="white-card-body"><h3>{isSample ? `${selected.names[0]}と話しますか？` : 'このルームを試してみますか？'}</h3><p>アプリをダウンロードせずに、<br />気軽に集まる体験へ。</p><button className="button primary" onClick={() => showStep('avatar')}><SocialIcon name="Discord" /><span>ゲスト参加をプレビュー<small>アカウント不要の画面を見る</small></span></button><div className="or-divider">または</div><div className="provider-buttons">{socials.map(name => <button onClick={() => showModal('signup')} key={name}><SocialIcon name={name} /><span>{name}で続ける</span><small>準備中</small></button>)}</div><p className="card-fine-print">このプレビューでは登録・ログインを行いません。</p></div></> : step === 'avatar' ? <><div className="welcome-art"><p>ようこそ！</p><span className="welcome-spark">✦</span><Avatar seed={seed} /><span className="welcome-spark second">✦</span></div><div className="avatar-body"><p>あなたのアバターを用意しました。</p><div className="avatar-options">{[0, 1, 2, 3].map(i => <button aria-label={`アバター ${i + 1}を選ぶ`} aria-pressed={seed === i} key={i} onClick={() => { setSeed(i); try { localStorage.setItem('yo.avatar.v2', String(i)); } catch {} }}><Avatar seed={i} /></button>)}</div><button className="button light" onClick={shuffle}>◇ 別のアバターにする</button><button className="button white" onClick={() => showStep('access')}>はじめる ↗</button><p className="card-fine-print">このブラウザに保存。詳細なカスタマイズは準備中。</p></div></> : <div className="access-body"><span className="lock-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><rect x="5" y="10" width="14" height="12" rx="3"/><path d="M8 10V6a4 4 0 0 1 8 0v4"/><path d="M12 15v3"/></svg></span><h3>このルームは<br />友達とその友達まで参加できます</h3><div className="access-rules"><p><span>✓</span> ホストの友達<small>自動参加</small></p><p><span>✓</span> 参加メンバーの友達<small>自動参加</small></p><p><span>＋</span> それ以外<small>参加リクエスト</small></p></div><div className="relationship-card"><strong>Friends + Friends</strong><p>友達・友達の友達は自動入室。<br />それ以外は承認が必要です。</p><span>権限判定は実装準備中</span></div><p className="access-disclaimer">上記はコンセプトの説明です。<br />このプレビューでは友達判定・入室を行いません。</p><button className="button primary" onClick={() => roomPanel.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })}>ルームの画面を見る ↗</button><button className="detail-link" onClick={() => showStep('choose')}>参加方法へ戻る</button></div>}
          </div>
          <div className="step-dots" role="group" aria-label="参加画面の切り替え">{(['choose', 'avatar', 'access'] as const).map((value, i) => <button key={value} aria-label={['参加方法','アバター','入室前の確認'][i]} aria-pressed={step === value} onClick={() => setStep(value)} />)}</div></section>
        <section className="voice-column" ref={roomPanel}><div className="step-heading"><span>3</span><h2>ボイスルームへ</h2><small>会話から始まる、つながり。</small></div><div className="voice-phone"><div className="voice-top"><span aria-hidden="true">‹</span><span>▥ ▰</span></div><h3>{selected.title}</h3><p className="voice-clock">{selected.minutes ? `${selected.minutes}:00` : '--:--'}</p><span className="voice-preview">音声未接続 · 画面プレビュー</span><div className="voice-members">{selected.names.slice(0, 4).map((name, i) => <div key={name}><span className="voice-avatar"><Avatar seed={isSample ? i : seed} /></span><p>{name}</p></div>)}{selected.count > 4 ? <div><span className="voice-avatar more">+{selected.count - 4}</span><p>ほかのメンバー</p></div> : null}</div><div className="voice-controls"><button disabled aria-label="マイク（通話準備中）"><svg viewBox="0 0 24 24"><rect x="9" y="3" width="6" height="12" rx="3"/><path d="M6 11v1a6 6 0 0 0 12 0v-1M12 18v4m-4 0h8"/></svg></button><button disabled aria-label="音声（通話準備中）"><svg viewBox="0 0 24 24"><path d="M4 9h4l5-5v16l-5-5H4Zm13-2q6 5 0 10"/></svg></button><button disabled aria-label="メニュー（準備中）">•••</button></div><button className="hangup" onClick={() => showModal('about')} aria-label="通話プレビューについて"><svg viewBox="0 0 24 24"><path d="M3 15v-4q9-7 18 0v4h-5v-4q-4-2-8 0v4Z" fill="white" /></svg></button><span className="voice-footer">実際の通話は、もう少しお待ちください。</span></div><button className="signup-later" onClick={() => showModal('signup')}>会話のあとに登録。カスタマイズはあとから ↗</button></section>
      </div>
      <section className="sharing-section"><div><span className="section-label">INVITE YOUR FRIENDS</span><h2>いつものSNSから、同じルームへ。</h2><p>Instagram / X / Discord / LINE。リンクひとつで誘える体験に。</p></div>{isSample ? <div className="share-actions"><button className="button primary" onClick={copyInvite}>↗ 招待サンプルを共有</button><label>サンプル招待URL<input ref={shareInput} value={shareUrl} readOnly onFocus={e => e.currentTarget.select()} /></label></div> : <p className="local-note">ローカルプレビューは共有できません。</p>}</section>
      <section id="tables" className="tables-section"><div className="section-title"><div><span className="section-label">ROOM PREVIEWS</span><h2>今日は、どんな気分？</h2></div><button className="text-button" onClick={() => showModal('create')}>＋ テーブルを試す</button></div><div className="filters" role="group" aria-label="テーブルの気分で絞り込む">{(['all','drink','chill','game'] as const).map(value => <button key={value} aria-pressed={filter === value} onClick={() => setFilter(value)}>{value === 'all' ? 'すべて' : moodLabels[value]}</button>)}</div><div className="room-cards">{visibleRooms.map(room => <button key={room.id} className={`room-card ${room.id === selected.id ? 'selected' : ''}`} onClick={() => chooseRoom(room)}><span className="room-card-avatar"><Avatar seed={room.mood === 'drink' ? 0 : room.mood === 'chill' ? 1 : 2} /></span><div><span className="room-card-mood">{moodLabels[room.mood]}</span><h3>{room.title}</h3><p>{room.description}</p><span className="room-card-count">{room.count}/{room.capacity}{room.count === room.capacity ? ' · FULL' : ` · あと${room.capacity-room.count}人`}</span></div><span className="room-card-arrow">↗</span></button>)}</div></section>
      <p role="status" aria-live="polite" className="notice">{notice}</p><footer><Logo /><span>今、話せる友達がいる。</span><button onClick={() => showModal('about')}>公開プレビューについて</button></footer>
    </main>
    <dialog ref={dialog} className="modal"><button className="modal-close" aria-label="閉じる" onClick={() => dialog.current?.close()}>×</button>{modal === 'create' ? <><span className="section-label">YOUR ROOM</span><h2>テーブルを試してみよう。</h2><p>名前と人数を決めて、画面を確認できます。<br />共有ルームはまだ作成されません。</p><form onSubmit={createPreview}><label>テーブルの名前<input name="title" placeholder="例：今夜は、ゆるく。" maxLength={40} required autoFocus /></label><div className="form-row"><label>定員<select name="capacity" defaultValue="8">{[2,3,4,5,6,7,8].map(n=><option key={n} value={n}>{n}人</option>)}</select></label><label>気分<select name="mood" defaultValue="chill">{Object.entries(moodLabels).map(([value,label])=><option key={value} value={value}>{label}</option>)}</select></label></div><p className="form-note">Friends + Friends · 最大8人</p><button className="button primary" type="submit">プレビューを作る</button></form></> : modal === 'signup' ? <><div className="modal-avatars"><Avatar seed={0}/><Avatar seed={1}/></div><h2>次回もすぐ話せるように。</h2><p>会話のあとに登録して、友達とつながる。<br />通知を受け取ったり、アバターをカスタマイズしたり。</p><div className="provider-buttons">{socials.map(name=><div className="provider-preview" key={name}><SocialIcon name={name}/><span>{name}で続ける</span><small>準備中</small></div>)}</div><p className="form-note">ログイン・登録は未対応です。<br />この画面では個人情報を収集しません。</p><button className="detail-link" onClick={()=>dialog.current?.close()}>今はしない</button></> : <><Logo /><h2>今、話せる友達がいる。</h2><p>YOは、SNSのリンクから友達と集まれる、最大8人のボイスチャット。アバターで気軽に参加して、登録やカスタマイズはあとから。</p><div className="form-note">デザインプレビュー v0.2<br />サンプルは架空のルームです。認証・友達判定・承認・共有ルーム・通話は準備中。アバターのみこのブラウザに保存します。</div><a className="text-button" href="https://github.com/sleeeepme/YO" target="_blank" rel="noreferrer">プロジェクトを見る ↗</a></> }</dialog>
  </div>;
}
