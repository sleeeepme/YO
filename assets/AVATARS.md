# YOアバター素材（2026-10-08）

既存の0〜3番はpublic/avatars.webpを維持。4〜9番はbuilt-in image_genで6回生成。参照は既存のavatars.webp（スタイルのみ）。透明PNGのアルファを維持し、配信用に512×683のWebPへ変換。新素材の合計は約205KB。原本はCodex生成画像フォルダに保持。

14種類のID・名前・検証はlib/avatars.tsで共通化。選択画面・参加API・LiveKit metadataの表示は同じIDを使用。選択中をチェックとaria-pressedで表し、接続中は選択不可。

## 生成プロンプト

### mint-headphones

配信素材：../public/avatars/mint-headphones.webp

Use case: stylized-concept. Asset type: one transparent full-body avatar for YO voice-chat website. Reference image is STYLE REFERENCE ONLY: match its soft toy-like 3D rounded blob creatures, stubby legs, round mitten hands, large glossy black oval eyes, cheerful small mouth, gentle soft studio lighting and pastel materials. Create exactly ONE new character: mint-green body, oversized lavender over-ear headphones, tiny smile, empty hands waving. Full body centered in a portrait composition, isolated on genuinely transparent background, no other characters, no platform, no ground, no backdrop, no text, no logos, no watermark. Character occupies about 75 percent of image height with generous clear margins on every side, no clipping. Distinct high quality clean silhouette, consistent front three-quarter view like the reference. This is a finished production UI cutout.

### peach-beret

配信素材：../public/avatars/peach-beret.webp

Use case: stylized-concept. Asset type: one transparent full-body avatar for YO voice-chat website. Reference image is STYLE REFERENCE ONLY: match its soft toy-like 3D rounded blob creatures, stubby legs, round mitten hands, large glossy black oval eyes, cheerful small mouth, gentle soft studio lighting and pastel materials. Create exactly ONE new character: soft peach body, coral-orange beret with a small cream star pin, cheerful expression, empty hands waving. Full body centered in a portrait composition, isolated on genuinely transparent background, no other characters, no platform, no ground, no backdrop, no text, no logos, no watermark. Character occupies about 75 percent of image height with generous clear margins on every side, no clipping. Distinct high quality clean silhouette, consistent front three-quarter view like the reference. This is a finished production UI cutout.

### lavender-hoodie

配信素材：../public/avatars/lavender-hoodie.webp

Use case: stylized-concept. Asset type: one transparent full-body avatar for YO voice-chat website. Reference image is STYLE REFERENCE ONLY: match its soft toy-like 3D rounded blob creatures, stubby legs, round mitten hands, large glossy black oval eyes, cheerful small mouth, gentle soft studio lighting and pastel materials. Create exactly ONE new character: pale lavender body, cream hoodie with two small rounded bear ears, round black eyes, empty hands waving. Full body centered in a portrait composition, isolated on genuinely transparent background, no other characters, no platform, no ground, no backdrop, no text, no logos, no watermark. Character occupies about 75 percent of image height with generous clear margins on every side, no clipping. Distinct high quality clean silhouette, consistent front three-quarter view like the reference. This is a finished production UI cutout.

### sky-glasses

配信素材：../public/avatars/sky-glasses.webp

Use case: stylized-concept. Asset type: one transparent full-body avatar for YO voice-chat website. Reference image is STYLE REFERENCE ONLY: match its soft toy-like 3D rounded blob creatures, stubby legs, round mitten hands, large glossy black oval eyes, cheerful small mouth, gentle soft studio lighting and pastel materials. Create exactly ONE new character: soft sky-blue body, round thin white eyeglasses, lemon-yellow knit beanie, empty hands waving. Full body centered in a portrait composition, isolated on genuinely transparent background, no other characters, no platform, no ground, no backdrop, no text, no logos, no watermark. Character occupies about 75 percent of image height with generous clear margins on every side, no clipping. Distinct high quality clean silhouette, consistent front three-quarter view like the reference. This is a finished production UI cutout.

### lemon-gamer

配信素材：../public/avatars/lemon-gamer.webp

