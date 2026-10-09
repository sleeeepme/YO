import 'server-only';
import { createClient } from '@supabase/supabase-js';
import { RoomServiceClient } from 'livekit-server-sdk';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { signGuest, verifyGuest } from './security';
const required = ['NEXT_PUBLIC_SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'LIVEKIT_URL', 'LIVEKIT_API_KEY', 'LIVEKIT_API_SECRET', 'YO_SESSION_SECRET'] as const;
export function configured() { return process.env.YO_VOICE_ENABLED === 'true' && required.every(k => !!process.env[k]?.trim()) && (process.env.YO_SESSION_SECRET?.length ?? 0) >= 32; }
export function services() {
  if (!configured()) throw new VoiceError('通話テストはまだ準備中です。', 503);
  return { db: createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false, autoRefreshToken: false } }), live: new RoomServiceClient(process.env.LIVEKIT_URL!.replace(/^wss:/, 'https:'), process.env.LIVEKIT_API_KEY!, process.env.LIVEKIT_API_SECRET!) };
}
export class VoiceError extends Error { constructor(message: string, public status = 400) { super(message); } }
export function response(data: unknown, status = 200) { return NextResponse.json(data, { status, headers: { 'Cache-Control': 'no-store', 'Referrer-Policy': 'no-referrer' } }); }
export function failed(error: unknown) { return error instanceof VoiceError ? response({ error: error.message }, error.status) : response({ error: '通話サービスに接続できません。少し待って再試行してください。' }, 503); }
export async function body(req: NextRequest) {
  const origin = req.headers.get('origin');
  let sameOrigin = false;
  try { const url = new URL(origin || ''); sameOrigin = ['https:', 'http:'].includes(url.protocol) && url.host === req.headers.get('host') && url.origin === origin; } catch { /* Missing or malformed origins are rejected. */ }
  if (!sameOrigin) throw new VoiceError('このページから操作してください。', 403);
  if (!req.headers.get('content-type')?.startsWith('application/json')) throw new VoiceError('入力形式が正しくありません。', 415);
  const text = await req.text(); if (Buffer.byteLength(text) > 2048) throw new VoiceError('入力が長すぎます。', 413);
  try { return JSON.parse(text) as Record<string, unknown>; } catch { throw new VoiceError('入力形式が正しくありません。'); }
}
export async function guest(create = false) {
  const jar = await cookies(); const secret = process.env.YO_SESSION_SECRET!;
  const found = verifyGuest(jar.get('yo_guest')?.value, secret);
  if (found) return found;
  if (!create) throw new VoiceError('参加手続きをやり直してください。', 401);
  const signed = signGuest(secret);
  jar.set('yo_guest', signed, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: '/', maxAge: 86400 });
  return signed.split('.')[0];
}
export async function rate(key: string, limit: number) {
  const { data, error } = await services().db.rpc('yo_voice_rate', { p_key: key, p_limit: limit });
  if (error) throw new VoiceError('通話テストの設定を確認中です。', 503);
  if (!data) throw new VoiceError('操作が集中しています。1分ほど待ってください。', 429);
}
export async function getRoom(id: string, allowExpired = false, allowClosed = false) {
  const { data, error } = await services().db.from('yo_voice_rooms').select('*').eq('id', id).single();
  if (error || !data || (!allowClosed && data.closed) || (!allowExpired && Date.parse(data.expires_at) <= Date.now())) throw new VoiceError('この招待は終了したか、有効期限が切れています。', 410);
  return data as { id: string; title: string; capacity: number; invite_hash: string; host_id: string; expires_at: string; closed: boolean };
}
