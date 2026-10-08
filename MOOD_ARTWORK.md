# Mood choice artwork

2026-10-08: `public/mood-characters-v1.webp` is a transparent three-cell atlas generated with the built-in image_gen tool, using `public/avatars.webp` as the identity/style reference. Exported as 1086 × 362 WebP with alpha, quality 85. Existing avatars remain unchanged.

## Final prompt

Use case: precise-object-edit. Asset type: transparent horizontal character sprite atlas for YO website mood buttons. Input image: existing YO avatar atlas, edit target and identity/style reference. Create exactly THREE equally spaced full-body characters in three equal-width cells, left to right: 1 white marshmallow with green knitted beanie, holding a clearly recognizable glass mug of golden beer with foam; 2 pink marshmallow with backwards purple cap and dark sunglasses, cheerful waving, no prop; 3 white marshmallow with blue baseball cap, holding a dark game controller with both hands, no drink. Preserve adorable soft 3D toy proportions, glossy black oval eyes, tiny smiling mouths, rounded limbs and existing hats. Clean high-quality smooth silhouettes, softly lit, same scale, centered separately in each cell, generous transparent margins, no overlap. Genuine transparent background, no text, no cards, no badges, no floor, no watermarks. Wide 3:1 composition.

## Interaction

The three mood buttons sit below the hero copy and stay in three columns on mobile. Category names are primary; suggested room names are secondary. Each button opens the actual VoiceTest creation form in a native dialog with its suggested room name. Category selection does not bypass host-code checks or persist a new database mood field. No sample occupancy is displayed on these creation buttons. The old filter and duplicated lower list were removed.
