// Gerado a partir do design aprovado no Claude Design (HarvestPoint.dc.html)
// e adaptado para React + TypeScript + Tailwind pelo pipeline de migração.
// Revise os TODOs antes de ligar em dados reais da API.
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { previsaoPropriedades } from '@/features/clima/data/previsaoMock';
import { OrigemPill } from '@/features/mercado/components/OrigemPill';
import { fmtNum } from '@/lib/uiHelpers';
import AutomacaoDashboardCard from '@/features/automacao/components/AutomacaoDashboardCard';

const DIAS_SEMANA = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
function formatDiaCurto(iso: string): string {
  const d = new Date(iso + 'T00:00:00');
  return DIAS_SEMANA[d.getDay()];
}

export default function DashboardPage() {

  const navigate = useNavigate();
  const goLotes = () => navigate('/lotes');
  const goLote = () => navigate('/lotes/A1');
  const goClima = () => navigate('/clima');
  const goExportacao = () => navigate('/inteligencia/exportacao');
  const previsao = previsaoPropriedades[0];
  const previsaoSemana = previsao.dias.slice(0, 7);
  const previsaoDiasRisco = previsaoSemana.filter((d) => d.temperaturaMax > previsao.faixaIdeal.max).length;
  const previsaoDiasRiscoLabels = previsaoSemana
    .filter((d) => d.temperaturaMax > previsao.faixaIdeal.max)
    .map((d, i) => (i === 0 && d.data === previsaoSemana[0].data ? 'hoje' : formatDiaCurto(d.data)))
    .join(', ');
  const [chips, setChips] = useState<{ label: string; onRemove: () => void }[]>([
    { label: 'Propriedade: Boa Vista', onRemove: () => setChips((cs) => cs.filter((c) => c.label !== 'Propriedade: Boa Vista')) },
  ]);
  const addChip = (label: string) =>
    setChips((cs) => [...cs, { label, onRemove: () => setChips((cs2) => cs2.filter((c) => c.label !== label)) }]);
  const addChipCultura = () => addChip('Cultura: Manga');
  const addChipLote = () => addChip('Lote: A1');
  const addChipSensor = () => addChip('Sensor: IOT-001');
  const [selectedPeriod, setSelectedPeriod] = useState('Hoje');
  const [periodMenuOpen, setPeriodMenuOpen] = useState(false);
  const togglePeriodMenu = () => setPeriodMenuOpen((v) => !v);
  const selectPeriodHoje = () => { setSelectedPeriod('Hoje'); setPeriodMenuOpen(false); };
  const selectPeriod7 = () => { setSelectedPeriod('7 dias'); setPeriodMenuOpen(false); };
  const selectPeriod30 = () => { setSelectedPeriod('30 dias'); setPeriodMenuOpen(false); };
  const exportIcon = 'download';
  const exportLabel = 'Exportar';
  const exportClick = () => {
    // TODO: substituir por exportação real (CSV) quando a API existir
    console.info('Exportar dashboard — ainda não ligado à API');
  };

  return (
    <>
    <div style={{display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '24px'}}>
      <div>
        <h1 style={{margin: '0', fontFamily: "'Plus Jakarta Sans', Inter, sans-serif", fontSize: '26px', lineHeight: '32px', fontWeight: '700', letterSpacing: '-.01em'}}>
          Dashboard Climático
        </h1>
        <div style={{fontSize: '12px', color: 'var(--hp-text-2)', marginTop: '4px'}}>
          Fazenda Boa Vista · Petrolina/PE · atualizado há 2 min
        </div>
      </div>
      <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
        <div style={{position: 'relative'}}>
          <div style={{height: '40px', padding: '0 14px', display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--hp-surface)', border: '1px solid var(--hp-input-border)', borderRadius: '12px', fontSize: '13px', fontWeight: '600', cursor: 'pointer'}} onClick={togglePeriodMenu}>
            {selectedPeriod}
            <span style={{fontFamily: "'Material Symbols Outlined'", fontSize: '18px', lineHeight: '1', color: 'var(--hp-text-2)'}}>
              expand_more
            </span>
          </div>
          {Boolean(periodMenuOpen) && (
            <React.Fragment>
            <div style={{position: 'absolute', top: '46px', left: '0', width: '160px', background: 'var(--hp-surface)', border: '1px solid var(--hp-border)', borderRadius: '12px', boxShadow: '0 8px 24px rgba(22,21,15,.12)', padding: '6px', zIndex: '20'}}>
              <div style={{padding: '10px 12px', borderRadius: '8px', fontSize: '13px', cursor: 'pointer'}} onClick={selectPeriodHoje}>
                Hoje
              </div>
              <div style={{padding: '10px 12px', borderRadius: '8px', fontSize: '13px', cursor: 'pointer'}} onClick={selectPeriod7}>
                7 dias
              </div>
              <div style={{padding: '10px 12px', borderRadius: '8px', fontSize: '13px', cursor: 'pointer'}} onClick={selectPeriod30}>
                30 dias
              </div>
            </div>
            </React.Fragment>
          )}
        </div>
        <div style={{height: '40px', padding: '0 14px', display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--hp-surface)', border: '1px solid var(--hp-input-border)', borderRadius: '12px', fontSize: '13px', fontWeight: '600', cursor: 'pointer'}} onClick={exportClick}>
          <span style={{fontFamily: "'Material Symbols Outlined'", fontSize: '18px', lineHeight: '1'}}>
            {exportIcon}
          </span>
          {exportLabel}
        </div>
      </div>
    </div>
    <div style={{display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap'}}>
      {(chips || []).map((c, __i) => (
        <React.Fragment key={__i}>
          <div style={{height: '32px', padding: '0 12px', display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--hp-accent-soft)', border: '1px solid var(--hp-sucesso-border)', borderRadius: '22px', fontSize: '12px', fontWeight: '600', color: 'var(--hp-accent-hover)'}}>
            {c.label}
            <span style={{fontFamily: "'Material Symbols Outlined'", fontSize: '16px', lineHeight: '1', cursor: 'pointer'}} onClick={c.onRemove}>
              close
            </span>
          </div>
        </React.Fragment>
      ))}
      <div style={{height: '32px', padding: '0 12px', display: 'flex', alignItems: 'center', background: 'transparent', border: '1px dashed var(--hp-input-border)', borderRadius: '22px', fontSize: '12px', color: 'var(--hp-text-2)', cursor: 'pointer'}} onClick={addChipCultura}>
        + Cultura
      </div>
      <div style={{height: '32px', padding: '0 12px', display: 'flex', alignItems: 'center', background: 'transparent', border: '1px dashed var(--hp-input-border)', borderRadius: '22px', fontSize: '12px', color: 'var(--hp-text-2)', cursor: 'pointer'}} onClick={addChipLote}>
        + Lote
      </div>
      <div style={{height: '32px', padding: '0 12px', display: 'flex', alignItems: 'center', background: 'transparent', border: '1px dashed var(--hp-input-border)', borderRadius: '22px', fontSize: '12px', color: 'var(--hp-text-2)', cursor: 'pointer'}} onClick={addChipSensor}>
        + Sensor
      </div>
    </div>
    <div style={{background: 'var(--hp-critico-bg)', borderLeft: '3px solid var(--hp-critico)', borderRadius: 'var(--hp-radius)', padding: 'var(--hp-pad)', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '24px'}}>
      <div style={{display: 'flex', gap: '14px'}}>
        <span style={{fontFamily: "'Material Symbols Outlined'", fontSize: '24px', lineHeight: '1', color: 'var(--hp-critico)'}}>
          warning
        </span>
        <div>
          <div style={{fontFamily: "'Plus Jakarta Sans', Inter, sans-serif", fontSize: '16px', lineHeight: '22px', fontWeight: '700', color: 'var(--hp-text)'}}>
            2 lotes em estresse térmico agora
          </div>
          <div style={{fontSize: '14px', lineHeight: '20px', color: 'var(--hp-text-4)', marginTop: '4px', maxWidth: '720px'}}>
            Lote A1 (Manga) está 1,9 °C acima do limite há 3 h. A janela de colheita recomendada começa em 6 dias.
          </div>
        </div>
      </div>
      <div style={{display: 'flex', alignItems: 'center', gap: '10px', flex: '0 0 auto'}}>
        <div style={{height: '40px', padding: '0 16px', display: 'flex', alignItems: 'center', background: 'var(--hp-accent)', color: '#FFFFFF', borderRadius: '12px', fontSize: '13px', fontWeight: '600', cursor: 'pointer'}} onClick={goLote}>
          Ver Lote A1
        </div>
        <div style={{height: '40px', padding: '0 16px', display: 'flex', alignItems: 'center', background: 'var(--hp-surface)', border: '1px solid var(--hp-input-border)', borderRadius: '12px', fontSize: '13px', fontWeight: '600', cursor: 'pointer'}}>
          Ver alertas
        </div>
      </div>
    </div>
    <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 'var(--hp-gap)'}}>
      <div style={{height: '168px', background: 'var(--hp-surface)', border: '1px solid var(--hp-border)', borderRadius: 'var(--hp-radius)', padding: 'var(--hp-pad)', display: 'flex', flexDirection: 'column'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
          <span style={{width: '8px', height: '8px', borderRadius: '50%', background: 'var(--hp-critico)', display: 'block'}} />
          <span style={{fontSize: '13px', lineHeight: '16px', fontWeight: '600'}}>
            Temperatura do ar
          </span>
        </div>
        <div style={{display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '8px'}}>
          <span style={{fontSize: '40px', lineHeight: '44px', fontWeight: '700', letterSpacing: '-.02em'}}>
            31,9
          </span>
          <span style={{fontSize: '12px', color: 'var(--hp-text-2)'}}>
            °C
          </span>
        </div>
        <div style={{fontSize: '12px', fontWeight: '600', color: 'var(--hp-critico)', marginTop: '2px'}}>
          ▲ 1,9 °C acima do ideal
        </div>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', marginTop: 'auto'}}>
          <svg viewBox="0 0 120 24" style={{width: '120px', height: '24px'}} preserveAspectRatio="none">
            <polyline points="2,18 12,19 24,17 36,13 48,9 60,5 72,3 84,6 96,10 108,14 118,16" fill="none" stroke="var(--hp-temp)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" />
          </svg>
          <span style={{fontSize: '12px', color: 'var(--hp-text-2)'}}>
            ideal ≤ 30 °C
          </span>
        </div>
        <div style={{fontSize: '12px', color: 'var(--hp-text-2)', marginTop: '8px'}}>
          máx. 33,0 · mín. 26,4 · há 2 min
        </div>
      </div>
      <div style={{height: '168px', background: 'var(--hp-surface)', border: '1px solid var(--hp-border)', borderRadius: 'var(--hp-radius)', padding: 'var(--hp-pad)', display: 'flex', flexDirection: 'column'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
          <span style={{width: '8px', height: '8px', borderRadius: '50%', background: 'var(--hp-accent)', display: 'block'}} />
          <span style={{fontSize: '13px', lineHeight: '16px', fontWeight: '600'}}>
            Umidade do ar
          </span>
        </div>
        <div style={{display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '8px'}}>
          <span style={{fontSize: '40px', lineHeight: '44px', fontWeight: '700', letterSpacing: '-.02em'}}>
            73,4
          </span>
          <span style={{fontSize: '12px', color: 'var(--hp-text-2)'}}>
            %
          </span>
        </div>
        <div style={{fontSize: '12px', fontWeight: '600', color: 'var(--hp-accent-hover)', marginTop: '2px'}}>
          ✓ dentro da faixa
        </div>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', marginTop: 'auto'}}>
          <svg viewBox="0 0 120 24" style={{width: '120px', height: '24px'}} preserveAspectRatio="none">
            <polyline points="2,14 12,11 24,9 36,13 48,17 60,20 72,18 84,14 96,11 108,9 118,10" fill="none" stroke="var(--hp-info)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" />
          </svg>
          <span style={{fontSize: '12px', color: 'var(--hp-text-2)'}}>
            ideal 60–80 %
          </span>
        </div>
        <div style={{fontSize: '12px', color: 'var(--hp-text-2)', marginTop: '8px'}}>
          máx. 78,1 · mín. 57,7 · há 2 min
        </div>
      </div>
      <div style={{height: '168px', background: 'var(--hp-surface)', border: '1px solid var(--hp-border)', borderRadius: 'var(--hp-radius)', padding: 'var(--hp-pad)', display: 'flex', flexDirection: 'column'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
          <span style={{width: '8px', height: '8px', borderRadius: '50%', background: 'var(--hp-atencao)', display: 'block'}} />
          <span style={{fontSize: '13px', lineHeight: '16px', fontWeight: '600'}}>
            Umidade do solo
          </span>
        </div>
        <div style={{display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '8px'}}>
          <span style={{fontSize: '40px', lineHeight: '44px', fontWeight: '700', letterSpacing: '-.02em'}}>
            43,8
          </span>
          <span style={{fontSize: '12px', color: 'var(--hp-text-2)'}}>
            %
          </span>
        </div>
        <div style={{fontSize: '12px', fontWeight: '600', color: 'var(--hp-atencao)', marginTop: '2px'}}>
          ▼ abaixo do ideal
        </div>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', marginTop: 'auto'}}>
          <svg viewBox="0 0 120 24" style={{width: '120px', height: '24px'}} preserveAspectRatio="none">
            <polyline points="2,8 12,9 24,11 36,12 48,14 60,15 72,17 84,18 96,19 108,20 118,21" fill="none" stroke="var(--hp-umid-solo)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" />
          </svg>
          <span style={{fontSize: '12px', color: 'var(--hp-text-2)'}}>
            ideal ≥ 50 %
          </span>
        </div>
        <div style={{fontSize: '12px', color: 'var(--hp-text-2)', marginTop: '8px'}}>
          máx. 64,9 · mín. 36,9 · há 2 min
        </div>
      </div>
      <div style={{height: '168px', background: 'var(--hp-surface)', border: '1px solid var(--hp-border)', borderRadius: 'var(--hp-radius)', padding: 'var(--hp-pad)', display: 'flex', flexDirection: 'column'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
          <span style={{width: '8px', height: '8px', borderRadius: '50%', background: 'var(--hp-accent)', display: 'block'}} />
          <span style={{fontSize: '13px', lineHeight: '16px', fontWeight: '600'}}>
            Rede de sensores
          </span>
        </div>
        <div style={{display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '8px'}}>
          <span style={{fontSize: '40px', lineHeight: '44px', fontWeight: '700', letterSpacing: '-.02em'}}>
            2 de 2
          </span>
          <span style={{fontSize: '12px', color: 'var(--hp-text-2)'}}>
            on-line
          </span>
        </div>
        <div style={{fontSize: '12px', fontWeight: '600', color: 'var(--hp-accent-hover)', marginTop: '2px'}}>
          ✓ rede estável
        </div>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', marginTop: 'auto'}}>
          <span style={{fontSize: '12px', color: 'var(--hp-text-2)'}}>
            12 leituras nas últimas 24 h
          </span>
        </div>
        <div style={{fontSize: '12px', color: 'var(--hp-text-2)', marginTop: '8px'}}>
          intervalo de 60 min
        </div>
      </div>
    </div>
    <div style={{display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--hp-gap)', alignItems: 'start'}}>
      <div style={{background: 'var(--hp-surface)', border: '1px solid var(--hp-border)', borderRadius: 'var(--hp-radius)', padding: 'var(--hp-pad)'}}>
        <div style={{display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px'}}>
          <div>
            <div style={{fontFamily: "'Plus Jakarta Sans', Inter, sans-serif", fontSize: '16px', lineHeight: '22px', fontWeight: '600'}}>
              Evolução climática
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: '16px', marginTop: '10px'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--hp-text-4)', cursor: 'pointer'}}>
                <span style={{width: '10px', height: '3px', background: 'var(--hp-temp)', display: 'block', borderRadius: '2px'}} />
                Temperatura
              </div>
              <div style={{display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--hp-text-4)', cursor: 'pointer'}}>
                <span style={{width: '10px', height: '3px', background: 'var(--hp-info)', display: 'block', borderRadius: '2px'}} />
                Umidade do ar
              </div>
              <div style={{display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--hp-text-4)', cursor: 'pointer'}}>
                <span style={{width: '10px', height: '3px', background: 'var(--hp-umid-solo)', display: 'block', borderRadius: '2px'}} />
                Umidade do solo
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
          <line x1="40" y1="140" x2="860" y2="140" stroke="var(--hp-critico)" stroke-width="1" stroke-dasharray="4 4" />
          <text x="44" y="133" style={{font: '600 12px Inter, sans-serif', fill: 'var(--hp-critico)'}}>
            limite manga 30 °C
          </text>
          <polyline points="40,215 108,218 176,220 244,222 312,225 380,228 448,231 516,234 584,232 652,229 720,226 788,224 856,221" fill="none" stroke="var(--hp-umid-solo)" stroke-width="2" stroke-dasharray="6 4" stroke-linejoin="round" />
          <polyline points="40,150 108,140 176,132 244,145 312,165 380,185 448,200 516,210 584,205 652,190 720,172 788,158 856,148" fill="none" stroke="var(--hp-info)" stroke-width="2" stroke-linejoin="round" />
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
      <div style={{display: 'flex', flexDirection: 'column', gap: 'var(--hp-gap)'}}>
      <div style={{background: 'var(--hp-surface)', border: '1px solid var(--hp-border)', borderRadius: 'var(--hp-radius)', padding: 'var(--hp-pad)'}}>
        <div style={{fontFamily: "'Plus Jakarta Sans', Inter, sans-serif", fontSize: '16px', lineHeight: '22px', fontWeight: '600'}}>
          Alertas ativos (2)
        </div>
        <div style={{display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '14px'}}>
          <div style={{border: '1px solid var(--hp-border)', borderLeft: '3px solid var(--hp-critico)', borderRadius: '12px', padding: '14px'}}>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
              <span style={{fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-critico)'}}>
                CRÍTICO
              </span>
              <span style={{fontSize: '12px', color: 'var(--hp-text-2)'}}>
                há 3 h
              </span>
            </div>
            <div style={{fontSize: '14px', fontWeight: '600', marginTop: '6px'}}>
              Lote A1 · Manga
            </div>
            <div style={{fontSize: '12px', color: 'var(--hp-text-2)', marginTop: '2px'}}>
              31,9 °C · limite 30,0 °C
            </div>
            <div style={{marginTop: '10px', fontSize: '12px', fontWeight: '600', color: 'var(--hp-accent-hover)', cursor: 'pointer'}} onClick={goLote}>
              Abrir lote ›
            </div>
          </div>
          <div style={{border: '1px solid var(--hp-border)', borderLeft: '3px solid var(--hp-atencao)', borderRadius: '12px', padding: '14px'}}>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
              <span style={{fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-atencao)'}}>
                ATENÇÃO
              </span>
              <span style={{fontSize: '12px', color: 'var(--hp-text-2)'}}>
                há 1 h
              </span>
            </div>
            <div style={{fontSize: '14px', fontWeight: '600', marginTop: '6px'}}>
              Lote B2 · Uva
            </div>
            <div style={{fontSize: '12px', color: 'var(--hp-text-2)', marginTop: '2px'}}>
              29,9 °C · limite 28,0 °C
            </div>
            <div style={{marginTop: '10px', fontSize: '12px', fontWeight: '600', color: 'var(--hp-accent-hover)', cursor: 'pointer'}}>
              Abrir lote ›
            </div>
          </div>
        </div>
      </div>
        <AutomacaoDashboardCard />
      </div>
    </div>
    <div>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <div style={{fontFamily: "'Plus Jakarta Sans', Inter, sans-serif", fontSize: '20px', lineHeight: '28px', fontWeight: '700'}}>
          Lotes monitorados (3)
        </div>
        <div style={{fontSize: '12px', fontWeight: '600', color: 'var(--hp-accent-hover)', cursor: 'pointer'}} onClick={goLotes}>
          Ver todos os lotes ›
        </div>
      </div>
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 'var(--hp-gap)', marginTop: '14px'}}>
        <div style={{background: 'var(--hp-surface)', border: '1px solid var(--hp-border)', borderRadius: 'var(--hp-radius)', padding: 'var(--hp-pad)'}}>
          <div style={{display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between'}}>
            <div>
              <div style={{fontFamily: "'Plus Jakarta Sans', Inter, sans-serif", fontSize: '16px', lineHeight: '22px', fontWeight: '600'}}>
                Lote A1 · Manga
              </div>
              <div style={{fontSize: '12px', color: 'var(--hp-text-2)', marginTop: '2px'}}>
                Tommy Atkins · 120 ha
              </div>
            </div>
            <span style={{fontFamily: "'Material Symbols Outlined'", fontSize: '20px', lineHeight: '1', color: 'var(--hp-critico)'}}>
              warning
            </span>
          </div>
          <div style={{display: 'flex', gap: 'var(--hp-gap)', marginTop: '16px'}}>
            <div>
              <div style={{fontSize: '20px', lineHeight: '26px', fontWeight: '700'}}>
                31,9 
                <span style={{fontSize: '12px', color: 'var(--hp-text-2)', fontWeight: '400'}}>
                  °C
                </span>
              </div>
              <div style={{fontSize: '12px', color: 'var(--hp-text-2)'}}>
                temperatura
              </div>
            </div>
            <div>
              <div style={{fontSize: '20px', lineHeight: '26px', fontWeight: '700'}}>
                73,4 
                <span style={{fontSize: '12px', color: 'var(--hp-text-2)', fontWeight: '400'}}>
                  %
                </span>
              </div>
              <div style={{fontSize: '12px', color: 'var(--hp-text-2)'}}>
                umidade do ar
              </div>
            </div>
            <div>
              <div style={{fontSize: '20px', lineHeight: '26px', fontWeight: '700'}}>
                43,8 
                <span style={{fontSize: '12px', color: 'var(--hp-text-2)', fontWeight: '400'}}>
                  %
                </span>
              </div>
              <div style={{fontSize: '12px', color: 'var(--hp-text-2)'}}>
                umidade do solo
              </div>
            </div>
          </div>
          <div style={{height: '6px', borderRadius: '3px', background: 'var(--hp-surface-2)', marginTop: '18px', overflow: 'hidden'}}>
            <div style={{width: '82%', height: '6px', background: 'var(--hp-accent)'}} />
          </div>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px', fontSize: '12px', color: 'var(--hp-text-2)'}}>
            <span>
              ciclo 82 %
            </span>
            <span>
              colheita em ~22 dias
            </span>
          </div>
        </div>
        <div style={{background: 'var(--hp-surface)', border: '1px solid var(--hp-border)', borderRadius: 'var(--hp-radius)', padding: 'var(--hp-pad)'}}>
          <div style={{display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between'}}>
            <div>
              <div style={{fontFamily: "'Plus Jakarta Sans', Inter, sans-serif", fontSize: '16px', lineHeight: '22px', fontWeight: '600'}}>
                Lote B2 · Uva
              </div>
              <div style={{fontSize: '12px', color: 'var(--hp-text-2)', marginTop: '2px'}}>
                Itália · 85 ha
              </div>
            </div>
            <span style={{fontFamily: "'Material Symbols Outlined'", fontSize: '20px', lineHeight: '1', color: 'var(--hp-atencao)'}}>
              error_outline
            </span>
          </div>
          <div style={{display: 'flex', gap: 'var(--hp-gap)', marginTop: '16px'}}>
            <div>
              <div style={{fontSize: '20px', lineHeight: '26px', fontWeight: '700'}}>
                29,9 
                <span style={{fontSize: '12px', color: 'var(--hp-text-2)', fontWeight: '400'}}>
                  °C
                </span>
              </div>
              <div style={{fontSize: '12px', color: 'var(--hp-text-2)'}}>
                temperatura
              </div>
            </div>
            <div>
              <div style={{fontSize: '20px', lineHeight: '26px', fontWeight: '700'}}>
                72,4 
                <span style={{fontSize: '12px', color: 'var(--hp-text-2)', fontWeight: '400'}}>
                  %
                </span>
              </div>
              <div style={{fontSize: '12px', color: 'var(--hp-text-2)'}}>
                umidade do ar
              </div>
            </div>
            <div>
              <div style={{fontSize: '20px', lineHeight: '26px', fontWeight: '700'}}>
                48,3 
                <span style={{fontSize: '12px', color: 'var(--hp-text-2)', fontWeight: '400'}}>
                  %
                </span>
              </div>
              <div style={{fontSize: '12px', color: 'var(--hp-text-2)'}}>
                umidade do solo
              </div>
            </div>
          </div>
          <div style={{height: '6px', borderRadius: '3px', background: 'var(--hp-surface-2)', marginTop: '18px', overflow: 'hidden'}}>
            <div style={{width: '61%', height: '6px', background: 'var(--hp-accent)'}} />
          </div>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px', fontSize: '12px', color: 'var(--hp-text-2)'}}>
            <span>
              ciclo 61 %
            </span>
            <span>
              colheita em ~58 dias
            </span>
          </div>
        </div>
        <div style={{background: 'var(--hp-surface)', border: '1px solid var(--hp-border)', borderRadius: 'var(--hp-radius)', padding: 'var(--hp-pad)'}}>
          <div style={{display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between'}}>
            <div>
              <div style={{fontFamily: "'Plus Jakarta Sans', Inter, sans-serif", fontSize: '16px', lineHeight: '22px', fontWeight: '600'}}>
                Lote C3 · Uva
              </div>
              <div style={{fontSize: '12px', color: 'var(--hp-text-2)', marginTop: '2px'}}>
                Crimson Seedless · 45 ha
              </div>
            </div>
            <span style={{fontFamily: "'Material Symbols Outlined'", fontSize: '20px', lineHeight: '1', color: 'var(--hp-accent-hover)'}}>
              check_circle
            </span>
          </div>
          <div style={{display: 'flex', gap: 'var(--hp-gap)', marginTop: '16px'}}>
            <div>
              <div style={{fontSize: '20px', lineHeight: '26px', fontWeight: '700'}}>
                27,4 
                <span style={{fontSize: '12px', color: 'var(--hp-text-2)', fontWeight: '400'}}>
                  °C
                </span>
              </div>
              <div style={{fontSize: '12px', color: 'var(--hp-text-2)'}}>
                temperatura
              </div>
            </div>
            <div>
              <div style={{fontSize: '20px', lineHeight: '26px', fontWeight: '700'}}>
                66,1 
                <span style={{fontSize: '12px', color: 'var(--hp-text-2)', fontWeight: '400'}}>
                  %
                </span>
              </div>
              <div style={{fontSize: '12px', color: 'var(--hp-text-2)'}}>
                umidade do ar
              </div>
            </div>
            <div>
              <div style={{fontSize: '20px', lineHeight: '26px', fontWeight: '700'}}>
                58,9 
                <span style={{fontSize: '12px', color: 'var(--hp-text-2)', fontWeight: '400'}}>
                  %
                </span>
              </div>
              <div style={{fontSize: '12px', color: 'var(--hp-text-2)'}}>
                umidade do solo
              </div>
            </div>
          </div>
          <div style={{height: '6px', borderRadius: '3px', background: 'var(--hp-surface-2)', marginTop: '18px', overflow: 'hidden'}}>
            <div style={{width: '24%', height: '6px', background: 'var(--hp-accent)'}} />
          </div>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px', fontSize: '12px', color: 'var(--hp-text-2)'}}>
            <span>
              ciclo 24 %
            </span>
            <span>
              colheita em ~114 dias
            </span>
          </div>
        </div>
      </div>
    </div>
    <div style={{display: 'grid', gridTemplateColumns: 'minmax(0,2fr) minmax(0,1fr)', gap: 'var(--hp-gap)'}}>
      <div style={{background: 'var(--hp-surface)', border: '1px solid var(--hp-border)', borderRadius: 'var(--hp-radius)', padding: 'var(--hp-pad)', display: 'flex', flexDirection: 'column', gap: '14px'}}>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px'}}>
          <div>
            <div style={{fontFamily: "'Plus Jakarta Sans', Inter, sans-serif", fontSize: '16px', fontWeight: '700'}}>
              Previsão regional · 7 dias
            </div>
            <div style={{fontSize: '12px', color: 'var(--hp-text-2)', marginTop: '2px'}}>
              Open-Meteo · Petrolina/PE · atualizado há 12 min
            </div>
          </div>
          <span style={{fontSize: '13px', fontWeight: '600', color: 'var(--hp-accent-hover)', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', whiteSpace: 'nowrap'}} onClick={goClima}>
            Abrir clima regional
            <span style={{fontFamily: "'Material Symbols Outlined'", fontSize: '18px', lineHeight: '1'}}>arrow_forward</span>
          </span>
        </div>
        {previsaoDiasRisco > 0 ? (
          <div style={{display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: 'var(--hp-radius-sm)', background: 'var(--hp-atencao-bg)', color: 'var(--hp-atencao)', fontSize: '13px', fontWeight: '600'}}>
            <span style={{fontFamily: "'Material Symbols Outlined'", fontSize: '18px', lineHeight: '1'}}>thermostat</span>
            {previsaoDiasRisco} {previsaoDiasRisco > 1 ? 'dias' : 'dia'} acima de {previsao.faixaIdeal.max} °C nesta semana: {previsaoDiasRiscoLabels}.
          </div>
        ) : (
          <div style={{display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: 'var(--hp-radius-sm)', background: 'var(--hp-accent-soft)', color: 'var(--hp-accent-hover)', fontSize: '13px', fontWeight: '600'}}>
            <span style={{fontFamily: "'Material Symbols Outlined'", fontSize: '18px', lineHeight: '1'}}>check_circle</span>
            Sem dias acima de {previsao.faixaIdeal.max} °C nesta semana.
          </div>
        )}
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0,1fr))', gap: '6px'}}>
          {previsaoSemana.map((d, i) => {
            const risco = d.temperaturaMax > previsao.faixaIdeal.max;
            const chuvaForte = d.chanceChuvaPercentual >= 50;
            return (
              <div
                key={d.data}
                style={{
                  borderRadius: 'var(--hp-radius-sm)',
                  background: risco ? 'var(--hp-critico-bg)' : 'var(--hp-surface-2)',
                  padding: '10px 6px',
                  textAlign: 'center',
                  borderTop: risco ? '3px solid var(--hp-critico)' : '3px solid transparent',
                }}
              >
                <div style={{fontSize: '12px', fontWeight: '700'}}>{i === 0 ? 'Hoje' : formatDiaCurto(d.data)}</div>
                <div style={{fontSize: '15px', fontWeight: '700', fontVariantNumeric: 'tabular-nums', marginTop: '4px', color: risco ? 'var(--hp-critico)' : 'var(--hp-text)'}}>
                  {fmtNum(d.temperaturaMax, 0)}°
                </div>
                <div style={{fontSize: '12px', color: 'var(--hp-text-2)', fontVariantNumeric: 'tabular-nums'}}>{fmtNum(d.temperaturaMin, 0)}°</div>
                <div style={{fontSize: '12px', color: 'var(--hp-info)', marginTop: '4px', fontWeight: chuvaForte ? '700' : '400', fontVariantNumeric: 'tabular-nums'}}>
                  {d.chanceChuvaPercentual} %
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{background: 'var(--hp-surface)', border: '1px solid var(--hp-border)', borderRadius: 'var(--hp-radius)', padding: 'var(--hp-pad)', display: 'flex', flexDirection: 'column', gap: '10px'}}>
        <div style={{fontFamily: "'Plus Jakarta Sans', Inter, sans-serif", fontSize: '16px', fontWeight: '700'}}>
          Mercado
        </div>
        <div style={{fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-3)'}}>
          MANGA · UNIÃO EUROPEIA
        </div>
        <div style={{display: 'flex', alignItems: 'baseline', gap: '6px'}}>
          <span style={{fontFamily: "'Plus Jakarta Sans', Inter, sans-serif", fontSize: '28px', fontWeight: '700', fontVariantNumeric: 'tabular-nums'}}>EUR 2,80</span>
          <span style={{fontSize: '12px', color: 'var(--hp-text-2)'}}>/kg</span>
        </div>
        <div style={{fontSize: '12px', fontWeight: '600', color: 'var(--hp-accent-hover)'}}>▲ 2,1 % no mês</div>
        <OrigemPill oficial label="PROHORT/Conab · 12/09" />
        <div style={{display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '8px', paddingTop: '10px', marginTop: '2px', borderTop: '1px solid var(--hp-border)', fontSize: '13px'}}>
          <span style={{color: 'var(--hp-text-2)'}}>Uva · EUA</span>
          <span style={{fontWeight: '600', fontVariantNumeric: 'tabular-nums'}}>USD 3,20 <span style={{color: 'var(--hp-text-2)'}}>▬ estável</span></span>
        </div>
        <div style={{fontSize: '13px', fontWeight: '600', color: 'var(--hp-accent-hover)', cursor: 'pointer', marginTop: 'auto'}} onClick={goExportacao}>
          Melhor semana para embarque: 12–18/10 ›
        </div>
      </div>
    </div>
    </>
  );
}
