# 招待共有とルームチャット

2026-10-08のユーザー依頼で追加。ログインなしの招待ゲストモードに対応。

## 共有

- 作成後の `/call/[id]` にLINE / X / Discord / Instagramの選択、招待リンクのコピー、SNSを開く、カード保存を配置。通話接続前から使える。
- LINEは公式共有画面、Xは投稿作成画面へ進む。最終送信・投稿は利用者が行う。DiscordはDM・チャンネルへコピーしたリンクを貼り付ける。Instagramは保存した縦長画像をストーリーズへ載せ、リンクスタンプまたはDMに招待URLを貼る。
- 各SNSのカードは `/api/share/card?platform=line|x|discord|instagram`。LINE/X/Discordは1200×630、Instagramは1080×1920 PNG。既存のYOビジュアルと正規SVGロゴを使う。
- 招待URLの `?share=` に対応するOGP/Twitter metadataを返す。SNSキャッシュや表示設定によりプレビューの表示は変わる。Instagramへの自動投稿は実装していない。
- 招待秘密値はURLフラグメントに保持し、画像URL・OGP・サーバーのクエリへ含めない。公開カードはブランドと一般的な招待文のみ。私的なルーム名・メンバー名・参加人数は公開しない。
- 画像は同一オリジンで生成し、カード保存にはContent-Dispositionを返す。SNS未選択・不正platformはLINEを既定値にする。

## チャット

- 同じLiveKitルームのReliable Data Packet、topic `yo.chat.v1`を使用。招待・期限・定員の検証後に発行した参加トークンだけにcanPublishDataを付ける。マイク以外のメディア・管理権限は付けない。
- 送信本文は最大500文字、受信は4KB以内。名前・IDはペイロードから取らず、LiveKitの接続済み参加者を根拠に表示。HTMLとして解釈せずReactのテキストとして描画する。
- 送信操作は1秒間隔、受信表示は参加者ごと3件/秒、重複・不正形式を除外。これらはブラウザーのUI制限であり、サーバーでの送信制限と同一視しない。
- 表示は最新200件。履歴のDB保存・再取得・ファイル送信・既読表示なし。退室や再読み込みで消える。切断中のメッセージは再配信されず、送信API成功は全員の受信・既読を保証しない。
- 再接続中は入力・送信を停止し、失敗時は下書きを維持。離脱時はイベントリスナーと履歴を破棄。

公式資料：[LiveKit Data packets](https://docs.livekit.io/transport/data/packets/)、[LINE共有ボタン](https://developers.line.biz/ja/docs/line-social-plugins/install-guide/using-line-share-buttons/)。

## 検証

`npm run test`でチャットの不正・過大・なりすまし形式と共有リンクのフラグメント保持を検査。`npm run build`で型と本番ビルドを確認。公開後の画面・PNG・OGP・参加トークンも確認する。複数の実端末間での音声・チャット受信は別途検証が必要。
