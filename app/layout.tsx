import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')),
  title: 'YO — これから、ちょっと集まろ。',
  description: '飲んだり、遊んだり、ただしゃべったり。ひまな時間に、友達とサクッとボイチャ。',
  openGraph: { title: 'YO — これから、ちょっと集まろ。', description: '飲んだり、遊んだり、ただしゃべったり。ひまな時間に、友達とサクッとボイチャ。', type: 'website' },
  twitter: { card: 'summary_large_image' },
};
export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ja"><body>{children}</body></html>;
}
