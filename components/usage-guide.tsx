import { Avatar } from './avatar';
import Image from 'next/image';
import { Logo } from './logo';

function GuideScreen({ kind }: { kind: 'create' | 'invite' | 'message' | 'join' }) {
  return <div className={`guide-screen guide-screen-${kind}`} aria-hidden="true">
    <div className="guide-screen-bar"><span>● ● ●</span><small>{kind === 'message' ? 'DM' : 'YO'}</small></div>
    {kind === 'create' ? <div className="guide-screen-sheet"><span className="guide-screen-character drink" /><strong>ルームを作る</strong><small>ルーム名</small><span className="guide-screen-field">FRIDAY DRINK</span><div className="guide-screen-capacity"><small>定員</small><b>8人</b></div><span className="guide-screen-cta">ルームを作る ＋</span></div> :
      kind === 'invite' ? <><div className="guide-invite-art"><Image src="/friday-scene.webp" alt="" fill sizes="(max-width:680px) 150px, 260px" /><Logo /></div><div className="guide-invite-body"><strong>FRIDAY DRINK</strong><div className="guide-screen-friends"><Avatar seed={0} /><Avatar seed={1} /><Avatar seed={2} /></div><span className="guide-screen-cta">招待リンクをコピー ↗</span><small>いつものSNSで友達へ</small></div></> :
      kind === 'message' ? <div className="guide-message-body"><div className="guide-message-sender"><Avatar seed={1} /><small>友達からの招待</small></div><span className="guide-chat-bubble">ちょっと話そう！</span><div className="guide-dm-invite"><div className="guide-dm-art"><Image src="/friday-scene.webp" alt="" fill sizes="(max-width:680px) 150px, 260px" /></div><strong>FRIDAY DRINK</strong><small>招待リンクを開く ↗</small></div></div> :
      <div className="guide-screen-sheet"><span className="guide-screen-character game" /><strong>一緒に話そう！</strong><small>あなたの呼び名</small><span className="guide-screen-field">あなたの名前</span><span className="guide-screen-cta">静かに参加する →</span><small>マイクはあとからONに</small></div>}
  </div>;
}

export function UsageGuide({ onCreate }: { onCreate: () => void }) {
  return <section className="usage-guide" aria-labelledby="usage-title">
    <h2 id="usage-title" className="usage-heading">YOの使い方</h2>
    <p className="usage-lead">自分から誘っても、友達に誘われても。リンクひとつで、同じルームへ。</p>
    <div className="usage-paths">
      <section className="usage-path host-path" aria-labelledby="host-path-title">
        <header><span className="usage-role">ホスト</span><h3 id="host-path-title">自分から友達を誘う</h3></header>
        <div className="usage-story-art host-story"><Image src="/friday-scene.webp" alt="ビールで乾杯する、緑のニット帽と紫のキャップのキャラクター" fill sizes="(max-width:900px) 90vw, 560px" /><span>「今から、乾杯しない？」</span></div>
        <p className="usage-screen-note">こんな画面で、かんたん2ステップ<span>画面イメージ</span></p>
        <ol className="usage-steps">
          <li><span className="usage-step-number">1</span><GuideScreen kind="create" /><h4>ルームを作る</h4><p>気分を選んで、ルーム名と人数を決める。</p></li>
          <li><span className="usage-step-number">2</span><GuideScreen kind="invite" /><h4>友達を招待する</h4><p>リンクをコピーして、SNSやDMで友達に送る。</p></li>
        </ol>
        <div className="usage-path-footer"><p>現在は限定テスト用のホストコードが必要です。</p><button type="button" className="button primary" aria-haspopup="dialog" onClick={onCreate}>ルームを作ってみる ＋</button></div>
      </section>
      <section className="usage-path guest-path" aria-labelledby="guest-path-title">
        <header><span className="usage-role">参加者</span><h3 id="guest-path-title">友達の招待から参加する</h3></header>
        <div className="usage-story-art guest-story"><Image src="/usage-game-night-v1.webp" alt="コントローラーを持った友達と、ソファでゲームを楽しむキャラクターたち" fill sizes="(max-width:900px) 90vw, 560px" /><span>「あと一戦、一緒にやろ！」</span></div>
        <p className="usage-screen-note">招待が届いたら、そのまま参加<span>画面イメージ</span></p>
        <ol className="usage-steps">
          <li><span className="usage-step-number">1</span><GuideScreen kind="message" /><h4>招待リンクを開く</h4><p>友達から届いたリンクで、参加画面を開く。</p></li>
          <li><span className="usage-step-number">2</span><GuideScreen kind="join" /><h4>ルームに参加する</h4><p>呼び名を入れて参加。マイクはあとからONに。</p></li>
        </ol>
        <div className="usage-path-footer guest-footer"><p>アプリのダウンロード不要。招待リンクから参加できます。</p><span className="usage-invite-hint">友達から届いたリンクを開いてね</span></div>
      </section>
    </div>
    <div className="usage-together"><div className="usage-together-avatars" aria-hidden="true"><Avatar seed={0} /><Avatar seed={1} /><Avatar seed={2} /></div><div><h3>同じルームで、あとは話すだけ。</h3><p>乾杯も、雑談も、ゲームも。最大8人で気軽にボイチャ。</p></div></div>
  </section>;
}
