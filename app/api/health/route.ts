export function GET() {
  return Response.json({ status: 'ok', mode: 'public-preview', version: '0.2.0', features: { preview: true, authentication: false, voice: false, sharedRooms: false } });
}
