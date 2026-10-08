import { Avatar } from './avatar';

export function UsageGuide({ onCreate }: { onCreate: () => void }) {
  return <section className="usage-guide" aria-labelledby="usage-title">
    <h2 id="usage-title" className="usage-heading">YOの使い方</h2>
    <p className="usage-lead">自分から誘っても、友達に誘われても。リンクひとつで、同じルームへ。</p>
    <div className="usage-paths">
      <section className="usage-path host-path" aria-labelledby="host-path-title">
        <header><span className="usage-role">ホスト</span><h3 id="host-path-title">自分から友達を誘う</h3></header>
        <ol className="usage-steps">
          <li><span className="usage-step-number">1</span><div className="usage-illustration usage-room" aria-hidden="true"><span className="usage-mini-avatar"><Avatar seed={0} /></span><span className="usage-mini-label">自分のルーム</span><span className="usage-plus">＋</span></div><h4>ルームを作る</h4><p>上の気分を選んで、<br />ルーム名と人数を決める。</p></li>
          <li><span className="usage-step-number">2</span><div className="usage-illustration usage-link" aria-hidden="true"><svg viewBox="0 0 48 48"><path d="m19 29 10-10M16 25l-3 3a8 8 0 0 0 11 11l7-7a8 8 0 0 0 0-11M32 23l3-3A8 8 0 0 0 24 9l-7 7a8 8 0 0 0 0 11" /></svg><span>招待リンク</span><span className="usage-send">↗</span></div><h4>友達を招待する</h4><p>作成後の招待リンクをコピー。<br />いつものSNSやDMで送る。</p></li>
        </ol>
        <div className="usage-path-footer"><p>現在は限定テスト用のホストコードが必要です。</p><button type="button" className="button primary" aria-haspopup="dialog" onClick={onCreate}>ルームを作ってみる ＋</button></div>
      </section>
      <section className="usage-path guest-path" aria-labelledby="guest-path-title">
        <header><span className="usage-role">参加者</span><h3 id="guest-path-title">友達の招待から参加する</h3></header>
        <ol className="usage-steps">
          <li><span className="usage-step-number">1</span><div className="usage-illustration usage-message" aria-hidden="true"><span className="usage-mini-avatar"><Avatar seed={1} /></span><span className="usage-message-bubble">一緒に話そう！<small>招待リンク ↗</small></span></div><h4>招待リンクを開く</h4><p>友達から届いたリンクをタップ。<br />そのルームの参加画面へ。</p></li>
          <li><span className="usage-step-number">2</span><div className="usage-illustration usage-join" aria-hidden="true"><span className="usage-mini-avatar"><Avatar seed={2} /></span><span className="usage-mini-label">あなたの呼び名</span><span className="usage-check">✓</span></div><h4>ルームに参加する</h4><p>呼び名を入れて「静かに参加」。<br />参加後にマイクをONにする。</p></li>
        </ol>
        <div className="usage-path-footer guest-footer"><p>アプリのダウンロード不要。招待リンクから参加できます。</p><span className="usage-invite-hint">友達から届いたリンクを開いてね</span></div>
      </section>
    </div>
    <div className="usage-together"><div className="usage-together-avatars" aria-hidden="true"><Avatar seed={0} /><Avatar seed={1} /><Avatar seed={2} /></div><div><h3>同じルームで、あとは話すだけ。</h3><p>乾杯も、雑談も、ゲームも。最大8人で気軽にボイチャ。</p></div></div>
  </section>;
}
