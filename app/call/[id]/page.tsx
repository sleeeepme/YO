import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { validRoom } from '@/lib/voice/security';
import { VoiceTest } from '@/components/voice-test';
export const metadata: Metadata = { title: 'YO — 招待ゲスト通話', robots: { index: false, follow: false }, referrer: 'no-referrer', description: 'YOの招待ゲスト向け通話テストです。' };
export default async function CallPage({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; if (!validRoom(id)) notFound(); return <VoiceTest id={id} />; }
