// Landing pública · direção "Caderno de campo" v2 (tema claro "Campo").
// v2: capítulo "02 · Automação" com demonstração animada, 4 cards de capítulo,
// faixa de chips no lugar da faixa "De onde vêm os dados", menu no celular.
// Rota "/" para visitante deslogado; quem já está logado continua indo direto
// para o Dashboard (ver RootGate em routes/index.tsx).
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import DemoGrafico, { DemoPassos, ModoCards, useDemo } from './AutomacaoDemo';
import Logo from '@/components/Logo';

// ---------------------------------------------------------------------------
// Dados (mock tipado)
// TODO: substituir por dado real da API.
// ---------------------------------------------------------------------------
interface Capitulo { numero: string; titulo: string; texto: string; curto: string; ancora: string }
const capitulos: Capitulo[] = [
  { numero: '01', titulo: 'Clima', texto: 'Previsão de 7 dias com o limite da sua cultura marcado.', curto: 'Previsão de 7 dias com o limite marcado.', ancora: 'clima' },
  { numero: '02', titulo: 'Automação', texto: 'Aspersores ligam sozinhos ou com a sua aprovação, sempre com o motivo.', curto: 'Aspersores com regra e motivo.', ancora: 'automacao' },
  { numero: '03', titulo: 'Lote', texto: 'Ficha de cada talhão e a janela de colheita estimada.', curto: 'Ficha e janela de colheita por talhão.', ancora: 'lote' },
  { numero: '04', titulo: 'Mercado', texto: 'Preço por destino com fonte oficial e semana de embarque.', curto: 'Preço por destino com fonte oficial.', ancora: 'mercado' },
];

interface PrecoDestino { destino: string; preco: string; variacao: string; tom: 'ok' | 'neutro' | 'atencao'; origem: 'Oficial' | 'Manual' }
const precos: PrecoDestino[] = [
  { destino: 'Manga · União Europeia', preco: 'EUR 2,80/kg', variacao: '▲ 2,1 %', tom: 'ok', origem: 'Oficial' },
  { destino: 'Uva · Estados Unidos', preco: 'USD 3,20/kg', variacao: '▬ estável', tom: 'neutro', origem: 'Oficial' },
  { destino: 'Manga · Estados Unidos', preco: 'USD 2,35/kg', variacao: '▼ 1,4 %', tom: 'atencao', origem: 'Manual' },
];

interface Persona { icone: string; nome: string; texto: string; curto: string }
const personas: Persona[] = [
  { icone: 'agriculture', nome: 'Proprietário', texto: 'Vê a fazenda inteira no celular e aprova o acionamento dos aspersores com um toque.', curto: 'Aprova o acionamento dos aspersores com um toque.' },
  { icone: 'engineering', nome: 'Técnico de campo', texto: 'Configura as regras de irrigação e os kits IoT, e confere os sensores no pomar.', curto: 'Configura regras e kits IoT, e confere os sensores.' },
  { icone: 'public', nome: 'Exportador', texto: 'Cruza preço, rota e clima antes de fechar o frete.', curto: 'Cruza preço, rota e clima antes de fechar o frete.' },
];

interface Numero { valor: number; unidade?: string; legenda: string }
const numeros: Numero[] = [
  { valor: 480, unidade: ' ha', legenda: 'monitorados na safra piloto' },
  { valor: 12, legenda: 'lotes de manga e uva' },
  { valor: 36, legenda: 'sensores enviando a cada 10 min' },
  { valor: 3, legenda: 'fontes oficiais de clima e preço' },
];

// Faixa "De onde vêm os dados": chips só com texto e ícone, sem logos de terceiros.
// TODO: confirmar a lista com a equipe (a fonte de clima hoje é a Open-Meteo).
interface Chip { icone: string; texto: string; curto: string }
const chips: Chip[] = [
  { icone: 'memory', texto: 'Kit IoT · ESP32 por lote', curto: 'Kit IoT' },
  { icone: 'water_drop', texto: 'Atuadores: aspersores e válvulas', curto: 'Atuadores: aspersores e válvulas' },
  { icone: 'partly_cloudy_day', texto: 'Previsão Open-Meteo', curto: 'Open-Meteo' },
  { icone: 'verified', texto: 'Preços PROHORT/Conab', curto: 'PROHORT/Conab' },
];

const CONTATO = 'contato@harvestpoint.com.br';

