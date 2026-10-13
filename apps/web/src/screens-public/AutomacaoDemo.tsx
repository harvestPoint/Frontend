// Demonstração do capítulo "02 · Automação" da landing. Toca uma vez, quando
// o card entra na tela (limiar de 35 %), em 4 quadros de 1.900 ms:
// (a) a temperatura cruza o limite · (b) chega o aviso com o motivo ·
// (c) a pessoa aprova e o aspersor liga · (d) a temperatura cai.
// Com movimento reduzido aparece só o quadro final. Dados simulados.
import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';

const QUADRO_MS = 1900;
const ROTULOS_PASSOS = ['Temperatura sobe e cruza o limite', 'Chega o aviso, com o motivo', 'Você aprova: aspersor ligado', 'A temperatura cai: concluído'];
// [texto, fundo] do selo por quadro (-1 e 0 = "Monitorando")
const SELOS: [string, string, string][] = [
  ['Monitorando', '#6A6455', '#EFEBE0'],
  ['Monitorando', '#6A6455', '#EFEBE0'],
  ['Aguardando aprovação', '#8C5A1E', '#F8EEDC'],
  ['Aspersor ligado · 15 min', '#46789F', '#E8F0F5'],
  ['Concluído', '#4A6950', '#E6EEE3'],
];

const reduzMovimento = () => typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/** quadro atual (-1 = ainda não tocou) e função para tocar de novo */
export function useDemo(alvo: React.RefObject<HTMLElement | null>) {
  const [quadro, setQuadro] = useState(() => (reduzMovimento() ? 3 : -1));
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const jaTocou = useRef(false);

  const limpar = () => { timers.current.forEach(clearTimeout); timers.current = []; };
  const tocar = useCallback(() => {
    limpar();
    if (reduzMovimento()) { setQuadro(3); return; }
    jaTocou.current = true;
    setQuadro(-1);
    timers.current.push(setTimeout(() => setQuadro(0), 80));
    [1, 2, 3].forEach((k) => timers.current.push(setTimeout(() => setQuadro(k), 80 + k * QUADRO_MS)));
  }, []);

  useEffect(() => {
    if (reduzMovimento() || typeof IntersectionObserver === 'undefined') { setQuadro(3); return; }
    const el = alvo.current;
    if (!el) return;
    const io = new IntersectionObserver((es) => {
      if (es.some((e) => e.isIntersecting) && !jaTocou.current) { tocar(); io.disconnect(); }
    }, { threshold: 0.35 });
    io.observe(el);
    return () => { io.disconnect(); limpar(); };
  }, [alvo, tocar]);

  return { quadro, tocar };
}

/** os 4 passos da coluna de texto (só desktop) */
export function DemoPassos({ quadro }: { quadro: number }) {
  return (
    <div className="lp-d" style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '28px' }}>
      {ROTULOS_PASSOS.map((rotulo, i) => {
        const ativo = quadro === i;
        const feito = quadro > i;
        const estilo: CSSProperties = {
          display: 'flex', alignItems: 'center', gap: '12px', height: '44px', padding: '0 12px', borderRadius: '12px', fontSize: '15px',
          fontWeight: ativo ? 700 : 500, color: ativo || feito ? '#221F18' : '#6A6455', background: ativo ? '#FFFDF8' : 'transparent',
          border: '1px solid ' + (ativo ? '#E3DDCF' : 'transparent'), transition: 'background 150ms, color 150ms',
        };
        const num: CSSProperties = {
          width: '24px', height: '24px', borderRadius: '12px', fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: ativo ? '#5C7F62' : feito ? '#E6EEE3' : '#EFEBE0', color: ativo ? '#FFFFFF' : feito ? '#4A6950' : '#6A6455',
        };
        return (
          <div key={rotulo} style={estilo} aria-current={ativo ? 'step' : undefined}>
            <span style={num}>{feito ? '✓' : i + 1}</span>
            {rotulo}
          </div>
        );
      })}
    </div>
  );
}

export const demoTemp = (q: number) => (q < 0 ? '31,2' : q < 2 ? '36,4' : q === 2 ? '36,9' : '33,3');

const rot = (extra: CSSProperties): CSSProperties => ({ font: '400 12px Inter, sans-serif', fill: '#6A6455', ...extra });

