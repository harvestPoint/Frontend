// Gerado a partir do design aprovado no Claude Design (HarvestPoint.dc.html)
// e adaptado para React + TypeScript + Tailwind pelo pipeline de migração.
// Revise os TODOs antes de ligar em dados reais da API.

export default function SensoresPage() {

  return (
    <>
    <div style={{display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '24px'}}>
      <div>
        <h1 style={{margin: '0', fontFamily: "'Plus Jakarta Sans', Inter, sans-serif", fontSize: '28px', lineHeight: '34px', fontWeight: '700', letterSpacing: '-.01em'}}>
          Sensores
        </h1>
        <div style={{fontSize: '12px', color: 'var(--hp-text-2)', marginTop: '4px'}}>
          Dispositivos de telemetria instalados em campo · 3 registros
        </div>
      </div>
      <div style={{height: '40px', padding: '0 16px', display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--hp-accent)', color: '#FFFFFF', borderRadius: '12px', fontSize: '13px', fontWeight: '600', cursor: 'pointer'}}>
        <span style={{fontFamily: "'Material Symbols Outlined'", fontSize: '18px', lineHeight: '1'}}>
          add
        </span>
        Novo sensor
      </div>
    </div>
    <div style={{height: '64px', background: 'var(--hp-surface)', border: '1px solid var(--hp-border)', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '12px', padding: '0 16px'}}>
      <div style={{flex: '1', minWidth: '0', height: '44px', border: '1px solid var(--hp-input-border)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px', padding: '0 12px'}}>
        <span style={{fontFamily: "'Material Symbols Outlined'", fontSize: '18px', lineHeight: '1', color: 'var(--hp-text-3)'}}>
          search
        </span>
        <span style={{fontSize: '14px', color: 'var(--hp-text-3)'}}>
          Buscar por código do sensor
        </span>
      </div>
      <div style={{height: '44px', padding: '0 12px', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid var(--hp-input-border)', borderRadius: '12px', fontSize: '13px', fontWeight: '600'}}>
        Lote
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
              CÓDIGO ↓
            </th>
            <th style={{textAlign: 'left', padding: '0 16px', fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-2)'}}>
              GRANDEZAS MEDIDAS
            </th>
            <th style={{textAlign: 'left', padding: '0 16px', fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-2)'}}>
              PROPRIEDADE
            </th>
            <th style={{textAlign: 'left', padding: '0 16px', fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-2)'}}>
              LOTE
            </th>
            <th style={{textAlign: 'left', padding: '0 16px', fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-2)'}}>
              INSTALAÇÃO
            </th>
            <th style={{textAlign: 'left', padding: '0 16px', fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-2)'}}>
              ÚLTIMA LEITURA
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
            <td style={{padding: '0 16px', fontFamily: "'JetBrains Mono', monospace", fontSize: '14px', fontWeight: '500', color: 'var(--hp-accent)', cursor: 'pointer'}}>
              IOT-001
            </td>
            <td style={{padding: '0 16px', fontSize: '14px'}}>
              temperatura · umidade do ar · umidade do solo · precipitação
            </td>
            <td style={{padding: '0 16px', fontSize: '14px'}}>
              Fazenda Boa Vista
            </td>
            <td style={{padding: '0 16px', fontSize: '14px'}}>
              Lote A1
            </td>
            <td style={{padding: '0 16px', fontSize: '14px'}}>
              10/01/2026
            </td>
            <td style={{padding: '0 16px', fontSize: '14px'}}>
              há 2 min
            </td>
            <td style={{padding: '0 16px'}}>
              <span style={{display: 'inline-flex', alignItems: 'center', gap: '6px', height: '24px', padding: '0 10px', borderRadius: '12px', background: 'var(--hp-accent-soft)', color: 'var(--hp-accent)', fontSize: '12px', fontWeight: '600'}}>
                <span style={{width: '6px', height: '6px', borderRadius: '50%', background: 'var(--hp-accent)'}} />
                on-line
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
            <td style={{padding: '0 16px', fontFamily: "'JetBrains Mono', monospace", fontSize: '14px', fontWeight: '500', color: 'var(--hp-accent)', cursor: 'pointer'}}>
              IOT-002
            </td>
            <td style={{padding: '0 16px', fontSize: '14px'}}>
              temperatura · umidade do ar · umidade do solo
            </td>
            <td style={{padding: '0 16px', fontSize: '14px'}}>
              Fazenda Boa Vista
            </td>
            <td style={{padding: '0 16px', fontSize: '14px'}}>
              Lote B2
            </td>
            <td style={{padding: '0 16px', fontSize: '14px'}}>
              20/01/2026
            </td>
            <td style={{padding: '0 16px', fontSize: '14px'}}>
              há 2 min
            </td>
            <td style={{padding: '0 16px'}}>
              <span style={{display: 'inline-flex', alignItems: 'center', gap: '6px', height: '24px', padding: '0 10px', borderRadius: '12px', background: 'var(--hp-accent-soft)', color: 'var(--hp-accent)', fontSize: '12px', fontWeight: '600'}}>
                <span style={{width: '6px', height: '6px', borderRadius: '50%', background: 'var(--hp-accent)'}} />
                on-line
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
            <td style={{padding: '0 16px', fontFamily: "'JetBrains Mono', monospace", fontSize: '14px', fontWeight: '500', color: 'var(--hp-accent)', cursor: 'pointer'}}>
              IOT-003
            </td>
            <td style={{padding: '0 16px', fontSize: '14px'}}>
              temperatura · umidade do solo
            </td>
            <td style={{padding: '0 16px', fontSize: '14px'}}>
              Sítio Nova Aurora
            </td>
            <td style={{padding: '0 16px', fontSize: '14px'}}>
              Lote C3
            </td>
            <td style={{padding: '0 16px', fontSize: '14px'}}>
              02/03/2026
            </td>
            <td style={{padding: '0 16px', fontSize: '14px'}}>
              há 4 h
            </td>
            <td style={{padding: '0 16px'}}>
              <span style={{display: 'inline-flex', alignItems: 'center', gap: '6px', height: '24px', padding: '0 10px', borderRadius: '12px', background: 'var(--hp-atencao-bg)', color: 'var(--hp-atencao)', fontSize: '12px', fontWeight: '600'}}>
                <span style={{width: '6px', height: '6px', borderRadius: '50%', background: 'var(--hp-atencao)'}} />
                instável
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
