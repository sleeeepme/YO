import { avatarId } from '@/lib/avatars';
const extraAssets = ['mint-headphones', 'peach-beret', 'lavender-hoodie', 'sky-glasses', 'lemon-gamer', 'pink-coffee'];
export function Avatar({ seed = 0, className = '' }: { seed?: number; className?: string }) {
  const variant = avatarId(seed);
  const style = variant < 4 ? { backgroundPosition: `${variant * 100 / 3}% center` } : {
    backgroundImage: `url('/avatars/${extraAssets[variant - 4]}.webp')`, backgroundPosition: 'center', backgroundSize: '100% 100%',
  };
  return <span className={`avatar ${className}`} style={style} aria-hidden="true" />;
}
