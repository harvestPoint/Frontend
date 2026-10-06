// Gerado a partir do design aprovado no Claude Design (HarvestPoint.dc.html)
// e adaptado para React + TypeScript + Tailwind pelo pipeline de migração.
// Revise os TODOs antes de ligar em dados reais da API.

export default function LogisticaPage() {

  return (
    <>
    <div>
      <h1 style={{margin: '0', fontFamily: "'Plus Jakarta Sans', Inter, sans-serif", fontSize: '26px', lineHeight: '32px', fontWeight: '700', letterSpacing: '-.01em'}}>
        Logística de Exportação
      </h1>
      <div style={{fontSize: '12px', color: 'var(--hp-text-2)', marginTop: '4px'}}>
        Comparação de modais · risco climático da previsão regional · 4 registros
      </div>
    </div>
    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--hp-gap)'}}>
      <div style={{background: 'var(--hp-surface)', border: '1px solid var(--hp-border)', borderRadius: 'var(--hp-radius)', padding: 'var(--hp-pad)'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
          <span style={{fontFamily: "'Material Symbols Outlined'", fontSize: '22px', lineHeight: '1', color: 'var(--hp-info)'}}>
            flight
          </span>
          <span style={{fontSize: '15px', fontWeight: '700'}}>
            AÉREO · Miami — 24 h — R$ 32.000
          </span>
        </div>
        <div style={{display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '16px'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
            <span style={{width: '56px', fontSize: '12px', color: 'var(--hp-text-2)'}}>
              Tempo
            </span>
            <div style={{flex: '1', height: '6px', borderRadius: '3px', background: 'var(--hp-surface-2)'}}>
              <div style={{width: '7%', height: '6px', borderRadius: '3px', background: 'var(--hp-text-2)'}} />
            </div>
            <span style={{width: '56px', textAlign: 'right', fontSize: '12px', fontVariantNumeric: 'tabular-nums'}}>
              24 h
            </span>
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
            <span style={{width: '56px', fontSize: '12px', color: 'var(--hp-text-2)'}}>
              Custo
            </span>
            <div style={{flex: '1', height: '6px', borderRadius: '3px', background: 'var(--hp-surface-2)'}}>
              <div style={{width: '100%', height: '6px', borderRadius: '3px', background: 'var(--hp-text-2)'}} />
            </div>
            <span style={{width: '56px', textAlign: 'right', fontSize: '12px', fontVariantNumeric: 'tabular-nums'}}>
              R$ 32k
            </span>
          </div>
        </div>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px', paddingTop: '14px', borderTop: '1px solid var(--hp-border)'}}>
          <span style={{fontSize: '13px', fontWeight: '600'}}>
            LATAM Cargo
          </span>
          <span style={{display: 'inline-flex', alignItems: 'center', gap: '6px', height: '24px', padding: '0 10px', borderRadius: '12px', background: 'var(--hp-accent-soft)', color: 'var(--hp-accent-hover)', fontSize: '12px', fontWeight: '600'}}>
            <span style={{width: '6px', height: '6px', borderRadius: '50%', background: 'var(--hp-accent)'}} />
            em operação
          </span>
        </div>
        {/* TODO: substituir por dado real da API (cruzamento rota × previsão regional) */}
        <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px', fontSize: '12px', color: 'var(--hp-text-2)'}}>
          <span style={{fontFamily: "'Material Symbols Outlined'", fontSize: '16px', lineHeight: '1'}}>cloud_done</span>
          Sem impacto climático previsto na rota nos próximos 7 dias.
        </div>
      </div>
      <div style={{background: 'var(--hp-surface)', border: '1px solid var(--hp-border)', borderRadius: 'var(--hp-radius)', padding: 'var(--hp-pad)'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
          <span style={{fontFamily: "'Material Symbols Outlined'", fontSize: '22px', lineHeight: '1', color: 'var(--hp-info)'}}>
            directions_boat
          </span>
          <span style={{fontSize: '15px', fontWeight: '700'}}>
            MARÍTIMO · Rotterdam — 15 dias — R$ 18.500
          </span>
        </div>
        <div style={{display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '16px'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
            <span style={{width: '56px', fontSize: '12px', color: 'var(--hp-text-2)'}}>
              Tempo
            </span>
            <div style={{flex: '1', height: '6px', borderRadius: '3px', background: 'var(--hp-surface-2)'}}>
              <div style={{width: '100%', height: '6px', borderRadius: '3px', background: 'var(--hp-text-2)'}} />
            </div>
            <span style={{width: '56px', textAlign: 'right', fontSize: '12px', fontVariantNumeric: 'tabular-nums'}}>
              15 dias
            </span>
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
            <span style={{width: '56px', fontSize: '12px', color: 'var(--hp-text-2)'}}>
              Custo
            </span>
            <div style={{flex: '1', height: '6px', borderRadius: '3px', background: 'var(--hp-surface-2)'}}>
              <div style={{width: '58%', height: '6px', borderRadius: '3px', background: 'var(--hp-text-2)'}} />
            </div>
            <span style={{width: '56px', textAlign: 'right', fontSize: '12px', fontVariantNumeric: 'tabular-nums'}}>
              R$ 18,5k
            </span>
          </div>
        </div>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px', paddingTop: '14px', borderTop: '1px solid var(--hp-border)'}}>
          <span style={{fontSize: '13px', fontWeight: '600'}}>
            Maersk Line
          </span>
          <span style={{display: 'inline-flex', alignItems: 'center', gap: '6px', height: '24px', padding: '0 10px', borderRadius: '12px', background: 'var(--hp-atencao-bg)', color: 'var(--hp-atencao)', fontSize: '12px', fontWeight: '600'}}>
            <span style={{width: '6px', height: '6px', borderRadius: '50%', background: 'var(--hp-atencao)'}} />
            aguardando embarque
          </span>
        </div>
        {/* TODO: substituir por dado real da API (cruzamento rota × previsão regional) */}
        <div style={{display: 'flex', alignItems: 'flex-start', gap: '8px', marginTop: '12px', padding: '10px 12px', borderRadius: 'var(--hp-radius-sm)', background: 'var(--hp-atencao-bg)', fontSize: '12px', lineHeight: '17px', color: 'var(--hp-atencao)', fontWeight: '600'}}>
          <span style={{fontFamily: "'Material Symbols Outlined'", fontSize: '16px', lineHeight: '1', flexShrink: 0}}>cloud_alert</span>
          Chuva de 80 % em Petrolina na sexta pode atrasar o carregamento em 1 dia. Antecipar para quinta de manhã.
        </div>
      </div>
    </div>
    <div style={{background: 'var(--hp-surface)', border: '1px solid var(--hp-border)', borderRadius: 'var(--hp-radius)', overflow: 'hidden'}}>
      <div style={{overflowX: 'auto'}}>
        <table style={{width: '100%', borderCollapse: 'collapse', minWidth: '980px', tableLayout: 'fixed'}}>
          <thead>
            <tr style={{height: '48px', background: 'var(--hp-surface-2)'}}>
              <th style={{width: '12%', textAlign: 'left', padding: '0 16px', fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-2)', whiteSpace: 'nowrap'}}>
                ORIGEM
              </th>
              <th style={{width: '15%', textAlign: 'left', padding: '0 16px', fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-2)', whiteSpace: 'nowrap'}}>
                DESTINO
              </th>
              <th style={{width: '10%', textAlign: 'left', padding: '0 16px', fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-2)', whiteSpace: 'nowrap'}}>
                MODAL
              </th>
              <th style={{width: '8%', textAlign: 'right', padding: '0 16px', fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-2)', whiteSpace: 'nowrap'}}>
                TEMPO
              </th>
              <th style={{width: '12%', textAlign: 'right', padding: '0 16px', fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-2)', whiteSpace: 'nowrap'}}>
                CUSTO
              </th>
              <th style={{width: '14%', textAlign: 'left', padding: '0 16px', fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-2)', whiteSpace: 'nowrap'}}>
                TRANSPORTADORA
              </th>
              <th style={{width: '17%', textAlign: 'left', padding: '0 16px', fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-2)', whiteSpace: 'nowrap'}}>
                SITUAÇÃO
              </th>
              <th style={{width: '12%', textAlign: 'left', padding: '0 16px', fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-2)', whiteSpace: 'nowrap'}}>
                CLIMA
              </th>
            </tr>
          </thead>
          <tbody>
            <tr style={{height: '52px', borderTop: '1px solid var(--hp-border)'}}>
              <td style={{padding: '0 16px', fontSize: '14px', whiteSpace: 'nowrap'}}>
                Petrolina/PE
              </td>
              <td style={{padding: '0 16px', fontSize: '14px', whiteSpace: 'nowrap'}}>
                Miami, EUA
              </td>
              <td style={{padding: '0 16px', fontSize: '14px', whiteSpace: 'nowrap'}}>
                <span style={{display: 'inline-flex', alignItems: 'center', gap: '6px'}}>
                  <span style={{fontFamily: "'Material Symbols Outlined'", fontSize: '18px', lineHeight: '1', color: 'var(--hp-text-2)'}}>
                    flight
                  </span>
                  Aéreo
                </span>
              </td>
              <td style={{padding: '0 16px', textAlign: 'right', fontSize: '14px', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap'}}>
                1 dia
              </td>
              <td style={{padding: '0 16px', textAlign: 'right', fontSize: '14px', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap'}}>
                R$ 32.000,00
              </td>
              <td style={{padding: '0 16px', fontSize: '14px', whiteSpace: 'nowrap'}}>
                LATAM Cargo
              </td>
              <td style={{padding: '0 16px', whiteSpace: 'nowrap'}}>
                <span style={{display: 'inline-flex', alignItems: 'center', gap: '6px', height: '24px', padding: '0 10px', borderRadius: '12px', background: 'var(--hp-info-bg)', color: 'var(--hp-info)', fontSize: '12px', fontWeight: '600', whiteSpace: 'nowrap'}}>
                  <span style={{width: '6px', height: '6px', borderRadius: '50%', background: 'var(--hp-info)', flexShrink: '0'}} />
                  em trânsito
                </span>
              </td>
              <td style={{padding: '0 16px', fontSize: '12px', color: 'var(--hp-text-2)', whiteSpace: 'nowrap'}}>
                sem risco
              </td>
            </tr>
            <tr style={{height: '52px', borderTop: '1px solid var(--hp-border)'}}>
              <td style={{padding: '0 16px', fontSize: '14px', whiteSpace: 'nowrap'}}>
                Petrolina/PE
              </td>
              <td style={{padding: '0 16px', fontSize: '14px', whiteSpace: 'nowrap'}}>
                Rotterdam, Holanda
              </td>
              <td style={{padding: '0 16px', fontSize: '14px', whiteSpace: 'nowrap'}}>
                <span style={{display: 'inline-flex', alignItems: 'center', gap: '6px'}}>
                  <span style={{fontFamily: "'Material Symbols Outlined'", fontSize: '18px', lineHeight: '1', color: 'var(--hp-text-2)'}}>
                    directions_boat
                  </span>
                  Marítimo
                </span>
              </td>
              <td style={{padding: '0 16px', textAlign: 'right', fontSize: '14px', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap'}}>
                15 dias
              </td>
              <td style={{padding: '0 16px', textAlign: 'right', fontSize: '14px', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap'}}>
                R$ 18.500,00
              </td>
              <td style={{padding: '0 16px', fontSize: '14px', whiteSpace: 'nowrap'}}>
                Maersk Line
              </td>
              <td style={{padding: '0 16px', whiteSpace: 'nowrap'}}>
                <span style={{display: 'inline-flex', alignItems: 'center', gap: '6px', height: '24px', padding: '0 10px', borderRadius: '12px', background: 'var(--hp-atencao-bg)', color: 'var(--hp-atencao)', fontSize: '12px', fontWeight: '600', whiteSpace: 'nowrap'}}>
                  <span style={{width: '6px', height: '6px', borderRadius: '50%', background: 'var(--hp-atencao)', flexShrink: '0'}} />
                  aguardando embarque
                </span>
              </td>
              <td style={{padding: '0 16px', whiteSpace: 'nowrap'}}>
                <span style={{display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: '600', color: 'var(--hp-atencao)'}}>
                  <span style={{fontFamily: "'Material Symbols Outlined'", fontSize: '14px', lineHeight: '1'}}>cloud_alert</span>
                  chuva sex
                </span>
              </td>
            </tr>
            <tr style={{height: '52px', borderTop: '1px solid var(--hp-border)'}}>
              <td style={{padding: '0 16px', fontSize: '14px', whiteSpace: 'nowrap'}}>
                Petrolina/PE
              </td>
              <td style={{padding: '0 16px', fontSize: '14px', whiteSpace: 'nowrap'}}>
                Londres, Reino Unido
              </td>
              <td style={{padding: '0 16px', fontSize: '14px', whiteSpace: 'nowrap'}}>
                <span style={{display: 'inline-flex', alignItems: 'center', gap: '6px'}}>
                  <span style={{fontFamily: "'Material Symbols Outlined'", fontSize: '18px', lineHeight: '1', color: 'var(--hp-text-2)'}}>
                    flight
                  </span>
                  Aéreo
                </span>
              </td>
              <td style={{padding: '0 16px', textAlign: 'right', fontSize: '14px', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap'}}>
                1 dia
              </td>
              <td style={{padding: '0 16px', textAlign: 'right', fontSize: '14px', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap'}}>
                R$ 29.800,00
              </td>
              <td style={{padding: '0 16px', fontSize: '14px', whiteSpace: 'nowrap'}}>
                LATAM Cargo
              </td>
              <td style={{padding: '0 16px', whiteSpace: 'nowrap'}}>
                <span style={{display: 'inline-flex', alignItems: 'center', gap: '6px', height: '24px', padding: '0 10px', borderRadius: '12px', background: 'var(--hp-accent-soft)', color: 'var(--hp-accent-hover)', fontSize: '12px', fontWeight: '600', whiteSpace: 'nowrap'}}>
                  <span style={{width: '6px', height: '6px', borderRadius: '50%', background: 'var(--hp-accent)', flexShrink: '0'}} />
                  entregue
                </span>
              </td>
              <td style={{padding: '0 16px', fontSize: '12px', color: 'var(--hp-text-2)', whiteSpace: 'nowrap'}}>
                —
              </td>
            </tr>
            <tr style={{height: '52px', borderTop: '1px solid var(--hp-border)'}}>
              <td style={{padding: '0 16px', fontSize: '14px', whiteSpace: 'nowrap'}}>
                Petrolina/PE
              </td>
              <td style={{padding: '0 16px', fontSize: '14px', whiteSpace: 'nowrap'}}>
                Hamburgo, Alemanha
              </td>
              <td style={{padding: '0 16px', fontSize: '14px', whiteSpace: 'nowrap'}}>
                <span style={{display: 'inline-flex', alignItems: 'center', gap: '6px'}}>
                  <span style={{fontFamily: "'Material Symbols Outlined'", fontSize: '18px', lineHeight: '1', color: 'var(--hp-text-2)'}}>
                    directions_boat
                  </span>
                  Marítimo
                </span>
              </td>
              <td style={{padding: '0 16px', textAlign: 'right', fontSize: '14px', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap'}}>
                16 dias
              </td>
              <td style={{padding: '0 16px', textAlign: 'right', fontSize: '14px', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap'}}>
                R$ 19.200,00
              </td>
              <td style={{padding: '0 16px', fontSize: '14px', whiteSpace: 'nowrap'}}>
                MSC
              </td>
              <td style={{padding: '0 16px', whiteSpace: 'nowrap'}}>
                <span style={{display: 'inline-flex', alignItems: 'center', gap: '6px', height: '24px', padding: '0 10px', borderRadius: '12px', background: 'var(--hp-info-bg)', color: 'var(--hp-info)', fontSize: '12px', fontWeight: '600', whiteSpace: 'nowrap'}}>
                  <span style={{width: '6px', height: '6px', borderRadius: '50%', background: 'var(--hp-info)', flexShrink: '0'}} />
                  em trânsito
                </span>
              </td>
              <td style={{padding: '0 16px', fontSize: '12px', color: 'var(--hp-text-2)', whiteSpace: 'nowrap'}}>
                sem risco
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    </>
  );
}
