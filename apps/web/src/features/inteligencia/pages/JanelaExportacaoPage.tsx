export default function JanelaExportacaoPage() {
  return (
    <>
      <div>
        <h1 style={{ margin: '0', fontFamily: "'Plus Jakarta Sans', Inter, sans-serif", fontSize: '28px', lineHeight: '34px', fontWeight: '700', letterSpacing: '-.01em' }}>
          Janela de Exportação
        </h1>
        <div style={{ fontSize: '12px', color: 'var(--hp-text-2)', marginTop: '4px' }}>
          Melhor período para embarque internacional por destino
        </div>
      </div>

      <div style={{ background: 'var(--hp-surface)', border: '1px solid var(--hp-border)', borderRadius: '16px', padding: '40px 24px', textAlign: 'center', marginTop: '20px' }}>
        <span style={{ fontFamily: "'Material Symbols Outlined'", fontSize: '48px', color: 'var(--hp-text-3)', display: 'block', marginBottom: '12px' }}>
          public
        </span>
        <div style={{ fontSize: '16px', fontWeight: '700', color: 'var(--hp-text)' }}>
          Nenhuma janela de exportação cadastrada no momento
        </div>
        <p style={{ fontSize: '13px', color: 'var(--hp-text-2)', maxWidth: '520px', margin: '8px auto 0', lineHeight: '20px' }}>
          Os períodos ideais de despacho para a Europa e Estados Unidos serão consolidados aqui assim que as safras forem aprovadas no módulo de Janela de Colheita e integradas aos despachos logísticos.
        </p>
      </div>
    </>
  );
}
