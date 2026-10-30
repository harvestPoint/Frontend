// apps/web/src/components/automacao/PorQueModal.tsx
// "Por que isso aconteceu": leitura que disparou, regra, decisão, condições e
// bloqueios avaliados e (no dia do Lote A1) o gráfico antes/depois.
import Modal from '@/components/overlay/Modal';
import { montarPorQue, type TomVerificacao } from './data/porque';
import { tempAr } from './data/curvas';
import type { Evento, Regra } from './types';
import { TIPOS } from './EventoRow';
import { Botao, FONTE_TITULO, FecharX, Icone, sobrelinha } from './ui';

const COR: Record<TomVerificacao, string> = { ok: 'var(--hp-accent-hover)', bloqueio: 'var(--hp-critico)', info: 'var(--hp-info)' };

/** 30 min antes e 60 min depois do acionamento das 13h40 (viewBox 600×150) */
function AntesDepoisChart() {
  const x = (h: number) => (((h - (13 + 10 / 60)) * 60) / 90) * 600;
  const y = (v: number) => 10 + ((39 - v) / (39 - 31)) * 110;
  const pts: string[] = [];
  for (let i = 0; i <= 90; i += 5) {
    const h = 13 + 10 / 60 + i / 60;
    pts.push(((i / 90) * 600).toFixed(1) + ',' + y(tempAr(h, 37.8, true)).toFixed(1));
  }
  const bx = x(13.667);
  const bw = x(14.667) - bx;
  const rotulo: React.CSSProperties = { font: '400 12px Inter, sans-serif', fill: 'var(--hp-text-2)' };
  return (
    <svg viewBox="0 0 600 150" style={{ width: '100%', height: '150px', marginTop: '8px', display: 'block' }} role="img"
      aria-label="Temperatura do Lote A1 entre 13h10 e 14h40: sobe até 37,8 °C às 14h e cai para 34,7 °C às 14h40 depois do aspersor.">
      <rect x={bx} y="10" width={bw} height="110" fill="var(--hp-faixa-aspersor)" />
      <line x1="0" y1={y(35)} x2="600" y2={y(35)} stroke="var(--hp-critico)" strokeDasharray="5 4" />
      <polyline points={pts.join(' ')} fill="none" stroke="var(--hp-temp)" strokeWidth="2.5" strokeLinejoin="round" />
      <line x1={x(14)} y1={y(37.8)} x2={x(14)} y2={y(34.7)} stroke="var(--hp-text-2)" strokeDasharray="2 3" />
      <circle cx={x(14)} cy={y(37.8)} r="4" fill="var(--hp-critico)" stroke="var(--hp-surface)" strokeWidth="2" />
      <text x="0" y="144" style={rotulo}>13h10</text>
      <text x={bx} y="144" style={{ ...rotulo, fill: 'var(--hp-info)' }}>13h40 ligou</text>
      <text x="600" y="144" textAnchor="end" style={rotulo}>14h40</text>
    </svg>
  );
}

interface Props {
  evento: Evento | null;
  regras: Regra[];
  aoFechar: () => void;
}

export default function PorQueModal({ evento, regras, aoFechar }: Props) {
  const p = evento ? montarPorQue(evento, TIPOS[evento.tipo].rotulo, regras) : null;
  return (
    <Modal aberto={!!p} aoFechar={aoFechar} largura={680} rotuloId="au-porque-titulo">
      {p && (
        <>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
            <div>
              <div style={sobrelinha}>POR QUE ISSO ACONTECEU</div>
              <div id="au-porque-titulo" style={{ fontFamily: FONTE_TITULO, fontSize: '20px', lineHeight: '26px', fontWeight: 700, marginTop: '4px' }}>{p.titulo}</div>
              <div style={{ fontSize: '13px', color: 'var(--hp-text-2)', marginTop: '2px' }}>{p.sub}</div>
            </div>
            <FecharX onClick={aoFechar} />
          </div>
          <div className="au-porque" style={{ marginTop: '18px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div><div style={{ fontSize: '12px', color: 'var(--hp-text-2)' }}>Leitura que disparou</div><div style={{ fontSize: '15px', fontWeight: 600, marginTop: '2px' }}>{p.leitura}</div></div>
              <div><div style={{ fontSize: '12px', color: 'var(--hp-text-2)' }}>Regra aplicada</div><div style={{ fontSize: '14px', lineHeight: '20px', marginTop: '2px' }}>{p.regra}</div></div>
              <div><div style={{ fontSize: '12px', color: 'var(--hp-text-2)' }}>Decisão</div><div style={{ fontSize: '14px', marginTop: '2px' }}>{p.decisao}</div></div>
            </div>
            <div style={{ borderRadius: 'var(--hp-radius-sm)', background: 'var(--hp-surface-2)', padding: '14px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--hp-text-2)' }}>Condições e bloqueios avaliados</div>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px', margin: '10px 0 0', padding: 0, listStyle: 'none' }}>
                {p.verificacoes.map((v) => (
                  <li key={v.texto} style={{ display: 'flex', gap: '8px', fontSize: '13px', lineHeight: '19px' }}>
                    <Icone nome={v.icone} tamanho={16} cor={COR[v.tom]} />
                    <span>{v.texto}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {p.completo && (
            <div style={{ marginTop: '16px', border: '1px solid var(--hp-border)', borderRadius: 'var(--hp-radius-sm)', padding: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '13px', fontWeight: 700 }}>Antes e depois · 30 min antes, 60 min depois</span>
                <span style={{ height: '24px', padding: '0 10px', borderRadius: '12px', background: 'var(--hp-accent-soft)', color: 'var(--hp-accent-hover)', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Icone nome="south" tamanho={14} />−3,1 °C em 40 min
                </span>
              </div>
              <AntesDepoisChart />
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '18px' }}>
            <Botao autoFoco onClick={aoFechar}>Fechar</Botao>
          </div>
        </>
      )}
    </Modal>
  );
}
