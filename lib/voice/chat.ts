export const CHAT_TOPIC = 'yo.chat.v1';
export const CHAT_MAX_LENGTH = 500;
export type ChatPacket = { id: string; body: string };
export function validChat(value: unknown): value is ChatPacket {
  if (!value || typeof value !== 'object') return false;
  const v = value as Record<string, unknown>;
  return Object.keys(v).length === 2 && typeof v.id === 'string' && /^[a-f0-9-]{36}$/.test(v.id) && typeof v.body === 'string' && v.body.trim().length > 0 && v.body.length <= CHAT_MAX_LENGTH && !/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(v.body);
}
export function decodeChat(payload: Uint8Array): ChatPacket | null {
  if (payload.byteLength > 4096) return null;
  try { const value: unknown = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(payload)); return validChat(value) ? value : null; } catch { return null; }
}
export function encodeChat(packet: ChatPacket) {
  if (!validChat(packet)) throw new Error('メッセージは1〜500文字で入力してください。');
  return new TextEncoder().encode(JSON.stringify(packet));
}
