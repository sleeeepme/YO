export function SocialIcon({ name }: { name: 'Instagram' | 'X' | 'Discord' | 'LINE' }) {
  return <span className={`social-icon social-${name.toLowerCase()}`} aria-hidden="true">
    {name === 'Instagram' ? <svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17" cy="7" r="1" fill="white" stroke="none" /></svg> : name === 'X' ? <svg viewBox="0 0 24 24"><path d="M5 4h4L19 20h-4ZM19 4 5 20" /></svg> : name === 'Discord' ? <svg viewBox="0 0 24 24"><path d="M6 6q6-2 12 0l3 11q-3 3-6 1l-1-2h-4l-1 2q-3 2-6-1Z" fill="white" stroke="none"/><ellipse cx="9" cy="12" rx="1.5" ry="2" fill="#6261ff" stroke="none"/><ellipse cx="15" cy="12" rx="1.5" ry="2" fill="#6261ff" stroke="none"/></svg> : <span className="line-mark">LINE</span>}
  </span>;
}
