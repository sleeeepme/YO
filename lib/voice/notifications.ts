export type RoomNotice = 'join' | 'chat';
export class RoomNotifications {
  private context?: AudioContext;
  private disposed = false;
  private last = new Map<RoomNotice, number>();
  // Called directly from the user's join/audio button, before any awaited work.
  unlock() {
    if (this.disposed || typeof window === 'undefined') return;
    try {
      const Context = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Context) return;
      this.context ??= new Context();
      if (this.context.state !== 'running') void this.context.resume().catch(() => undefined);
    } catch { /* Notifications never block joining or chat. */ }
  }
  play(kind: RoomNotice, audible = true) {
    if (this.disposed) return;
    const now = Date.now();
    if (now - (this.last.get(kind) ?? -Infinity) < 1000) return;
    this.last.set(kind, now);
    if (kind === 'join') {
      try { if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') navigator.vibrate([80, 50, 80]); } catch { /* Unsupported or blocked vibration is optional. */ }
    }
    const context = this.context;
    if (!audible || !context || context.state !== 'running') return;
    try {
      const notes = kind === 'join' ? [660, 880] : [1046];
      notes.forEach((frequency, index) => {
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        const start = context.currentTime + index * 0.13;
        oscillator.type = 'sine'; oscillator.frequency.setValueAtTime(frequency, start);
        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.09, start + 0.012);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.16);
        oscillator.connect(gain); gain.connect(context.destination);
        oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
        oscillator.start(start); oscillator.stop(start + 0.18);
      });
    } catch { /* Audio failure must not affect the call. */ }
  }
  dispose() {
    this.disposed = true; this.last.clear();
    const context = this.context; this.context = undefined;
    if (context) void context.close().catch(() => undefined);
  }
}
