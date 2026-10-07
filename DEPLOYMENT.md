# YO 公開状況

- 公開URL: https://yo-fawn-tau.vercel.app
- 公開日: 2026-10-07（日本時間）
- 環境: production / 状態: READY
- フレームワーク: Next.js 16.4.0
- Vercelプロジェクト: yo / prj_nwZ7YRgsjm74PGffYoRWpYdVkLRT
- デプロイID: dpl_Pxy7n9briuWpJscPiXFktBmkoXGc
- 配信したアプリのコミット: b2c98be053405f10a942e0c7d99c91653c420cba

## この版で使えること

トップページ、気分フィルター、公開サンプルの招待、リンクコピー、2〜8人のローカルプレビュー、ランダムアバターとShuffle、ブラウザ内のアバター保存、OGP。

認証、SNSログイン、友達判定、承認、共有ルームの永続化、実際の音声通話は未実装です。
サンプルの人数・名前・残り時間は架空の表示です。

## 確認結果

- npm run typecheck / npm run build: 成功。
- ブラウザ: テーブルのプレビュー作成、定員2人、アバター変更、満員時の別テーブル導線、気分フィルター、サンプル招待リンクのコピーを確認。
- モバイル幅390px: 満員の招待画面を確認。
- 公開ページのブラウザエラー: 確認範囲ではなし。
- 認証情報なしのHTTPアクセス: /、/invite/friday-drink、/api/health、/opengraph-image が200。不明な招待IDは404。
- /api/health: public-preview。authentication / voice / sharedRooms は false。
- 公開URLのOGP画像URLが公開URL上の画像を指すことを確認。

## 配信運用

GitHub main の上記コミットを指定して Vercel API から配信しました。
今後のpushが自動配信されることは未確認です。Git連携・本番ブランチの設定を確認してから運用してください。
後続コミットが文書のみの場合、配信中のアプリのコードは上記コミットのままです。

Vercel のアクセス保護設定は変更していません。上記の公開ドメインは認証情報なしで閲覧できることを確認済みです。

## v0.2 デザイン更新

ユーザー指定のコンセプト画像に合わせて、白い丸いYOロゴ、濃紺背景、紫のCTA、白い参加カード、3Dキャラクター、暖色のバー背景へ更新。参加方法・アバター・入室確認の画面切り替えを追加。

公開URLで新デザインをブラウザ確認。390pxのモバイル表示と1280pxのデスクトップ表示を確認。キャラクターと背景画像は200応答で、ローカルの素材とハッシュ一致。OGPも200。状態APIはバージョン0.2.0。

デザインの基準は DESIGN.md に保存。認証・実際の音声通話は引き続き未対応。

前の公開版: a3af351e98e50c7a9f9876f23206090dca3b05d7 / dpl_HgppzgKk3Qf38SZczmFW85h5jQu7。

## v0.3 通話テスト準備

招待ゲスト用の通話UI・サーバーAPI・参加枠SQL・署名webhookを追加。Supabase / LiveKitの環境変数は未登録で、通話テストは無効。VOICE_SETUP.mdに有効化手順と外部検証条件を記載。

型チェック・本番ビルド・3件の自動テスト成功。PGliteによるSQL検証は実Supabaseの複数接続による競合試験ではない。ローカルで未設定statusのready:false、作成・参加503、不正Origin403、不正な通話ID404を確認。実際の複数端末での音声は未検証。
