export const ROOM_DURATIONS = [30, 60, 120, 180, 360] as const;
export const DEFAULT_ROOM_DURATION = 60;
export function roomDuration(value: unknown): number | undefined {
  if (value === undefined) return DEFAULT_ROOM_DURATION;
  return typeof value === 'number' && ROOM_DURATIONS.some(minutes => minutes === value) ? value : undefined;
}
export function durationLabel(minutes: number): string {
  return minutes < 60 ? `${minutes}分` : `${minutes / 60}時間`;
}
