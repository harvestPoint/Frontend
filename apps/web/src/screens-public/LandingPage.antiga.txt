// Landing page v3 — convertida a partir do export estático aprovado
// (landing-export/HarvestPoint-Landing.html). O fundo topográfico, o
// paralaxe do scroll e o contador animado das estatísticas são o MESMO
// algoritmo do arquivo original, só portado para dentro de um useEffect.
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LANDING_STYLES = `
  .hp-landing a { color: #8FB596; text-decoration: none; }
  .hp-landing a:hover { color: #A9C9AE; }
  .hp-landing .logo-icon { transition: transform 450ms cubic-bezier(.34,1.56,.64,1); }
  .hp-landing .logo-icon:hover { transform: rotate(10deg) scale(1.1); }
  .hp-landing .nav-link { transition: color 150ms; cursor: pointer; }
  .hp-landing .nav-link:hover { color: #ECEBE4; }
  .hp-landing .btn-primary { transition: background 150ms; cursor: pointer; }
  .hp-landing .btn-primary:hover { background: #A9C9AE; }
  .hp-landing .btn-secondary { transition: border-color 150ms; cursor: pointer; }
  .hp-landing .btn-secondary:hover { border-color: #8FB596; }
  .hp-landing .card-persona { transition: border-color 200ms, transform 200ms; }
  .hp-landing .card-persona:hover { border-color: #3A3D30; transform: translateY(-3px); }
  .hp-landing .card-how { transition: transform 200ms ease-out, border-color 200ms ease-out; }
  .hp-landing .card-how:hover { transform: translateY(-3px); border-color: #3A3D30; }
  .hp-landing .card-how-big { transition: transform 200ms ease-out, border-color 200ms ease-out; }
  .hp-landing .card-how-big:hover { transform: translateY(-3px); border-color: #8FB596; }
  .hp-landing .card-preview { transition: border-color 200ms; }
  .hp-landing .card-preview:hover { border-color: #3A3D30; }
  .hp-landing .card-only-hp { transition: border-color 200ms; }
  .hp-landing .card-only-hp:hover { border-color: #8FB596; }
  @keyframes hpPulse { 0%,100% { opacity: 1; } 50% { opacity: .4; } }
  @keyframes hpScrollHint { 0%,100% { transform: translateY(0); opacity: .5; } 50% { transform: translateY(6px); opacity: 1; } }
`;