// ---------------------------------------------------------------------------
// Estilos: responsivo, revelação ao rolar e hover (inline não alcança).
// ---------------------------------------------------------------------------
const LANDING_CSS = `
  .lp { --gut: max(64px, calc((100% - 1312px) / 2)); background: #FFFDF8; color: #221F18; font-family: Inter, sans-serif; -webkit-font-smoothing: antialiased; }
  .lp [id] { scroll-margin-top: 76px; }
  .lp button { font-family: inherit; }
  .lp-reset { background: none; border: 0; padding: 0; margin: 0; color: inherit; font: inherit; cursor: pointer; }
  .lp-hover { transition: background 150ms ease-out, border-color 150ms ease-out, color 150ms ease-out, box-shadow 150ms ease-out; cursor: pointer; }
  .lp-btn-primary:hover { background: #4A6950 !important; }
  .lp-btn-sec:hover { border-color: #5C7F62 !important; }
  .lp-btn-ghost:hover { border-color: #FFFDF8 !important; background: rgba(255,253,248,.08) !important; }
  .lp-btn-cta:hover { background: #A9C9AE !important; }
  .lp-card-cap:hover { border-color: #5C7F62 !important; }
  .lp-reveal { opacity: 0; transform: translateY(12px); transition: opacity 500ms ease-out, transform 500ms ease-out; }
  .lp-reveal.in { opacity: 1; transform: none; }
  .lp button:focus-visible, .lp a:focus-visible { outline: 2px solid #5C7F62; outline-offset: 2px; }

  /* texto longo (desktop) x curto (celular) */
  .lp-m { display: none !important; }

  .lp-head { position: sticky; top: 0; z-index: 50; background: rgba(255,253,248,.94); -webkit-backdrop-filter: saturate(1.4) blur(8px); backdrop-filter: saturate(1.4) blur(8px); border-bottom: 1px solid #E3DDCF; transition: box-shadow 200ms ease-out; }
  .lp-head.scrolled { box-shadow: 0 6px 20px rgba(34,31,24,.07); }
  .lp-top { height: 75px; display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; padding: 0 var(--gut); }
  .lp-logo { display: flex; align-items: center; gap: 10px; }
  .lp-logo-box { width: 36px; height: 36px; border-radius: 10px; background: #E6EEE3; display: flex; align-items: center; justify-content: center; }
  .lp-logo-txt { font-family: 'Plus Jakarta Sans', Inter, sans-serif; font-size: 17px; font-weight: 800; }
  .lp-nav-links { display: flex; align-items: stretch; gap: 32px; height: 75px; font-size: 14px; font-weight: 400; color: #4A4538; }
  .lp-nav { height: 75px; padding: 0 2px; display: flex; align-items: center; border-bottom: 2px solid transparent; margin-bottom: -1px; }
  .lp-nav:hover { color: #221F18; }
  .lp-nav.ativo { color: #4A6950; font-weight: 600; border-bottom-color: #4A6950; }
  .lp-actions { display: flex; align-items: center; justify-content: flex-end; gap: 12px; }
  .lp-sep { width: 1px; height: 24px; background: #E3DDCF; margin-right: 4px; }
  .lp-menu-btn { display: none; width: 44px; height: 44px; border-radius: 12px; border: 1px solid #D8D1C0; background: transparent; align-items: center; justify-content: center; justify-self: end; }
  .lp-menu { display: none; position: absolute; left: 0; right: 0; top: 100%; background: #FFFDF8; border-bottom: 1px solid #E3DDCF; box-shadow: 0 16px 32px rgba(34,31,24,.10); padding: 8px 20px 20px; }
  .lp-menu-link { width: 100%; height: 48px; display: flex; align-items: center; justify-content: space-between; font-size: 16px; color: #221F18; border-bottom: 1px solid #EFEBE0; text-align: left; }
  .lp-menu-link.ativo { color: #4A6950; font-weight: 600; }

  .lp-hero { position: relative; height: 680px; background-color: #2A2418; background-image: url('/images/hero-fundo-1440.jpg'); background-size: cover; background-position: center 45%; }
  @media (min-width: 1441px), (min-resolution: 1.5dppx) { .lp-hero { background-image: url('/images/hero-fundo-2880.jpg'); } }
  .lp-scrim { position: absolute; inset: 0; background: linear-gradient(90deg, rgba(19,17,13,.74) 0%, rgba(19,17,13,.42) 48%, rgba(19,17,13,.06) 82%); }
  .lp-hero-txt { position: absolute; left: var(--gut); right: var(--gut); top: 120px; max-width: 660px; }
  .lp-h1 { margin: 20px 0 0; font-family: Newsreader, Georgia, serif; font-size: 80px; line-height: 82px; font-weight: 500; letter-spacing: -.02em; color: #FFFDF8; }
  .lp-hero-p { margin: 24px 0 0; font-size: 19px; line-height: 29px; color: rgba(255,253,248,.9); max-width: 540px; text-wrap: pretty; }
  .lp-legenda { position: absolute; right: var(--gut); top: 28px; }

  .lp-caps { margin: -96px var(--gut) 0; position: relative; display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
  .lp-card-cap { background: #FFFFFF; border: 1px solid #E3DDCF; border-radius: 18px; padding: 24px; box-shadow: 0 12px 32px rgba(34,31,24,.08); text-align: left; display: flex; flex-direction: column; justify-content: flex-start; align-items: stretch; }
  .lp-cap-n { font-family: Newsreader, Georgia, serif; font-size: 40px; line-height: 40px; font-weight: 500; color: #4A6950; }
  .lp-cap-t { font-family: 'Plus Jakarta Sans', Inter, sans-serif; font-size: 20px; font-weight: 700; margin-top: 14px; }
  .lp-cap-x { font-size: 15px; line-height: 22px; color: #6A6455; margin-top: 6px; }

  .lp-chips { margin: 32px var(--gut) 0; display: flex; align-items: center; gap: 12px; flex-wrap: wrap; font-size: 13px; color: #6A6455; }
  .lp-chips-rot { font-size: 11px; font-weight: 700; letter-spacing: .1em; color: #6A6455; }
  .lp-chip { height: 28px; padding: 0 12px; border-radius: 14px; border: 1px solid #E3DDCF; display: flex; align-items: center; gap: 6px; background: #FFFFFF; white-space: nowrap; }

  .lp-sec { display: grid; grid-template-columns: repeat(12, 1fr); gap: 32px; align-items: center; padding: 96px var(--gut); }
  .lp-sec.automacao { padding: 112px var(--gut); background: #F5F2EA; }
  .lp-sec.mercado { padding: 96px var(--gut) 120px; background: #F5F2EA; }
  .lp-c6L { grid-column: 1 / span 6; } .lp-c6R { grid-column: 7 / span 6; }
  .lp-c5L { grid-column: 1 / span 5; } .lp-c5R { grid-column: 8 / span 5; }
  .lp-h2 { margin: 14px 0 0; font-family: Newsreader, Georgia, serif; font-size: 48px; line-height: 52px; font-weight: 500; letter-spacing: -.01em; }
  .lp-p { margin: 20px 0 0; font-size: 17px; line-height: 27px; color: #4A4538; }

  .lp-rep { display: flex; align-items: center; gap: 12px; margin-top: 20px; }
  .lp-rep-btn { height: 40px; padding: 0 16px; border-radius: 12px; border: 1px solid #D8D1C0; background: #FFFFFF; color: #221F18; font-size: 14px; font-weight: 600; display: inline-flex; align-items: center; gap: 6px; }
  .lp-rep-btn:hover { border-color: #5C7F62; }
  .lp-rep-leg { font-size: 13px; color: #6A6455; }
  .lp-repm { display: none; }
  .lp-demo-svg { height: 220px; display: block; }
  .lp-notif { position: absolute; left: 24px; bottom: 24px; width: 320px; background: #FFFFFF; border: 1px solid #E3DDCF; border-radius: 14px; padding: 14px; box-shadow: 0 12px 32px rgba(34,31,24,.14); }
  .lp-modos { grid-column: 1 / -1; display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 48px; }

  .lp-personas { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
  .lp-quem { padding: 112px var(--gut); }
  .lp-nums { padding: 72px var(--gut); background: #F5F2EA; border-top: 1px solid #E3DDCF; display: grid; grid-template-columns: repeat(4, 1fr); }
  .lp-num { font-family: Newsreader, Georgia, serif; font-size: 60px; line-height: 60px; font-weight: 500; font-variant-numeric: tabular-nums; }
  .lp-cta { background: #13110D; color: #FFFDF8; padding: 112px var(--gut) 0; }
  .lp-cta-row { display: flex; align-items: flex-end; justify-content: space-between; gap: 48px; padding-bottom: 96px; }
  .lp-cta-h { margin: 0; font-family: Newsreader, Georgia, serif; font-size: 64px; line-height: 66px; font-weight: 500; letter-spacing: -.01em; max-width: 720px; }
  .lp-tab-scroll { overflow-x: auto; }
  @media (max-width: 1100px) {
    .lp { --gut: 32px; }
    .lp-nav-links { gap: 18px; }
    .lp-caps { grid-template-columns: 1fr 1fr; }
    .lp-sec.automacao { padding-top: 88px; padding-bottom: 88px; }
    .lp-notif { width: 280px; }
  }
  @media (max-width: 899px) {
    .lp { --gut: 20px; }
    .lp [id] { scroll-margin-top: 60px; }
    .lp-d { display: none !important; }
    .lp-m { display: inline !important; }
    .lp-top { height: 59px; grid-template-columns: 1fr auto; }
    .lp-logo { gap: 8px; }
    .lp-logo-box { width: 32px; height: 32px; border-radius: 9px; }
    .lp-logo-txt { font-size: 16px; }
    .lp-nav-links, .lp-sep, .lp-actions { display: none; }
    .lp-menu-btn { display: flex; }
    .lp-menu.aberto { display: block; }
    .lp-hero { height: 560px; background-image: url('/images/hero-fundo-900.jpg'); background-position: 40% center; }
    .lp-scrim { background: linear-gradient(180deg, rgba(19,17,13,.35) 0%, rgba(19,17,13,.78) 70%); }
    .lp-hero-txt { top: auto; bottom: 72px; }
    .lp-h1 { margin-top: 14px; font-size: 44px; line-height: 46px; }
    .lp-hero-p { margin-top: 14px; font-size: 16px; line-height: 24px; max-width: none; }
    .lp-hero-btns { display: grid !important; gap: 10px !important; margin-top: 22px !important; }
    .lp-hero-btns button { width: 100%; justify-content: center; }
    .lp-legenda { display: none !important; }
    .lp-caps { grid-template-columns: 1fr; gap: 10px; margin-top: -40px; }
    .lp-card-cap { flex-direction: row; justify-content: flex-start; align-items: center; gap: 16px; padding: 16px 18px; box-shadow: 0 8px 24px rgba(34,31,24,.08); }
    .lp-cap-n { font-size: 30px; line-height: 30px; width: 40px; flex-shrink: 0; }
    .lp-cap-t { font-size: 16px; margin-top: 0; }
    .lp-cap-x { font-size: 13px; line-height: 19px; margin-top: 0; }
    .lp-chips { margin-top: 24px; gap: 8px; font-size: 12px; }
    .lp-chips-rot { width: 100%; }
    .lp-chip { padding: 0 10px; }
    .lp-chip-ic { display: none !important; }
    .lp-sec, .lp-sec.automacao, .lp-sec.mercado { grid-template-columns: 1fr; padding-top: 56px; padding-bottom: 56px; gap: 24px; }
    .lp-c6L, .lp-c6R, .lp-c5L, .lp-c5R { grid-column: 1 / -1; }
    .lp-txt { order: -1; }
    .lp-h2 { margin-top: 10px; font-size: 32px; line-height: 36px; }
    .lp-p { margin-top: 12px; font-size: 16px; line-height: 24px; }
    .lp-demo-svg { height: 170px; }
    .lp-notif { position: relative; left: auto; bottom: auto; width: auto; margin-top: 12px; }
    .lp-repm { display: flex; align-items: center; gap: 12px; margin-top: 12px; }
    .lp-repm .lp-rep-btn { height: 44px; }
    .lp-modos { grid-template-columns: 1fr; gap: 12px; margin-top: 0; }
    .lp-personas { grid-template-columns: 1fr; }
    .lp-quem { padding-top: 56px; padding-bottom: 56px; }
    .lp-nums { padding-top: 48px; padding-bottom: 48px; grid-template-columns: 1fr 1fr; row-gap: 32px; }
    .lp-num-cell { border-left: 0 !important; padding: 0 !important; }
    .lp-num { font-size: 44px; line-height: 44px; }
    .lp-cta { padding-top: 56px; }
    .lp-cta-row { flex-direction: column; align-items: flex-start; gap: 32px; padding-bottom: 40px; }
    .lp-cta-h { font-size: 36px; line-height: 40px; }
    .lp-cta-col { align-items: stretch !important; width: 100%; }
    .lp-cta-col button { width: 100%; height: 52px !important; }
  }
  @media (prefers-reduced-motion: reduce) {
    .lp-reveal { opacity: 1; transform: none; transition: none; }
    .lp-hover, .lp-head { transition: none; }
  }
`;

