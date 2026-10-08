'use client';

export function VoiceControls({ mic, sound, busy, onMic, onSound, onShare }: { mic: boolean; sound: boolean; busy: boolean; onMic: () => void; onSound: () => void; onShare: () => void }) {
  return <div className="voice-controls">
    <button type="button" aria-label={mic ? 'マイクをOFF' : 'マイクをON'} aria-pressed={mic} disabled={busy} onClick={onMic}>
      <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="2" width="6" height="12" rx="3" /><path d="M5 10v2a7 7 0 0 0 14 0v-2M12 19v3M8 22h8" />{!mic ? <path className="control-slash" d="M2 2l20 20" /> : null}</svg>
      <span>マイク {mic ? 'ON' : 'OFF'}</span>
    </button>
    <button type="button" aria-label={sound ? 'スピーカーをOFF' : 'スピーカーをON'} aria-pressed={sound} onClick={onSound}>
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 4L6 8H3v8h3l5 4z" />{sound ? <path d="M15 8a6 6 0 0 1 0 8M18 5a10 10 0 0 1 0 14" /> : <path className="control-slash" d="M2 2l20 20" />}</svg>
      <span>音声 {sound ? 'ON' : 'OFF'}</span>
    </button>
    <button type="button" aria-label="友達を招待する" aria-haspopup="dialog" onClick={onShare}>
      <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="18" cy="4" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="20" r="3" /><path d="M8.5 10.3l7-4.6M8.5 13.7l7 4.6" /></svg>
      <span>シェア</span>
    </button>
  </div>;
}
