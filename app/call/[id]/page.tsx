import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { validRoom } from '@/lib/voice/security';
import { VoiceTest } from '@/components/voice-test';
import { cardUrl, invitationText, shareActivity, shareGameTitle, sharePlatform, shareUntil } from '@/lib/share';
export async function generateMetadata({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ share?: string; activity?: string; until?: string; game?: string }> }): Promise<Metadata> {
  const { id } = await params;
  if (!validRoom(id)) notFound();
  const query = await searchParams;
  const platform = sharePlatform(query.share);
  const activity = shareActivity(query.activity);
  const until = shareUntil(query.until);
  const gameTitle = activity === 'game' ? shareGameTitle(query.game) : '';
  const title = 'YO — これから、ちょっと集まろ。';
  const description = invitationText(activity, until, gameTitle).replaceAll('\n', ' ');
  const image = { url: cardUrl(platform, activity, until, gameTitle), width: platform === 'Instagram' ? 1080 : 1200, height: platform === 'Instagram' ? 1920 : 630, alt: description };
  const publicQuery = new URLSearchParams({ share: platform.toLowerCase(), activity });
  if (until) publicQuery.set('until', String(until));
  if (gameTitle) publicQuery.set('game', gameTitle);
  return { title, description, robots: { index: false, follow: false }, referrer: 'no-referrer', openGraph: { title, description, type: 'website', url: `/call/${id}?${publicQuery}`, images: [image] }, twitter: { card: 'summary_large_image', title, description, images: [image] } };
}
export default async function CallPage({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; if (!validRoom(id)) notFound(); return <VoiceTest id={id} />; }
