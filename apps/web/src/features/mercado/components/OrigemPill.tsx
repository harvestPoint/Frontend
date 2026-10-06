// src/features/mercado/components/OrigemPill.tsx
// Pílula de origem do dado de preço/mercado — padrão do redesign 1b
// (ver APLICAR.md §3): "Oficial" (info + ícone verified) ou "Manual"
// (neutro + ícone edit). Reaproveitada em Mercado (cards e tabela) e no
// mini-card de Mercado do Dashboard.
export function OrigemPill({ oficial = true, label }: { oficial?: boolean; label?: string }) {
  const texto = label ?? (oficial ? 'Oficial' : 'Manual');
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        height: '24px',
        padding: '0 10px',
        borderRadius: '12px',
        background: oficial ? 'var(--hp-info-bg)' : 'var(--hp-surface-2)',
        color: oficial ? 'var(--hp-info)' : 'var(--hp-text-2)',
        fontSize: '12px',
        fontWeight: 600,
        whiteSpace: 'nowrap',
      }}
    >
      <span style={{ fontFamily: "'Material Symbols Outlined'", fontSize: '14px', lineHeight: 1 }}>
        {oficial ? 'verified' : 'edit'}
      </span>
      {texto}
    </span>
  );
}
