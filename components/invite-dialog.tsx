'use client';
import { useEffect, useRef, type KeyboardEvent } from 'react';
import { createPortal } from 'react-dom';
import { InviteShare } from './invite-share';

export function InviteDialog({ id, invite, onClose }: { id: string; invite: string; onClose: () => void }) {
  const panel = useRef<HTMLDivElement>(null);
  const close = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const overflow = document.body.style.overflow;
    const background = Array.from(document.body.children).filter((el): el is HTMLElement => el instanceof HTMLElement && el !== panel.current?.parentElement).map(el => ({ el, inert: el.inert }));
    background.forEach(({ el }) => { el.inert = true; });
    document.body.style.overflow = 'hidden';
    close.current?.focus();
    return () => { background.forEach(({ el, inert }) => { el.inert = inert; }); document.body.style.overflow = overflow; previous?.focus(); };
  }, []);
  function keyboard(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Escape') { event.preventDefault(); onClose(); return; }
    if (event.key !== 'Tab') return;
    const elements = Array.from(panel.current?.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex="0"]') || []).filter(el => el.getClientRects().length > 0);
    const first = elements[0], last = elements.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
  }
  return createPortal(<div className="invite-modal-backdrop" onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
    <div ref={panel} className="invite-share-dialog" role="dialog" aria-modal="true" aria-labelledby="invite-share-title" onKeyDown={keyboard}>
      <div className="invite-dialog-toolbar"><span>招待リンクを共有</span><button ref={close} type="button" aria-label="招待画面を閉じる" onClick={onClose}>閉じる <span aria-hidden="true">×</span></button></div>
      <div className="invite-dialog-content"><InviteShare id={id} invite={invite} /></div>
    </div>
  </div>, document.body);
}
