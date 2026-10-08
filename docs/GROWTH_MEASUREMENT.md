# YO: 利用分析と費用監視 (初期実装計画)

## 目的
広告費をかける前に「招待 → 入室 → 通話 → 次回の主催」が成立するか検証する。通話内容・音声は収集しない。

## イベント仕様
| event | 発火条件 | 主な属性 |
| --- | --- | --- |
| invite_opened | 招待ページが表示されたとき（重複除外） | invite_id, source, anonymous_id |
| room_join_attempted | 入室ボタン押下 | room_id, anonymous_id |
| room_joined | サーバー側で入室確定 | room_id, anonymous_id |
| voice_connected | LiveKit接続成功 | room_id, anonymous_id |
| voice_disconnected | LiveKit切断 | room_id, anonymous_id, duration_seconds |
| room_created | ルーム作成成功 | room_id, anonymous_id |
| invite_shared | ユーザーが共有アクションを実行 | room_id, source, anonymous_id |

source は x / threads / bluesky / line / discord / native / copy / unknown などの許可リストに正規化。utm_source は信用できない入力として扱う。
anonymous_id はサーバーで発行したランダムな識別子を使用し、IP・メール・SNSハンドルを分析テーブルに保存しない。
同意・プライバシー告知とデータ保持期限を公開前に確認する。通話内容・マイク入力は記録しない。

## 集計指標
- 入室率 = room_joined / invite_opened（同一招待・匿名IDの重複を除外）
- 通話成功率 = voice_connected / room_joined
- 通話時間中央値 = voice_disconnected.duration_seconds の中央値
- 7日以内のグループ再利用率 = 初回利用後7日以内に再利用したグループ / 初回利用グループ
- 新規参加者の主催率 = 参加後7日以内に room_created を行った匿名ID / 初回参加匿名ID

※グループ再利用率の計測には同一グループを識別する仕組みが別途必要。現状のゲストIDだけでは推定値になる。

## 費用と制限
予算目安: 月額10,000円。3,000 / 5,000 / 8,000円で通知、上限到達前に新規作成制限を検討。
LiveKit: 接続分数・転送量・同時接続数。Supabase: DB容量・通信量。Vercel: リクエスト・転送量・実行時間。
**重要**: サービス別請求額の自動取得はAPIの提供範囲に依存する。使用量からの概算と実際の請求額を混同しない。
制限・Kill Switch はサーバー側で強制する。通知のみでは請求上限にならない。

## 実装順
1. SQLマイグレーションを確認し、分析イベント用テーブルとRLSを追加
2. イベント受信API（レート制限、入力検証、冪等性）を追加
3. 既存ルーム作成・参加・LiveKitイベントにサーバー計測を接続
4. 集計用管理画面を認証付きで追加
5. 各社利用量取得の可否を確認し、費用概算・警告・Kill Switchを接続
6. テスト（重複イベント、改ざん、再送、切断、制限超過）と実機検証

初期段階では個人情報を最小化し、公開ダッシュボードや外部解析SDKは導入しない。
