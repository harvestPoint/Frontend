export default function LogisticaPage() {
  return (
    <>
      <div>
        <h1 style={{ margin: '0', fontFamily: "'Plus Jakarta Sans', Inter, sans-serif", fontSize: '28px', lineHeight: '34px', fontWeight: '700', letterSpacing: '-.01em' }}>
          Logística de Exportação
        </h1>
        <div style={{ fontSize: '12px', color: 'var(--hp-text-2)', marginTop: '4px' }}>
          Planejamento de frete e rastreio de embarques
        </div>
      </div>

      <div style={{ background: 'var(--hp-surface)', border: '1px solid var(--hp-border)', borderRadius: '16px', padding: '48px 24px', textAlign: 'center', marginTop: '20px' }}>
        <span style={{ fontFamily: "'Material Symbols Outlined'", fontSize: '48px', color: 'var(--hp-text-3)', display: 'block', marginBottom: '12px' }}>
          local_shipping
        </span>
        <div style={{ fontSize: '16px', fontWeight: '700', color: 'var(--hp-text)' }}>
          Nenhum envio ou despacho em andamento
        </div>
        <p style={{ fontSize: '13px', color: 'var(--hp-text-2)', maxWidth: '520px', margin: '8px auto 0', lineHeight: '20px' }}>
          As rotas logísticas, custos por modal (aéreo e marítimo) e despachos de cargas estarão disponíveis assim que houver embarques vinculados aos lotes colhidos.
        </p>
      </div>
    </>
  );
}
