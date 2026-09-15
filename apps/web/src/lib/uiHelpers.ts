// apps/web/src/lib/uiHelpers.ts
// Pequenos helpers usados pelas telas migradas do Claude Design — substituem
// o mecanismo interno de estilos do protótipo (roleCardX, statX.cardStyle...)
// por algo idiomático em React.
import { useState, type CSSProperties } from 'react';

/** Estilo do cartão de perfil (Proprietário/Técnico) do Login e do Cadastro.
 * Cor sempre fixa em claro — essas duas telas nunca acompanham o modo
 * noturno do resto do app, então usa hex direto, nunca var(--hp-*). */
export function roleCardStyle(active: boolean): CSSProperties {
  return {
    flex: 1,
    minHeight: '96px',
    borderRadius: '14px',
    border: active ? '2px solid #6B8F71' : '1px solid #D6D4CB',
    background: active ? '#E7EFE7' : '#FFFFFF',
    position: 'relative',
    cursor: 'pointer',
    padding: '14px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    transition: 'border-color .15s ease-out, background-color .15s ease-out',
  };
}

/**
 * Hook para os cards "hero" (maiores) de cada grade bento da landing —
 * cada um carrega o estilo completo do card (borda, fundo, posição na
 * grade) e ganha um leve realce ao passar o mouse. `base` é o estilo fixo
 * daquele card específico (grid-column/row, padding...); o hook só
 * acrescenta o comportamento de hover em cima.
 */
export function useHoverCard(base?: CSSProperties) {
  const [hovered, setHovered] = useState(false);
  const hoverExtra: CSSProperties = {
    transition: 'transform .15s ease-out, box-shadow .15s ease-out, border-color .15s ease-out',
    transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
    boxShadow: hovered ? '0 8px 24px rgba(0,0,0,.28)' : 'none',
    borderColor: hovered ? '#3A3D30' : '#2A2C22',
  };
  const smallBase: CSSProperties = {
    border: '1px solid #2A2C22', borderRadius: '12px', background: '#1B1D16', padding: '16px 18px',
  };
  return {
    cardStyle: { ...base, ...hoverExtra } as CSSProperties,
    cardStyleSmall: { ...smallBase, ...hoverExtra } as CSSProperties,
    detailStyle: {
      opacity: hovered ? 1 : 0, marginTop: hovered ? '8px' : '0px', maxHeight: hovered ? '40px' : '0px',
      overflow: 'hidden', transition: 'opacity .2s ease-out, margin-top .2s ease-out, max-height .2s ease-out',
      fontSize: '12px', color: '#8FB596',
    } as CSSProperties,
    previewStyle: {
      opacity: hovered ? 1 : 0, marginTop: hovered ? '12px' : '0px', maxHeight: hovered ? '40px' : '0px',
      overflow: 'hidden', display: 'flex', alignItems: 'center', gap: '8px',
      transition: 'opacity .2s ease-out, margin-top .2s ease-out, max-height .2s ease-out',
    } as CSSProperties,
    onEnter: () => setHovered(true),
    onLeave: () => setHovered(false),
  };
}
