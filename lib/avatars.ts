export const avatarNames = ['グリーンニット', 'パープルキャップ', 'ブルーキャップ', 'オレンジハット', 'ミントヘッドホン', 'ピーチベレー', 'クマ耳フード', 'スカイメガネ', 'レモンゲーマー', 'ピンクコーヒー', '泥酔', '一つ目', 'ゾンビ', 'げっそり', '猫', '犬', 'カエル'] as const;
export const AVATAR_COUNT = avatarNames.length;
export const avatarIds = avatarNames.map((_, id) => id);
export function validAvatar(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0 && value < AVATAR_COUNT;
}
export function avatarId(seed: number): number {
  return Number.isInteger(seed) ? ((seed % AVATAR_COUNT) + AVATAR_COUNT) % AVATAR_COUNT : 0;
}
