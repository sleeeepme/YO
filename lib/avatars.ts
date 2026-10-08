export const avatarNames = ['グリーンニット', 'パープルキャップ', 'ブルーキャップ', 'オレンジハット', 'ミントヘッドホン', 'ピーチベレー', 'クマ耳フード', 'スカイメガネ', 'レモンゲーマー', 'ピンクコーヒー', '泥酔', '一つ目', 'ゾンビ', 'げっそり', '猫', '犬', 'カエル', '宇宙人', 'ロボ', 'ジェイソン'] as const;
export const AVATAR_COUNT = avatarNames.length;
export const avatarIds = avatarNames.map((_, id) => id);
export function validAvatar(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0 && value < AVATAR_COUNT;
}
export function avatarId(seed: number): number {
  return Number.isInteger(seed) ? ((seed % AVATAR_COUNT) + AVATAR_COUNT) % AVATAR_COUNT : 0;
}

export function randomAvatar(current: number): number {
  return (avatarId(current) + 1 + Math.floor(Math.random() * (AVATAR_COUNT - 1))) % AVATAR_COUNT;
}