// ---------------------------------------------------------------------------
// Peças pequenas
// ---------------------------------------------------------------------------
function Ic({ nome, size = 18, color }: { nome: string; size?: number; color?: string }) {
  return (
    <span aria-hidden="true" style={{ fontFamily: "'Material Symbols Outlined'", fontFeatureSettings: "'liga'", fontSize: `${size}px`, lineHeight: 1, color }}>
      {nome}
    </span>
  );
}

const sobrelinha: CSSProperties = { fontSize: '11px', fontWeight: 700, letterSpacing: '.1em', color: '#6A6455' };
const cardBase: CSSProperties = { border: '1px solid #E3DDCF', borderRadius: '18px', background: '#FFFFFF' };
const fontLabel = "'Plus Jakarta Sans', Inter, sans-serif";

function Pill({ bg, color, children }: { bg: string; color: string; children: ReactNode }) {
  return (
    <span style={{ height: '24px', padding: '0 10px', borderRadius: '12px', background: bg, color, fontSize: '12px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}>
      {children}
    </span>
  );
}
const Dot = ({ cor }: { cor: string }) => <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: cor }} />;

function OrigemPill({ origem }: { origem: 'Oficial' | 'Manual' }) {
  const oficial = origem === 'Oficial';
  return (
    <span style={{ height: '24px', padding: '0 9px', borderRadius: '12px', background: oficial ? '#E8F0F5' : '#EFEBE0', color: oficial ? '#46789F' : '#6A6455', fontSize: '12px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
      <Ic nome={oficial ? 'verified' : 'edit'} size={14} />
      {origem}
    </span>
  );
}

const COR_VARIACAO = { ok: '#4A6950', neutro: '#6A6455', atencao: '#8C5A1E' } as const;
// [rótulo, id da seção] do header, na ordem da página
const SECOES: [string, string][] = [['Clima', 'clima'], ['Automação', 'automacao'], ['Lote', 'lote'], ['Mercado', 'mercado'], ['Para quem', 'paraquem']];
const rolar = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

// Gráfico compacto de 7 dias (estático, igual à referência aprovada).
// TODO: ligar ao componente PrevisaoRegua com a série real da API.
const DIAS = ['Qui', 'Sex', 'Sáb', 'Dom', 'Seg', 'Ter', 'Qua'];
const X = [40, 120, 200, 280, 360, 440, 520];
const TMAX = [82, 68, 48, 34, 40, 70, 86];
const TMIN = [160, 156, 150, 146, 150, 158, 164];
const pts = (ys: number[]) => ys.map((y, i) => `${X[i]},${y}`).join(' ');

function GraficoSemana() {
  return (
    <svg viewBox="0 0 560 200" role="img" aria-label="Temperatura máxima e mínima dos próximos 7 dias, com 3 dias acima do limite de 36 °C" style={{ width: '100%', height: '200px', marginTop: '12px' }}>
      <rect x="0" y="54" width="560" height="96" fill="rgba(92,127,98,.14)" />
      <line x1="0" y1="54" x2="560" y2="54" stroke="#AE4638" strokeWidth="1" strokeDasharray="4 4" />
      <text x="4" y="46" style={{ font: '600 12px Inter, sans-serif', fill: '#AE4638' }}>limite manga 36 °C</text>
      <polyline points={pts(TMAX)} fill="none" stroke="#B8612E" strokeWidth="2.5" strokeLinejoin="round" />
      <polyline points={pts(TMIN)} fill="none" stroke="#5B8AA6" strokeWidth="2" strokeLinejoin="round" />
      {[2, 3, 4].map((i) => (
        <circle key={i} cx={X[i]} cy={TMAX[i]} r="5" fill="#AE4638" stroke="#FFFFFF" strokeWidth="2" />
      ))}
      {DIAS.map((d, i) => (
        <text key={d} x={X[i]} y="192" textAnchor="middle" style={{ font: '400 12px Inter, sans-serif', fill: '#6A6455' }}>{d}</text>
      ))}
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Página
// ---------------------------------------------------------------------------
export default function LandingPage() {
  const navigate = useNavigate();
  const numsRef = useRef<HTMLDivElement>(null);
  const demoRef = useRef<HTMLDivElement>(null);
  const menuBtnRef = useRef<HTMLButtonElement>(null);
  const [rolou, setRolou] = useState(false);
  const [ativo, setAtivo] = useState<string>('');
  const [menuAberto, setMenuAberto] = useState(false);
  const { quadro, tocar } = useDemo(demoRef);

  // Header: sombra ao rolar e destaque da seção em tela.
  useEffect(() => {
    const onScroll = () => setRolou(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    let io: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== 'undefined') {
      io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) setAtivo(e.target.id); }), { rootMargin: '-40% 0px -55% 0px' });
      SECOES.forEach(([, id]) => { const el = document.getElementById(id); if (el) io!.observe(el); });
    }
    return () => { window.removeEventListener('scroll', onScroll); io?.disconnect(); };
  }, []);

  // Menu do celular: Esc fecha e devolve o foco ao botão.
  useEffect(() => {
    if (!menuAberto) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setMenuAberto(false); menuBtnRef.current?.focus(); } };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuAberto]);

  useEffect(() => {
    const reduz = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Revelação ao rolar: fade + 12px, uma vez por seção.
    const alvos = Array.from(document.querySelectorAll<HTMLElement>('.lp-reveal'));
    let ioReveal: IntersectionObserver | null = null;
    if (reduz || typeof IntersectionObserver === 'undefined') {
      alvos.forEach((el) => el.classList.add('in'));
    } else {
      ioReveal = new IntersectionObserver((es) => es.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('in'); ioReveal?.unobserve(e.target); }
      }), { threshold: 0.15 });
      alvos.forEach((el) => ioReveal!.observe(el));
    }

    // Contadores: 0 → valor em 700ms, uma vez, quando a faixa entra na tela.
    const faixa = numsRef.current;
    const nums = faixa ? Array.from(faixa.querySelectorAll<HTMLElement>('[data-alvo]')) : [];
    let ioNums: IntersectionObserver | null = null;
    let raf = 0;
    if (faixa && !reduz && typeof IntersectionObserver !== 'undefined') {
      const fmt = (el: HTMLElement, v: number) => { el.textContent = Math.round(v).toLocaleString('pt-BR') + (el.dataset.unidade ?? ''); };
      nums.forEach((el) => fmt(el, 0));
      ioNums = new IntersectionObserver((es) => {
        if (!es[0].isIntersecting) return;
        ioNums?.disconnect();
        const ini = performance.now();
        const passo = (t: number) => {
          const p = Math.min(1, (t - ini) / 700);
          const suave = 1 - Math.pow(1 - p, 3);
          nums.forEach((el) => fmt(el, Number(el.dataset.alvo) * suave));
          if (p < 1) raf = requestAnimationFrame(passo);
        };
        raf = requestAnimationFrame(passo);
      }, { threshold: 0.4 });
      ioNums.observe(faixa);
    }

    return () => { ioReveal?.disconnect(); ioNums?.disconnect(); cancelAnimationFrame(raf); };
  }, []);

  const irPara = (id: string) => { setMenuAberto(false); rolar(id); };
  const botaoRepetir = (
    <button type="button" className="lp-reset lp-hover lp-rep-btn" onClick={tocar}>
      <Ic nome="replay" size={18} />Repetir
    </button>
  );

  return (
    <div className="lp">
      <style>{LANDING_CSS}</style>
      <div>
        {/* Topbar */}
        <header className={`lp-head${rolou ? ' scrolled' : ''}`}>
          <div className="lp-top">
            <div className="lp-logo">
              <Logo size={36} textColor="#221F18" />
            </div>
            <nav className="lp-nav-links" aria-label="Seções">
              {SECOES.map(([rotulo, id]) => (
                <button key={id} className={`lp-reset lp-hover lp-nav${ativo === id ? ' ativo' : ''}`} aria-current={ativo === id ? 'true' : undefined} onClick={() => rolar(id)}>{rotulo}</button>
              ))}
            </nav>
            <div className="lp-actions">
              <span className="lp-sep" aria-hidden="true" />
              <button className="lp-hover lp-btn-sec" onClick={() => navigate('/login')} style={{ height: '40px', padding: '0 16px', borderRadius: '12px', border: '1px solid #D8D1C0', background: 'transparent', color: '#221F18', fontSize: '14px', fontWeight: 600 }}>Entrar</button>
              <button className="lp-hover lp-btn-primary" onClick={() => navigate('/criar-conta')} style={{ height: '40px', padding: '0 18px', borderRadius: '12px', border: 0, background: '#5C7F62', color: '#FFFFFF', fontSize: '14px', fontWeight: 600 }}>Criar conta</button>
            </div>
            <button ref={menuBtnRef} type="button" className="lp-hover lp-menu-btn" aria-label={menuAberto ? 'Fechar menu' : 'Abrir menu'} aria-expanded={menuAberto} aria-controls="lp-menu" onClick={() => setMenuAberto((v) => !v)}>
              <Ic nome={menuAberto ? 'close' : 'menu'} size={22} color="#221F18" />
            </button>
          </div>
          <div id="lp-menu" className={`lp-menu${menuAberto ? ' aberto' : ''}`}>
            {SECOES.map(([rotulo, id]) => (
              <button key={id} type="button" className={`lp-reset lp-menu-link${ativo === id ? ' ativo' : ''}`} onClick={() => irPara(id)}>{rotulo}</button>
            ))}
            <div style={{ display: 'grid', gap: '10px', marginTop: '16px' }}>
              <button className="lp-hover lp-btn-sec" onClick={() => navigate('/login')} style={{ height: '52px', borderRadius: '12px', border: '1px solid #D8D1C0', background: 'transparent', color: '#221F18', fontSize: '15px', fontWeight: 600 }}>Entrar</button>
              <button className="lp-hover lp-btn-primary" onClick={() => navigate('/criar-conta')} style={{ height: '52px', borderRadius: '12px', border: 0, background: '#5C7F62', color: '#FFFFFF', fontSize: '15px', fontWeight: 600 }}>Criar conta</button>
            </div>
          </div>
        </header>

        {/* Hero */}
        <section className="lp-hero" aria-label="Apresentação">
          <div className="lp-scrim" />
          <div className="lp-hero-txt">
            <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '.1em', color: 'rgba(255,253,248,.82)' }}>SAFRA 2026 · VALE DO SÃO FRANCISCO</div>
            <h1 className="lp-h1">Cada lote, no tempo certo.</h1>
            <p className="lp-hero-p">
              <span className="lp-d">Clima, solo e mercado lidos juntos, talhão por talhão. </span>
              Quando a temperatura passa do limite da cultura, o sistema avisa você ou aciona a irrigação.
            </p>
            <div className="lp-hero-btns" style={{ display: 'flex', gap: '12px', marginTop: '36px', flexWrap: 'wrap' }}>
              <button className="lp-hover lp-btn-primary" onClick={() => navigate('/login')} style={{ height: '52px', padding: '0 26px', borderRadius: '12px', border: 0, background: '#5C7F62', color: '#FFFFFF', fontSize: '15px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                Entrar <Ic nome="arrow_forward" />
              </button>
              <button className="lp-hover lp-btn-ghost" onClick={() => rolar('clima')} style={{ height: '52px', padding: '0 22px', borderRadius: '12px', border: '1px solid rgba(255,253,248,.6)', background: 'transparent', color: '#FFFDF8', fontSize: '15px', fontWeight: 600 }}>
                Conhecer o painel
              </button>
            </div>
          </div>
          <div className="lp-legenda" style={{ height: '30px', padding: '0 12px', borderRadius: '10px', background: 'rgba(19,17,13,.55)', color: '#FFFDF8', fontSize: '12px', display: 'flex', alignItems: 'center' }}>
            Fileiras de plantio · Vale do São Francisco
          </div>
        </section>

        {/* Cards de capítulo */}
        <div className="lp-caps">
          {capitulos.map((c) => (
            <button key={c.numero} className="lp-reset lp-hover lp-card-cap" onClick={() => rolar(c.ancora)}>
              <div className="lp-cap-n">{c.numero}</div>
              <div>
                <div className="lp-cap-t">{c.titulo}</div>
                <div className="lp-cap-x"><span className="lp-d">{c.texto}</span><span className="lp-m">{c.curto}</span></div>
              </div>
            </button>
          ))}
        </div>

        {/* De onde vêm os dados */}
        <section className="lp-chips" aria-label="De onde vêm os dados">
          <span className="lp-chips-rot">DE ONDE VÊM OS DADOS</span>
          {chips.map((c) => (
            <span key={c.icone} className="lp-chip">
              <span className="lp-chip-ic" style={{ display: 'inline-flex' }}><Ic nome={c.icone} size={16} color="#5C7F62" /></span>
              <span className="lp-d">{c.texto}</span><span className="lp-m">{c.curto}</span>
            </span>
          ))}
        </section>

        {/* 01 · Clima */}
        <section id="clima" className="lp-sec lp-reveal">
          <div className="lp-c6L lp-txt">
            <div style={sobrelinha}>01 · CLIMA</div>
            <h2 className="lp-h2" style={{ maxWidth: '520px' }}>O alerta chega antes do dano.</h2>
            <p className="lp-p" style={{ maxWidth: '500px' }}>
              <span className="lp-d">A previsão regional cruza o limite da sua cultura. Quando um dia passa da linha, você sabe com antecedência qual lote proteger e o que fazer.</span>
              <span className="lp-m">A previsão regional cruza o limite da sua cultura e mostra qual lote proteger.</span>
            </p>
          </div>
          <div className="lp-c6R" style={{ ...cardBase, padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '13px', fontWeight: 700 }}>Petrolina · próximos 7 dias</span>
              <Pill bg="#F9E7E2" color="#AE4638"><Dot cor="#AE4638" />3 dias acima do limite</Pill>
            </div>
            <GraficoSemana />
            <div style={{ fontSize: '13px', color: '#6A6455', borderTop: '1px solid #E3DDCF', paddingTop: '12px', marginTop: '8px' }}>
              Recomendação: irrigar o lote A1 no fim da tarde de sábado a segunda.
            </div>
          </div>
        </section>

        {/* 02 · Automação */}
        <section id="automacao" className="lp-sec automacao lp-reveal">
          <div className="lp-c5L lp-txt">
            <div style={sobrelinha}>02 · AUTOMAÇÃO</div>
            <h2 className="lp-h2">Passou do limite, a irrigação responde.</h2>
            <p className="lp-p">
              <span className="lp-d">O kit IoT acompanha cada lote. Quando o ar passa do limite da cultura, o sistema liga os aspersores ou avisa você com o motivo. Toda ação fica registrada.</span>
              <span className="lp-m">O sistema liga os aspersores ou avisa você com o motivo. Você aprova com um toque.</span>
            </p>
            <DemoPassos quadro={quadro} />
            <div className="lp-rep lp-d">
              {botaoRepetir}
              <span className="lp-rep-leg">Demonstração com dados simulados</span>
            </div>
          </div>
          <div className="lp-c6R">
            <DemoGrafico quadro={quadro} alvo={demoRef} />
            <div className="lp-repm">
              {botaoRepetir}
              <span className="lp-rep-leg">Dados simulados</span>
            </div>
          </div>
          <ModoCards />
        </section>

        {/* 03 · Lote */}
        <section id="lote" className="lp-sec lp-reveal">
          <div className="lp-c6L" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ ...cardBase, gridColumn: 'span 2', padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                <span style={{ fontFamily: fontLabel, fontSize: '18px', fontWeight: 700 }}>Lote A1 · Manga Tommy Atkins</span>
                <Pill bg="#E6EEE3" color="#4A6950"><Dot cor="#4A6950" />ativo</Pill>
              </div>
              <div style={{ fontSize: '13px', color: '#6A6455', marginTop: '4px' }}>Fazenda Boa Vista · 120 ha · plantio 15/03/2024 · sensor IOT-001</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginTop: '18px' }}>
                {[['Temperatura', '34,2 °C', '#221F18'], ['Umidade do solo', '22,4 %', '#8C5A1E'], ['Umidade do ar', '48,0 %', '#221F18']].map(([rot, val, cor]) => (
                  <div key={rot}>
                    <div style={{ fontSize: '12px', color: '#6A6455' }}>{rot}</div>
                    <div style={{ fontSize: '22px', fontWeight: 700, fontVariantNumeric: 'tabular-nums', color: cor }}>{val}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ ...cardBase, padding: '20px' }}>
              <div style={{ fontSize: '12px', color: '#6A6455' }}>Janela de colheita</div>
              <div style={{ fontSize: '22px', fontWeight: 700, marginTop: '4px', fontVariantNumeric: 'tabular-nums' }}>22–29 out</div>
              <div style={{ height: '8px', borderRadius: '4px', background: '#EFEBE0', marginTop: '12px' }}>
                <div style={{ width: '82%', height: '8px', borderRadius: '4px', background: '#5C7F62' }} />
              </div>
              <div style={{ fontSize: '12px', color: '#6A6455', marginTop: '6px' }}>dia 98 de 120 · confiança 84 %</div>
            </div>
            <div style={{ ...cardBase, padding: '20px' }}>
              <div style={{ fontSize: '12px', color: '#6A6455' }}>Próxima operação</div>
              <div style={{ fontSize: '17px', fontWeight: 700, marginTop: '4px' }}>Irrigação · hoje 17h</div>
              <div style={{ fontSize: '12px', color: '#6A6455', marginTop: '10px' }}>Responsável: técnico de campo</div>
            </div>
          </div>
          <div className="lp-c5R lp-txt">
            <div style={sobrelinha}>03 · LOTE</div>
            <h2 className="lp-h2">Decisão por talhão, não pela média<span className="lp-d"> da fazenda</span>.</h2>
            <p className="lp-p">
              Cada lote tem cultura, variedade, ciclo e sensor próprios. A janela de colheita é estimada para cada um, com a confiança da estimativa.
            </p>
          </div>
        </section>

        {/* 04 · Mercado */}
        <section id="mercado" className="lp-sec mercado lp-reveal">
          <div className="lp-c5L lp-txt">
            <div style={sobrelinha}>04 · MERCADO</div>
            <h2 className="lp-h2">Do pé de manga ao preço em Rotterdam.</h2>
            <p className="lp-p">
              Preço e demanda por destino, com a origem de cada número. A semana de embarque sai cruzada com a colheita e o tempo de trânsito.
            </p>
          </div>
          <div className="lp-c6R" style={{ ...cardBase, overflow: 'hidden' }}>
            <div className="lp-tab-scroll">
              <div style={{ minWidth: '460px' }}>
                <div style={{ height: '44px', background: '#EFEBE0', display: 'grid', gridTemplateColumns: '1.2fr 1fr .8fr 1fr', alignItems: 'center', padding: '0 20px', fontSize: '11px', fontWeight: 700, letterSpacing: '.08em', color: '#6A6455' }}>
                  <span>DESTINO</span><span style={{ textAlign: 'right' }}>PREÇO</span><span style={{ textAlign: 'right' }}>MÊS</span><span style={{ textAlign: 'right' }}>ORIGEM</span>
                </div>
                {precos.map((p) => (
                  <div key={p.destino} style={{ minHeight: '52px', borderTop: '1px solid #E3DDCF', display: 'grid', gridTemplateColumns: '1.2fr 1fr .8fr 1fr', alignItems: 'center', padding: '0 20px', fontSize: '14px' }}>
                    <span style={{ fontWeight: 600 }}>{p.destino}</span>
                    <span style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{p.preco}</span>
                    <span style={{ textAlign: 'right', color: COR_VARIACAO[p.tom], fontWeight: 600 }}>{p.variacao}</span>
                    <span style={{ display: 'flex', justifyContent: 'flex-end' }}><OrigemPill origem={p.origem} /></span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ borderTop: '1px solid #E3DDCF', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', background: '#FFFDF8' }}>
              <Ic nome="directions_boat" size={20} color="#5C7F62" />
              <span>Embarque sugerido do Lote A1: <b>semana 44 (27/10 a 02/11)</b>, chegada a Rotterdam em 15 dias.</span>
            </div>
          </div>
        </section>

        {/* Para quem */}
        <section id="paraquem" className="lp-quem lp-reveal">
          <h2 className="lp-h2" style={{ margin: '0 0 48px', textAlign: 'center' }}>Feito para quem vive a safra.</h2>
          <div className="lp-personas">
            {personas.map((p) => (
              <div key={p.nome} style={{ border: '1px solid #E3DDCF', borderRadius: '18px', background: '#FFFFFF', padding: '32px' }}>
                <Ic nome={p.icone} size={28} color="#5C7F62" />
                <div style={{ fontFamily: fontLabel, fontSize: '20px', fontWeight: 700, marginTop: '18px' }}>{p.nome}</div>
                <div style={{ fontSize: '15px', lineHeight: '23px', color: '#6A6455', marginTop: '8px' }}>
                  <span className="lp-d">{p.texto}</span><span className="lp-m">{p.curto}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Números */}
        <div className="lp-nums lp-reveal" ref={numsRef}>
          {numeros.map((n, i) => (
            <div key={n.legenda} className="lp-num-cell" style={{ padding: i === 0 ? '0 24px 0 0' : i === numeros.length - 1 ? '0 0 0 24px' : '0 24px', borderLeft: i === 0 ? 0 : '1px solid #E3DDCF' }}>
              <div className="lp-num" data-alvo={n.valor} data-unidade={n.unidade ?? ''}>
                {n.valor.toLocaleString('pt-BR')}{n.unidade}
              </div>
              <div style={{ fontSize: '14px', color: '#6A6455', marginTop: '10px' }}>{n.legenda}</div>
            </div>
          ))}
        </div>

        {/* CTA escuro + rodapé */}
        <footer className="lp-cta">
          <div className="lp-cta-row">
            <div>
              <h2 className="lp-cta-h">Comece pela próxima safra.</h2>
              <div style={{ fontSize: '17px', color: '#B3AC9A', marginTop: '16px' }}>Cadastre um lote e veja o primeiro alerta ainda esta semana.</div>
            </div>
            <div className="lp-cta-col" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px' }}>
              <button className="lp-hover lp-btn-cta" onClick={() => navigate('/login')} style={{ height: '56px', padding: '0 28px', borderRadius: '12px', border: 0, background: '#93B69A', color: '#13110D', fontSize: '16px', fontWeight: 700 }}>
                Entrar no HarvestPoint
              </button>
              <a href={`mailto:${CONTATO}`} style={{ fontSize: '14px', color: '#B3AC9A', textDecoration: 'none' }}>{CONTATO}</a>
            </div>
          </div>
          <div style={{ borderTop: '1px solid #2F2B22', padding: '24px 0 32px', display: 'flex', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', fontSize: '13px', color: '#B3AC9A' }}>
            <span>© 2026 HarvestPoint · Vale do São Francisco</span>
            <span style={{ display: 'flex', gap: '24px' }}><span>Termos de uso</span><span>Privacidade</span></span>
          </div>
        </footer>
      </div>
    </div>
  );
}
