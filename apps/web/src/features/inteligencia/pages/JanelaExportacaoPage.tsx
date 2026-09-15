// Gerado a partir do design aprovado no Claude Design (HarvestPoint.dc.html)
// e adaptado para React + TypeScript + Tailwind pelo pipeline de migração.
// Revise os TODOs antes de ligar em dados reais da API.

export default function JanelaExportacaoPage() {

  return (
    <>
    <div>
      <h1 style={{margin: '0', fontFamily: "'Plus Jakarta Sans', Inter, sans-serif", fontSize: '28px', lineHeight: '34px', fontWeight: '700', letterSpacing: '-.01em'}}>
        Janela de Exportação
      </h1>
      <div style={{fontSize: '12px', color: 'var(--hp-text-2)', marginTop: '4px'}}>
        Melhor período para embarque por destino
      </div>
    </div>
    <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '20px'}}>
      <div style={{background: 'var(--hp-surface)', border: '1px solid var(--hp-border)', borderRadius: '16px', padding: '20px'}}>
        <div style={{fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-3)'}}>
          MANGA · UNIÃO EUROPEIA
        </div>
        <div style={{fontSize: '20px', fontWeight: '700', marginTop: '10px'}}>
          12/10 – 18/10
        </div>
        <div style={{fontSize: '12px', color: 'var(--hp-text-2)', marginTop: '6px'}}>
          Preço em alta e demanda de 1.500 t no período
        </div>
      </div>
      <div style={{background: 'var(--hp-surface)', border: '1px solid var(--hp-border)', borderRadius: '16px', padding: '20px'}}>
        <div style={{fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-3)'}}>
          UVA · ESTADOS UNIDOS
        </div>
        <div style={{fontSize: '20px', fontWeight: '700', marginTop: '10px'}}>
          05/11 – 12/11
        </div>
        <div style={{fontSize: '12px', color: 'var(--hp-text-2)', marginTop: '6px'}}>
          Preço estável e demanda de 820 t no período
        </div>
      </div>
    </div>
    </>
  );
}
