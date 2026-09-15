// Gerado a partir do design aprovado no Claude Design (HarvestPoint.dc.html)
// e adaptado para React + TypeScript + Tailwind pelo pipeline de migração.
// Revise os TODOs antes de ligar em dados reais da API.

export default function PropriedadesPage() {

  return (
    <>
    <div style={{display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '24px'}}>
      <div>
        <h1 style={{margin: '0', fontFamily: "'Plus Jakarta Sans', Inter, sans-serif", fontSize: '28px', lineHeight: '34px', fontWeight: '700', letterSpacing: '-.01em'}}>
          Propriedades
        </h1>
        <div style={{fontSize: '12px', color: 'var(--hp-text-2)', marginTop: '4px'}}>
          Propriedades e áreas produtivas · 2 registros
        </div>
      </div>
      <div style={{height: '40px', padding: '0 16px', display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--hp-accent)', color: '#FFFFFF', borderRadius: '12px', fontSize: '13px', fontWeight: '600', cursor: 'pointer'}}>
        <span style={{fontFamily: "'Material Symbols Outlined'", fontSize: '18px', lineHeight: '1'}}>
          add
        </span>
        Nova propriedade
      </div>
    </div>
    <div style={{height: '64px', background: 'var(--hp-surface)', border: '1px solid var(--hp-border)', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '12px', padding: '0 16px'}}>
      <div style={{flex: '1', minWidth: '0', height: '44px', border: '1px solid var(--hp-input-border)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px', padding: '0 12px'}}>
        <span style={{fontFamily: "'Material Symbols Outlined'", fontSize: '18px', lineHeight: '1', color: 'var(--hp-text-3)'}}>
          search
        </span>
        <span style={{fontSize: '14px', color: 'var(--hp-text-3)'}}>
          Buscar por propriedade, produtor ou município
        </span>
      </div>
      <div style={{height: '44px', padding: '0 12px', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid var(--hp-input-border)', borderRadius: '12px', fontSize: '13px', fontWeight: '600'}}>
        Produtor
        <span style={{fontFamily: "'Material Symbols Outlined'", fontSize: '18px', lineHeight: '1', color: 'var(--hp-text-2)'}}>
          expand_more
        </span>
      </div>
      <div style={{height: '44px', padding: '0 12px', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid var(--hp-input-border)', borderRadius: '12px', fontSize: '13px', fontWeight: '600'}}>
        Status
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
              PROPRIEDADE ↓
            </th>
            <th style={{textAlign: 'left', padding: '0 16px', fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-2)'}}>
              PRODUTOR
            </th>
            <th style={{textAlign: 'left', padding: '0 16px', fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-2)'}}>
              MUNICÍPIO/UF
            </th>
            <th style={{textAlign: 'right', padding: '0 16px', fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-2)'}}>
              ÁREA (HA)
            </th>
            <th style={{textAlign: 'right', padding: '0 16px', fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-2)'}}>
              LOTES
            </th>
            <th style={{textAlign: 'right', padding: '0 16px', fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-2)'}}>
              SENSORES
            </th>
            <th style={{textAlign: 'left', padding: '0 16px', fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-2)'}}>
              STATUS
            </th>
            <th style={{textAlign: 'right', padding: '0 16px', fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-2)'}}>
              AÇÕES
            </th>
          </tr>
        </thead>
        <tbody>
          <tr style={{height: '52px', borderTop: '1px solid var(--hp-border)'}}>
            <td style={{padding: '0 16px', fontSize: '14px', fontWeight: '600', color: 'var(--hp-accent)', cursor: 'pointer'}}>
              Fazenda Boa Vista
            </td>
            <td style={{padding: '0 16px', fontSize: '14px'}}>
              Vale Verde Agroexport Ltda
            </td>
            <td style={{padding: '0 16px', fontSize: '14px'}}>
              Petrolina/PE
            </td>
            <td style={{padding: '0 16px', fontSize: '14px', textAlign: 'right'}}>
              250 ha
            </td>
            <td style={{padding: '0 16px', fontSize: '14px', textAlign: 'right'}}>
              3
            </td>
            <td style={{padding: '0 16px', fontSize: '14px', textAlign: 'right'}}>
              2
            </td>
            <td style={{padding: '0 16px'}}>
              <span style={{display: 'inline-flex', alignItems: 'center', gap: '6px', height: '24px', padding: '0 10px', borderRadius: '12px', background: 'var(--hp-accent-soft)', color: 'var(--hp-accent)', fontSize: '12px', fontWeight: '600'}}>
                <span style={{width: '6px', height: '6px', borderRadius: '50%', background: 'var(--hp-accent)'}} />
                ativo
              </span>
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
              Sítio Nova Aurora
            </td>
            <td style={{padding: '0 16px', fontSize: '14px'}}>
              Frutos do São Francisco S.A.
            </td>
            <td style={{padding: '0 16px', fontSize: '14px'}}>
              Juazeiro/BA
            </td>
            <td style={{padding: '0 16px', fontSize: '14px', textAlign: 'right'}}>
              96 ha
            </td>
            <td style={{padding: '0 16px', fontSize: '14px', textAlign: 'right'}}>
              1
            </td>
            <td style={{padding: '0 16px', fontSize: '14px', textAlign: 'right'}}>
              1
            </td>
            <td style={{padding: '0 16px'}}>
              <span style={{display: 'inline-flex', alignItems: 'center', gap: '6px', height: '24px', padding: '0 10px', borderRadius: '12px', background: 'var(--hp-atencao-bg)', color: 'var(--hp-atencao)', fontSize: '12px', fontWeight: '600'}}>
                <span style={{width: '6px', height: '6px', borderRadius: '50%', background: 'var(--hp-atencao)'}} />
                em manejo
              </span>
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
          Mostrando 1–2 de 2
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
