import Link from 'next/link';
import { Logo } from '@/components/logo';
export default function NotFound() {
  return <main className="not-found"><Logo /><h1>このテーブルは見つかりません。</h1><p>リンクをご確認ください。公開中のサンプルはトップから見られます。</p><Link href="/" className="button primary">トップへ戻る ↗</Link></main>;
}
