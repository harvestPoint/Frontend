// Gerado a partir do design aprovado no Claude Design (HarvestPoint.dc.html)
// e adaptado para React + TypeScript + Tailwind pelo pipeline de migração.
// Revise os TODOs antes de ligar em dados reais da API.

export default function JanelaColheitaPage() {

  return (
    <>
    <div>
      <h1 style={{margin: '0', fontFamily: "'Plus Jakarta Sans', Inter, sans-serif", fontSize: '28px', lineHeight: '34px', fontWeight: '700', letterSpacing: '-.01em'}}>
        Janela de Colheita
      </h1>
      <div style={{fontSize: '12px', color: 'var(--hp-text-2)', marginTop: '4px'}}>
        Melhor período estimado de colheita por lote
      </div>
    </div>
    <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '20px'}}>
      <div style={{background: 'var(--hp-surface)', border: '1px solid var(--hp-border)', borderRadius: '16px', padding: '20px'}}>
        <div style={{fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-3)'}}>
          LOTE A1 · MANGA
        </div>
        <div style={{fontSize: '20px', fontWeight: '700', marginTop: '10px'}}>
          22/10 – 29/10
        </div>
        <div style={{fontSize: '12px', color: 'var(--hp-text-2)', marginTop: '6px'}}>
          Ciclo no dia 98 de 120 · faltam ~22 dias
        </div>
      </div>
      <div style={{background: 'var(--hp-surface)', border: '1px solid var(--hp-border)', borderRadius: '16px', padding: '20px'}}>
        <div style={{fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-3)'}}>
          LOTE B2 · UVA
        </div>
        <div style={{fontSize: '20px', fontWeight: '700', marginTop: '10px'}}>
          08/11 – 15/11
        </div>
        <div style={{fontSize: '12px', color: 'var(--hp-text-2)', marginTop: '6px'}}>
          Ciclo no dia 76 de 150 · faltam ~74 dias
        </div>
      </div>
      <div style={{background: 'var(--hp-surface)', border: '1px solid var(--hp-border)', borderRadius: '16px', padding: '20px'}}>
        <div style={{fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-3)'}}>
          LOTE C3 · UVA
        </div>
        <div style={{fontSize: '20px', fontWeight: '700', marginTop: '10px'}}>
          02/10 – 09/10
        </div>
        <div style={{fontSize: '12px', color: 'var(--hp-text-2)', marginTop: '6px'}}>
          Ciclo no dia 35 de 45 · faltam ~10 dias
        </div>
      </div>
    </div>
    </>
  );
}
