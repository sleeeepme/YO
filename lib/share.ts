export const platforms = ['LINE', 'X', 'Discord', 'Instagram'] as const;
export type Platform = typeof platforms[number];
export const activities = { drink: { label: '飲んでる', first: '今、ボイスチャットで', second: '飲んでるよ！' }, game: { label: '遊んでる', first: '今、ボイスチャットで', second: '遊んでるよ！' }, talk: { label: 'しゃべってる', first: '今、ボイスチャットで', second: 'しゃべってるよ！' } } as const;
export type Activity = keyof typeof activities;
export function shareActivity(value: unknown): Activity { return value === 'drink' || value === 'game' ? value : 'talk'; }
export function shareUntil(value: unknown): number | undefined {
  if (!/^\d{13}$/.test(String(value))) return undefined;
  const time = Number(value);
  return time >= Date.UTC(2026, 0, 1) && time < Date.UTC(2100, 0, 1) ? time : undefined;
}
export function endTimeText(until?: number) {
  if (!until) return '気軽に参加してね！';
  const date = new Date(until);
  const day = new Intl.DateTimeFormat('ja-JP', { timeZone: 'Asia/Tokyo', month: 'numeric', day: 'numeric' }).format(date);
  const time = new Intl.DateTimeFormat('ja-JP', { timeZone: 'Asia/Tokyo', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(date);
  return `${day} ${time}ごろまでやってる予定。`;
}
export function invitationText(activity: Activity, until?: number) { return `${activities[activity].first}${activities[activity].second}\n${endTimeText(until)}\nYOで一緒に話そう！`; }
export function cardUrl(platform: Platform, activity: Activity, until?: number) {
  const query = new URLSearchParams({ platform: platform.toLowerCase(), activity });
  if (until) query.set('until', String(until));
  return `/api/share/card?${query}`;
}
export function sharePlatform(value: unknown): Platform {
  return platforms.find(p => p.toLowerCase() === String(value).toLowerCase()) || 'LINE';
}
export function inviteUrl(origin: string, id: string, invite: string, platform: Platform, activity: Activity = 'talk', until?: number) {
  const url = new URL(`/call/${id}`, origin);
  url.searchParams.set('share', platform.toLowerCase());
  url.searchParams.set('activity', activity);
  // LINE officially supports opening ordinary links in the external browser.
  if (platform === 'LINE') url.searchParams.set('openExternalBrowser', '1');
  if (until) url.searchParams.set('until', String(until));
  url.hash = invite;
  return url.toString();
}
export function composerUrl(platform: Platform, url: string, text = 'これから、ちょっと集まろ。YOで話そう！') {
  if (platform === 'LINE') return `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}`;
  if (platform === 'X') return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
  return platform === 'Discord' ? 'https://discord.com/channels/@me' : 'https://www.instagram.com/';
}
