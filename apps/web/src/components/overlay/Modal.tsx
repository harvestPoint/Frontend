// apps/web/src/components/overlay/Modal.tsx
// Modal centralizado (portal, position: fixed). Abaixo de 900 px vira bottom
// sheet. Scrim ao fundo; clicar nele ou apertar Esc fecha.
import { createPortal } from 'react-dom';
import type { CSSProperties, ReactNode } from 'react';
import { useDialog } from './useDialog';
import './overlay.css';

interface ModalProps {
  aberto: boolean;
  aoFechar: () => void;
  /** largura em px no desktop (460, 620 ou 680 nas telas atuais) */
  largura?: number;
  /** id do elemento que dá o nome ao diálogo */
  rotuloId: string;
  children: ReactNode;
}

export default function Modal({ aberto, aoFechar, largura = 460, rotuloId, children }: ModalProps) {
  const ref = useDialog(aberto, aoFechar);
  if (!aberto) return null;
  return createPortal(
    <div className="hp-scrim" onMouseDown={(e) => { if (e.target === e.currentTarget) aoFechar(); }}>
      <div
        ref={ref} className="hp-modal" role="dialog" aria-modal="true" aria-labelledby={rotuloId} tabIndex={-1}
        style={{ '--hp-modal-w': largura + 'px' } as CSSProperties}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}