Use case: stylized-concept. Asset type: one transparent full-body avatar for YO voice-chat website. Reference image is STYLE REFERENCE ONLY: match its soft toy-like 3D rounded blob creatures, stubby legs, round mitten hands, large glossy black oval eyes, cheerful small mouth, gentle soft studio lighting and pastel materials. Create exactly ONE new character: pale lemon-yellow body, dark-purple baseball cap worn backwards, holding a small navy video game controller with both rounded hands. Full body centered in a portrait composition, isolated on genuinely transparent background, no other characters, no platform, no ground, no backdrop, no text, no logos, no watermark. Character occupies about 75 percent of image height with generous clear margins on every side, no clipping. Distinct high quality clean silhouette, consistent front three-quarter view like the reference. This is a finished production UI cutout.

### pink-coffee

配信素材：../public/avatars/pink-coffee.webp

Use case: stylized-concept. Asset type: one transparent full-body avatar for YO voice-chat website. Reference image is STYLE REFERENCE ONLY: match its soft toy-like 3D rounded blob creatures, stubby legs, round mitten hands, large glossy black oval eyes, cheerful small mouth, gentle soft studio lighting and pastel materials. Create exactly ONE new character: soft pastel pink body, turquoise bucket hat, holding a small white cup of coffee, happy open smile. Full body centered in a portrait composition, isolated on genuinely transparent background, no other characters, no platform, no ground, no backdrop, no text, no logos, no watermark. Character occupies about 75 percent of image height with generous clear margins on every side, no clipping. Distinct high quality clean silhouette, consistent front three-quarter view like the reference. This is a finished production UI cutout.

## ユニークな4種類の追加

10〜13番：泥酔、一つ目、ゾンビ、げっそり。built-in image_genを4回使用し、既存のpink-coffeeをスタイル参照として新キャラクターを制作。透過PNGから512×683のWebPへ変換。原本は生成フォルダに保持。

### tipsy（泥酔）

配信素材：../public/avatars/tipsy.webp

Create one full-body YO app avatar in the same polished soft 3D vinyl plush toy style as the reference character. Replace the reference character with this new character: A rosy pink extremely tipsy drunk party blob, flushed cheeks, comically drooping mismatched eyes, goofy smile, slumped wobbly pose, crooked purple cap, holding a small beer mug. Cute funny and visibly tipsy. Rounded tiny limbs, soft pastel colors, smooth material, studio lighting. Entire character centered with generous transparent margins, consistent full-body framing. Transparent background, no floor, no shadow plane, no halo, no text, no other characters. Portrait 3:4.

### cyclops（一つ目）

配信素材：../public/avatars/cyclops.webp

Create one full-body YO app avatar in the same polished soft 3D vinyl plush toy style as the reference character. Replace the reference character with this new character: A lavender cyclops blob with exactly ONE large glossy black oval eye in the center of its face, no other eyes, tiny cheerful smile, teal beanie, waving one stubby arm. Rounded tiny limbs, soft pastel colors, smooth material, studio lighting. Entire character centered with generous transparent margins, consistent full-body framing. Transparent background, no floor, no shadow plane, no halo, no text, no other characters. Portrait 3:4.

### zombie（ゾンビ）

配信素材：../public/avatars/zombie.webp

Create one full-body YO app avatar in the same polished soft 3D vinyl plush toy style as the reference character. Replace the reference character with this new character: A pale mint green cute zombie blob, uneven sleepy black eyes, small stitched patches on forehead and body, ragged purple hoodie, quirky tiny single tooth, arms reaching forward. Playful zombie, no gore. Rounded tiny limbs, soft pastel colors, smooth material, studio lighting. Entire character centered with generous transparent margins, consistent full-body framing. Transparent background, no floor, no shadow plane, no halo, no text, no other characters. Portrait 3:4.

### exhausted（げっそり）

配信素材：../public/avatars/exhausted.webp

Create one full-body YO app avatar in the same polished soft 3D vinyl plush toy style as the reference character. Replace the reference character with this new character: An unusually skinny elongated pale cream bean-shaped exhausted blob, visibly sunken cheeks, dark circles under droopy glossy black eyes, hunched shoulders, limp little arms, oversized blue cap, tiny weary mouth. Clearly gaunt but adorable. Rounded tiny limbs, soft pastel colors, smooth material, studio lighting. Entire character centered with generous transparent margins, consistent full-body framing. Transparent background, no floor, no shadow plane, no halo, no text, no other characters. Portrait 3:4.
