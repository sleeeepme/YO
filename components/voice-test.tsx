'use client';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
import { type Room, type Participant } from 'livekit-client';
import { Avatar } from './avatar';
import { AVATAR_COUNT, randomAvatar, validAvatar } from '@/lib/avatars';
import { Logo } from './logo';
import { InviteDialog } from './invite-dialog';
import { VoiceControls } from './voice-controls';
import { RoomChat } from './room-chat';
import { withDeadline } from '@/lib/voice/client';
import { RoomNotifications } from '@/lib/voice/notifications';
import { ROOM_DURATIONS, DEFAULT_ROOM_DURATION, durationLabel } from '@/lib/voice/duration';

type Member = { id: string; name: string; seed: number; speaking: boolean; muted: boolean };
type Connection = { token: string; serverUrl: string; title: string; capacity: number; expiresAt: string; host: boolean };
async function api(path: string, input: unknown, timeout = 20000) {
  const abort = new AbortController();
  const timer = window.setTimeout(() => abort.abort(), timeout);
  try {
    const res = await fetch(`/api/voice/${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(input), signal: abort.signal });
    const result = await res.json(); if (!res.ok) throw new Error(result.error || '接続できませんでした。'); return result;
  } catch (error) {
    if (error instanceof DOMException && (error.name === 'TimeoutError' || error.name === 'AbortError')) throw new Error(path === 'create' ? '作成結果を確認できませんでした。少し待ってからページを開き直してください。' : '接続に時間がかかっています。少し待ってからもう一度お試しください。');
    if (error instanceof TypeError || error instanceof SyntaxError) throw new Error('通信できませんでした。通信環境を確認して、もう一度お試しください。');
    throw error;
  } finally { window.clearTimeout(timer); }
}
function member(p: Participant): Member {
  let seed = 0; try { const value = JSON.parse(p.metadata || '{}').seed; if (validAvatar(value)) seed = value; } catch { /* Invalid participant metadata is ignored. */ }
  return { id: p.identity, name: p.name || 'ゲスト', seed, speaking: p.isSpeaking, muted: !p.isMicrophoneEnabled };
}
export function VoiceTest({ id, hero = false, defaultTitle = '' }: { id?: string; hero?: boolean; defaultTitle?: string }) {
  const [ready, setReady] = useState<boolean | null>(null);
  const [notice, setNotice] = useState('');
  const [invite, setInvite] = useState('');
  const [seed, setSeed] = useState(0);
  const [busy, setBusy] = useState(false);
  const [state, setState] = useState('未接続');
  const [connection, setConnection] = useState<Connection>();
  const [members, setMembers] = useState<Member[]>([]);
  const [mic, setMic] = useState(false);
  const [sound, setSound] = useState(true);
  const [inLine, setInLine] = useState(false);
  const [fallbackLink, setFallbackLink] = useState('');
  const [inviteOpen, setInviteOpen] = useState(false);
  const room = useRef<Room | null>(null);
  const soundRef = useRef(true);
  const notifications = useRef<RoomNotifications | null>(null);
  const chatNotice = useCallback(() => { notifications.current?.play('chat', soundRef.current); }, []);
  function unlockNotifications() { notifications.current ??= new RoomNotifications(); notifications.current.unlock(); }
  function disposeNotifications() { notifications.current?.dispose(); notifications.current = null; }
  const audio = useRef<HTMLDivElement>(null);
  const mounted = useRef(true);
  const creating = useRef(false);
  function openInvite() {
    if (!id || !invite) { setNotice('招待リンクを開き直してください。'); return; }
    setInviteOpen(true);
  }
  const update = useCallback(() => {
    const live = room.current; if (!live || !mounted.current) return;
    setMembers([live.localParticipant, ...live.remoteParticipants.values()].map(member)); setMic(live.localParticipant.isMicrophoneEnabled);
  }, []);
  useEffect(() => {
    mounted.current = true; const abort = new AbortController();
    fetch('/api/voice/status', { signal: abort.signal }).then(r => r.json()).then(d => { setReady(d.ready); if (!d.ready) setNotice(d.message); }).catch(() => { if (!abort.signal.aborted) { setReady(false); setNotice('接続状況を確認できませんでした。'); } });
    setSeed(Math.floor(Math.random() * AVATAR_COUNT));
    setInLine(/\bLine\//i.test(navigator.userAgent));
    if (id) {
      const value = window.location.hash.slice(1);
      try { if (value) { sessionStorage.setItem(`yo.invite.${id}`, value); /* Keep the fragment for LINE's Open in browser action; it is never sent to the server. */ } setInvite(value || sessionStorage.getItem(`yo.invite.${id}`) || ''); } catch { setInvite(value); }
    }
    return () => { mounted.current = false; abort.abort(); disposeNotifications(); const live = room.current; room.current = null; void live?.disconnect(); };
  }, [id]);
  useEffect(() => {
    if (!connection || !id || state !== '通話中' || busy) return;
    const timeout = window.setTimeout(() => { void leave(); setNotice('ルームの時間が終了しました。'); }, Math.max(0, Date.parse(connection.expiresAt) - Date.now()));
    return () => window.clearTimeout(timeout);
    // Connection expiration is unchanged by participant updates.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connection, id, state, busy]);
  async function create(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (creating.current) return;
    const form = event.currentTarget; const data = new FormData(form);
    const title = String(data.get('title') || '').trim();
    if (!title) {
      setNotice('ルーム名を入力してください。');
      form.querySelector<HTMLInputElement>('[name="title"]')?.focus(); return;
    }
    creating.current = true; setBusy(true); setNotice('ルームを作成しています…');
    try { const result = await api('create', { title, capacity: Number(data.get('capacity')), durationMinutes: Number(data.get('durationMinutes')) }); window.location.assign(result.url); }
    catch (error) { setNotice(error instanceof Error ? error.message : '作成できませんでした。'); }
    finally { creating.current = false; if (mounted.current) setBusy(false); }
  }
  async function join(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (!id || busy || room.current) return;
    const form = event.currentTarget;
    const name = String(new FormData(form).get('name') || '').trim();
    if (!name) { setNotice('表示名を入力してから参加してください。'); form.querySelector<HTMLInputElement>('[name="name"]')?.focus(); return; }
    if (!invite) { setNotice('招待情報がありません。LINEで受け取ったリンク全体を開き直してください。'); return; }
    if (typeof window.RTCPeerConnection !== 'function') { setNotice('このブラウザでは音声通話を利用できません。下のリンクをコピーしてSafariまたはChromeで開いてください。'); return; }
    unlockNotifications();
    setBusy(true); setNotice('ルームへの参加を確認しています…'); setState('接続中');
    let live: Room | null = null;
    try {
      const { Room, RoomEvent, Track } = await withDeadline(import('livekit-client'), 20000, '通話の読み込みに時間がかかっています。通信環境を確認して再度お試しください。');
      const result: Connection = await api('join', { id, invite, name, seed });
      if (!mounted.current) { await api('leave', { id }).catch(() => undefined); return; }
      live = new Room({ adaptiveStream: false, dynacast: false }); room.current = live;
      live.on(RoomEvent.TrackSubscribed, track => { if (track.kind === Track.Kind.Audio) { const el = track.attach(); if (el instanceof HTMLAudioElement) el.muted = !soundRef.current; audio.current?.appendChild(el); } });
      live.on(RoomEvent.TrackUnsubscribed, track => track.detach().forEach(el => el.remove()));
      for (const event of [RoomEvent.ParticipantConnected, RoomEvent.ParticipantDisconnected, RoomEvent.ActiveSpeakersChanged, RoomEvent.TrackMuted, RoomEvent.TrackUnmuted, RoomEvent.LocalTrackPublished, RoomEvent.LocalTrackUnpublished, RoomEvent.ParticipantMetadataChanged, RoomEvent.ParticipantNameChanged] as const) live.on(event, update);
      let notifyJoins = false;
      const knownParticipants = new Set<string>();
      live.on(RoomEvent.ParticipantConnected, participant => {
        if (notifyJoins && room.current === live && mounted.current && !knownParticipants.has(participant.identity)) notifications.current?.play('join', soundRef.current);
        knownParticipants.add(participant.identity);
      });
      live.on(RoomEvent.ParticipantDisconnected, participant => { knownParticipants.delete(participant.identity); });
      live.on(RoomEvent.Reconnecting, () => { notifyJoins = false; setState('再接続中'); });
      live.on(RoomEvent.Reconnected, () => { knownParticipants.clear(); live?.remoteParticipants.forEach(p => knownParticipants.add(p.identity)); notifyJoins = true; setState('通話中'); update(); });
      live.on(RoomEvent.Disconnected, () => { if (room.current === live) { room.current = null; disposeNotifications(); setState('退出しました'); setMembers([]); setMic(false); setConnection(undefined); } });
      setNotice('音声通話に接続しています…');
      await withDeadline(live.connect(result.serverUrl, result.token, { websocketTimeout: 10000, peerConnectionTimeout: 15000, maxRetries: 1 }), 30000, '音声通話に接続できませんでした。SafariまたはChromeで開き直すか、通信環境を変えてお試しください。');
      if (!mounted.current) { await live.disconnect(); return; }
      live.remoteParticipants.forEach(p => knownParticipants.add(p.identity)); notifyJoins = true;
      setConnection(result); setState('通話中'); update();
      try { await withDeadline(live.startAudio(), 5000, '音声の再生待ち'); setNotice('参加しました。話すときはマイクをONにしてください。'); } catch { setSound(false); soundRef.current = false; setNotice('音声を聞くにはスピーカーボタンを押してください。'); }
      // Joining is silent. Microphone permission is requested only on an explicit tap.
    } catch (error) {
      room.current = null; disposeNotifications(); setState('未接続'); setConnection(undefined);
      const message = error instanceof Error ? error.message : '参加できませんでした。';
      setNotice(/setConfiguration|RTCPeerConnection|WebRTC|could not establish|signal connection|peer connection/i.test(message) ? 'このブラウザでは音声通話に接続できませんでした。下のリンクをコピーし、SafariまたはChromeで開いて再度お試しください。' : message);
      await withDeadline(Promise.resolve(live?.disconnect()), 5000, '切断待ち').catch(() => undefined);
      audio.current?.replaceChildren();
      await api('leave', { id }, 5000).catch(() => undefined);
    } finally { if (mounted.current) setBusy(false); }
  }
  async function toggleMic() {
    const live = room.current; if (!live || busy) return; setBusy(true);
    try { await live.localParticipant.setMicrophoneEnabled(!live.localParticipant.isMicrophoneEnabled); setNotice(''); update(); }
    catch { setNotice('マイクを使えません。ブラウザのマイク許可と接続機器を確認してください。'); }
    finally { setBusy(false); }
  }
  async function toggleSound() {
    unlockNotifications();
    try { await room.current?.startAudio(); const next = !sound; soundRef.current = next; audio.current?.querySelectorAll('audio').forEach(el => { el.muted = !next; }); setSound(next); }
    catch { setNotice('音声を再生できませんでした。もう一度押してください。'); }
  }
  async function leave(close = false) {
    if (!id || busy) return; setBusy(true);
    try {
      if (close) await api('close', { id });
      const live = room.current; room.current = null; disposeNotifications(); await live?.disconnect(); audio.current?.replaceChildren();
      setConnection(undefined); setMembers([]); setMic(false); setState('退出しました');
      if (!close) await api('leave', { id });
      setNotice(close ? 'ルームを終了しました。' : '退出しました。');
    } catch (error) { setNotice(error instanceof Error ? error.message : '退出処理を確認できませんでした。'); }
    finally { setBusy(false); }
  }
  return <section className={id ? `yo-page call-page${!connection ? ' call-entry' : ' call-active'}` : hero ? 'voice-test-entry hero-room-create' : 'sharing-section voice-test-entry'} aria-label="ボイスルーム">
    {id ? <header className="site-header"><Link href="/" aria-label="YO トップ"><Logo /></Link><span className="preview-chip">ボイスルーム</span></header> : null}
    <div className="voice-test-layout">
      {hero ? null : <div className="voice-test-info"><span className="section-label">INVITE. JOIN. TALK.</span><h2>{id ? (connection ? 'ボイスチャット' : '友達と、同じルームへ。') : '招待した友達と、話してみよう。'}</h2>{!connection ? <><p>リンクを開いて、友達とボイスチャット。</p><p className="voice-test-caution">リンクは参加してほしい人だけに送ってください。</p></> : null}<p role="status" className="notice">{(ready !== true || !!connection) ? notice || (ready === null ? '接続状況を確認中…' : '') : ''}</p>{ready === false ? <p>現在、通話を利用できません。少し時間をおいて再度お試しください。</p> : null}</div>}
      {id && connection ? <div className="voice-phone"><div className="voice-top"><span>‹</span><span>YO</span></div><h3>{connection.title}</h3><p className="voice-clock">{members.length} / {connection.capacity}<span className="room-expiry">終了 {new Intl.DateTimeFormat('ja-JP', { timeZone: 'Asia/Tokyo', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(Date.parse(connection.expiresAt))}</span></p><p className="voice-preview" role="status">{state}</p><div className="voice-members">{members.map(p => <div key={p.id}><div className={`voice-avatar ${p.speaking ? 'speaking' : ''}`}><Avatar seed={p.seed} /></div><p>{p.name}{p.muted ? ' · 静かに参加' : ''}</p></div>)}</div><VoiceControls mic={mic} sound={sound} busy={busy} onMic={() => void toggleMic()} onSound={() => void toggleSound()} onShare={openInvite} /><button className="hangup" aria-label="通話から退出" disabled={busy} onClick={() => void leave()}><svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M3 9c5-4 13-4 18 0a2 2 0 0 1 1 2v3a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-3a16 16 0 0 0-8 0v3a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-3a2 2 0 0 1 1-2z" /></svg></button>{connection.host ? <button className="detail-link" disabled={busy} onClick={() => void leave(true)}>全員のルームを終了</button> : null}<button type="button" className="voice-share-trigger" aria-haspopup="dialog" onClick={openInvite}>招待リンク<span>友達を招待する ↗</span></button></div> : ready === true || hero ? <div className="join-card voice-test-form">{hero ? null : <div className={`join-art${id ? ' join-avatar-selection' : ''}`}>{id ? <><span className="join-avatar-caption">あなたのアバター</span><Avatar seed={seed} /><button className="avatar-random-button" type="button" disabled={busy} onClick={() => setSeed(current => randomAvatar(current))}>ランダムで変更</button></> : <><Avatar seed={seed} /><Avatar seed={(seed+1)%AVATAR_COUNT} /></>}</div>}<div className="white-card-body"><h3>{id ? 'あなたの呼び名は？' : 'ルームを作る'}</h3><form onSubmit={id ? join : create} noValidate aria-busy={busy}>{id ? <><label>表示名<input name="name" maxLength={20} required autoComplete="nickname" placeholder="例：Daisuke" /></label></> : <><label>ルーム名<input name="title" defaultValue={defaultTitle} maxLength={40} required placeholder="例：FRIDAY DRINK" /></label><label>定員<select name="capacity" defaultValue="8">{[2,3,4,5,6,7,8].map(n => <option value={n} key={n}>{n}人</option>)}</select></label><label>招待の有効期限<select name="durationMinutes" defaultValue={DEFAULT_ROOM_DURATION}>{ROOM_DURATIONS.map(minutes => <option key={minutes} value={minutes}>{durationLabel(minutes)}</option>)}</select></label></>}<p className="form-status" role="status" aria-live="polite">{notice || (ready === null ? '接続状況を確認中…' : '')}</p><button className="button primary" disabled={busy || ready !== true || (!!id && !invite)} type="submit">{busy ? (id ? '接続中…' : 'ルームを作成中…') : id ? '参加する' : 'ルームを作る'}</button>{id && !invite ? <p className="card-fine-print" role="alert">招待リンクを受け取って開き直してください。</p> : null}<p className="card-fine-print">マイクは参加後にONにできます。<br />{id ? '招待の有効期限はルーム作成時に設定されています。' : '有効期限になると、招待とルームが終了します。'}{hero ? <><br />最大8人・ログイン不要。招待リンクは参加してほしい人だけに。</> : null}</p></form></div></div> : null}
    </div>{id && invite && !connection ? <div className="voice-browser-help"><p>{inLine ? 'LINEから参加する場合はSafari・Chromeで開くとスムーズです。' : '参加できないときは、Safari・Chromeでこのリンクを開いてください。'}</p><button type="button" className="button light" onClick={async () => { const url = new URL(window.location.href); url.searchParams.set('openExternalBrowser', '1'); url.hash = invite; setFallbackLink(url.toString()); try { await navigator.clipboard.writeText(url.toString()); setNotice('招待リンクをコピーしました。Safari・Chromeのアドレス欄に貼り付けて開いてください。'); } catch { setNotice('下の招待リンクを長押ししてコピーし、Safari・Chromeで開いてください。'); } }}>ブラウザで開くためのリンクをコピー</button>{fallbackLink ? <label>招待リンク<input readOnly value={fallbackLink} onFocus={e => e.currentTarget.select()} /></label> : null}{inLine ? <p>LINEのメニューから「ブラウザで開く」も選べます。</p> : null}</div> : null}{id && invite && !connection ? <div className="invite-entry"><button type="button" className="voice-share-trigger" aria-haspopup="dialog" onClick={openInvite}>招待リンク<span>友達を招待する ↗</span></button></div> : null}{id && connection && room.current ? <RoomChat room={room.current} connected={state === '通話中'} onIncomingMessage={chatNotice} /> : null}{id && invite && inviteOpen ? <InviteDialog id={id} invite={invite} onClose={() => setInviteOpen(false)} /> : null}<div ref={audio} className="voice-audio" />{id ? <footer><Link href="/">YOトップに戻る</Link></footer> : null}
  </section>;
}
