// Gerado a partir do design aprovado no Claude Design (HarvestPoint.dc.html)
// e adaptado para React + TypeScript + Tailwind pelo pipeline de migração.
// Revise os TODOs antes de ligar em dados reais da API.
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PrevisaoRegua from '@/features/clima/components/PrevisaoRegua';
import { previsaoPropriedades } from '@/features/clima/data/previsaoMock';

type LoteTab = 'clima' | 'leituras' | 'alertas' | 'operacoes' | 'historico' | 'previsao';

const TABS: { key: LoteTab; label: string }[] = [
  { key: 'clima', label: 'Clima' },
  { key: 'previsao', label: 'Previsão' },
  { key: 'leituras', label: 'Leituras' },
  { key: 'alertas', label: 'Alertas (2)' },
  { key: 'operacoes', label: 'Operações' },
  { key: 'historico', label: 'Histórico' },
];

export default function LoteDetalhePage() {

  const navigate = useNavigate();
  const goLotes = () => navigate('/lotes');
  const [activeTab, setActiveTab] = useState<LoteTab>('clima');
  // TODO: trocar pela propriedade real do lote quando o backend existir —
  // por ora, o Lote A1 pertence à Fazenda Boa Vista (mesma faixa ideal de
  // manga já usada no restante desta tela).
  const previsao = previsaoPropriedades[0];

  // TODO: mocks tipados desta rodada — substituir pelos endpoints reais
  // (recomendação agroclimática, leituras do sensor do lote, alertas do
  // lote, histórico de manejo e de safras) quando o backend existir.
  const oQueFazer: { icone: string; cor: string; texto: string }[] = [
    { icone: 'water_drop', cor: 'var(--hp-critico)', texto: 'Antecipar irrigação para 5h hoje e quarta — solo em 22,4 %.' },
    { icone: 'pause_circle', cor: 'var(--hp-atencao)', texto: 'Suspender irrigação qui–sex; chuva prevista de 18 mm.' },
    { icone: 'event_available', cor: 'var(--hp-text-2)', texto: 'Colheita estimada 22/10–29/10 segue mantida.' },
  ];
  const leiturasLote: { hora: string; valor: string; seta: string; cor: string }[] = [
    { hora: '09h04', valor: '31,9 °C', seta: '▲', cor: 'var(--hp-critico)' },
    { hora: '08h54', valor: '30,6 °C', seta: '▲', cor: 'var(--hp-atencao)' },
    { hora: '08h44', valor: '29,8 °C', seta: '', cor: 'var(--hp-text)' },
  ];
  const alertasLote: { titulo: string; tempo: string; acao: string; cor: string }[] = [
    { titulo: 'Estresse térmico', tempo: 'há 3 h', acao: '31,9 °C · limite 30,0 °C — considerar irrigação de alívio', cor: 'var(--hp-critico)' },
    { titulo: 'Solo abaixo da faixa', tempo: 'há 6 h', acao: '22,4 % · ideal ≥ 50 % — antecipar próxima irrigação', cor: 'var(--hp-atencao)' },
  ];
  const operacoesLote: { acao: string; data: string }[] = [
    { acao: 'Irrigação 4 h', data: '28/09' },
    { acao: 'Adubação K', data: '22/09' },
    { acao: 'Indução floral', data: '10/07' },
  ];
  const historicoLote: { label: string; valor: string }[] = [
    { label: 'Safra 2025', valor: '19,6 t/ha' },
    { label: 'Safra 2024', valor: '18,2 t/ha' },
    { label: 'Perda média', valor: '6,4 %' },
  ];

  return (
    <>
    <div style={{fontSize: '13px', fontWeight: '600', color: 'var(--hp-accent-hover)', cursor: 'pointer'}} onClick={goLotes}>
      ‹ Lotes
    </div>
    <div style={{display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '24px'}}>
      <div>
        <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
          <h1 style={{margin: '0', fontFamily: "'Plus Jakarta Sans', Inter, sans-serif", fontSize: '26px', lineHeight: '32px', fontWeight: '700', letterSpacing: '-.01em'}}>
            Lote A1 · Manga Tommy Atkins
          </h1>
          <span style={{display: 'inline-flex', alignItems: 'center', gap: '6px', height: '24px', padding: '0 10px', borderRadius: '12px', background: 'var(--hp-accent-soft)', color: 'var(--hp-accent-hover)', fontSize: '12px', fontWeight: '600'}}>
            <span style={{width: '6px', height: '6px', borderRadius: '50%', background: 'var(--hp-accent)'}} />
            ativo
          </span>
        </div>
        <div style={{fontSize: '12px', color: 'var(--hp-text-2)', marginTop: '6px'}}>
          Fazenda Boa Vista · 120 ha · plantio 15/03/2024 · sensor IOT-001 · ciclo dia 98 de 120
        </div>
      </div>
      <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
        <div style={{height: '40px', padding: '0 16px', display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--hp-surface)', border: '1px solid var(--hp-input-border)', borderRadius: '12px', fontSize: '13px', fontWeight: '600', cursor: 'pointer'}}>
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
    <div style={{background: 'var(--hp-critico-bg)', borderLeft: '3px solid var(--hp-critico)', borderRadius: 'var(--hp-radius)', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px'}}>
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
    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--hp-gap)'}}>
      <div style={{background: 'var(--hp-surface)', border: '1px solid var(--hp-border)', borderRadius: 'var(--hp-radius)', padding: 'var(--hp-pad)'}}>
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
      <div style={{background: 'var(--hp-surface)', border: '1px solid var(--hp-border)', borderRadius: 'var(--hp-radius)', padding: 'var(--hp-pad)'}}>
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
            <span style={{fontSize: '12px', fontWeight: '600', color: 'var(--hp-accent-hover)', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px', whiteSpace: 'nowrap'}}>
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
            <span style={{fontSize: '12px', fontWeight: '600', color: 'var(--hp-accent-hover)', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px', whiteSpace: 'nowrap'}}>
              ✓ dentro
            </span>
          </div>
        </div>
      </div>
    </div>
    <div style={{display: 'flex', alignItems: 'center', gap: '24px', borderBottom: '1px solid var(--hp-border)'}}>
      {TABS.map((tab) => (
        <div
          key={tab.key}
          style={{
            padding: '12px 2px',
            fontSize: '13px',
            fontWeight: 600,
            color: activeTab === tab.key ? 'var(--hp-text)' : 'var(--hp-text-2)',
            borderBottom: activeTab === tab.key ? '2px solid var(--hp-accent)' : '2px solid transparent',
            cursor: 'pointer',
          }}
          onClick={() => setActiveTab(tab.key)}
        >
          {tab.label}
        </div>
      ))}
    </div>
    {activeTab === 'previsao' && (
      <div style={{display: 'grid', gridTemplateColumns: 'minmax(0,2fr) minmax(0,1fr)', gap: 'var(--hp-gap)'}}>
        <div style={{background: 'var(--hp-surface)', border: '1px solid var(--hp-border)', borderRadius: 'var(--hp-radius)', padding: 'var(--hp-pad)'}}>
          <div style={{fontFamily: "'Plus Jakarta Sans', Inter, sans-serif", fontSize: '16px', lineHeight: '22px', fontWeight: '700', marginBottom: '14px'}}>
            Previsão dos próximos {previsao.dias.length} dias
          </div>
          <PrevisaoRegua dias={previsao.dias} faixaIdeal={previsao.faixaIdeal} />
        </div>
        <div style={{background: 'var(--hp-surface)', border: '1px solid var(--hp-border)', borderRadius: 'var(--hp-radius)', padding: 'var(--hp-pad)', display: 'flex', flexDirection: 'column', gap: '12px'}}>
          <div style={{fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-3)'}}>
            O QUE FAZER NESTE LOTE
          </div>
          {oQueFazer.map((acao, i) => (
            <div key={i} style={{display: 'flex', gap: '10px', fontSize: '13px', lineHeight: '19px'}}>
              <span style={{fontFamily: "'Material Symbols Outlined'", fontSize: '18px', lineHeight: '1', color: acao.cor, flexShrink: 0}}>{acao.icone}</span>
              <span>{acao.texto}</span>
            </div>
          ))}
        </div>
      </div>
    )}
    {activeTab === 'leituras' && (
      <div style={{background: 'var(--hp-surface)', border: '1px solid var(--hp-border)', borderRadius: 'var(--hp-radius)', overflow: 'hidden'}}>
        <div style={{padding: '14px var(--hp-pad)', borderBottom: '1px solid var(--hp-border)'}}>
          <div style={{fontFamily: "'Plus Jakarta Sans', Inter, sans-serif", fontSize: '16px', fontWeight: '700'}}>Leituras</div>
          <div style={{fontSize: '12px', color: 'var(--hp-text-2)', marginTop: '2px'}}>Tabela filtrada no sensor IOT-001 (deste lote)</div>
        </div>
        {leiturasLote.map((l, i) => (
          <div key={i} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 'var(--hp-row)', padding: '0 var(--hp-pad)', borderTop: i === 0 ? 'none' : '1px solid var(--hp-border)', fontSize: '13px', fontVariantNumeric: 'tabular-nums'}}>
            <span style={{color: 'var(--hp-text-2)'}}>{l.hora}</span>
            <span style={{fontWeight: '600', color: l.cor}}>{l.valor} {l.seta}</span>
          </div>
        ))}
      </div>
    )}
    {activeTab === 'alertas' && (
      <div style={{background: 'var(--hp-surface)', border: '1px solid var(--hp-border)', borderRadius: 'var(--hp-radius)', overflow: 'hidden'}}>
        <div style={{padding: '14px var(--hp-pad)', borderBottom: '1px solid var(--hp-border)'}}>
          <div style={{fontFamily: "'Plus Jakarta Sans', Inter, sans-serif", fontSize: '16px', fontWeight: '700'}}>Alertas (2)</div>
          <div style={{fontSize: '12px', color: 'var(--hp-text-2)', marginTop: '2px'}}>Só os alertas deste lote, com ação sugerida</div>
        </div>
        {alertasLote.map((a, i) => (
          <div key={i} style={{display: 'flex', gap: '10px', padding: '14px var(--hp-pad)', borderTop: i === 0 ? 'none' : '1px solid var(--hp-border)'}}>
            <span style={{width: '6px', height: '6px', borderRadius: '50%', background: a.cor, marginTop: '6px', flexShrink: 0}} />
            <div>
              <div style={{fontSize: '13px', fontWeight: '600'}}>{a.titulo} · {a.tempo}</div>
              <div style={{fontSize: '12px', color: 'var(--hp-text-2)', marginTop: '2px'}}>{a.acao}</div>
            </div>
          </div>
        ))}
      </div>
    )}
    {activeTab === 'operacoes' && (
      <div style={{background: 'var(--hp-surface)', border: '1px solid var(--hp-border)', borderRadius: 'var(--hp-radius)', overflow: 'hidden'}}>
        <div style={{padding: '14px var(--hp-pad)', borderBottom: '1px solid var(--hp-border)'}}>
          <div style={{fontFamily: "'Plus Jakarta Sans', Inter, sans-serif", fontSize: '16px', fontWeight: '700'}}>Operações</div>
          <div style={{fontSize: '12px', color: 'var(--hp-text-2)', marginTop: '2px'}}>Linha do tempo de manejo deste lote</div>
        </div>
        {operacoesLote.map((o, i) => (
          <div key={i} style={{display: 'flex', justifyContent: 'space-between', height: 'var(--hp-row)', alignItems: 'center', padding: '0 var(--hp-pad)', borderTop: i === 0 ? 'none' : '1px solid var(--hp-border)', fontSize: '13px'}}>
            <span>{o.acao}</span>
            <span style={{color: 'var(--hp-text-2)', fontVariantNumeric: 'tabular-nums'}}>{o.data}</span>
          </div>
        ))}
      </div>
    )}
    {activeTab === 'historico' && (
      <div style={{background: 'var(--hp-surface)', border: '1px solid var(--hp-border)', borderRadius: 'var(--hp-radius)', overflow: 'hidden'}}>
        <div style={{padding: '14px var(--hp-pad)', borderBottom: '1px solid var(--hp-border)'}}>
          <div style={{fontFamily: "'Plus Jakarta Sans', Inter, sans-serif", fontSize: '16px', fontWeight: '700'}}>Histórico</div>
          <div style={{fontSize: '12px', color: 'var(--hp-text-2)', marginTop: '2px'}}>Safras anteriores deste lote</div>
        </div>
        {historicoLote.map((h, i) => (
          <div key={i} style={{display: 'flex', justifyContent: 'space-between', height: 'var(--hp-row)', alignItems: 'center', padding: '0 var(--hp-pad)', borderTop: i === 0 ? 'none' : '1px solid var(--hp-border)', fontSize: '13px', fontVariantNumeric: 'tabular-nums'}}>
            <span>{h.label}</span>
            <span style={{fontWeight: '600'}}>{h.valor}</span>
          </div>
        ))}
      </div>
    )}
    {activeTab === 'clima' && (
    <div style={{background: 'var(--hp-surface)', border: '1px solid var(--hp-border)', borderRadius: 'var(--hp-radius)', padding: 'var(--hp-pad)'}}>
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
        <line x1="40" y1="140" x2="860" y2="140" stroke="var(--hp-critico)" stroke-width="1" stroke-dasharray="4 4" />
        <text x="44" y="133" style={{font: '600 12px Inter, sans-serif', fill: 'var(--hp-critico)'}}>
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
    )}
    </>
  );
}
