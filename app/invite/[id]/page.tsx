import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { findRoom, rooms } from '@/lib/rooms';
import { PreviewApp } from '@/components/preview-app';
export function generateStaticParams() { return rooms.map(({ id }) => ({ id })); }
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const room = findRoom((await params).id);
  if (!room) return { title: 'ルームが見つかりません — YO' };
  return { title: `${room.title} — YO 招待プレビュー`, description: `${room.description} サンプルの招待画面です。実際の参加・通話は準備中。`, openGraph: { title: `${room.title} — YO`, description: '公開サンプルの招待プレビュー。実際の参加・通話は準備中。' } };
}
export default async function Invite({ params }: { params: Promise<{ id: string }> }) {
  const room = findRoom((await params).id);
  if (!room) notFound();
  return <PreviewApp initialRoom={room} />;
}
