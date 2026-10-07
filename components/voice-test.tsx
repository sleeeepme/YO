'use client';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
import { type Room, type Participant } from 'livekit-client';
import { Avatar } from './avatar';
import { Logo } from './logo';

type Member = { id: string; name: string; seed: number; speaking: boolean; muted: boolean };
type Connection = { token: string; serverUrl: string; title: string; capacity: number; expiresAt: string; host: boolean };
async function api(path: string, input: unknown) {
  const res = await fetch(`/api/voice/${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(input) });
  const result = await res.json(); if (!res.ok) throw new Error(result.error || '接続できませんでした。'); return result;
}
function member(p: Participant): Member {
  let seed = 0; try { const value = JSON.parse(p.metadata || '{}').seed; if (Number.isInteger(value) && value >= 0 && value <= 3) seed = value; } catch { /* Invalid participant metadata is ignored. */ }
  return { id: p.identity, name: p.name || 'ゲスト', seed, speaking: p.isSpeaking, muted: !p.isMicrophoneEnabled };
}
export function VoiceTest({ id }: { id?: string }) {
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
  const [share, setShare] = useState('');
  const room = useRef<Room | null>(null);
  const soundRef = useRef(true);
  const audio = useRef<HTMLDivElement>(null);
  const mounted = useRef(true);
  const update = useCallback(() => {
    const live = room.current; if (!live || !mounted.current) return;
    setMembers([live.localParticipant, ...live.remoteParticipants.values()].map(member)); setMic(live.localParticipant.isMicrophoneEnabled);
  }, []);
  useEffect(() => {
    mounted.current = true; const abort = new AbortController();
    fetch('/api/voice/status', { signal: abort.signal }).then(r => r.json()).then(d => { setReady(d.ready); if (!d.ready) setNotice(d.message); }).catch(() => { if (!abort.signal.aborted) { setReady(false); setNotice('接続状況を確認できませんでした。'); } });
    setSeed(Math.floor(Math.random() * 4));
    if (id) {
      const value = window.location.hash.slice(1);
      try { if (value) { sessionStorage.setItem(`yo.invite.${id}`, value); window.history.replaceState(null, '', window.location.pathname); } setInvite(value || sessionStorage.getItem(`yo.invite.${id}`) || ''); } catch { setInvite(value); }
    }
    return () => { mounted.current = false; abort.abort(); const live = room.current; room.current = null; void live?.disconnect(); };
  }, [id]);
  useEffect(() => {
    if (!connection || !id || state !== '通話中' || busy) return;
    const timeout = window.setTimeout(() => { void leave(); setNotice('1時間のテストが終了しました。'); }, Math.max(0, Date.parse(connection.expiresAt) - Date.now()));
    return () => window.clearTimeout(timeout);
    // Connection expiration is unchanged by participant updates.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connection, id, state, busy]);
  async function create(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (busy) return; setBusy(true); setNotice(''); const data = new FormData(event.currentTarget);
    try { const result = await api('create', { title: data.get('title'), capacity: Number(data.get('capacity')), code: data.get('code') }); window.location.assign(result.url); }
    catch (error) { setNotice(error instanceof Error ? error.message : '作成できませんでした。'); setBusy(false); }
  }
  async function join(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (!id || busy || room.current) return; setBusy(true); setNotice(''); setState('接続中');
    const name = String(new FormData(event.currentTarget).get('name') || ''); let live: Room | null = null;
    try {
      const { Room, RoomEvent, Track } = await import('livekit-client');
      const result: Connection = await api('join', { id, invite, name, seed });
      if (!mounted.current) { await api('leave', { id }).catch(() => undefined); return; }
      live = new Room({ adaptiveStream: false, dynacast: false }); room.current = live;
      live.on(RoomEvent.TrackSubscribed, track => { if (track.kind === Track.Kind.Audio) { const el = track.attach(); if (el instanceof HTMLAudioElement) el.muted = !soundRef.current; audio.current?.appendChild(el); } });
      live.on(RoomEvent.TrackUnsubscribed, track => track.detach().forEach(el => el.remove()));
      for (const event of [RoomEvent.ParticipantConnected, RoomEvent.ParticipantDisconnected, RoomEvent.ActiveSpeakersChanged, RoomEvent.TrackMuted, RoomEvent.TrackUnmuted, RoomEvent.LocalTrackPublished, RoomEvent.LocalTrackUnpublished, RoomEvent.ParticipantMetadataChanged, RoomEvent.ParticipantNameChanged] as const) live.on(event, update);
      live.on(RoomEvent.Reconnecting, () => setState('再接続中'));
      live.on(RoomEvent.Reconnected, () => { setState('通話中'); update(); });
      live.on(RoomEvent.Disconnected, () => { if (room.current === live) { room.current = null; setState('退出しました'); setMembers([]); setMic(false); setConnection(undefined); } });
      await live.connect(result.serverUrl, result.token);
      if (!mounted.current) { await live.disconnect(); return; }
      setConnection(result); setState('通話中'); setShare(`${window.location.origin}/call/${id}#${invite}`); update();
      try { await live.startAudio(); setNotice('参加しました。話すときはマイクをONにしてください。'); } catch { setSound(false); soundRef.current = false; setNotice('音声を聞くには「音声を再生」を押してください。'); }
      // Joining is silent. Microphone permission is requested only on an explicit tap.
    } catch (error) {
      room.current = null; await live?.disconnect(); setState('未接続'); setConnection(undefined);
      setNotice(error instanceof Error ? error.message : '参加できませんでした。');
      await api('leave', { id }).catch(() => undefined);
    } finally { if (mounted.current) setBusy(false); }
  }
  async function toggleMic() {
    const live = room.current; if (!live || busy) return; setBusy(true);
    try { await live.localParticipant.setMicrophoneEnabled(!live.localParticipant.isMicrophoneEnabled); setNotice(''); update(); }
    catch { setNotice('マイクを使えません。ブラウザのマイク許可と接続機器を確認してください。'); }
    finally { setBusy(false); }
  }
  async function toggleSound() {
    try { await room.current?.startAudio(); const next = !sound; soundRef.current = next; audio.current?.querySelectorAll('audio').forEach(el => { el.muted = !next; }); setSound(next); }
    catch { setNotice('音声を再生できませんでした。もう一度押してください。'); }
  }
  async function leave(close = false) {
    if (!id || busy) return; setBusy(true);
    try {
      if (close) await api('close', { id });
      const live = room.current; room.current = null; await live?.disconnect(); audio.current?.replaceChildren();
      setConnection(undefined); setMembers([]); setMic(false); setState('退出しました');
      if (!close) await api('leave', { id });
      setNotice(close ? 'テーブルを終了しました。' : '退出しました。');
    } catch (error) { setNotice(error instanceof Error ? error.message : '退出処理を確認できませんでした。'); }
    finally { setBusy(false); }
  }
  return <section className={id ? 'yo-page call-page' : 'sharing-section voice-test-entry'} aria-label="招待ゲスト通話テスト">
    {id ? <header className="site-header"><Link href="/" aria-label="YO トップ"><Logo /></Link><span className="preview-chip">招待ゲスト通話テスト</span></header> : null}
    <div className="voice-test-layout">
      <div className="voice-test-info"><span className="section-label">INVITE. JOIN. TALK.</span><h2>{id ? (connection?.title || '友達と、同じテーブルへ。') : '招待した友達と、話してみよう。'}</h2><p>招待リンクを知っている人だけの限定テスト。<br />最大8人・登録なし・録音なし。</p><p className="voice-test-caution">このテストでは友達関係の判定は行いません。<br />リンクは参加してほしい人だけに送ってください。</p><p role="status" className="notice">{notice || (ready === null ? '接続状況を確認中…' : '')}</p>{ready === false ? <p>音声サービスの設定が完了したら、ここから参加できます。</p> : null}</div>
      {id && connection ? <div className="voice-phone"><div className="voice-top"><span>‹</span><span>YO</span></div><h3>{connection.title}</h3><p className="voice-clock">{members.length} / {connection.capacity}</p><p className="voice-preview" role="status">{state}</p><div className="voice-members">{members.map(p => <div key={p.id}><div className={`voice-avatar ${p.speaking ? 'speaking' : ''}`}><Avatar seed={p.seed} /></div><p>{p.name}{p.muted ? ' · 静かに参加' : ''}</p></div>)}</div><div className="voice-controls"><button aria-label={mic ? 'マイクをOFF' : 'マイクをON'} aria-pressed={mic} onClick={toggleMic} disabled={busy}>{mic ? '🎙' : '🔇'}</button><button aria-label={sound ? '音声を消す' : '音声を再生'} aria-pressed={sound} onClick={toggleSound}>{sound ? '🔊' : '🔈'}</button><button aria-label="招待リンクをコピー" onClick={async () => { try { await navigator.clipboard.writeText(share); setNotice('招待リンクをコピーしました。'); } catch { setNotice('下の招待リンクを選択してコピーしてください。'); } }}>↗</button></div><button className="hangup" aria-label="通話から退出" disabled={busy} onClick={() => void leave()}>☎</button>{connection.host ? <button className="detail-link" disabled={busy} onClick={() => void leave(true)}>全員のテーブルを終了</button> : null}<label className="voice-share">招待リンク<input readOnly value={share} onFocus={e => e.currentTarget.select()} /></label></div> : ready === true ? <div className="join-card voice-test-form"><div className="join-art"><Avatar seed={seed} /><Avatar seed={(seed+1)%4} /></div><div className="white-card-body"><h3>{id ? 'あなたの呼び名は？' : 'テーブルを作る'}</h3><form onSubmit={id ? join : create}>{id ? <><label>表示名<input name="name" maxLength={20} required autoComplete="nickname" placeholder="例：Daisuke" /></label><button className="button light" type="button" onClick={() => setSeed((seed+1)%4)}>別のアバターにする</button></> : <><label>テーブル名<input name="title" maxLength={40} required placeholder="例：FRIDAY DRINK" /></label><label>定員<select name="capacity" defaultValue="8">{[2,3,4,5,6,7,8].map(n => <option value={n} key={n}>{n}人</option>)}</select></label><label>ホスト用コード<input name="code" type="password" required autoComplete="off" /></label></>}<button className="button primary" disabled={busy || (!!id && !invite)} type="submit">{busy ? '接続中…' : id ? '静かに参加する' : 'テーブルを作る'}</button>{id && !invite ? <p className="card-fine-print">招待リンクを受け取って開き直してください。</p> : null}<p className="card-fine-print">マイクは参加後にONにできます。<br />招待の有効期限は作成から1時間です。</p></form></div></div> : null}
    </div><div ref={audio} className="voice-audio" />{id ? <footer><Link href="/">YOトップに戻る</Link></footer> : null}
  </section>;
}
