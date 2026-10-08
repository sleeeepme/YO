# YO バーチャル空間ビジュアル

2026-10-08。ユーザーの「家が金持ちすぎるので庶民の家かバーチャル空間に」という依頼を受け、家ではなく親しみやすいバーチャル空間に統一。built-in image_gen.imagegenで既存素材を編集。キャラクター・乾杯・ゲームを維持し、高級な室内・夜景を削除。WebPへ変換してリポジトリ内に保存。

| 用途 | 最終素材 | 編集対象 | 追加参照 |
| --- | --- | --- | --- |
| トップ背景 | public/hero-virtual-v1.webp | public/hero-lounge-v1.webp | public/mood-characters-v1.webp |
| 乾杯・招待画面 | public/invite-virtual-v1.webp | public/friday-scene.webp | public/mood-characters-v1.webp |
| ゲームの使い方 | public/game-virtual-v1.webp | public/usage-game-night-v1.webp | public/mood-characters-v1.webp |

既存の画像は履歴として保存。現在表示する画像は上記の3つ。ロゴや透明キャラクター素材、コピーと操作フローは維持する。

## hero

```text
Use case: precise-object-edit. Asset type: full-width website hero, wide 16:9 landscape. Input image 1: edit target showing four friends; image 2: character identity reference. Replace the wealthy penthouse lounge entirely with a playful, accessible virtual hangout floating in a navy, lilac and turquoise digital sky. Preserve exactly the four cute rounded 3D marshmallow characters and their identities: pink backward purple cap with black sunglasses and white green beanie friend clinking golden beer mugs; cream blue baseball cap and pink purple headphones friends playing with dark game controllers. Keep warm expressive smiles, glossy black oval eyes, plush soft bodies. Keep the composition: LEFT 30 percent largely quiet dark abstract sky for website text, all four characters clustered CENTER and RIGHT, their faces and hands in the middle of the frame, compact enough to remain recognizable on mobile. Seat them on simple soft rounded floating platforms and small colorful cushions, a low simple rounded platform for snacks; scattered little stars, translucent bubbles and subtle orbit arcs. Whimsical approachable multiplayer-game lobby, polished cute 3D rendering, readable silhouettes and soft glow. No house, no architecture, no walls, no windows, no city skyline, no bookshelves, no lamps, no luxury furniture, no expensive interiors, no realistic bar, no text, no logo, no watermark. Lower edge blends toward deep navy. Preserve drinking and gaming activities with complete faces, hands and props.
```

## invite

```text
Use case: precise-object-edit. Asset type: portrait invitation illustration 3:4, also cropped into a wide website banner. Input image 1: edit target two cheering friends; image 2: character identity reference. Replace the wealthy bar/home completely with a colorful virtual gathering place floating in a soft navy-purple digital sky with pastel lilac rounded platforms, little golden stars and translucent bubbles. Keep exactly the pink marshmallow friend with backwards purple cap and black sunglasses and the white marshmallow friend with green knitted beanie, clinking two golden beer mugs with white foam and smiling. Keep the same soft rounded 3D toy bodies, black oval eyes, identities, pose and emotional warmth. Faces and mugs should remain grouped in the central middle half of the portrait for a horizontal banner crop; show their rounded feet and a simple little floating lilac platform below, navy-purple gradient above and below. Friendly casual digital game lobby, polished 3D render, soft playful glow. Remove all wood bar furnishings, windows, buildings, shelves, hanging lights, plants and luxurious home details. No house or architecture of any kind, no luxury furniture, no text, no logo, no watermark.
```

## game

```text
Use case: precise-object-edit. Asset type: wide 16:9 website illustration. Input image 1: edit target three gaming friends; image 2: character identity reference. Replace the wealthy lounge entirely with a playful virtual game lobby in a navy, purple and turquoise digital sky. Keep exactly the three smiling rounded 3D marshmallow friends: green knitted beanie white friend waving on the LEFT, cream blue baseball cap friend holding a dark controller CENTER, pink purple headphones friend holding a dark controller RIGHT. Preserve their adorable plush toy identities, glossy black oval eyes, bright smiles and detailed accessories. Seat them on simple lilac and teal floating rounded platforms and soft colorful cushions, with a little bowl of popcorn, little stars, translucent bubbles and subtle game-like orbit arcs. Faces and controllers occupy the central 80 percent of the frame, easy to read in a wide banner crop. Rich cheerful colors and soft glowing 3D rendering, casual welcoming digital playground. No home, no architecture, no walls, no windows, no skyscrapers, no bookshelves, no lamps, no luxury furniture, no expensive interior, no leather sofa. No text, no logo, no watermark.
```

