import { ImageResponse } from 'next/og';
import { Logo } from '@/components/logo';
export const alt = 'YO — Say YO. Hang out.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export default function Image() {
  return new ImageResponse(<div style={{ display: 'flex', width: '100%', height: '100%', background: 'linear-gradient(135deg,#090e20,#36216b)', padding: 80, color: '#ffffff', flexDirection: 'column', justifyContent: 'space-between' }}><div style={{ display: 'flex', color: '#ffffff', transform: 'scale(2.2)', transformOrigin: 'left top' }}><Logo /></div><div style={{ display: 'flex', fontSize: 64, fontWeight: 700, marginTop: 60 }}>Say YO. Hang out.</div><div style={{ display: 'flex', fontSize: 27, color: '#d7bfff' }}>FRIENDS + FRIENDS / UP TO 8 / DESIGN PREVIEW</div></div>, size);
}
