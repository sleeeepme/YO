import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')),
  title: 'YO — 今夜、ちょっと話さない？',
  description: '友達と、友達の友達と。SNSから集まる、小さなボイスチャットのテーブル。YOの公開プレビュー。',
  openGraph: { title: 'YO — 今夜、ちょっと話さない？', description: '友達と、友達の友達と。気軽に話せる、小さなテーブル。公開プレビュー。', type: 'website' },
  twitter: { card: 'summary_large_image' },
};
export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ja"><body>{children}</body></html>;
}
