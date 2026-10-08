import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { findRoom, rooms } from '@/lib/rooms';
import { PreviewApp } from '@/components/preview-app';
export function generateStaticParams() { return rooms.map(({ id }) => ({ id })); }
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const room = findRoom((await params).id);
  if (!room) return { title: 'ルームが見つかりません — YO' };
  return { title: `${room.title} — YO`, description: `YOでルームを作って、友達を招待しよう。登録なし、最大8人のボイスチャット。`, openGraph: { title: `${room.title} — YO`, description: 'YOでルームを作って、友達を招待しよう。登録なし、最大8人のボイスチャット。' } };
}
export default async function Invite({ params }: { params: Promise<{ id: string }> }) {
  const room = findRoom((await params).id);
  if (!room) notFound();
  return <PreviewApp initialRoom={room} />;
}
