// Gerado a partir do design aprovado no Claude Design (HarvestPoint.dc.html)
// e adaptado para React + TypeScript + Tailwind pelo pipeline de migração.
// Revise os TODOs antes de ligar em dados reais da API.

export default function MercadoPage() {

  return (
    <>
    <div>
      <h1 style={{margin: '0', fontFamily: "'Plus Jakarta Sans', Inter, sans-serif", fontSize: '28px', lineHeight: '34px', fontWeight: '700', letterSpacing: '-.01em'}}>
        Mercado & Preços
      </h1>
      <div style={{fontSize: '12px', color: 'var(--hp-text-2)', marginTop: '4px'}}>
        Preços de exportação por destino · atualizado hoje
      </div>
    </div>
    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px'}}>
      <div style={{background: 'var(--hp-surface)', border: '1px solid var(--hp-border)', borderRadius: '16px', padding: '20px'}}>
        <div style={{display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px'}}>
          <div>
            <div style={{fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-3)'}}>
              MANGA · UNIÃO EUROPEIA
            </div>
            <div style={{display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '8px'}}>
              <span style={{fontSize: '30px', lineHeight: '34px', fontWeight: '700', fontVariantNumeric: 'tabular-nums'}}>
                EUR 2,80
              </span>
              <span style={{fontSize: '12px', color: 'var(--hp-text-2)'}}>
                /kg
              </span>
            </div>
            <div style={{fontSize: '13px', fontWeight: '600', color: 'var(--hp-accent)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px'}}>
              <span style={{fontFamily: "'Material Symbols Outlined'", fontSize: '16px', lineHeight: '1'}}>
                arrow_upward
              </span>
              2,1% no mês
            </div>
            <div style={{fontSize: '12px', color: 'var(--hp-text-2)', marginTop: '8px'}}>
              Demanda 1.500 t · ≈ R$ 16,80/kg
            </div>
          </div>
          <svg viewBox="0 0 160 56" style={{width: '140px', height: '56px'}}>
            <polyline points="0,44 26,40 52,38 78,30 104,22 130,14 158,8" fill="none" stroke="var(--hp-accent)" stroke-width="2.5" stroke-linejoin="round" />
          </svg>
        </div>
      </div>
      <div style={{background: 'var(--hp-surface)', border: '1px solid var(--hp-border)', borderRadius: '16px', padding: '20px'}}>
        <div style={{display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px'}}>
          <div>
            <div style={{fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-3)'}}>
              UVA · ESTADOS UNIDOS
            </div>
            <div style={{display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '8px'}}>
              <span style={{fontSize: '30px', lineHeight: '34px', fontWeight: '700', fontVariantNumeric: 'tabular-nums'}}>
                USD 3,20
              </span>
              <span style={{fontSize: '12px', color: 'var(--hp-text-2)'}}>
                /kg
              </span>
            </div>
            <div style={{fontSize: '13px', fontWeight: '600', color: 'var(--hp-text-2)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px'}}>
              <span style={{fontFamily: "'Material Symbols Outlined'", fontSize: '16px', lineHeight: '1'}}>
                remove
              </span>
              estável
            </div>
            <div style={{fontSize: '12px', color: 'var(--hp-text-2)', marginTop: '8px'}}>
              Demanda 820 t · ≈ R$ 18,40/kg
            </div>
          </div>
          <svg viewBox="0 0 160 56" style={{width: '140px', height: '56px'}}>
            <polyline points="0,28 26,30 52,26 78,29 104,27 130,28 158,27" fill="none" stroke="var(--hp-text-2)" stroke-width="2.5" stroke-linejoin="round" />
          </svg>
        </div>
      </div>
    </div>
    <div style={{background: 'var(--hp-surface)', border: '1px solid var(--hp-border)', borderRadius: '16px', overflow: 'hidden'}}>
      <table style={{width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed'}}>
        <thead>
          <tr style={{height: '48px', background: 'var(--hp-surface-2)'}}>
            <th style={{width: '16%', textAlign: 'left', padding: '0 16px', fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-2)'}}>
              CULTURA
            </th>
            <th style={{width: '24%', textAlign: 'left', padding: '0 16px', fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-2)'}}>
              DESTINO
            </th>
            <th style={{width: '16%', textAlign: 'right', padding: '0 16px', fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-2)'}}>
              PREÇO
            </th>
            <th style={{width: '14%', textAlign: 'right', padding: '0 16px', fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-2)'}}>
              VARIAÇÃO
            </th>
            <th style={{width: '14%', textAlign: 'right', padding: '0 16px', fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-2)'}}>
              DEMANDA
            </th>
            <th style={{width: '16%', textAlign: 'right', padding: '0 16px', fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-2)'}}>
              REFERÊNCIA
            </th>
          </tr>
        </thead>
        <tbody>
          <tr style={{height: '52px', borderTop: '1px solid var(--hp-border)'}}>
            <td style={{padding: '0 16px', fontSize: '14px', fontWeight: '600'}}>
              Manga
            </td>
            <td style={{padding: '0 16px', fontSize: '14px'}}>
              União Europeia
            </td>
            <td style={{padding: '0 16px', textAlign: 'right', fontSize: '14px', fontVariantNumeric: 'tabular-nums'}}>
              EUR 2,80/kg
            </td>
            <td style={{padding: '0 16px', textAlign: 'right', fontSize: '14px', fontWeight: '600', color: 'var(--hp-accent)'}}>
              ▲ 2,1%
            </td>
            <td style={{padding: '0 16px', textAlign: 'right', fontSize: '14px', fontVariantNumeric: 'tabular-nums'}}>
              1.500 t
            </td>
            <td style={{padding: '0 16px', textAlign: 'right', fontSize: '14px', color: 'var(--hp-text-2)', fontVariantNumeric: 'tabular-nums'}}>
              12/09/2026
            </td>
          </tr>
          <tr style={{height: '52px', borderTop: '1px solid var(--hp-border)'}}>
            <td style={{padding: '0 16px', fontSize: '14px', fontWeight: '600'}}>
              Manga
            </td>
            <td style={{padding: '0 16px', fontSize: '14px'}}>
              Estados Unidos
            </td>
            <td style={{padding: '0 16px', textAlign: 'right', fontSize: '14px', fontVariantNumeric: 'tabular-nums'}}>
              USD 2,35/kg
            </td>
            <td style={{padding: '0 16px', textAlign: 'right', fontSize: '14px', fontWeight: '600', color: 'var(--hp-atencao)'}}>
              ▼ 1,4%
            </td>
            <td style={{padding: '0 16px', textAlign: 'right', fontSize: '14px', fontVariantNumeric: 'tabular-nums'}}>
              640 t
            </td>
            <td style={{padding: '0 16px', textAlign: 'right', fontSize: '14px', color: 'var(--hp-text-2)', fontVariantNumeric: 'tabular-nums'}}>
              12/09/2026
            </td>
          </tr>
          <tr style={{height: '52px', borderTop: '1px solid var(--hp-border)'}}>
            <td style={{padding: '0 16px', fontSize: '14px', fontWeight: '600'}}>
              Uva
            </td>
            <td style={{padding: '0 16px', fontSize: '14px'}}>
              Estados Unidos
            </td>
            <td style={{padding: '0 16px', textAlign: 'right', fontSize: '14px', fontVariantNumeric: 'tabular-nums'}}>
              USD 3,20/kg
            </td>
            <td style={{padding: '0 16px', textAlign: 'right', fontSize: '14px', fontWeight: '600', color: 'var(--hp-text-2)'}}>
              ▬ estável
            </td>
            <td style={{padding: '0 16px', textAlign: 'right', fontSize: '14px', fontVariantNumeric: 'tabular-nums'}}>
              820 t
            </td>
            <td style={{padding: '0 16px', textAlign: 'right', fontSize: '14px', color: 'var(--hp-text-2)', fontVariantNumeric: 'tabular-nums'}}>
              12/09/2026
            </td>
          </tr>
          <tr style={{height: '52px', borderTop: '1px solid var(--hp-border)'}}>
            <td style={{padding: '0 16px', fontSize: '14px', fontWeight: '600'}}>
              Uva
            </td>
            <td style={{padding: '0 16px', fontSize: '14px'}}>
              União Europeia
            </td>
            <td style={{padding: '0 16px', textAlign: 'right', fontSize: '14px', fontVariantNumeric: 'tabular-nums'}}>
              EUR 2,95/kg
            </td>
            <td style={{padding: '0 16px', textAlign: 'right', fontSize: '14px', fontWeight: '600', color: 'var(--hp-accent)'}}>
              ▲ 0,8%
            </td>
            <td style={{padding: '0 16px', textAlign: 'right', fontSize: '14px', fontVariantNumeric: 'tabular-nums'}}>
              410 t
            </td>
            <td style={{padding: '0 16px', textAlign: 'right', fontSize: '14px', color: 'var(--hp-text-2)', fontVariantNumeric: 'tabular-nums'}}>
              10/09/2026
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    </>
  );
}
