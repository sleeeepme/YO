import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { validRoom } from '@/lib/voice/security';
import { VoiceTest } from '@/components/voice-test';
import { sharePlatform } from '@/lib/share';
export async function generateMetadata({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ share?: string }> }): Promise<Metadata> {
  const { id } = await params;
  if (!validRoom(id)) notFound();
  const platform = sharePlatform((await searchParams).share);
  const title = 'YO — これから、ちょっと集まろ。';
  const description = '友達からの招待です。飲んだり、遊んだり、ただしゃべったり。最大8人でボイス＆チャット。';
  const image = { url: `/api/share/card?platform=${platform.toLowerCase()}`, width: platform === 'Instagram' ? 1080 : 1200, height: platform === 'Instagram' ? 1920 : 630, alt: `${platform}用のYO招待カード` };
  return { title, description, robots: { index: false, follow: false }, referrer: 'no-referrer', openGraph: { title, description, type: 'website', url: `/call/${id}?share=${platform.toLowerCase()}`, images: [image] }, twitter: { card: 'summary_large_image', title, description, images: [image] } };
}
export default async function CallPage({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; if (!validRoom(id)) notFound(); return <VoiceTest id={id} />; }