export default function LandingPage() {
  const navigate = useNavigate();
  const goLogin = () => navigate('/login');
  const goCadastro = () => navigate('/criar-conta');
  const scrollToPersonas = () => document.getElementById('personas')?.scrollIntoView({ behavior: 'smooth' });
  const scrollToHow = () => document.getElementById('how')?.scrollIntoView({ behavior: 'smooth' });
  const scrollToProduto = () => document.getElementById('produto')?.scrollIntoView({ behavior: 'smooth' });

  // Porta fiel do <script> do export original: desenha o fundo topográfico,
  // liga o paralaxe/opacidade ao scroll e anima os dois contadores de
  // estatística quando eles entram na viewport.
  useEffect(() => {
    function topoRing(cx: number, cy: number, r: number, seedA: number, seedB: number, pts = 16) {
      let d = '';
      for (let i = 0; i <= pts; i++) {
        const a = (i / pts) * Math.PI * 2;
        const wob = 1 + 0.18 * Math.sin(a * 3 + seedA) + 0.1 * Math.sin(a * 5 + seedB);
        const x = cx + Math.cos(a) * r * wob;
        const y = cy + Math.sin(a) * r * wob;
        d += (i === 0 ? 'M' : 'L') + x.toFixed(1) + ',' + y.toFixed(1) + ' ';
      }
      return d + 'Z';
    }
    function topoCluster(cx: number, cy: number, baseR: number, seedA: number, seedB: number) {
      return [1, 0.84, 0.68, 0.52, 0.36, 0.2].map((s) => topoRing(cx, cy, baseR * s, seedA, seedB));
    }
    const svg = document.getElementById('topoSvg');
    if (svg) {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      topoCluster(280, 220, 260, 0.4, 1.7)
        .concat(topoCluster(1180, 680, 230, 2.1, 0.6))
        .forEach((d) => {
          const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          p.setAttribute('d', d);
          p.setAttribute('fill', 'none');
          p.setAttribute('stroke', '#8FB596');
          p.setAttribute('stroke-width', '1');
          svg.appendChild(p);
        });
    }

    function lerp(y: number, pts: [number, number][]) {
      for (let i = 0; i < pts.length - 1; i++) {
        const [y0, v0] = pts[i];
        const [y1, v1] = pts[i + 1];
        if (y <= y1) return v0 + (v1 - v0) * Math.max(0, (y - y0) / (y1 - y0));
      }
      return pts[pts.length - 1][1];
    }
    let raf: number | null = null;
    function onScroll() {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = null;
        const y = window.scrollY || 0;
        const el = document.getElementById('topoSvg');
        if (!el) return;
        el.style.opacity = String(
          lerp(y, [[0, 0.16], [900, 0.11], [1900, 0.06], [2900, 0.06], [3600, 0.09], [4400, 0.14]]),
        );
        el.style.transform = 'translateX(-50%) translateY(' + Math.round(y * 0.05) + 'px)';
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    function animateStat(el: HTMLElement, target: number, decimals: number) {
      const start = performance.now();
      const dur = 700;
      function step(t: number) {
        const p = Math.min(1, (t - start) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = (target * eased).toFixed(decimals).replace('.', ',') + '%';
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }
    const statsEl = document.getElementById('stats');
    let statsDone = false;
    let observer: IntersectionObserver | null = null;
    if (statsEl) {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && !statsDone) {
            statsDone = true;
            const s1 = document.getElementById('stat1');
            const s2 = document.getElementById('stat2');
            if (s1) animateStat(s1, 85.3, 1);
            if (s2) animateStat(s2, 70.6, 1);
          }
        },
        { threshold: 0.3 },
      );
      observer.observe(statsEl);
    }

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (observer) observer.disconnect();
    };
  }, []);

  return (
    <div className="hp-landing" style={{ background: '#14160F', color: '#ECEBE4', minHeight: '100vh' }}>
      <style>{LANDING_STYLES}</style>
    <div id="landingRoot" style={{width: '100%', maxWidth: '1440px', margin: '0 auto', position: 'relative', overflow: 'hidden'}}>
      <svg id="topoSvg" viewBox="0 0 1440 900" preserveAspectRatio="none" style={{position: 'fixed', inset: '0', width: '100%', maxWidth: '1440px', height: '100vh', opacity: '.16', transition: 'opacity 500ms ease-out', zIndex: '0', left: '50%', transform: 'translateX(-50%)'}} />
      <div style={{position: 'absolute', top: '600px', left: '-160px', width: '720px', height: '720px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(143,181,150,.16), transparent 70%)', zIndex: '0', pointerEvents: 'none', filter: 'blur(10px)'}} />
      <div style={{position: 'absolute', top: '2100px', right: '-200px', width: '780px', height: '780px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(156,123,79,.14), transparent 70%)', zIndex: '0', pointerEvents: 'none', filter: 'blur(10px)'}} />
      <div style={{position: 'absolute', top: '3400px', left: '40%', width: '820px', height: '820px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(85,115,92,.22), transparent 70%)', zIndex: '0', pointerEvents: 'none', filter: 'blur(10px)'}} />
      <div style={{height: '72px', position: 'fixed', top: '0', left: '0', right: '0', maxWidth: '1440px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 48px', background: 'rgba(20,22,15,.8)', backdropFilter: 'blur(10px)', borderBottom: '1px solid #2A2C22', zIndex: '5'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: '36px'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
            <span className="material-symbols-outlined logo-icon" style={{fontSize: '22px', color: '#8FB596', display: 'inline-block'}}>
              eco
            </span>
            <span style={{fontFamily: "'Plus Jakarta Sans', Inter, sans-serif", fontSize: '15px', fontWeight: '800'}}>
              HarvestPoint
            </span>
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: '28px', fontSize: '13px', color: '#9B9C8F'}}>
            <span className="nav-link" onClick={scrollToPersonas}>
              Para quem é
            </span>
            <span className="nav-link" onClick={scrollToHow}>
              Como funciona
            </span>
            <span className="nav-link" onClick={scrollToProduto}>
              Produto
            </span>
          </div>
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
          <span style={{fontSize: '13px', fontWeight: '600', cursor: 'pointer'}} onClick={goLogin}>
            Entrar
          </span>
          <div className="btn-primary" style={{height: '36px', padding: '0 16px', display: 'flex', alignItems: 'center', background: '#8FB596', color: '#14160F', borderRadius: '10px', fontSize: '13px', fontWeight: '700'}} onClick={goCadastro}>
            Criar conta
          </div>
        </div>
      </div>
      <div style={{position: 'relative', zIndex: '1'}}>
        <div style={{padding: '168px 48px 96px', display: 'flex', gap: '56px', alignItems: 'center', maxWidth: '1280px', margin: '0 auto'}}>
          <div style={{flex: '1', maxWidth: '560px'}}>
            <div style={{display: 'inline-flex', alignItems: 'center', gap: '8px', height: '28px', padding: '0 12px', borderRadius: '14px', background: '#1B1D16', border: '1px solid #2A2C22', marginBottom: '24px'}}>
              <span style={{width: '6px', height: '6px', borderRadius: '50%', background: '#8FB596', display: 'inline-block', animation: 'hpPulse 2s ease-in-out infinite'}} />
              <span style={{fontSize: '11px', fontWeight: '700', letterSpacing: '.06em', color: '#9B9C8F'}}>
                VALE DO SÃO FRANCISCO · PETROLINA/PE
              </span>
            </div>
            <h1 style={{margin: '0', fontFamily: "'Plus Jakarta Sans', Inter, sans-serif", fontSize: '48px', lineHeight: '1.12', fontWeight: '800'}}>
              Sua colheita, decidida pelo 
              <span style={{color: '#8FB596'}}>
                dado
              </span>
              , não pelo olho.
            </h1>
            <div style={{fontSize: '17px', lineHeight: '1.55', color: '#9B9C8F', marginTop: '20px', maxWidth: '480px'}}>
              Sensores no pomar, alertas por lote e por cultura, e a janela certa de colheita — tudo num painel só, pra manga e uva irrigadas no Vale.
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: '14px', marginTop: '32px'}}>
              <div className="btn-primary" style={{height: '48px', padding: '0 24px', display: 'flex', alignItems: 'center', background: '#8FB596', color: '#14160F', borderRadius: '12px', fontSize: '14px', fontWeight: '700'}} onClick={goCadastro}>
                Criar conta gratuitamente
              </div>
              <div className="btn-secondary" style={{height: '48px', padding: '0 20px', display: 'flex', alignItems: 'center', gap: '6px', color: '#ECEBE4', border: '1px solid #2A2C22', borderRadius: '12px', fontSize: '14px', fontWeight: '600'}} onClick={scrollToHow}>
                Ver como funciona
                <span className="material-symbols-outlined" style={{fontSize: '16px'}}>
                  arrow_downward
                </span>
              </div>
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: '24px', marginTop: '40px', paddingTop: '24px', borderTop: '1px solid #2A2C22'}}>
              <div>
                <div style={{fontFamily: "'Plus Jakarta Sans', Inter, sans-serif", fontSize: '22px', fontWeight: '800', color: '#ECEBE4'}}>
                  2
                </div>
                <div style={{fontSize: '11px', color: '#6B6D63', marginTop: '2px'}}>
                  culturas · manga e uva
                </div>
              </div>
              <div style={{width: '1px', height: '28px', background: '#2A2C22'}} />
              <div>
                <div style={{fontFamily: "'Plus Jakarta Sans', Inter, sans-serif", fontSize: '22px', fontWeight: '800', color: '#ECEBE4'}}>
                  12
                </div>
                <div style={{fontSize: '11px', color: '#6B6D63', marginTop: '2px'}}>
                  leituras IoT · últimas 24h
                </div>
              </div>
              <div style={{width: '1px', height: '28px', background: '#2A2C22'}} />
              <div>
                <div style={{fontFamily: "'Plus Jakarta Sans', Inter, sans-serif", fontSize: '22px', fontWeight: '800', color: '#ECEBE4'}}>
                  3
                </div>
                <div style={{fontSize: '11px', color: '#6B6D63', marginTop: '2px'}}>
                  lotes monitorados
                </div>
              </div>
            </div>
          </div>
          <div style={{flex: '1', maxWidth: '480px'}}>
            <div style={{border: '1px solid #2A2C22', borderRadius: '16px', background: '#1B1D16', padding: '20px', boxShadow: '0 24px 64px rgba(0,0,0,.4)'}}>
              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                <div style={{fontSize: '11px', fontWeight: '700', letterSpacing: '.06em', color: '#6B6D63'}}>
                  LOTE A1 · MANGA TOMMY ATKINS
                </div>
                <span style={{display: 'inline-flex', alignItems: 'center', gap: '6px', height: '22px', padding: '0 9px', borderRadius: '11px', background: '#2A1714', color: '#E2897D', fontSize: '11px', fontWeight: '600'}}>
                  <span style={{width: '5px', height: '5px', borderRadius: '50%', background: '#E2897D'}} />
                  estresse térmico
                </span>
              </div>
              <div style={{display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '14px'}}>
                <span style={{fontFamily: 'Inter, sans-serif', fontSize: '44px', fontWeight: '700', fontVariantNumeric: 'tabular-nums'}}>
                  31,9
                </span>
                <span style={{fontSize: '15px', color: '#6B6D63'}}>
                  °C
                </span>
              </div>
              <svg viewBox="0 0 420 48" style={{width: '100%', height: '48px', marginTop: '6px'}}>
                <polyline points="0,34 42,32 84,29 126,26 168,22 210,17 252,13 294,9 336,6 378,4 420,2" fill="none" stroke="#8FB596" stroke-width="2" stroke-linejoin="round" />
              </svg>
              <div style={{height: '1px', background: '#2A2C22', margin: '16px 0'}} />
              <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px'}}>
                  <span style={{color: '#9B9C8F'}}>
                    Umidade do ar
                  </span>
                  <span style={{fontVariantNumeric: 'tabular-nums', fontWeight: '600'}}>
                    58,0 %
                  </span>
                </div>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px'}}>
                  <span style={{color: '#9B9C8F'}}>
                    Umidade do solo
                  </span>
                  <span style={{fontVariantNumeric: 'tabular-nums', fontWeight: '600', color: '#E0B074'}}>
                    22,4 %
                  </span>
                </div>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px'}}>
                  <span style={{color: '#9B9C8F'}}>
                    Colheita estimada
                  </span>
                  <span style={{fontVariantNumeric: 'tabular-nums', fontWeight: '600'}}>
                    22–29 out
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id="personas" style={{padding: '96px 48px', maxWidth: '1280px', margin: '0 auto'}}>
          <div style={{textAlign: 'center', marginBottom: '40px'}}>
            <div style={{fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: '#6B6D63'}}>
              PARA QUEM É
            </div>
            <h2 style={{margin: '8px 0 0', fontFamily: "'Plus Jakarta Sans', Inter, sans-serif", fontSize: '32px', fontWeight: '800'}}>
              Uma plataforma, três formas de usar.
            </h2>
          </div>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px'}}>
            <div className="card-persona" style={{border: '1px solid #2A2C22', borderRadius: '16px', background: '#1B1D16', padding: '28px'}}>
              <span className="material-symbols-outlined" style={{fontSize: '26px', color: '#8FB596'}}>
                agriculture
              </span>
              <div style={{fontSize: '17px', fontWeight: '700', marginTop: '14px'}}>
                Produtor rural
              </div>
              <div style={{fontSize: '13px', lineHeight: '1.5', color: '#9B9C8F', marginTop: '8px'}}>
                Acompanha clima, lotes e resultados no celular, mesmo sob sol forte — decide a colheita com dado, não no chute.
              </div>
            </div>
            <div className="card-persona" style={{border: '1px solid #2A2C22', borderRadius: '16px', background: '#1B1D16', padding: '28px'}}>
              <span className="material-symbols-outlined" style={{fontSize: '26px', color: '#8FB596'}}>
                engineering
              </span>
              <div style={{fontSize: '17px', fontWeight: '700', marginTop: '14px'}}>
                Técnico de campo
              </div>
              <div style={{fontSize: '13px', lineHeight: '1.5', color: '#9B9C8F', marginTop: '8px'}}>
                Registra leituras e confere sensores direto do pomar, de moto, mesmo em área sem sinal — sincroniza depois.
              </div>
            </div>
            <div className="card-persona" style={{border: '1px solid #2A2C22', borderRadius: '16px', background: '#1B1D16', padding: '28px'}}>
              <span className="material-symbols-outlined" style={{fontSize: '26px', color: '#8FB596'}}>
                work
              </span>
              <div style={{fontSize: '17px', fontWeight: '700', marginTop: '14px'}}>
                Gestora de exportação
              </div>
              <div style={{fontSize: '13px', lineHeight: '1.5', color: '#9B9C8F', marginTop: '8px'}}>
                Cruza preço, demanda e logística por destino no desktop — decide rota e transportadora com dado atualizado.
              </div>
            </div>
          </div>
        </div>
        <div id="how" style={{padding: '96px 48px', maxWidth: '1280px', margin: '0 auto', borderTop: '1px solid #2A2C22'}}>
          <div style={{textAlign: 'center', marginBottom: '40px'}}>
            <div style={{fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: '#6B6D63'}}>
              COMO FUNCIONA
            </div>
            <h2 style={{margin: '8px 0 0', fontFamily: "'Plus Jakarta Sans', Inter, sans-serif", fontSize: '32px', fontWeight: '800'}}>
              O sensor mede. O modelo decide. Você recebe o aviso.
            </h2>
          </div>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: 'repeat(2, auto)', gap: '14px'}}>
            <div className="card-how" style={{gridColumn: '1', gridRow: '1', border: '1px solid #2A2C22', borderRadius: '14px', background: '#1B1D16', padding: '22px'}}>
              <span className="material-symbols-outlined" style={{fontSize: '20px', color: '#8FB596'}}>
                sensors
              </span>
              <div style={{fontSize: '14px', fontWeight: '700', marginTop: '10px'}}>
                Sensor mede
              </div>
              <div style={{fontSize: '12px', lineHeight: '1.4', color: '#9B9C8F', marginTop: '4px'}}>
                Temperatura, umidade do ar e do solo, a cada poucos minutos.
              </div>
            </div>
            <div className="card-how" style={{gridColumn: '1', gridRow: '2', border: '1px solid #2A2C22', borderRadius: '14px', background: '#1B1D16', padding: '22px'}}>
              <span className="material-symbols-outlined" style={{fontSize: '20px', color: '#8FB596'}}>
                cloud_sync
              </span>
              <div style={{fontSize: '14px', fontWeight: '700', marginTop: '10px'}}>
                Dado sobe em tempo real
              </div>
              <div style={{fontSize: '12px', lineHeight: '1.4', color: '#9B9C8F', marginTop: '4px'}}>
                Sem planilha, sem digitação manual.
              </div>
            </div>
            <div className="card-how" style={{gridColumn: '2', gridRow: '1 / 3', border: '1px solid #2A2C22', borderRadius: '14px', background: '#1B1D16', padding: '26px', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
              <span className="material-symbols-outlined" style={{fontSize: '20px', color: '#8FB596'}}>
                insights
              </span>
              <div style={{fontSize: '14px', fontWeight: '700', marginTop: '10px'}}>
                Modelo cruza com o histórico
              </div>
              <div style={{fontSize: '12px', lineHeight: '1.4', color: '#9B9C8F', marginTop: '4px'}}>
                Compara com a faixa ideal da cultura e o ciclo daquele lote.
              </div>
            </div>
            <div className="card-how-big" style={{gridColumn: '3', gridRow: '1 / 3', border: '1px solid #2A2C22', borderRadius: '14px', background: '#1B1D16', padding: '26px', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
              <span className="material-symbols-outlined" style={{fontSize: '24px', color: '#8FB596'}}>
                notifications_active
              </span>
              <div style={{fontSize: '16px', fontWeight: '700', marginTop: '12px'}}>
                Alerta ou recomendação aparece
              </div>
              <div style={{fontSize: '12px', lineHeight: '1.4', color: '#9B9C8F', marginTop: '6px'}}>
                Direto no painel, por lote e por cultura.
              </div>
            </div>
          </div>
        </div>
        <div id="produto" style={{padding: '96px 48px', maxWidth: '1280px', margin: '0 auto', borderTop: '1px solid #2A2C22'}}>
          <div style={{textAlign: 'center', marginBottom: '40px'}}>
            <div style={{fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: '#6B6D63'}}>
              O QUE VOCÊ VÊ NO PAINEL
            </div>
            <h2 style={{margin: '8px 0 0', fontFamily: "'Plus Jakarta Sans', Inter, sans-serif", fontSize: '32px', fontWeight: '800'}}>
              Clima, lotes e mercado, sempre à mão.
            </h2>
          </div>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px'}}>
            <div className="card-preview" style={{border: '1px solid #2A2C22', borderRadius: '14px', background: '#1B1D16', padding: '18px'}}>
              <div style={{fontSize: '12px', fontWeight: '600', color: '#9B9C8F', marginBottom: '10px'}}>
                Dashboard climático
              </div>
              <div style={{borderRadius: '10px', background: '#14160F', padding: '14px', border: '1px solid #2A2C22'}}>
                <div style={{display: 'flex', alignItems: 'baseline', gap: '6px'}}>
                  <span style={{fontFamily: 'Inter, sans-serif', fontSize: '24px', fontWeight: '700', fontVariantNumeric: 'tabular-nums'}}>
                    31,9
                  </span>
                  <span style={{fontSize: '11px', color: '#6B6D63'}}>
                    °C
                  </span>
                </div>
                <div style={{fontSize: '10px', color: '#6B6D63', marginTop: '2px'}}>
                  Temperatura do ar · Lote A1
                </div>
              </div>
            </div>
            <div className="card-preview" style={{border: '1px solid #2A2C22', borderRadius: '14px', background: '#1B1D16', padding: '18px'}}>
              <div style={{fontSize: '12px', fontWeight: '600', color: '#9B9C8F', marginBottom: '10px'}}>
                Alertas por lote
              </div>
              <div style={{borderRadius: '10px', background: '#14160F', padding: '14px', border: '1px solid #2A2C22', display: 'flex', alignItems: 'center', gap: '8px'}}>
                <span className="material-symbols-outlined" style={{fontSize: '16px', color: '#E2897D'}}>
                  warning
                </span>
                <span style={{fontSize: '11px', color: '#E2897D', lineHeight: '1.4'}}>
                  Estresse térmico — 31,9 °C, limite 30 °C
                </span>
              </div>
            </div>
            <div className="card-preview" style={{border: '1px solid #2A2C22', borderRadius: '14px', background: '#1B1D16', padding: '18px'}}>
              <div style={{fontSize: '12px', fontWeight: '600', color: '#9B9C8F', marginBottom: '10px'}}>
                Mercado & preços
              </div>
              <div style={{borderRadius: '10px', background: '#14160F', padding: '14px', border: '1px solid #2A2C22'}}>
                <div style={{display: 'flex', alignItems: 'baseline', gap: '6px'}}>
                  <span style={{fontFamily: 'Inter, sans-serif', fontSize: '20px', fontWeight: '700', fontVariantNumeric: 'tabular-nums'}}>
                    EUR 2,80
                  </span>
                  <span style={{fontSize: '11px', color: '#8FB596'}}>
                    ▲ 2,1%
                  </span>
                </div>
                <div style={{fontSize: '10px', color: '#6B6D63', marginTop: '2px'}}>
                  Manga · União Europeia
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id="stats" style={{padding: '96px 48px', maxWidth: '1280px', margin: '0 auto', borderTop: '1px solid #2A2C22'}}>
          <div style={{textAlign: 'center', marginBottom: '40px'}}>
            <div style={{fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: '#6B6D63'}}>
              POR QUE ISSO IMPORTA
            </div>
          </div>
          <div style={{display: 'grid', gridTemplateColumns: '1.6fr 1fr', gridTemplateRows: 'repeat(2, auto)', gap: '14px'}}>
            <div style={{gridColumn: '1', gridRow: '1 / 3', border: '1px solid #2A2C22', borderRadius: '14px', background: '#1B1D16', padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
              <div id="stat1" style={{fontFamily: "'Plus Jakarta Sans', Inter, sans-serif", fontSize: '64px', fontWeight: '800', color: '#8FB596', fontVariantNumeric: 'tabular-nums', lineHeight: '1'}}>
                0,0%
              </div>
              <div style={{fontSize: '18px', lineHeight: '1.4', marginTop: '12px', maxWidth: '380px'}}>
                dos consumidores escolhem a manga pela aparência.
              </div>
            </div>
            <div style={{gridColumn: '2', gridRow: '1', border: '1px solid #2A2C22', borderRadius: '14px', background: '#1B1D16', padding: '20px'}}>
              <div id="stat2" style={{fontFamily: "'Plus Jakarta Sans', Inter, sans-serif", fontSize: '32px', fontWeight: '800', color: '#8FB596', fontVariantNumeric: 'tabular-nums'}}>
                0,0%
              </div>
              <div style={{fontSize: '13px', lineHeight: '1.4', marginTop: '6px'}}>
                pagariam mais por um padrão de qualidade garantido.
              </div>
            </div>
            <div style={{gridColumn: '2', gridRow: '2', border: '1px solid #2A2C22', borderRadius: '14px', background: '#1B1D16', padding: '20px'}}>
              <div style={{fontSize: '14px', lineHeight: '1.4'}}>
                As maiores perdas começam ainda 
                <span style={{color: '#8FB596', fontWeight: '700'}}>
                  na colheita e no transporte
                </span>
                .
              </div>
            </div>
          </div>
        </div>
        <div style={{padding: '96px 48px', maxWidth: '1280px', margin: '0 auto', borderTop: '1px solid #2A2C22'}}>
          <div style={{textAlign: 'center', marginBottom: '40px'}}>
            <div style={{fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: '#6B6D63'}}>
              O QUE SÓ O HARVESTPOINT TEM
            </div>
          </div>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px'}}>
            <div className="card-only-hp" style={{border: '1px solid #2A2C22', borderRadius: '12px', background: '#1B1D16', padding: '18px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', fontWeight: '600'}}>
              <span className="material-symbols-outlined" style={{fontSize: '18px', color: '#8FB596', flexShrink: '0'}}>
                check
              </span>
              Simulador de telemetria nativo
            </div>
            <div className="card-only-hp" style={{border: '1px solid #2A2C22', borderRadius: '12px', background: '#1B1D16', padding: '18px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', fontWeight: '600'}}>
              <span className="material-symbols-outlined" style={{fontSize: '18px', color: '#8FB596', flexShrink: '0'}}>
                check
              </span>
              Alertas por lote e por cultura
            </div>
            <div className="card-only-hp" style={{border: '1px solid #2A2C22', borderRadius: '12px', background: '#1B1D16', padding: '18px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', fontWeight: '600'}}>
              <span className="material-symbols-outlined" style={{fontSize: '18px', color: '#8FB596', flexShrink: '0'}}>
                check
              </span>
              Logística com custo e prazo
            </div>
            <div className="card-only-hp" style={{border: '1px solid #2A2C22', borderRadius: '12px', background: '#1B1D16', padding: '18px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', fontWeight: '600'}}>
              <span className="material-symbols-outlined" style={{fontSize: '18px', color: '#8FB596', flexShrink: '0'}}>
                check
              </span>
              Gestão por perfil de acesso
            </div>
          </div>
        </div>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '96px 48px', textAlign: 'center', borderTop: '1px solid #2A2C22'}}>
          <h2 style={{margin: '0 0 28px', fontFamily: "'Plus Jakarta Sans', Inter, sans-serif", fontSize: '32px', lineHeight: '1.2', fontWeight: '800', maxWidth: '560px'}}>
            Comece a decidir com dado, não com o olho.
          </h2>
          <div className="btn-primary" style={{height: '52px', padding: '0 32px', display: 'inline-flex', alignItems: 'center', background: '#8FB596', color: '#14160F', borderRadius: '12px', fontSize: '15px', fontWeight: '700'}} onClick={goCadastro}>
            Criar conta gratuitamente
          </div>
          <div style={{fontSize: '13px', color: '#9B9C8F', marginTop: '18px', cursor: 'pointer'}} onClick={goLogin}>
            Já tenho conta →
          </div>
        </div>
        <div style={{padding: '32px 48px 40px', borderTop: '1px solid #2A2C22', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px', color: '#9B9C8F'}}>
          <span>
            © 2026 HarvestPoint · Vale do São Francisco
          </span>
          <span style={{display: 'flex', gap: '20px'}}>
            <span style={{cursor: 'pointer'}}>
              Termos de uso
            </span>
            <span style={{cursor: 'pointer'}}>
              Privacidade
            </span>
          </span>
        </div>
      </div>
    </div>
    </div>
  );
}
