// Gerado a partir do design aprovado no Claude Design (HarvestPoint.dc.html)
// e adaptado para React + TypeScript + Tailwind pelo pipeline de migração.
// Revise os TODOs antes de ligar em dados reais da API.

import { useState } from 'react';
import DispositivoDrawer from '@/features/automacao/components/DispositivoDrawer';

export default function LeiturasPage() {
  const [kitAberto, setKitAberto] = useState<string | null>(null);

  return (
    <>
    <div style={{display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '24px'}}>
      <div>
        <h1 style={{margin: '0', fontFamily: "'Plus Jakarta Sans', Inter, sans-serif", fontSize: '26px', lineHeight: '32px', fontWeight: '700', letterSpacing: '-.01em'}}>
          Leituras IoT
        </h1>
        <div style={{fontSize: '12px', color: 'var(--hp-text-2)', marginTop: '4px'}}>
          Histórico de telemetria · 1.284 leituras · última há 2 min
        </div>
      </div>
      <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
        <div style={{height: '40px', padding: '0 14px', display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--hp-surface)', border: '1px solid var(--hp-input-border)', borderRadius: '12px', fontSize: '13px', fontWeight: '600', cursor: 'pointer'}}>
          <span style={{fontFamily: "'Material Symbols Outlined'", fontSize: '18px', lineHeight: '1'}}>
            download
          </span>
          Exportar CSV
        </div>
        <div style={{height: '40px', padding: '0 16px', display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--hp-accent)', color: '#FFFFFF', borderRadius: '12px', fontSize: '13px', fontWeight: '600', cursor: 'pointer'}}>
          <span style={{fontFamily: "'Material Symbols Outlined'", fontSize: '18px', lineHeight: '1'}}>
            add
          </span>
          Registro manual
        </div>
      </div>
    </div>
    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--hp-gap)', alignItems: 'stretch'}}>
      <div style={{border: '1px solid var(--hp-sucesso-border)', background: 'var(--hp-bg)', borderRadius: 'var(--hp-radius)', padding: 'var(--hp-pad)', display: 'flex', flexDirection: 'column'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
          <span style={{width: '8px', height: '8px', borderRadius: '50%', background: 'var(--hp-accent)', display: 'inline-block', animation: 'hpPulse 2s ease-in-out infinite'}} />
          <span style={{fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-accent-hover)'}}>
            SIMULADOR DE TELEMETRIA · RODANDO
          </span>
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: '10px', marginTop: '16px', flexWrap: 'wrap'}}>
          <div style={{height: '40px', padding: '0 12px', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid var(--hp-input-border)', background: 'var(--hp-surface)', borderRadius: '12px', fontSize: '13px', fontWeight: '600'}}>
            Intervalo 10 s
            <span style={{fontFamily: "'Material Symbols Outlined'", fontSize: '18px', lineHeight: '1', color: 'var(--hp-text-2)'}}>
              expand_more
            </span>
          </div>
          <div style={{height: '40px', padding: '0 12px', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid var(--hp-input-border)', background: 'var(--hp-surface)', borderRadius: '12px', fontSize: '13px', fontWeight: '600'}}>
            Sensores: todos
            <span style={{fontFamily: "'Material Symbols Outlined'", fontSize: '18px', lineHeight: '1', color: 'var(--hp-text-2)'}}>
              expand_more
            </span>
          </div>
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: '10px', marginTop: '12px'}}>
          <div style={{height: '40px', padding: '0 16px', display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--hp-accent)', color: '#FFFFFF', borderRadius: '12px', fontSize: '13px', fontWeight: '600', cursor: 'pointer'}}>
            <span style={{fontFamily: "'Material Symbols Outlined'", fontSize: '18px', lineHeight: '1'}}>
              pause
            </span>
            Pausar
          </div>
          <div style={{height: '40px', padding: '0 16px', display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--hp-surface)', border: '1px solid var(--hp-input-border)', borderRadius: '12px', fontSize: '13px', fontWeight: '600', cursor: 'pointer'}}>
            <span style={{fontFamily: "'Material Symbols Outlined'", fontSize: '18px', lineHeight: '1'}}>
              bolt
            </span>
            Gerar agora
          </div>
        </div>
        <div style={{fontSize: '12px', color: 'var(--hp-text-2)', marginTop: '14px'}}>
          42 leituras geradas nesta sessão
        </div>
      </div>
      <div style={{border: '1px solid var(--hp-border)', background: 'var(--hp-surface)', borderRadius: 'var(--hp-radius)', padding: 'var(--hp-pad)', display: 'flex', flexDirection: 'column'}}>
        <div style={{fontFamily: "'Plus Jakarta Sans', Inter, sans-serif", fontSize: '16px', lineHeight: '22px', fontWeight: '600'}}>
          Registro manual de leitura
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: '10px', marginTop: '14px'}}>
          <div style={{flex: '1', height: '40px', padding: '0 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid var(--hp-input-border)', borderRadius: '12px', fontSize: '13px', fontWeight: '600'}}>
            Sensor: IOT-001
            <span style={{fontFamily: "'Material Symbols Outlined'", fontSize: '18px', lineHeight: '1', color: 'var(--hp-text-2)'}}>
              expand_more
            </span>
          </div>
          <div style={{flex: '1', height: '40px', padding: '0 12px', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid var(--hp-input-border)', borderRadius: '12px', fontSize: '13px'}}>
            <span style={{fontFamily: "'Material Symbols Outlined'", fontSize: '18px', lineHeight: '1', color: 'var(--hp-text-3)'}}>
              calendar_today
            </span>
            Hoje · 09h04
          </div>
        </div>
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '12px'}}>
          <div>
            <div style={{fontSize: '12px', fontWeight: '600', marginBottom: '4px', color: 'var(--hp-text-2)'}}>
              Temperatura °C
            </div>
            <div style={{height: '40px', border: '1px solid var(--hp-input-border)', borderRadius: '12px', display: 'flex', alignItems: 'center', padding: '0 12px', fontSize: '14px', fontFamily: 'Inter', fontVariantNumeric: 'tabular-nums', color: 'var(--hp-text-3)'}}>
              0,0
            </div>
          </div>
          <div>
            <div style={{fontSize: '12px', fontWeight: '600', marginBottom: '4px', color: 'var(--hp-text-2)'}}>
              Umidade do ar %
            </div>
            <div style={{height: '40px', border: '1px solid var(--hp-input-border)', borderRadius: '12px', display: 'flex', alignItems: 'center', padding: '0 12px', fontSize: '14px', fontVariantNumeric: 'tabular-nums', color: 'var(--hp-text-3)'}}>
              0,0
            </div>
          </div>
          <div>
            <div style={{fontSize: '12px', fontWeight: '600', marginBottom: '4px', color: 'var(--hp-text-2)'}}>
              Umidade do solo %
            </div>
            <div style={{height: '40px', border: '1px solid var(--hp-input-border)', borderRadius: '12px', display: 'flex', alignItems: 'center', padding: '0 12px', fontSize: '14px', fontVariantNumeric: 'tabular-nums', color: 'var(--hp-text-3)'}}>
              0,0
            </div>
          </div>
          <div>
            <div style={{fontSize: '12px', fontWeight: '600', marginBottom: '4px', color: 'var(--hp-text-2)'}}>
              Precipitação mm
            </div>
            <div style={{height: '40px', border: '1px solid var(--hp-input-border)', borderRadius: '12px', display: 'flex', alignItems: 'center', padding: '0 12px', fontSize: '14px', fontVariantNumeric: 'tabular-nums', color: 'var(--hp-text-3)'}}>
              0,0
            </div>
          </div>
        </div>
        <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: '16px'}}>
          <div style={{height: '40px', padding: '0 18px', display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--hp-accent)', color: '#FFFFFF', borderRadius: '12px', fontSize: '13px', fontWeight: '600', cursor: 'pointer'}}>
            Salvar leitura
          </div>
        </div>
      </div>
    </div>
    <div style={{height: '64px', background: 'var(--hp-surface)', border: '1px solid var(--hp-border)', borderRadius: 'var(--hp-radius)', display: 'flex', alignItems: 'center', gap: '12px', padding: '0 16px'}}>
      <div style={{flex: '1', minWidth: '0', height: '44px', border: '1px solid var(--hp-input-border)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px', padding: '0 12px'}}>
        <span style={{fontFamily: "'Material Symbols Outlined'", fontSize: '18px', lineHeight: '1', color: 'var(--hp-text-3)'}}>
          search
        </span>
        <span style={{fontSize: '14px', color: 'var(--hp-text-3)'}}>
          Buscar por sensor
        </span>
      </div>
      <div style={{height: '44px', padding: '0 12px', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid var(--hp-input-border)', borderRadius: '12px', fontSize: '13px', fontWeight: '600'}}>
        Lote
        <span style={{fontFamily: "'Material Symbols Outlined'", fontSize: '18px', lineHeight: '1', color: 'var(--hp-text-2)'}}>
          expand_more
        </span>
      </div>
      <div style={{height: '44px', padding: '0 12px', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid var(--hp-input-border)', borderRadius: '12px', fontSize: '13px', fontWeight: '600'}}>
        Grandeza
        <span style={{fontFamily: "'Material Symbols Outlined'", fontSize: '18px', lineHeight: '1', color: 'var(--hp-text-2)'}}>
          expand_more
        </span>
      </div>
      <div style={{height: '44px', padding: '0 12px', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid var(--hp-input-border)', borderRadius: '12px', fontSize: '13px', fontWeight: '600'}}>
        Período
        <span style={{fontFamily: "'Material Symbols Outlined'", fontSize: '18px', lineHeight: '1', color: 'var(--hp-text-2)'}}>
          expand_more
        </span>
      </div>
      <div style={{width: '1px', height: '28px', background: 'var(--hp-border)'}} />
      <div style={{height: '32px', padding: '0 12px', display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--hp-atencao-bg)', border: '1px solid var(--hp-atencao-border)', borderRadius: '22px', fontSize: '12px', fontWeight: '600', color: 'var(--hp-atencao)', cursor: 'pointer'}}>
        <span style={{width: '14px', height: '14px', borderRadius: '4px', border: '1px solid var(--hp-atencao)', display: 'block'}} />
        só fora da faixa
      </div>
    </div>
    <div style={{background: 'var(--hp-surface)', border: '1px solid var(--hp-border)', borderRadius: 'var(--hp-radius)', overflow: 'hidden'}}>
      <div style={{overflowX: 'auto'}}>
        <table style={{width: '100%', borderCollapse: 'collapse', minWidth: '1020px', tableLayout: 'fixed'}}>
          <thead>
            <tr style={{height: '48px', background: 'var(--hp-surface-2)'}}>
              <th style={{width: '96px', textAlign: 'left', padding: '0 16px', fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-2)', whiteSpace: 'nowrap'}}>
                SENSOR
              </th>
              <th style={{width: '84px', textAlign: 'left', padding: '0 16px', fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-2)', whiteSpace: 'nowrap'}}>
                LOTE
              </th>
              <th style={{width: '128px', textAlign: 'left', padding: '0 16px', fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-2)', whiteSpace: 'nowrap'}}>
                DATA/HORA
              </th>
              <th style={{width: '84px', textAlign: 'right', padding: '0 16px', fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-2)', whiteSpace: 'nowrap'}}>
                TEMP °C
              </th>
              <th style={{width: '88px', textAlign: 'right', padding: '0 16px', fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-2)', whiteSpace: 'nowrap'}}>
                UM. AR %
              </th>
              <th style={{width: '84px', textAlign: 'right', padding: '0 16px', fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-2)', whiteSpace: 'nowrap'}}>
                SOLO %
              </th>
              <th style={{width: '96px', textAlign: 'right', padding: '0 16px', fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-2)', whiteSpace: 'nowrap'}}>
                PRECIP. mm
              </th>
              <th style={{width: '96px', textAlign: 'right', padding: '0 16px', fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-2)', whiteSpace: 'nowrap'}}>
                LUM. lx
              </th>
              <th style={{width: '112px', textAlign: 'right', padding: '0 16px', fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-2)', whiteSpace: 'nowrap'}}>
                PRESSÃO hPa
              </th>
            </tr>
          </thead>
          <tbody>
            <tr style={{height: '52px', borderTop: '1px solid var(--hp-border)', background: 'var(--hp-accent-soft)', animation: 'hpFade 3s forwards'}}>
              <td style={{padding: '0 16px', fontSize: '14px'}}>
                <button type="button" onClick={() => setKitAberto('IOT-001')} title="Abrir o dispositivo IOT-001" style={{border: 0, background: 'transparent', padding: 0, cursor: 'pointer', fontFamily: "'JetBrains Mono', monospace", fontSize: '14px', color: 'var(--hp-accent-hover)', textDecoration: 'underline', textUnderlineOffset: '3px'}}>
                  IOT-001
                </button>
              </td>
              <td style={{padding: '0 16px', fontSize: '14px', whiteSpace: 'nowrap'}}>
                Lote A1
              </td>
              <td style={{padding: '0 16px', fontSize: '14px', whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums'}}>
                26/08 · 09h04
              </td>
              <td style={{padding: '0 16px', textAlign: 'right', fontSize: '14px', fontWeight: '600', color: 'var(--hp-critico)', fontVariantNumeric: 'tabular-nums'}}>
                31,9 ▲
              </td>
              <td style={{padding: '0 16px', textAlign: 'right', fontSize: '14px', fontVariantNumeric: 'tabular-nums'}}>
                73,4
              </td>
              <td style={{padding: '0 16px', textAlign: 'right', fontSize: '14px', fontVariantNumeric: 'tabular-nums'}}>
                38,2
              </td>
              <td style={{padding: '0 16px', textAlign: 'right', fontSize: '14px', fontVariantNumeric: 'tabular-nums'}}>
                0,0
              </td>
              <td style={{padding: '0 16px', textAlign: 'right', fontSize: '14px', fontVariantNumeric: 'tabular-nums'}}>
                62.000
              </td>
              <td style={{padding: '0 16px', textAlign: 'right', fontSize: '14px', fontVariantNumeric: 'tabular-nums'}}>
                1.013,2
              </td>
            </tr>
            <tr style={{height: '52px', borderTop: '1px solid var(--hp-border)'}}>
              <td style={{padding: '0 16px', fontSize: '14px'}}>
                <button type="button" onClick={() => setKitAberto('IOT-002')} title="Abrir o dispositivo IOT-002" style={{border: 0, background: 'transparent', padding: 0, cursor: 'pointer', fontFamily: "'JetBrains Mono', monospace", fontSize: '14px', color: 'var(--hp-accent-hover)', textDecoration: 'underline', textUnderlineOffset: '3px'}}>
                  IOT-002
                </button>
              </td>
              <td style={{padding: '0 16px', fontSize: '14px', whiteSpace: 'nowrap'}}>
                Lote B2
              </td>
              <td style={{padding: '0 16px', fontSize: '14px', whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums'}}>
                26/08 · 09h02
              </td>
              <td style={{padding: '0 16px', textAlign: 'right', fontSize: '14px', fontVariantNumeric: 'tabular-nums'}}>
                28,4
              </td>
              <td style={{padding: '0 16px', textAlign: 'right', fontSize: '14px', fontVariantNumeric: 'tabular-nums'}}>
                65,1
              </td>
              <td style={{padding: '0 16px', textAlign: 'right', fontSize: '14px', fontVariantNumeric: 'tabular-nums'}}>
                41,0
              </td>
              <td style={{padding: '0 16px', textAlign: 'right', fontSize: '14px', fontVariantNumeric: 'tabular-nums'}}>
                0,0
              </td>
              <td style={{padding: '0 16px', textAlign: 'right', fontSize: '14px', fontVariantNumeric: 'tabular-nums'}}>
                58.400
              </td>
              <td style={{padding: '0 16px', textAlign: 'right', fontSize: '14px', fontVariantNumeric: 'tabular-nums'}}>
                1.012,8
              </td>
            </tr>
            <tr style={{height: '52px', borderTop: '1px solid var(--hp-border)'}}>
              <td style={{padding: '0 16px', fontSize: '14px'}}>
                <button type="button" onClick={() => setKitAberto('IOT-001')} title="Abrir o dispositivo IOT-001" style={{border: 0, background: 'transparent', padding: 0, cursor: 'pointer', fontFamily: "'JetBrains Mono', monospace", fontSize: '14px', color: 'var(--hp-accent-hover)', textDecoration: 'underline', textUnderlineOffset: '3px'}}>
                  IOT-001
                </button>
              </td>
              <td style={{padding: '0 16px', fontSize: '14px', whiteSpace: 'nowrap'}}>
                Lote A1
              </td>
              <td style={{padding: '0 16px', fontSize: '14px', whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums'}}>
                26/08 · 08h54
              </td>
              <td style={{padding: '0 16px', textAlign: 'right', fontSize: '14px', fontWeight: '600', color: 'var(--hp-atencao)', fontVariantNumeric: 'tabular-nums'}}>
                30,6 ▲
              </td>
              <td style={{padding: '0 16px', textAlign: 'right', fontSize: '14px', fontVariantNumeric: 'tabular-nums'}}>
                70,2
              </td>
              <td style={{padding: '0 16px', textAlign: 'right', fontSize: '14px', fontWeight: '600', color: 'var(--hp-atencao)', fontVariantNumeric: 'tabular-nums'}}>
                22,4 ▼
              </td>
              <td style={{padding: '0 16px', textAlign: 'right', fontSize: '14px', fontVariantNumeric: 'tabular-nums'}}>
                0,0
              </td>
              <td style={{padding: '0 16px', textAlign: 'right', fontSize: '14px', fontVariantNumeric: 'tabular-nums'}}>
                64.100
              </td>
              <td style={{padding: '0 16px', textAlign: 'right', fontSize: '14px', fontVariantNumeric: 'tabular-nums'}}>
                1.013,5
              </td>
            </tr>
            <tr style={{height: '52px', borderTop: '1px solid var(--hp-border)'}}>
              <td style={{padding: '0 16px', fontSize: '14px'}}>
                <button type="button" onClick={() => setKitAberto('IOT-003')} title="Abrir o dispositivo IOT-003" style={{border: 0, background: 'transparent', padding: 0, cursor: 'pointer', fontFamily: "'JetBrains Mono', monospace", fontSize: '14px', color: 'var(--hp-accent-hover)', textDecoration: 'underline', textUnderlineOffset: '3px'}}>
                  IOT-003
                </button>
              </td>
              <td style={{padding: '0 16px', fontSize: '14px', whiteSpace: 'nowrap'}}>
                Lote C3
              </td>
              <td style={{padding: '0 16px', fontSize: '14px', whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums'}}>
                26/08 · 08h40
              </td>
              <td style={{padding: '0 16px', textAlign: 'right', fontSize: '14px', fontVariantNumeric: 'tabular-nums'}}>
                24,1
              </td>
              <td style={{padding: '0 16px', textAlign: 'right', fontSize: '14px', fontVariantNumeric: 'tabular-nums'}}>
                58,0
              </td>
              <td style={{padding: '0 16px', textAlign: 'right', fontSize: '14px', fontVariantNumeric: 'tabular-nums'}}>
                19,8
              </td>
              <td style={{padding: '0 16px', textAlign: 'right', fontSize: '14px', fontVariantNumeric: 'tabular-nums'}}>
                4,2
              </td>
              <td style={{padding: '0 16px', textAlign: 'right', fontSize: '14px', fontVariantNumeric: 'tabular-nums'}}>
                41.200
              </td>
              <td style={{padding: '0 16px', textAlign: 'right', fontSize: '14px', fontVariantNumeric: 'tabular-nums'}}>
                1.011,5
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div style={{height: '56px', borderTop: '1px solid var(--hp-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', fontSize: '12px', color: 'var(--hp-text-2)'}}>
        <span>
          Mostrando 1–4 de 1.284
        </span>
        <div style={{height: '32px', padding: '0 10px', display: 'flex', alignItems: 'center', gap: '6px', border: '1px solid var(--hp-input-border)', borderRadius: '8px', fontSize: '12px', fontWeight: '600', color: 'var(--hp-text)'}}>
          10 por página
          <span style={{fontFamily: "'Material Symbols Outlined'", fontSize: '16px', lineHeight: '1', color: 'var(--hp-text-2)'}}>
            expand_more
          </span>
        </div>
      </div>
    </div>
    <DispositivoDrawer kitId={kitAberto} aoFechar={() => setKitAberto(null)} largura={440} />
    </>
  );
}
