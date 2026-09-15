// Gerado a partir do design aprovado no Claude Design (HarvestPoint.dc.html)
// e adaptado para React + TypeScript + Tailwind pelo pipeline de migração.
// Revise os TODOs antes de ligar em dados reais da API.

export default function CulturasPage() {

  return (
    <>
    <div style={{display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '24px'}}>
      <div>
        <h1 style={{margin: '0', fontFamily: "'Plus Jakarta Sans', Inter, sans-serif", fontSize: '28px', lineHeight: '34px', fontWeight: '700', letterSpacing: '-.01em'}}>
          Culturas
        </h1>
        <div style={{fontSize: '12px', color: 'var(--hp-text-2)', marginTop: '4px'}}>
          Culturas e parâmetros ideais · 3 registros
        </div>
      </div>
      <div style={{height: '40px', padding: '0 16px', display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--hp-accent)', color: '#FFFFFF', borderRadius: '12px', fontSize: '13px', fontWeight: '600', cursor: 'pointer'}}>
        <span style={{fontFamily: "'Material Symbols Outlined'", fontSize: '18px', lineHeight: '1'}}>
          add
        </span>
        Nova cultura
      </div>
    </div>
    <div style={{height: '64px', background: 'var(--hp-surface)', border: '1px solid var(--hp-border)', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '12px', padding: '0 16px'}}>
      <div style={{flex: '1', minWidth: '0', height: '44px', border: '1px solid var(--hp-input-border)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px', padding: '0 12px'}}>
        <span style={{fontFamily: "'Material Symbols Outlined'", fontSize: '18px', lineHeight: '1', color: 'var(--hp-text-3)'}}>
          search
        </span>
        <span style={{fontSize: '14px', color: 'var(--hp-text-3)'}}>
          Buscar por cultura ou variedade
        </span>
      </div>
      <div style={{height: '44px', padding: '0 12px', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid var(--hp-input-border)', borderRadius: '12px', fontSize: '13px', fontWeight: '600'}}>
        Cultura
        <span style={{fontFamily: "'Material Symbols Outlined'", fontSize: '18px', lineHeight: '1', color: 'var(--hp-text-2)'}}>
          expand_more
        </span>
      </div>
      <div style={{width: '1px', height: '28px', background: 'var(--hp-border)'}} />
      <span style={{fontFamily: "'Material Symbols Outlined'", fontSize: '20px', lineHeight: '1', color: 'var(--hp-text-2)', cursor: 'pointer'}}>
        density_medium
      </span>
      <span style={{fontFamily: "'Material Symbols Outlined'", fontSize: '20px', lineHeight: '1', color: 'var(--hp-text-2)', cursor: 'pointer'}}>
        download
      </span>
    </div>
    <div style={{background: 'var(--hp-surface)', border: '1px solid var(--hp-border)', borderRadius: '16px', overflow: 'hidden'}}>
      <table style={{width: '100%', borderCollapse: 'collapse'}}>
        <thead>
          <tr style={{height: '48px', background: 'var(--hp-surface-2)'}}>
            <th style={{textAlign: 'left', padding: '0 16px', fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-2)'}}>
              CULTURA ↓
            </th>
            <th style={{textAlign: 'left', padding: '0 16px', fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-2)'}}>
              VARIEDADE
            </th>
            <th style={{textAlign: 'left', padding: '0 16px', fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-2)'}}>
              FAIXA DE TEMPERATURA
            </th>
            <th style={{textAlign: 'left', padding: '0 16px', fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-2)'}}>
              FAIXA DE UMIDADE
            </th>
            <th style={{textAlign: 'right', padding: '0 16px', fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-2)'}}>
              CICLO (DIAS)
            </th>
            <th style={{textAlign: 'right', padding: '0 16px', fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-2)'}}>
              LOTES USANDO
            </th>
            <th style={{textAlign: 'right', padding: '0 16px', fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-2)'}}>
              AÇÕES
            </th>
          </tr>
        </thead>
        <tbody>
          <tr style={{height: '52px', borderTop: '1px solid var(--hp-border)'}}>
            <td style={{padding: '0 16px', fontSize: '14px', fontWeight: '600', color: 'var(--hp-accent)', cursor: 'pointer'}}>
              Manga
            </td>
            <td style={{padding: '0 16px', fontSize: '14px'}}>
              Tommy Atkins
            </td>
            <td style={{padding: '0 16px', fontSize: '14px'}}>
              <span style={{display: 'inline-flex', alignItems: 'center', gap: '10px'}}>
                22–30 °C
                <span style={{width: '48px', height: '6px', borderRadius: '3px', background: 'var(--hp-surface-2)', display: 'inline-block', position: 'relative', overflow: 'hidden'}}>
                  <span style={{position: 'absolute', left: '8px', top: '0', width: '28px', height: '6px', background: 'var(--hp-temp)', display: 'block'}} />
                </span>
              </span>
            </td>
            <td style={{padding: '0 16px', fontSize: '14px'}}>
              <span style={{display: 'inline-flex', alignItems: 'center', gap: '10px'}}>
                60–80 %
                <span style={{width: '48px', height: '6px', borderRadius: '3px', background: 'var(--hp-surface-2)', display: 'inline-block', position: 'relative', overflow: 'hidden'}}>
                  <span style={{position: 'absolute', left: '20px', top: '0', width: '22px', height: '6px', background: 'var(--hp-info)', display: 'block'}} />
                </span>
              </span>
            </td>
            <td style={{padding: '0 16px', fontSize: '14px', textAlign: 'right'}}>
              120
            </td>
            <td style={{padding: '0 16px', fontSize: '14px', textAlign: 'right'}}>
              1
            </td>
            <td style={{padding: '0 16px', textAlign: 'right'}}>
              <span style={{fontFamily: "'Material Symbols Outlined'", fontSize: '18px', lineHeight: '1', color: 'var(--hp-text-2)', cursor: 'pointer', marginRight: '12px'}}>
                edit
              </span>
              <span style={{fontFamily: "'Material Symbols Outlined'", fontSize: '18px', lineHeight: '1', color: 'var(--hp-text-2)', cursor: 'pointer'}}>
                more_vert
              </span>
            </td>
          </tr>
          <tr style={{height: '52px', borderTop: '1px solid var(--hp-border)'}}>
            <td style={{padding: '0 16px', fontSize: '14px', fontWeight: '600', color: 'var(--hp-accent)', cursor: 'pointer'}}>
              Uva
            </td>
            <td style={{padding: '0 16px', fontSize: '14px'}}>
              Itália
            </td>
            <td style={{padding: '0 16px', fontSize: '14px'}}>
              <span style={{display: 'inline-flex', alignItems: 'center', gap: '10px'}}>
                20–28 °C
                <span style={{width: '48px', height: '6px', borderRadius: '3px', background: 'var(--hp-surface-2)', display: 'inline-block', position: 'relative', overflow: 'hidden'}}>
                  <span style={{position: 'absolute', left: '4px', top: '0', width: '26px', height: '6px', background: 'var(--hp-temp)', display: 'block'}} />
                </span>
              </span>
            </td>
            <td style={{padding: '0 16px', fontSize: '14px'}}>
              <span style={{display: 'inline-flex', alignItems: 'center', gap: '10px'}}>
                55–70 %
                <span style={{width: '48px', height: '6px', borderRadius: '3px', background: 'var(--hp-surface-2)', display: 'inline-block', position: 'relative', overflow: 'hidden'}}>
                  <span style={{position: 'absolute', left: '14px', top: '0', width: '18px', height: '6px', background: 'var(--hp-info)', display: 'block'}} />
                </span>
              </span>
            </td>
            <td style={{padding: '0 16px', fontSize: '14px', textAlign: 'right'}}>
              150
            </td>
            <td style={{padding: '0 16px', fontSize: '14px', textAlign: 'right'}}>
              1
            </td>
            <td style={{padding: '0 16px', textAlign: 'right'}}>
              <span style={{fontFamily: "'Material Symbols Outlined'", fontSize: '18px', lineHeight: '1', color: 'var(--hp-text-2)', cursor: 'pointer', marginRight: '12px'}}>
                edit
              </span>
              <span style={{fontFamily: "'Material Symbols Outlined'", fontSize: '18px', lineHeight: '1', color: 'var(--hp-text-2)', cursor: 'pointer'}}>
                more_vert
              </span>
            </td>
          </tr>
          <tr style={{height: '52px', borderTop: '1px solid var(--hp-border)'}}>
            <td style={{padding: '0 16px', fontSize: '14px', fontWeight: '600', color: 'var(--hp-accent)', cursor: 'pointer'}}>
              Uva
            </td>
            <td style={{padding: '0 16px', fontSize: '14px'}}>
              Crimson Seedless
            </td>
            <td style={{padding: '0 16px', fontSize: '14px'}}>
              <span style={{display: 'inline-flex', alignItems: 'center', gap: '10px'}}>
                21–29 °C
                <span style={{width: '48px', height: '6px', borderRadius: '3px', background: 'var(--hp-surface-2)', display: 'inline-block', position: 'relative', overflow: 'hidden'}}>
                  <span style={{position: 'absolute', left: '6px', top: '0', width: '26px', height: '6px', background: 'var(--hp-temp)', display: 'block'}} />
                </span>
              </span>
            </td>
            <td style={{padding: '0 16px', fontSize: '14px'}}>
              <span style={{display: 'inline-flex', alignItems: 'center', gap: '10px'}}>
                58–72 %
                <span style={{width: '48px', height: '6px', borderRadius: '3px', background: 'var(--hp-surface-2)', display: 'inline-block', position: 'relative', overflow: 'hidden'}}>
                  <span style={{position: 'absolute', left: '16px', top: '0', width: '18px', height: '6px', background: 'var(--hp-info)', display: 'block'}} />
                </span>
              </span>
            </td>
            <td style={{padding: '0 16px', fontSize: '14px', textAlign: 'right'}}>
              145
            </td>
            <td style={{padding: '0 16px', fontSize: '14px', textAlign: 'right'}}>
              1
            </td>
            <td style={{padding: '0 16px', textAlign: 'right'}}>
              <span style={{fontFamily: "'Material Symbols Outlined'", fontSize: '18px', lineHeight: '1', color: 'var(--hp-text-2)', cursor: 'pointer', marginRight: '12px'}}>
                edit
              </span>
              <span style={{fontFamily: "'Material Symbols Outlined'", fontSize: '18px', lineHeight: '1', color: 'var(--hp-text-2)', cursor: 'pointer'}}>
                more_vert
              </span>
            </td>
          </tr>
        </tbody>
      </table>
      <div style={{height: '56px', borderTop: '1px solid var(--hp-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', fontSize: '12px', color: 'var(--hp-text-2)'}}>
        <span>
          Mostrando 1–3 de 3
        </span>
        <div style={{height: '32px', padding: '0 10px', display: 'flex', alignItems: 'center', gap: '6px', border: '1px solid var(--hp-input-border)', borderRadius: '8px', fontSize: '12px', fontWeight: '600', color: 'var(--hp-text)'}}>
          10 por página
          <span style={{fontFamily: "'Material Symbols Outlined'", fontSize: '16px', lineHeight: '1', color: 'var(--hp-text-2)'}}>
            expand_more
          </span>
        </div>
      </div>
    </div>
    </>
  );
}
