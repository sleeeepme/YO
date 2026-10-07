import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto';
export function hash(value: string, secret: string) { return createHmac('sha256', secret).update(value).digest('hex'); }
export function equal(a: string, b: string) { const x = Buffer.from(a), y = Buffer.from(b); return x.length === y.length && timingSafeEqual(x, y); }
export function signGuest(secret: string, id = randomUUID(), now = Date.now()) { const payload = `${id}.${Math.floor(now / 1000) + 86400}`; return `${payload}.${hash(payload, secret)}`; }
export function verifyGuest(value: string | undefined, secret: string, now = Date.now()) {
  if (!value || value.length > 200) return null;
  const [id, expiry, signature, extra] = value.split('.');
  if (extra || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(id ?? '') || !/^\d+$/.test(expiry ?? '') || Number(expiry) <= now / 1000 || Number(expiry) > now / 1000 + 86401 || !equal(signature ?? '', hash(`${id}.${expiry}`, secret))) return null;
  return id;
}
export function validRoom(id: unknown): id is string { return typeof id === 'string' && /^yo-[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(id); }
export function validInvite(value: unknown): value is string { return typeof value === 'string' && /^[A-Za-z0-9_-]{43}$/.test(value); }
