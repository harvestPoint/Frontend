// Gerado a partir do design aprovado no Claude Design (HarvestPoint.dc.html)
// e adaptado para React + TypeScript + Tailwind pelo pipeline de migração.
// Revise os TODOs antes de ligar em dados reais da API.
import { useNavigate } from 'react-router-dom';

export default function AlertasPage() {

  const navigate = useNavigate();
  const goLote = () => navigate('/lotes/A1');

  return (
    <>
    <div>
      <h1 style={{margin: '0', fontFamily: "'Plus Jakarta Sans', Inter, sans-serif", fontSize: '28px', lineHeight: '34px', fontWeight: '700', letterSpacing: '-.01em'}}>
        Alertas
      </h1>
      <div style={{fontSize: '12px', color: 'var(--hp-text-2)', marginTop: '4px'}}>
        Notificações climáticas e operacionais · 4 ativos
      </div>
    </div>
    <div style={{height: '64px', background: 'var(--hp-surface)', border: '1px solid var(--hp-border)', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '12px', padding: '0 16px'}}>
      <div style={{flex: '1', minWidth: '0', height: '44px', border: '1px solid var(--hp-input-border)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px', padding: '0 12px'}}>
        <span style={{fontFamily: "'Material Symbols Outlined'", fontSize: '18px', lineHeight: '1', color: 'var(--hp-text-3)'}}>
          search
        </span>
        <span style={{fontSize: '14px', color: 'var(--hp-text-3)'}}>
          Buscar por alerta ou lote
        </span>
      </div>
      <div style={{height: '44px', padding: '0 12px', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid var(--hp-input-border)', borderRadius: '12px', fontSize: '13px', fontWeight: '600'}}>
        Severidade
        <span style={{fontFamily: "'Material Symbols Outlined'", fontSize: '18px', lineHeight: '1', color: 'var(--hp-text-2)'}}>
          expand_more
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
    </div>
    <div style={{background: 'var(--hp-surface)', border: '1px solid var(--hp-border)', borderRadius: '16px', overflow: 'hidden'}}>
      <table style={{width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed'}}>
        <thead>
          <tr style={{height: '48px', background: 'var(--hp-surface-2)'}}>
            <th style={{width: '11%', textAlign: 'left', padding: '0 16px', fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-2)'}}>
              SEVERIDADE
            </th>
            <th style={{width: '34%', textAlign: 'left', padding: '0 16px', fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-2)'}}>
              ALERTA
            </th>
            <th style={{width: '10%', textAlign: 'left', padding: '0 16px', fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-2)'}}>
              LOTE
            </th>
            <th style={{width: '14%', textAlign: 'left', padding: '0 16px', fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-2)'}}>
              GRANDEZA
            </th>
            <th style={{width: '10%', textAlign: 'left', padding: '0 16px', fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-2)'}}>
              REGISTRADO
            </th>
            <th style={{width: '13%', textAlign: 'left', padding: '0 16px', fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-2)'}}>
              STATUS
            </th>
            <th style={{width: '8%', textAlign: 'right', padding: '0 16px', fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-2)'}}>
              AÇÕES
            </th>
          </tr>
        </thead>
        <tbody>
          <tr style={{height: '52px', borderTop: '1px solid var(--hp-border)'}}>
            <td style={{padding: '0 16px'}}>
              <span style={{display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '600', color: 'var(--hp-critico)'}}>
                <span style={{width: '6px', height: '6px', borderRadius: '50%', background: 'var(--hp-critico)', display: 'inline-block'}} />
                crítico
              </span>
            </td>
            <td style={{padding: '0 16px', fontSize: '14px'}}>
              Estresse térmico — 31,9 °C, limite da manga é 30 °C
            </td>
            <td style={{padding: '0 16px', fontSize: '14px', color: 'var(--hp-accent)', fontWeight: '600', cursor: 'pointer'}} onClick={goLote}>
              Lote A1
            </td>
            <td style={{padding: '0 16px', fontSize: '14px'}}>
              Temperatura
            </td>
            <td style={{padding: '0 16px', fontSize: '14px', color: 'var(--hp-text-2)'}}>
              há 3 h
            </td>
            <td style={{padding: '0 16px'}}>
              <span style={{display: 'inline-flex', alignItems: 'center', gap: '6px', height: '24px', padding: '0 10px', borderRadius: '12px', background: 'var(--hp-critico-bg)', color: 'var(--hp-critico)', fontSize: '12px', fontWeight: '600'}}>
                <span style={{width: '6px', height: '6px', borderRadius: '50%', background: 'var(--hp-critico)'}} />
                aberto
              </span>
            </td>
            <td style={{padding: '0 16px', textAlign: 'right'}}>
              <span style={{fontFamily: "'Material Symbols Outlined'", fontSize: '18px', lineHeight: '1', color: 'var(--hp-text-2)', cursor: 'pointer'}}>
                more_vert
              </span>
            </td>
          </tr>
          <tr style={{height: '52px', borderTop: '1px solid var(--hp-border)'}}>
            <td style={{padding: '0 16px'}}>
              <span style={{display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '600', color: 'var(--hp-atencao)'}}>
                <span style={{width: '6px', height: '6px', borderRadius: '50%', background: 'var(--hp-atencao)', display: 'inline-block'}} />
                atenção
              </span>
            </td>
            <td style={{padding: '0 16px', fontSize: '14px'}}>
              Umidade do solo abaixo do ideal — 22,4%, faixa 35–55%
            </td>
            <td style={{padding: '0 16px', fontSize: '14px', color: 'var(--hp-accent)', fontWeight: '600', cursor: 'pointer'}}>
              Lote C3
            </td>
            <td style={{padding: '0 16px', fontSize: '14px'}}>
              Umidade do solo
            </td>
            <td style={{padding: '0 16px', fontSize: '14px', color: 'var(--hp-text-2)'}}>
              há 6 h
            </td>
            <td style={{padding: '0 16px'}}>
              <span style={{display: 'inline-flex', alignItems: 'center', gap: '6px', height: '24px', padding: '0 10px', borderRadius: '12px', background: 'var(--hp-atencao-bg)', color: 'var(--hp-atencao)', fontSize: '12px', fontWeight: '600'}}>
                <span style={{width: '6px', height: '6px', borderRadius: '50%', background: 'var(--hp-atencao)'}} />
                em análise
              </span>
            </td>
            <td style={{padding: '0 16px', textAlign: 'right'}}>
              <span style={{fontFamily: "'Material Symbols Outlined'", fontSize: '18px', lineHeight: '1', color: 'var(--hp-text-2)', cursor: 'pointer'}}>
                more_vert
              </span>
            </td>
          </tr>
          <tr style={{height: '52px', borderTop: '1px solid var(--hp-border)'}}>
            <td style={{padding: '0 16px'}}>
              <span style={{display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '600', color: 'var(--hp-atencao)'}}>
                <span style={{width: '6px', height: '6px', borderRadius: '50%', background: 'var(--hp-atencao)', display: 'inline-block'}} />
                atenção
              </span>
            </td>
            <td style={{padding: '0 16px', fontSize: '14px'}}>
              Sensor IOT-003 com leituras instáveis
            </td>
            <td style={{padding: '0 16px', fontSize: '14px', color: 'var(--hp-accent)', fontWeight: '600', cursor: 'pointer'}}>
              Lote C3
            </td>
            <td style={{padding: '0 16px', fontSize: '14px', color: 'var(--hp-text-2)'}}>
              —
            </td>
            <td style={{padding: '0 16px', fontSize: '14px', color: 'var(--hp-text-2)'}}>
              há 4 h
            </td>
            <td style={{padding: '0 16px'}}>
              <span style={{display: 'inline-flex', alignItems: 'center', gap: '6px', height: '24px', padding: '0 10px', borderRadius: '12px', background: 'var(--hp-atencao-bg)', color: 'var(--hp-atencao)', fontSize: '12px', fontWeight: '600'}}>
                <span style={{width: '6px', height: '6px', borderRadius: '50%', background: 'var(--hp-atencao)'}} />
                em análise
              </span>
            </td>
            <td style={{padding: '0 16px', textAlign: 'right'}}>
              <span style={{fontFamily: "'Material Symbols Outlined'", fontSize: '18px', lineHeight: '1', color: 'var(--hp-text-2)', cursor: 'pointer'}}>
                more_vert
              </span>
            </td>
          </tr>
          <tr style={{height: '52px', borderTop: '1px solid var(--hp-border)'}}>
            <td style={{padding: '0 16px'}}>
              <span style={{display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '600', color: 'var(--hp-info)'}}>
                <span style={{width: '6px', height: '6px', borderRadius: '50%', background: 'var(--hp-info)', display: 'inline-block'}} />
                informação
              </span>
            </td>
            <td style={{padding: '0 16px', fontSize: '14px'}}>
              Janela de colheita se aproxima — 22/10
            </td>
            <td style={{padding: '0 16px', fontSize: '14px', color: 'var(--hp-accent)', fontWeight: '600', cursor: 'pointer'}} onClick={goLote}>
              Lote A1
            </td>
            <td style={{padding: '0 16px', fontSize: '14px', color: 'var(--hp-text-2)'}}>
              —
            </td>
            <td style={{padding: '0 16px', fontSize: '14px', color: 'var(--hp-text-2)'}}>
              há 1 d
            </td>
            <td style={{padding: '0 16px'}}>
              <span style={{display: 'inline-flex', alignItems: 'center', gap: '6px', height: '24px', padding: '0 10px', borderRadius: '12px', background: 'var(--hp-info-bg)', color: 'var(--hp-info)', fontSize: '12px', fontWeight: '600'}}>
                <span style={{width: '6px', height: '6px', borderRadius: '50%', background: 'var(--hp-info)'}} />
                informativo
              </span>
            </td>
            <td style={{padding: '0 16px', textAlign: 'right'}}>
              <span style={{fontFamily: "'Material Symbols Outlined'", fontSize: '18px', lineHeight: '1', color: 'var(--hp-text-2)', cursor: 'pointer'}}>
                more_vert
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    </>
  );
}
