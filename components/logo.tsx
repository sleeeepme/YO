import { YO_LOGO_PATH } from '@/lib/brand';
export function Logo({ className = '' }: { className?: string }) {
  return <svg className={`yo-logo ${className}`} width="108" height="56" viewBox="0 0 108 56" role="img" aria-label="YO"><path d={YO_LOGO_PATH} fill="currentColor" fillRule="evenodd" /></svg>;
}
