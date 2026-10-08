# 日本語カードのフォント

Noto Sans JP（700）のGoogle Fonts textサブセットを同梱。必要な定型日本語と日付・時刻の数字のみ収録。SIL Open Font License 1.1、同梱OFL.txtを参照。
取得元：Google Fonts CSS API (`family=Noto+Sans+JP:wght@700&text=...`)、2026-10-08。
TTFデータとしてImageResponseに渡し、日本語画像の生成時に外部フォントサービスへアクセスしない。カードの定型文を増やす場合は対応する文字をサブセットに追加する。

2026-10-08：任意のゲームタイトル対応用にNotoSansJP-Full.woffを追加。Google Fonts公式リポジトリのNotoSansJP[wght].ttfから700の静的WOFFに変換。日本語全グリフを収録し、入力文字を外部サービスへ送らずカードを生成。OFL.txtのライセンスを維持。
取得元：https://github.com/google/fonts/blob/main/ofl/notosansjp/NotoSansJP%5Bwght%5D.ttf
