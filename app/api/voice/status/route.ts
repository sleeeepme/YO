import { configured, response, services } from '@/lib/voice/server';
export const runtime = 'nodejs';
export async function GET() {
  if (!configured()) return response({ ready: false, message: '通話テストは準備中です。' });
  try { const { db, live } = services(); const { error } = await db.from('yo_voice_rooms').select('id').limit(1); if (error) throw error; await live.listRooms(['yo-readiness-check']); return response({ ready: true, mode: 'invite-guest-test' }); }
  catch { return response({ ready: false, message: '通話サービスの接続を確認中です。' }); }
}
