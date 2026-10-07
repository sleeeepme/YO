import { createClient } from '@supabase/supabase-js';
import { RoomServiceClient, ServerError } from 'livekit-server-sdk';
import { configured, response } from '@/lib/voice/server';
export const runtime = 'nodejs';
type Check = 'ready' | 'authentication_failed' | 'schema_missing' | 'invalid_url' | 'unavailable';
async function supabaseCheck(): Promise<Check> {
  try {
    const url = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL!);
    if (url.protocol !== 'https:' || url.pathname !== '/') return 'invalid_url';
    const db = createClient(url.origin, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false, autoRefreshToken: false } });
    const { error, status } = await db.from('yo_voice_rooms').select('id').limit(1).abortSignal(AbortSignal.timeout(8000));
    if (!error) return 'ready';
    if (status === 401 || status === 403 || error.code === '42501') return 'authentication_failed';
    if (error.code === 'PGRST205' || error.code === '42P01') return 'schema_missing';
    return 'unavailable';
  } catch { return 'unavailable'; }
}
async function livekitCheck(): Promise<Check> {
  try {
    const url = new URL(process.env.LIVEKIT_URL!);
    if (url.protocol !== 'wss:' || url.pathname !== '/') return 'invalid_url';
    const live = new RoomServiceClient(url.origin.replace(/^wss:/, 'https:'), process.env.LIVEKIT_API_KEY!, process.env.LIVEKIT_API_SECRET!, { requestTimeout: 8 });
    await live.listRooms(['yo-readiness-check']); return 'ready';
  } catch (error) {
    if (error instanceof ServerError && (error.status === 401 || error.status === 403 || error.code === 'unauthenticated' || error.code === 'permission_denied')) return 'authentication_failed';
    return 'unavailable';
  }
}
export async function GET() {
  if (!configured()) return response({ ready: false, message: '通話テストは準備中です。' });
  const [supabase, livekit] = await Promise.all([supabaseCheck(), livekitCheck()]);
  const ready = supabase === 'ready' && livekit === 'ready';
  return response({ ready, mode: 'invite-guest-test', checks: { supabase, livekit }, ...(ready ? {} : { message: supabase !== 'ready' ? 'Supabaseへの接続設定を確認中です。' : 'LiveKitへの接続設定を確認中です。' }) });
}
