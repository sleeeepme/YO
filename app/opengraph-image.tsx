import { ImageResponse } from 'next/og';
export const alt = 'YO — Talk a little. Stay a while. Public preview.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export default function Image() {
  return new ImageResponse(<div style={{ display: 'flex', width: '100%', height: '100%', background: '#f5f2e9', padding: 80, color: '#2a2434', flexDirection: 'column', justifyContent: 'space-between' }}><div style={{ display: 'flex', fontSize: 100, fontWeight: 900, color: '#ed704b' }}>YO</div><div style={{ display: 'flex', fontSize: 72, fontWeight: 700 }}>Talk a little. Stay a while.</div><div style={{ display: 'flex', fontSize: 28 }}>FRIENDS + FRIENDS / UP TO 8 / PUBLIC PREVIEW</div></div>, size);
}
