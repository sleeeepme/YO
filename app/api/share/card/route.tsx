import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { sharePlatform } from '@/lib/share';
import { Logo } from '@/components/logo';
export const runtime = 'nodejs';
export async function GET(request: Request) {
  const url = new URL(request.url);
  const platform = sharePlatform(url.searchParams.get('platform'));
  const story = platform === 'Instagram';
  const size = story ? { width: 1080, height: 1920 } : { width: 1200, height: 630 };
  const accent = { LINE: '#64edb3', X: '#fff0a4', Discord: '#bdb5ff', Instagram: '#ffb4ef' }[platform];
  const filename = story ? 'share-story.jpg' : 'share-wide.jpg';
  const image = `data:image/jpeg;base64,${(await readFile(path.join(process.cwd(), 'public', filename))).toString('base64')}`;
  return new ImageResponse(<div style={{ display: 'flex', width: '100%', height: '100%', background: '#0b1025', color: 'white', position: 'relative', flexDirection: 'column', padding: story ? 72 : 48 }}>
    {/* ImageResponse embeds local artwork without third-party fetches. */}
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src={image} alt="" width={story ? 1080 : 760} height={story ? 1440 : 630} style={{ position: 'absolute', top: 0, right: 0, objectFit: 'cover', opacity: story ? 0.9 : 0.82 }} />
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: story ? 'linear-gradient(180deg,#0b102530 20%,#0b102500 48%,#0b1025 72%)' : 'linear-gradient(90deg,#0b1025 18%,#0b1025e8 35%,#0b102510 80%)', display: 'flex' }} />
    <div style={{ display: 'flex', position: 'relative', transform: story ? 'scale(2.2)' : 'scale(1.6)', transformOrigin: 'left top', color: 'white' }}><Logo /></div>
    <div style={{ display: 'flex', position: 'relative', flexDirection: 'column', marginTop: 'auto', gap: story ? 32 : 18 }}>
      <div style={{ display: 'flex', color: accent, fontSize: story ? 36 : 22, letterSpacing: 4 }}>{platform.toUpperCase()} · YOU&apos;RE INVITED</div>
      <div style={{ display: 'flex', fontSize: story ? 106 : 64, fontWeight: 700, lineHeight: 1.05, flexDirection: 'column' }}><span>Say YO.</span><span>Hang out.</span></div>
      <div style={{ display: 'flex', fontSize: story ? 38 : 26, color: '#e4dafa' }}>Join my room. Let&apos;s talk!</div>
      <div style={{ display: 'flex', alignSelf: 'flex-start', marginTop: 14, padding: story ? '24px 40px' : '14px 25px', borderRadius: 60, background: accent, color: '#18132c', fontSize: story ? 32 : 23, fontWeight: 700 }}>VOICE + CHAT · UP TO 8</div>
    </div>
  </div>, { ...size, headers: { 'Cache-Control': 'public, max-age=3600', ...(url.searchParams.get('download') === '1' ? { 'Content-Disposition': `attachment; filename="yo-${platform.toLowerCase()}.png"` } : {}) } });
}
