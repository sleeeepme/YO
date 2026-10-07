export function Avatar({ seed = 0, className = '' }: { seed?: number; className?: string }) {
  const variant = Math.abs(seed) % 4;
  return <span className={`avatar ${className}`} style={{ backgroundPosition: `${variant * 100 / 3}% center` }} aria-hidden="true" />;
}
