export type Mood = 'drink' | 'chill' | 'game';
export type Room = { id: string; title: string; description: string; mood: Mood; count: number; capacity: number; minutes: number; names: string[]; color: string };
// Public fictional examples only. Never use these records for authorization or occupancy.
export const rooms: Room[] = [
  { id: 'friday-drink', title: 'FRIDAY DRINK', description: 'おつかれさま。好きな一杯を持って。', mood: 'drink', count: 6, capacity: 8, minutes: 45, names: ['Kenta', 'Yuki', 'Mio', 'Haru', 'Ren', 'Aoi'], color: 'peach' },
  { id: 'chill-night', title: 'とりあえず、雑談。', description: '今日あったこと、なかったこと。', mood: 'chill', count: 3, capacity: 6, minutes: 60, names: ['Mio', 'Haru', 'Ren'], color: 'lavender' },
  { id: 'one-more-game', title: 'あと、もう一戦', description: 'ゲームしながら、ゆるく話そう。', mood: 'game', count: 8, capacity: 8, minutes: 30, names: ['Ren', 'Aoi', 'Kenta', 'Yuki', 'Mio', 'Haru', 'Sora', 'Kai'], color: 'mint' },
];
export const moodLabels = { drink: '乾杯したい', chill: '雑談したい', game: 'ゲームしたい' };
export function findRoom(id: string) { return rooms.find(room => room.id === id); }
