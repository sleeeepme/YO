export function Logo({ className = '' }: { className?: string }) {
  return <svg className={`yo-logo ${className}`} width="136" height="76" viewBox="0 0 136 76" role="img" aria-label="YO">
    <path d="M20 20 39 45 39 61M39 45 58 19" fill="none" stroke="currentColor" strokeWidth="22" strokeLinecap="round" strokeLinejoin="round" />
    <ellipse cx="101" cy="41" rx="26" ry="26" fill="none" stroke="currentColor" strokeWidth="17" />
  </svg>;
}
