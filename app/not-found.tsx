import Link from 'next/link';
export default function NotFound() {
  return <main className="not-found"><span className="brand">YO<span>✳</span></span><h1>このテーブルは見つかりません。</h1><p>リンクをご確認ください。公開中のサンプルはトップから見られます。</p><Link href="/" className="button primary">トップへ戻る ↗</Link></main>;
}
