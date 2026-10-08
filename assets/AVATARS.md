# YOアバター素材（2026-10-08）

既存の0〜3番はpublic/avatars.webpを維持。4〜9番はbuilt-in image_genで6回生成。参照は既存のavatars.webp（スタイルのみ）。透明PNGのアルファを維持し、配信用に512×683のWebPへ変換。新素材の合計は約205KB。原本はCodex生成画像フォルダに保持。

20種類のID・名前・検証はlib/avatars.tsで共通化。選択画面・参加API・LiveKit metadataの表示は同じIDを使用。初回と変更はランダムのみ。変更時は現在のIDを除外し、接続中は変更不可。

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

## 猫・犬・カエル追加

14〜16番。built-in image_genで3回生成。pink-coffeeをスタイル参照に使用。透過PNGから512×683のWebPへ変換。原本は生成フォルダに保持。

### cat（猫）

配信素材：../public/avatars/cat.webp

Use case: stylized-concept. Create ONE full-body animal avatar for YO voice chat. Reference is STYLE ONLY: match polished soft 3D vinyl plush, pastel rounded blob body, tiny stubby limbs, adorable smooth toy appearance. Subject: A peach cream cat mascot with triangular cat ears, whiskers, tiny pink nose, curved fluffy tail, large glossy black oval eyes, playful smile and one paw waving. Entire character centered, occupies 75 percent of portrait 3:4 image height with generous clear margins. Transparent background, no floor, no platform, no shadow plane, no text, no other characters. Soft studio lighting, clean silhouette. Make the animal instantly recognizable.

### dog（犬）

配信素材：../public/avatars/dog.webp

Use case: stylized-concept. Create ONE full-body animal avatar for YO voice chat. Reference is STYLE ONLY: match polished soft 3D vinyl plush, pastel rounded blob body, tiny stubby limbs, adorable smooth toy appearance. Subject: A golden cream puppy mascot with floppy brown ears, little round muzzle and shiny black nose, tiny wagging tail, glossy black oval eyes, happy open mouth and stubby paws. Entire character centered, occupies 75 percent of portrait 3:4 image height with generous clear margins. Transparent background, no floor, no platform, no shadow plane, no text, no other characters. Soft studio lighting, clean silhouette. Make the animal instantly recognizable.

### frog（カエル）

配信素材：../public/avatars/frog.webp

Use case: stylized-concept. Create ONE full-body animal avatar for YO voice chat. Reference is STYLE ONLY: match polished soft 3D vinyl plush, pastel rounded blob body, tiny stubby limbs, adorable smooth toy appearance. Subject: A mint green frog mascot with two big glossy black eyes on raised round eye bumps, wide cheerful smile, cream belly, tiny rounded webbed feet and waving rounded hands. Entire character centered, occupies 75 percent of portrait 3:4 image height with generous clear margins. Transparent background, no floor, no platform, no shadow plane, no text, no other characters. Soft studio lighting, clean silhouette. Make the animal instantly recognizable.

## 宇宙人・ロボ・ジェイソン追加／ランダム専用

17〜19番。built-in image_genで3回生成。pink-coffeeをスタイル参照に使用。透過PNGから512×683のWebPへ変換。原本は生成フォルダに保持。選択一覧は廃止し、ランダム変更時は現在のIDを除外。

### alien（宇宙人）

配信素材：../public/avatars/alien.webp

Use case: stylized-concept. Create ONE full-body YO voice-chat avatar. Reference is STYLE ONLY: polished soft 3D vinyl plush toy, rounded body, short limbs, pastel materials and adorable appearance. Subject: A mint-lime alien blob, oversized smooth oval head, two large glossy black almond-shaped eyes, small antennae, tiny smile, silver violet space suit collar and waving stubby arm. Entire character centered at 75 percent of portrait 3:4 image height with generous clear margins. Soft studio lighting. Transparent background, no floor, no shadow plane, no text, no other characters, clean silhouette.

### robot（ロボ）

配信素材：../public/avatars/robot.webp

Use case: stylized-concept. Create ONE full-body YO voice-chat avatar. Reference is STYLE ONLY: polished soft 3D vinyl plush toy, rounded body, short limbs, pastel materials and adorable appearance. Subject: A cute rounded pastel silver and sky-blue robot, rounded rectangular head, two glowing turquoise eyes on a dark face panel, tiny antenna, rounded metal mitten hands and stubby feet, friendly digital smile. Entire character centered at 75 percent of portrait 3:4 image height with generous clear margins. Soft studio lighting. Transparent background, no floor, no shadow plane, no text, no other characters, clean silhouette.

### jason（ジェイソン）

配信素材：../public/avatars/jason.webp

Use case: stylized-concept. Create ONE full-body YO voice-chat avatar. Reference is STYLE ONLY: polished soft 3D vinyl plush toy, rounded body, short limbs, pastel materials and adorable appearance. Subject: A cute chubby toy version of Jason Voorhees, wearing his recognizable off-white hockey mask with small breathing holes, black eye openings and red chevron markings, worn olive jacket, dark trousers, stubby rounded hands and feet. Friendly playful pose, no weapons, no blood, no gore. Entire character centered at 75 percent of portrait 3:4 image height with generous clear margins. Soft studio lighting. Transparent background, no floor, no shadow plane, no text, no other characters, clean silhouette.
