// Gerado a partir do design aprovado no Claude Design (HarvestPoint.dc.html)
// e adaptado para React + TypeScript + Tailwind pelo pipeline de migração.
// Revise os TODOs antes de ligar em dados reais da API.
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getLote, type Lote } from '@/lib/api';

function formatDate(value: string | null) {
  if (!value) return '—';
  const [y, m, d] = value.split('-');
  if (!y || !m || !d) return value;
  return `${d}/${m}/${y}`;
}

export default function LoteDetalhePage() {

  const navigate = useNavigate();
  const { id } = useParams();
  const goLotes = () => navigate('/lotes');
  const [lote, setLote] = useState<Lote | null>(null);
  const [erro, setErro] = useState('');

  useEffect(() => {
    if (!id) return;
    getLote(id)
      .then(setLote)
      .catch(() => setErro('Lote não encontrado'));
  }, [id]);

  const titulo = lote ? `${lote.codigo} · ${lote.cultura} ${lote.variedade}` : 'Lote';
  const status = lote?.status === 'em_manejo' ? 'em manejo' : (lote?.status || '…');
  const subtitulo = lote
    ? `${lote.propriedade} · ${lote.area_ha} ha · plantio ${formatDate(lote.data_plantio)} · sensor ${lote.sensor_vinculado || '—'}`
    : (erro || 'Carregando…');

  return (
    <>
    <div style={{fontSize: '13px', fontWeight: '600', color: 'var(--hp-accent)', cursor: 'pointer'}} onClick={goLotes}>
      ‹ Lotes
    </div>
    <div style={{display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '24px'}}>
      <div>
        <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
          <h1 style={{margin: '0', fontFamily: "'Plus Jakarta Sans', Inter, sans-serif", fontSize: '28px', lineHeight: '34px', fontWeight: '700', letterSpacing: '-.01em'}}>
            {titulo}
          </h1>
          <span style={{display: 'inline-flex', alignItems: 'center', gap: '6px', height: '24px', padding: '0 10px', borderRadius: '12px', background: 'var(--hp-accent-soft)', color: 'var(--hp-accent)', fontSize: '12px', fontWeight: '600'}}>
            <span style={{width: '6px', height: '6px', borderRadius: '50%', background: 'var(--hp-accent)'}} />
            {status}
          </span>
        </div>
        <div style={{fontSize: '12px', color: 'var(--hp-text-2)', marginTop: '6px'}}>
          {subtitulo}
        </div>
      </div>
      <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
        <div style={{height: '40px', padding: '0 16px', display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--hp-surface)', border: '1px solid var(--hp-input-border)', borderRadius: '12px', fontSize: '13px', fontWeight: '600', cursor: 'pointer'}} onClick={goLotes}>
          <span style={{fontFamily: "'Material Symbols Outlined'", fontSize: '18px', lineHeight: '1'}}>
            edit
          </span>
          Editar
        </div>
        <span style={{fontFamily: "'Material Symbols Outlined'", fontSize: '20px', lineHeight: '1', color: 'var(--hp-text-2)', cursor: 'pointer'}}>
          more_vert
        </span>
      </div>
    </div>
    <div style={{background: 'var(--hp-critico-bg)', borderLeft: '3px solid var(--hp-critico)', borderRadius: '16px', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px'}}>
      <span style={{fontFamily: "'Material Symbols Outlined'", fontSize: '22px', lineHeight: '1', color: 'var(--hp-critico)'}}>
        warning
      </span>
      <div style={{fontSize: '14px', lineHeight: '20px', color: 'var(--hp-text)'}}>
        Estresse térmico há 3 h — 
        <span style={{fontWeight: '700'}}>
          31,9 °C
        </span>
        , limite da manga é 30 °C.
      </div>
    </div>
    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px'}}>
      <div style={{background: 'var(--hp-surface)', border: '1px solid var(--hp-border)', borderRadius: '16px', padding: '20px'}}>
        <div style={{fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-3)'}}>
          CICLO DA CULTURA
        </div>
        <div style={{height: '8px', borderRadius: '4px', background: 'var(--hp-surface-2)', marginTop: '14px'}}>
          <div style={{width: '82%', height: '8px', borderRadius: '4px', background: 'var(--hp-accent)'}} />
        </div>
        <div style={{display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: '10px'}}>
          <span style={{fontSize: '14px', fontWeight: '600'}}>
            dia 98 de 120
          </span>
          <span style={{fontSize: '12px', color: 'var(--hp-text-2)'}}>
            faltam ~22 dias
          </span>
        </div>
        <div style={{fontSize: '14px', color: 'var(--hp-text-4)', marginTop: '6px'}}>
          Colheita estimada 22/10 – 29/10
        </div>
      </div>
      <div style={{background: 'var(--hp-surface)', border: '1px solid var(--hp-border)', borderRadius: '16px', padding: '20px'}}>
        <div style={{fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-3)'}}>
          CONDIÇÕES AGORA
        </div>
        <div style={{display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '14px'}}>
          <div style={{display: 'grid', gridTemplateColumns: '1fr auto 84px', alignItems: 'center', gap: '12px'}}>
            <span style={{fontSize: '13px', color: 'var(--hp-text-4)'}}>
              Temperatura do ar
            </span>
            <span style={{fontSize: '20px', fontWeight: '700', fontVariantNumeric: 'tabular-nums', textAlign: 'right'}}>
              31,9 °C
            </span>
            <span style={{fontSize: '12px', fontWeight: '600', color: 'var(--hp-critico)', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px', whiteSpace: 'nowrap'}}>
              ▲ acima
            </span>
          </div>
          <div style={{display: 'grid', gridTemplateColumns: '1fr auto 84px', alignItems: 'center', gap: '12px'}}>
            <span style={{fontSize: '13px', color: 'var(--hp-text-4)'}}>
              Umidade do ar
            </span>
            <span style={{fontSize: '20px', fontWeight: '700', fontVariantNumeric: 'tabular-nums', textAlign: 'right'}}>
              58,0 %
            </span>
            <span style={{fontSize: '12px', fontWeight: '600', color: 'var(--hp-accent)', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px', whiteSpace: 'nowrap'}}>
              ✓ dentro
            </span>
          </div>
          <div style={{display: 'grid', gridTemplateColumns: '1fr auto 84px', alignItems: 'center', gap: '12px'}}>
            <span style={{fontSize: '13px', color: 'var(--hp-text-4)'}}>
              Umidade do solo
            </span>
            <span style={{fontSize: '20px', fontWeight: '700', fontVariantNumeric: 'tabular-nums', textAlign: 'right'}}>
              22,4 %
            </span>
            <span style={{fontSize: '12px', fontWeight: '600', color: 'var(--hp-atencao)', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px', whiteSpace: 'nowrap'}}>
              ▼ abaixo
            </span>
          </div>
          <div style={{display: 'grid', gridTemplateColumns: '1fr auto 84px', alignItems: 'center', gap: '12px'}}>
            <span style={{fontSize: '13px', color: 'var(--hp-text-4)'}}>
              Precipitação (24 h)
            </span>
            <span style={{fontSize: '20px', fontWeight: '700', fontVariantNumeric: 'tabular-nums', textAlign: 'right'}}>
              0,0 mm
            </span>
            <span style={{fontSize: '12px', fontWeight: '600', color: 'var(--hp-accent)', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px', whiteSpace: 'nowrap'}}>
              ✓ dentro
            </span>
          </div>
        </div>
      </div>
    </div>
    <div style={{display: 'flex', alignItems: 'center', gap: '24px', borderBottom: '1px solid var(--hp-border)'}}>
      <div style={{padding: '12px 2px', fontSize: '13px', fontWeight: '600', color: 'var(--hp-text)', borderBottom: '2px solid var(--hp-accent)'}}>
        Clima
      </div>
      <div style={{padding: '12px 2px', fontSize: '13px', fontWeight: '600', color: 'var(--hp-text-2)', cursor: 'pointer'}}>
        Leituras
      </div>
      <div style={{padding: '12px 2px', fontSize: '13px', fontWeight: '600', color: 'var(--hp-text-2)', cursor: 'pointer'}}>
        Alertas (4)
      </div>
      <div style={{padding: '12px 2px', fontSize: '13px', fontWeight: '600', color: 'var(--hp-text-2)', cursor: 'pointer'}}>
        Operações
      </div>
      <div style={{padding: '12px 2px', fontSize: '13px', fontWeight: '600', color: 'var(--hp-text-2)', cursor: 'pointer'}}>
        Histórico
      </div>
    </div>
    <div style={{background: 'var(--hp-surface)', border: '1px solid var(--hp-border)', borderRadius: '16px', padding: '20px'}}>
      <div style={{display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px'}}>
        <div>
          <div style={{fontFamily: "'Plus Jakarta Sans', Inter, sans-serif", fontSize: '16px', lineHeight: '22px', fontWeight: '600'}}>
            Evolução climática do lote
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: '16px', marginTop: '10px'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--hp-text-4)'}}>
              <span style={{width: '10px', height: '3px', background: 'var(--hp-temp)', display: 'block', borderRadius: '2px'}} />
              Temperatura
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--hp-text-4)'}}>
              <span style={{width: '10px', height: '3px', background: 'var(--hp-info)', display: 'block', borderRadius: '2px'}} />
              Umidade do ar
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--hp-text-4)'}}>
              <span style={{width: '10px', height: '3px', background: 'var(--hp-umid-solo)', display: 'block', borderRadius: '2px'}} />
              Umidade do solo
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--hp-text-4)'}}>
              <span style={{width: '10px', height: '3px', background: 'var(--hp-precip)', display: 'block', borderRadius: '2px'}} />
              Precipitação
            </div>
          </div>
        </div>
        <div style={{display: 'flex', gap: '4px', background: 'var(--hp-surface-2)', borderRadius: '12px', padding: '3px'}}>
          <div style={{padding: '6px 12px', borderRadius: '8px', background: 'var(--hp-surface)', fontSize: '12px', fontWeight: '600', boxShadow: '0 1px 2px rgba(22,21,15,.06)', cursor: 'pointer'}}>
            24 h
          </div>
          <div style={{padding: '6px 12px', borderRadius: '8px', fontSize: '12px', color: 'var(--hp-text-2)', cursor: 'pointer'}}>
            7 d
          </div>
          <div style={{padding: '6px 12px', borderRadius: '8px', fontSize: '12px', color: 'var(--hp-text-2)', cursor: 'pointer'}}>
            30 d
          </div>
        </div>
      </div>
      <svg viewBox="0 0 900 320" style={{width: '100%', height: '320px', marginTop: '12px', overflow: 'visible'}}>
        <rect x="40" y="140" width="820" height="100" fill="var(--hp-accent-band)" />
        <line x1="40" y1="40" x2="860" y2="40" stroke="var(--hp-border)" stroke-width="1" />
        <line x1="40" y1="90" x2="860" y2="90" stroke="var(--hp-border)" stroke-width="1" />
        <line x1="40" y1="190" x2="860" y2="190" stroke="var(--hp-border)" stroke-width="1" />
        <line x1="40" y1="240" x2="860" y2="240" stroke="var(--hp-border)" stroke-width="1" />
        <line x1="40" y1="140" x2="860" y2="140" stroke="var(--hp-accent)" stroke-width="1" stroke-dasharray="5 5" />
        <text x="44" y="133" style={{font: '600 12px Inter, sans-serif', fill: 'var(--hp-accent)'}}>
          limite manga 30 °C
        </text>
        <polyline points="40,215 108,218 176,220 244,222 312,225 380,228 448,231 516,234 584,232 652,229 720,226 788,224 856,221" fill="none" stroke="var(--hp-umid-solo)" stroke-width="2" stroke-dasharray="6 4" stroke-linejoin="round" />
        <polyline points="40,150 108,140 176,132 244,145 312,165 380,185 448,200 516,210 584,205 652,190 720,172 788,158 856,148" fill="none" stroke="var(--hp-info)" stroke-width="2" stroke-linejoin="round" />
        <polyline points="40,260 108,262 176,261 244,263 312,259 380,258 448,262 516,264 584,257 652,260 720,262 788,261 856,263" fill="none" stroke="var(--hp-precip)" stroke-width="2" stroke-linejoin="round" />
        <polyline points="40,200 108,207 176,203 244,183 312,157 380,130 448,110 516,95 584,90 652,100 720,120 788,147 856,170" fill="none" stroke="var(--hp-temp)" stroke-width="2.5" stroke-linejoin="round" />
        <polyline points="380,130 448,110 516,95 584,90 652,100 720,120" fill="none" stroke="var(--hp-critico)" stroke-width="3" stroke-linejoin="round" />
        <circle cx="584" cy="90" r="5" fill="var(--hp-critico)" stroke="var(--hp-surface)" stroke-width="2" />
        <text x="40" y="268" style={{font: '400 12px Inter, sans-serif', fill: 'var(--hp-text-2)'}}>
          04h
        </text>
        <text x="176" y="268" style={{font: '400 12px Inter, sans-serif', fill: 'var(--hp-text-2)'}}>
          08h
        </text>
        <text x="312" y="268" style={{font: '400 12px Inter, sans-serif', fill: 'var(--hp-text-2)'}}>
          12h
        </text>
        <text x="448" y="268" style={{font: '400 12px Inter, sans-serif', fill: 'var(--hp-text-2)'}}>
          16h
        </text>
        <text x="584" y="268" style={{font: '400 12px Inter, sans-serif', fill: 'var(--hp-text-2)'}}>
          20h
        </text>
        <text x="720" y="268" style={{font: '400 12px Inter, sans-serif', fill: 'var(--hp-text-2)'}}>
          00h
        </text>
      </svg>
      <div style={{fontSize: '12px', color: 'var(--hp-text-2)', borderTop: '1px solid var(--hp-border)', paddingTop: '12px'}}>
        Máxima de 33,0 °C às 13h · 4 h acima do limite · amplitude de 6,6 °C
      </div>
    </div>
    </>
  );
}
