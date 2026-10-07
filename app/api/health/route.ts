import { response } from '@/lib/voice/server';
import { GET as voiceStatus } from '../voice/status/route';
export async function GET() {
 const voice = await (await voiceStatus()).json();
 return response({ status: 'ok', mode: voice.ready ? 'invite-guest-test' : 'public-preview', version: '0.3.0', features: { preview: true, authentication: false, friendGraph: false, voice: voice.ready === true, sharedRooms: voice.ready === true }, voiceTest: { implemented: true, ready: voice.ready === true } });
}
