const palettes = [
  ['#ffc3a7', '#7c4bce', '#292135'], ['#d7bafa', '#e6f777', '#292135'],
  ['#b7dfbc', '#ed7049', '#292135'], ['#f5da7a', '#729ae9', '#292135'],
  ['#9ebde9', '#f29dac', '#292135'], ['#f7acca', '#514ab4', '#292135'],
];
export function Avatar({ seed = 0, className = '' }: { seed?: number; className?: string }) {
  const [skin, shirt, ink] = palettes[Math.abs(seed) % palettes.length];
  return <svg className={`avatar ${className}`} viewBox="0 0 120 140" aria-hidden="true">
    <ellipse cx="60" cy="134" rx="39" ry="5" fill="#292135" opacity=".1" />
    <path d="M27 118q0-35 33-35t33 35v13H27Z" fill={shirt} stroke={ink} strokeWidth="2.5" />
    <path d="M39 117v14m42-14v14" stroke={ink} strokeWidth="2.5" strokeLinecap="round" />
    <ellipse cx="60" cy="58" rx="35" ry="38" fill={skin} stroke={ink} strokeWidth="2.5" />
    <path d={seed % 2 ? 'M25 49Q19 15 54 13q41-4 42 36L79 37q-11 17-27-2Q39 49 25 49' : 'M24 46Q17 17 56 13q42-3 40 40L83 35q-32 0-39 8Z'} fill={ink} />
    <ellipse cx="47" cy="59" rx="2.5" ry="4" fill={ink} /><ellipse cx="72" cy="59" rx="2.5" ry="4" fill={ink} />
    <path d="M53 72q7 7 14 0" fill="none" stroke={ink} strokeWidth="2.5" strokeLinecap="round" />
    <ellipse cx="37" cy="71" rx="6" ry="3" fill="#e77473" opacity=".5" /><ellipse cx="82" cy="71" rx="6" ry="3" fill="#e77473" opacity=".5" />
    {seed % 3 === 1 ? <g fill="none" stroke={ink} strokeWidth="2"><rect x="37" y="51" width="20" height="17" rx="6" /><rect x="63" y="51" width="20" height="17" rx="6" /><path d="M57 58h6" /></g> : null}
  </svg>;
}
