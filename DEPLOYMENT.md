# YO 公開状況

- 公開URL: https://yo-fawn-tau.vercel.app
- 公開日: 2026-10-07（日本時間）
- 環境: production / 状態: READY
- バージョン: 0.3.0 / Next.js 16.4.0
- Vercelプロジェクト: yo / prj_nwZ7YRgsjm74PGffYoRWpYdVkLRT
- デプロイID: dpl_GepVX5ZyDbsU3wFi1dvPfnqPN2aS
- 配信したアプリのコミット: 10c2a2405847c48a77d504e1ec0e8a4d0a75929f

## 利用できること・未設定の機能

トップ、気分フィルター、招待サンプル、リンクコピー、2〜8人のローカルプレビュー、アバターとShuffle、OGP。ユーザー指定の濃紺・白YO・紫CTA・3Dキャラクターのデザインを維持。

v0.3で招待ゲスト用の通話UI、サーバーAPI、参加枠SQL、署名webhookを追加。Supabase / LiveKitの環境変数は未登録で、実通話は無効。公開画面は「通話テストは準備中」と表示し、作成・参加APIは503で停止する。VOICE_SETUP.mdに有効化手順と検証条件を記載。

SNSログイン、友達判定、承認、ブロックは未実装。デザインサンプルの人数・名前・時間は架空。

## 確認結果

- npm run typecheck / npm run test / npm run build: 成功。3件の自動テスト。
- Cookie改ざん・期限・リンク形式を検証。
- PGliteでSQL適用、8枠、重複参加、予約回収、終了・期限切れ、公開権限とレート制限を検証。PGliteは実Supabaseの複数接続による競合試験とは異なる。
- ローカル・公開URLとも status ready:false、作成・参加503、不正Origin403を確認。ローカルの不正な通話IDは404。
- 公開 /api/health はversion 0.3.0、voiceTest.implemented:true / ready:false、voice / sharedRooms / authentication / friendGraph:false。
- 公開ブラウザで準備中表示を確認。390pxで横はみ出しなし。確認範囲のブラウザエラーなし。
- 実際の複数端末での相互音声、LiveKit接続、実Supabaseでの同時入室、webhook到達は未検証。設定後の受け入れ条件はVOICE_SETUP.md。

## 配信運用

GitHub main の上記コミットを指定してVercel APIから配信。今後のpushの自動配信は未確認。後続コミットが文書だけなら配信コードは上記コミットのまま。

Vercelのアクセス保護設定は変更していない。上記公開ドメインは認証情報なしで閲覧・API確認済み。環境変数の保存後は新しいデプロイが必要。

前のデザイン版: b2c98be053405f10a942e0c7d99c91653c420cba / dpl_Pxy7n9briuWpJscPiXFktBmkoXGc。
