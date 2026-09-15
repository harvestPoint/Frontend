// Gerado a partir do design aprovado no Claude Design (HarvestPoint.dc.html)
// e adaptado para React + TypeScript + Tailwind pelo pipeline de migração.
// Revise os TODOs antes de ligar em dados reais da API.

export default function LotesVazioState() {

  return (
    <>
    <div style={{display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '24px'}}>
      <div>
        <h1 style={{margin: '0', fontFamily: "'Plus Jakarta Sans', Inter, sans-serif", fontSize: '28px', lineHeight: '34px', fontWeight: '700', letterSpacing: '-.01em'}}>
          Lotes / Talhões
        </h1>
        <div style={{fontSize: '12px', color: 'var(--hp-text-2)', marginTop: '4px'}}>
          Divisão produtiva por propriedade · 0 registros
        </div>
      </div>
      <div style={{height: '40px', padding: '0 16px', display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--hp-accent)', color: '#FFFFFF', borderRadius: '12px', fontSize: '13px', fontWeight: '600', cursor: 'pointer'}}>
        <span style={{fontFamily: "'Material Symbols Outlined'", fontSize: '18px', lineHeight: '1'}}>
          add
        </span>
        Novo lote
      </div>
    </div>
    <div style={{background: 'var(--hp-surface)', border: '1px solid var(--hp-border)', borderRadius: '16px', height: '280px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px', textAlign: 'center'}}>
      <span style={{fontFamily: "'Material Symbols Outlined'", fontSize: '40px', lineHeight: '1', color: 'var(--hp-icon-disabled)'}}>
        grid_view
      </span>
      <div style={{fontSize: '16px', lineHeight: '22px', fontWeight: '600'}}>
        Nenhum lote cadastrado
      </div>
      <div style={{fontSize: '14px', lineHeight: '20px', color: 'var(--hp-text-2)', maxWidth: '420px'}}>
        Cadastre o primeiro lote para vincular sensores, acompanhar o clima e receber alertas de estresse térmico.
      </div>
      <div style={{height: '40px', padding: '0 16px', display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--hp-accent)', color: '#FFFFFF', borderRadius: '12px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', marginTop: '6px'}}>
        <span style={{fontFamily: "'Material Symbols Outlined'", fontSize: '18px', lineHeight: '1'}}>
          add
        </span>
        Novo lote
      </div>
    </div>
    </>
  );
}
