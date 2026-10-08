'use client';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { type Room, type RemoteParticipant, type DataPacket_Kind } from 'livekit-client';
import { CHAT_MAX_LENGTH, CHAT_TOPIC, decodeChat, encodeChat } from '@/lib/voice/chat';
type Message = { key: string; name: string; body: string; own: boolean; time: string };
export function RoomChat({ room, connected }: { room: Room; connected: boolean }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const list = useRef<HTMLDivElement>(null);
  const sending = useRef(false);
  const lastSend = useRef(0);
  const active = useRef(true);
  const follow = useRef(true);
  useEffect(() => {
    active.current = true;
    const seen = new Set<string>(); const rates = new Map<string, number[]>();
    const receive = (payload: Uint8Array, participant?: RemoteParticipant, _kind?: DataPacket_Kind, topic?: string) => {
      if (topic !== CHAT_TOPIC || !participant || !room.remoteParticipants.has(participant.identity)) return;
      const packet = decodeChat(payload); if (!packet) return;
      const key = `${participant.identity}:${packet.id}`; if (seen.has(key)) return;
      const now = Date.now(); const recent = (rates.get(participant.identity) || []).filter(t => now - t < 1000);
      if (recent.length >= 3) return;
      recent.push(now); rates.set(participant.identity, recent); seen.add(key);
      if (seen.size > 400) seen.delete(seen.values().next().value!);
      setMessages(m => [...m, { key, name: (participant.name || 'ゲスト').slice(0, 20), body: packet.body, own: false, time: new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' }) }].slice(-200));
    };
    const forget = (p: RemoteParticipant) => rates.delete(p.identity);
    let cancelled = false; let dispose = () => {};
    void import('livekit-client').then(({ RoomEvent }) => {
      if (cancelled) return;
      room.on(RoomEvent.DataReceived, receive); room.on(RoomEvent.ParticipantDisconnected, forget);
      dispose = () => { room.off(RoomEvent.DataReceived, receive); room.off(RoomEvent.ParticipantDisconnected, forget); };
    });
    return () => { cancelled = true; active.current = false; dispose(); };
  }, [room]);
  useEffect(() => { if (follow.current && list.current) list.current.scrollTop = list.current.scrollHeight; }, [messages]);
  async function send(event: FormEvent) {
    event.preventDefault(); if (sending.current || !connected) return;
    const body = draft.trim(); if (!body) return;
    if (Date.now() - lastSend.current < 1000) { setError('少し待ってから送ってください。'); return; }
    sending.current = true; setBusy(true); setError('');
    try {
      const id = crypto.randomUUID(); const payload = encodeChat({ id, body });
      lastSend.current = Date.now();
      await room.localParticipant.publishData(payload, { reliable: true, topic: CHAT_TOPIC });
      if (!active.current) return;
      follow.current = true;
      setMessages(m => [...m, { key: `${room.localParticipant.identity}:${id}`, name: 'あなた', body, own: true, time: new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' }) }].slice(-200));
      setDraft('');
    } catch { if (active.current) setError('送信できませんでした。接続を確認してもう一度お試しください。'); }
    finally { sending.current = false; if (active.current) setBusy(false); }
  }
  return <section className="room-chat" aria-labelledby="room-chat-title"><div className="chat-heading"><h3 id="room-chat-title">ルームチャット</h3><span>話しながら、ひとこと。</span></div>
    <div className="chat-messages" ref={list} role="log" aria-label="チャットのメッセージ" aria-live="polite" aria-relevant="additions" onScroll={e => { const el = e.currentTarget; follow.current = el.scrollHeight - el.scrollTop - el.clientHeight < 60; }}>
      {!messages.length ? <p className="chat-empty">挨拶やゲームの合言葉を送ってみよう 👋</p> : messages.map(m => <div className={`chat-message ${m.own ? 'chat-own' : ''}`} key={m.key}><div className="chat-byline"><strong>{m.name}</strong><time>{m.time}</time></div><p>{m.body}</p></div>)}
    </div><form onSubmit={send}><label htmlFor="room-chat-input" className="sr-only">メッセージ</label><textarea id="room-chat-input" placeholder="メッセージを入力…" maxLength={CHAT_MAX_LENGTH} rows={2} value={draft} onChange={e => setDraft(e.target.value)} disabled={!connected} /><button className="button primary" type="submit" disabled={busy || !connected || !draft.trim()}>{busy ? '送信中…' : '送信 ↑'}</button></form>
    <p className="chat-error" role="status">{error || (!connected ? '再接続中です。少しお待ちください。' : '')}</p><p className="chat-note">入室中のメッセージだけ表示します。退室・再読み込みで履歴は消えます。</p>
  </section>;
}
