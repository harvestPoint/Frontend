// apps/web/src/components/automacao/ui.tsx
// Peças pequenas e compartilhadas da Automação: ícone, botão e pílula no
// padrão "1b Campo" (botão 40 px / raio 12; pílula 26 px / raio 13).
import type { CSSProperties, MouseEventHandler, ReactNode } from 'react';
import './automacao.css';

export const FONTE_TITULO = "'Plus Jakarta Sans', Inter, sans-serif";

export function Icone({ nome, tamanho = 18, cor, style }: { nome: string; tamanho?: number; cor?: string; style?: CSSProperties }) {
  return (
    <span
      aria-hidden="true"
      style={{ fontFamily: "'Material Symbols Outlined'", fontSize: tamanho + 'px', lineHeight: 1, color: cor, flexShrink: 0, ...style }}
    >
      {nome}
    </span>
  );
}

export const sobrelinha: CSSProperties = { fontSize: '11px', lineHeight: '14px', fontWeight: 700, letterSpacing: '.08em', color: 'var(--hp-text-3)' };

export const cartao: CSSProperties = {
  background: 'var(--hp-surface)', border: '1px solid var(--hp-border)', borderRadius: 'var(--hp-radius)', padding: 'var(--hp-pad)',
};

export const tituloCartao: CSSProperties = { fontFamily: FONTE_TITULO, fontSize: '17px', lineHeight: '24px', fontWeight: 700 };

interface BotaoProps {
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  variante?: 'primario' | 'secundario' | 'texto';
  altura?: number;
  icone?: string;
  bloco?: boolean;
  desabilitado?: boolean;
  titulo?: string;
  tracejado?: boolean;
  cor?: string;
  style?: CSSProperties;
  autoFoco?: boolean;
}

export function Botao({ children, onClick, variante = 'secundario', altura = 40, icone, bloco, desabilitado, titulo, tracejado, cor, style, autoFoco }: BotaoProps) {
  const base: CSSProperties = {
    height: altura + 'px', padding: altura <= 34 ? '0 12px' : '0 16px', borderRadius: altura <= 34 ? '10px' : 'var(--hp-radius-sm)',
    fontSize: altura <= 34 ? '13px' : '14px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    gap: '6px', whiteSpace: 'nowrap', flex: bloco ? 1 : undefined, width: bloco ? '100%' : undefined,
  };
  const porVariante: CSSProperties =
    variante === 'primario'
      ? { background: 'var(--hp-accent)', color: 'var(--hp-on-accent)', border: '1px solid transparent' }
      : variante === 'texto'
        ? { background: 'transparent', color: cor ?? 'var(--hp-accent-hover)', border: '1px solid transparent' }
        : { background: 'var(--hp-surface)', color: cor ?? 'var(--hp-text)', border: (tracejado ? '1px dashed ' : '1px solid ') + 'var(--hp-input-border)' };
  return (
    <button
      type="button" className={'au-btn au-btn--' + variante} onClick={onClick} disabled={desabilitado} title={titulo}
      data-autofocus={autoFoco ? '' : undefined} style={{ ...base, ...porVariante, ...style }}
    >
      {icone && <Icone nome={icone} tamanho={altura <= 34 ? 16 : 18} />}
      {children}
    </button>
  );
}

export function Pilula({ fg, bg, children, style }: { fg: string; bg: string; children: ReactNode; style?: CSSProperties }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', height: '26px', padding: '0 10px', borderRadius: '13px', background: bg, color: fg, fontSize: '12px', fontWeight: 600, whiteSpace: 'nowrap', ...style }}>
      {children}
    </span>
  );
}

export function Ponto({ cor }: { cor: string }) {
  return <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: cor, display: 'inline-block' }} />;
}

/** botão-ícone de fechar dos modais */
export function FecharX({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} aria-label="Fechar" className="au-btn"
      style={{ border: 0, background: 'transparent', padding: '6px', margin: '-6px', display: 'flex', color: 'var(--hp-text-2)', borderRadius: '8px' }}>
      <Icone nome="close" tamanho={20} />
    </button>
  );
}

/** pares [texto, fundo] por tom — usados em ícones de evento e marcadores */
export const TONS = {
  at: ['var(--hp-atencao)', 'var(--hp-atencao-bg)'],
  ac: ['var(--hp-accent-hover)', 'var(--hp-accent-soft)'],
  in: ['var(--hp-info)', 'var(--hp-info-bg)'],
  cr: ['var(--hp-critico)', 'var(--hp-critico-bg)'],
  tx: ['var(--hp-text-2)', 'var(--hp-surface-2)'],
} as const;
export type Tom = keyof typeof TONS;

export const somenteLeitor: CSSProperties = {
  position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap',
};
