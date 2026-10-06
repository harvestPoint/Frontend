// apps/web/src/components/overlay/Drawer.tsx
// Painel lateral de altura total (portal, position: fixed). 480 px no
// desktop; em tela estreita ocupa a largura toda.
import { createPortal } from 'react-dom';
import type { CSSProperties, ReactNode } from 'react';
import { useDialog } from './useDialog';
import './overlay.css';

interface DrawerProps {
  aberto: boolean;
  aoFechar: () => void;
  largura?: number;
  titulo: string;
  subtitulo?: ReactNode;
  children: ReactNode;
}

export default function Drawer({ aberto, aoFechar, largura = 480, titulo, subtitulo, children }: DrawerProps) {
  const ref = useDialog(aberto, aoFechar);
  if (!aberto) return null;
  return createPortal(
    <div className="hp-scrim hp-scrim--drawer" onMouseDown={(e) => { if (e.target === e.currentTarget) aoFechar(); }}>
      <div
        ref={ref} className="hp-drawer" role="dialog" aria-modal="true" aria-labelledby="hp-drawer-titulo" tabIndex={-1}
        style={{ '--hp-drawer-w': largura + 'px' } as CSSProperties}
      >
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--hp-border)', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
          <div style={{ minWidth: 0 }}>
            <div id="hp-drawer-titulo" style={{ fontFamily: "'Plus Jakarta Sans', Inter, sans-serif", fontSize: '20px', lineHeight: '26px', fontWeight: 700 }}>{titulo}</div>
            {subtitulo && <div style={{ fontSize: '13px', color: 'var(--hp-text-2)', marginTop: '2px' }}>{subtitulo}</div>}
          </div>
          <button
            type="button" onClick={aoFechar} aria-label="Fechar" data-autofocus
            style={{ border: 0, background: 'transparent', padding: '6px', margin: '-6px', cursor: 'pointer', color: 'var(--hp-text-2)', display: 'flex', borderRadius: '8px' }}
          >
            <span style={{ fontFamily: "'Material Symbols Outlined'", fontSize: '20px', lineHeight: 1 }}>close</span>
          </button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {children}
        </div>
      </div>
    </div>,
    document.body,
  );
}
