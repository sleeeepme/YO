import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { activities, endTimeText, shareActivity, shareGameTitle, sharePlatform, shareUntil } from '@/lib/share';
import { Logo } from '@/components/logo';
export const runtime = 'nodejs';
export async function GET(request: Request) {
  const url = new URL(request.url);
  const platform = sharePlatform(url.searchParams.get('platform'));
  const activity = shareActivity(url.searchParams.get('activity'));
  const until = shareUntil(url.searchParams.get('until'));
  const gameTitle = activity === 'game' ? shareGameTitle(url.searchParams.get('game')) : ''; 
  const story = platform === 'Instagram';
  const size = story ? { width: 1080, height: 1920 } : { width: 1200, height: 630 };
  const accent = { LINE: '#64edb3', X: '#fff0a4', Discord: '#bdb5ff', Instagram: '#ffb4ef' }[platform];
  const filename = story ? 'share-story.jpg' : 'share-wide.jpg';
  const [art, font] = await Promise.all([readFile(path.join(process.cwd(), 'public', filename)), readFile(path.join(process.cwd(), 'assets/fonts/NotoSansJP-Full.woff'))]);
  const image = `data:image/jpeg;base64,${art.toString('base64')}`;
  return new ImageResponse(<div style={{ display: 'flex', width: '100%', height: '100%', background: '#0b1025', color: 'white', position: 'relative', flexDirection: 'column', padding: story ? 72 : 48, fontFamily: 'YO Japanese' }}>
    {/* ImageResponse embeds local artwork without third-party fetches. */}
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src={image} alt="" width={story ? 1080 : 760} height={story ? 1440 : 630} style={{ position: 'absolute', top: 0, right: 0, objectFit: 'cover', opacity: story ? 0.9 : 0.82 }} />
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: story ? 'linear-gradient(180deg,#0b102530 20%,#0b102500 48%,#0b1025 72%)' : 'linear-gradient(90deg,#0b1025 18%,#0b1025e8 35%,#0b102510 80%)', display: 'flex' }} />
    <div style={{ display: 'flex', position: 'relative', transform: story ? 'scale(2.2)' : 'scale(1.6)', transformOrigin: 'left top', color: 'white' }}><Logo /></div>
    <div style={{ display: 'flex', position: 'relative', flexDirection: 'column', marginTop: 'auto', paddingBottom: platform === 'X' ? 80 : 0, gap: story ? 32 : gameTitle ? 10 : 18 }}>
      <div style={{ display: 'flex', color: accent, fontSize: story ? 32 : 22 }}>YOで一緒に話そう！</div>
      <div style={{ display: 'flex', fontSize: story ? 62 : gameTitle ? 30 : 34, fontWeight: 700, lineHeight: 1.4, flexDirection: 'column' }}><span>{activities[activity].first}</span><span style={{ fontSize: story ? 100 : gameTitle ? 48 : 60 }}>{activities[activity].second}</span></div>
      {gameTitle ? <div style={{ display: 'flex', flexDirection: 'column', maxWidth: story ? 936 : 620, padding: story ? '20px 28px' : '10px 18px', borderRadius: 18, background: '#302448dd', color: '#ffffff', gap: 4 }}><span style={{ fontSize: story ? 28 : 20, color: accent }}>ゲーム仲間募集中！</span><span style={{ fontSize: story ? 50 : 26, lineHeight: 1.35, wordBreak: 'break-all' }}>{gameTitle}</span></div> : null}<div style={{ display: 'flex', maxWidth: story ? 936 : 550, fontSize: story ? 36 : 23, color: '#e4dafa', lineHeight: 1.6 }}>{endTimeText(until)}</div>
      {platform !== 'X' ? <div style={{ display: 'flex', alignSelf: 'flex-start', marginTop: 14, padding: story ? '24px 40px' : '14px 25px', borderRadius: 60, background: accent, color: '#18132c', fontSize: story ? 32 : 23, fontWeight: 700 }}>最大8人・登録なし</div> : null}
    </div>
  </div>, { ...size, fonts: [{ name: 'YO Japanese', data: new Uint8Array(font).buffer, weight: 700, style: 'normal' }], headers: { 'Cache-Control': 'public, max-age=3600', ...(url.searchParams.get('download') === '1' ? { 'Content-Disposition': `attachment; filename="yo-${platform.toLowerCase()}.png"` } : {}) } });
}