/** card do gráfico com selo de estado e a notificação do aviso */
export default function DemoGrafico({ quadro, alvo }: { quadro: number; alvo: React.RefObject<HTMLDivElement | null> }) {
  const d = quadro;
  const reduz = reduzMovimento();
  const t = (css: string) => (reduz ? 'none' : css);
  const selo = SELOS[d + 1];
  const aprovado = d >= 2;
  return (
    <div ref={alvo} style={{ position: 'relative', border: '1px solid #E3DDCF', borderRadius: '18px', background: '#FFFFFF', padding: '24px', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '13px', fontWeight: 700 }}>Lote A1 · ar agora <span style={{ fontVariantNumeric: 'tabular-nums' }}>{demoTemp(d)} °C</span></span>
        <span role="status" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', height: '26px', padding: '0 10px', borderRadius: '13px', background: selo[2], color: selo[1], fontSize: '12px', fontWeight: 600, whiteSpace: 'nowrap', transition: t('background 200ms, color 200ms') }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: selo[1] }} />
          {selo[0]}
        </span>
      </div>
      <svg className="lp-demo-svg" viewBox="0 0 560 220" role="img" aria-label="Demonstração: a temperatura sobe, cruza o limite de 35 °C, o aspersor é ligado e a temperatura cai 3,1 °C em 40 minutos." style={{ width: '100%', marginTop: '10px' }}>
        <rect x="340" y="10" width="200" height="180" fill="rgba(70,120,159,.14)" style={{ opacity: d >= 2 ? 1 : 0, transition: t('opacity 250ms ease-out') }} />
        <text x="346" y="26" style={{ font: '600 12px Inter, sans-serif', fill: '#46789F' }} opacity={d >= 2 ? 1 : 0}>Aspersor ligado</text>
        <line x1="0" y1="80" x2="560" y2="80" stroke="#AE4638" strokeWidth="1.5" strokeDasharray="6 5" />
        <text x="4" y="72" style={{ font: '600 12px Inter, sans-serif', fill: '#AE4638' }}>limite 35 °C</text>
        <polyline points="20,180 80,168 140,146 200,118 250,90 300,62 340,52" pathLength={1} strokeDasharray={1} fill="none" stroke="#B8612E" strokeWidth="2.5" strokeLinejoin="round"
          style={{ strokeDashoffset: d >= 0 ? 0 : 1, transition: d >= 0 ? t('stroke-dashoffset 1500ms ease-out') : 'none' }} />
        <polyline points="340,52 380,64 420,84 460,98 500,106 540,110" pathLength={1} strokeDasharray={1} fill="none" stroke="#B8612E" strokeWidth="2.5" strokeLinejoin="round"
          style={{ strokeDashoffset: d >= 3 ? 0 : 1, transition: d >= 3 ? t('stroke-dashoffset 1400ms ease-out') : 'none' }} />
        <circle cx="263" cy="80" r="5" fill="#AE4638" stroke="#FFFFFF" strokeWidth="2" style={{ opacity: d >= 0 ? 1 : 0, transition: t('opacity 200ms ease-out 1100ms') }} />
        <text x="548" y="136" textAnchor="end" style={{ font: '700 13px Inter, sans-serif', fill: '#4A6950' }} opacity={d >= 3 ? 1 : 0}>−3,1 °C em 40 min</text>
        <text x="20" y="212" style={rot({})}>12h50</text>
        <text x="340" y="212" textAnchor="middle" style={rot({})}>13h40</text>
        <text x="540" y="212" textAnchor="end" style={rot({})}>14h40</text>
      </svg>
      <div className="lp-notif" aria-hidden={d < 1} style={{ opacity: d >= 1 ? 1 : 0, transform: d >= 1 ? 'none' : 'translateY(8px)', transition: t('opacity 200ms ease-out, transform 200ms ease-out') }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#6A6455' }}>
          <span style={{ width: '22px', height: '22px', borderRadius: '6px', background: '#E6EEE3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span aria-hidden="true" style={{ fontFamily: "'Material Symbols Outlined'", fontSize: '14px', lineHeight: 1, color: '#5C7F62' }}>eco</span>
          </span>
          HarvestPoint · agora
        </div>
        <div style={{ fontSize: '14px', lineHeight: '20px', marginTop: '8px' }}><b>Lote A1 passou do limite.</b> 36,4 °C há 10 min (limite 35 °C), solo 22,4 %. Ligar por 15 min?</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '12px' }}>
          <div style={{ height: '40px', borderRadius: '12px', background: aprovado ? '#4A6950' : '#5C7F62', color: '#FFFFFF', fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: d === 2 ? 'scale(.96)' : 'none', transition: t('transform 150ms, background 150ms') }}>
            {aprovado ? 'Ligado ✓' : 'Ligar 15 min'}
          </div>
          <div style={{ height: '40px', borderRadius: '12px', border: '1px solid #D8D1C0', fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FFFFFF' }}>Ignorar</div>
        </div>
      </div>
    </div>
  );
}

const MODOS = [
  { icone: 'bolt', nome: 'Automático', texto: 'A regra liga e desliga sozinha.', destaque: false },
  { icone: 'how_to_reg', nome: 'Aprovação', texto: 'A regra só avisa, com o motivo. Você decide.', destaque: true },
  { icone: 'pan_tool', nome: 'Manual', texto: 'A regra fica quieta. Só você aciona.', destaque: false },
];

/** os três modos de operação, com o do exemplo destacado */
export function ModoCards() {
  return (
    <div className="lp-modos">
      {MODOS.map((m) => (
        <div key={m.nome} style={{ border: m.destaque ? '2px solid #5C7F62' : '1px solid #E3DDCF', borderRadius: '18px', background: '#FFFDF8', padding: m.destaque ? '23px' : '24px', position: 'relative' }}>
          <span aria-hidden="true" style={{ fontFamily: "'Material Symbols Outlined'", fontSize: '24px', lineHeight: 1, color: '#5C7F62' }}>{m.icone}</span>
          <div style={{ fontFamily: "'Plus Jakarta Sans', Inter, sans-serif", fontSize: '18px', fontWeight: 700, marginTop: '12px' }}>{m.nome}</div>
          <div style={{ fontSize: '15px', lineHeight: '22px', color: '#6A6455', marginTop: '4px' }}>{m.texto}</div>
          {m.destaque && (
            <span style={{ position: 'absolute', top: '20px', right: '20px', height: '24px', padding: '0 10px', borderRadius: '12px', background: '#E6EEE3', color: '#4A6950', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center' }}>na demonstração</span>
          )}
        </div>
      ))}
    </div>
  );
}
