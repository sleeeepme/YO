export const platforms = ['LINE', 'X', 'Discord', 'Instagram'] as const;
export type Platform = typeof platforms[number];
export function sharePlatform(value: unknown): Platform {
  return platforms.find(p => p.toLowerCase() === String(value).toLowerCase()) || 'LINE';
}
export function inviteUrl(origin: string, id: string, invite: string, platform: Platform) {
  const url = new URL(`/call/${id}`, origin);
  url.searchParams.set('share', platform.toLowerCase());
  url.hash = invite;
  return url.toString();
}
export function composerUrl(platform: Platform, url: string) {
  if (platform === 'LINE') return `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}`;
  if (platform === 'X') return `https://twitter.com/intent/tweet?text=${encodeURIComponent('これから、ちょっと集まろ。YOで話そう！')}&url=${encodeURIComponent(url)}`;
  return platform === 'Discord' ? 'https://discord.com/channels/@me' : 'https://www.instagram.com/';
}
