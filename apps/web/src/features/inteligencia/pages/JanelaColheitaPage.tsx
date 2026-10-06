// Janela de Colheita — redesign v2 · direção "1b Campo" (APLICAR.md §5 e
// especificacao.md §6): linha do tempo compartilhada com marcador de hoje,
// uma barra de janela por lote (mais clara quando a confiança é média) e um
// card por lote com a confiança em % e o bloco "Por que essa janela".

// TODO: substituir por dado real da API (modelo de janela de colheita:
// ciclo da cultura + graus-dia + Brix + previsão regional).
interface JanelaLote {
  lote: string;
  cultura: string;
  inicio: string; // ISO yyyy-mm-dd
  fim: string;
  confianca: number; // 0–100
  motivo: string;
}

const HOJE_MOCK = '2026-09-29';
const EIXO_INICIO = '2026-09-25';
const EIXO_FIM = '2026-11-21';
const MARCAS_EIXO = ['2026-10-01', '2026-10-15', '2026-11-01', '2026-11-15'];

const janelas: JanelaLote[] = [
  { lote: 'Lote C3', cultura: 'Uva Crimson', inicio: '2026-10-12', fim: '2026-10-18', confianca: 86, motivo: 'Brix em 16,8° (meta 17°) · ciclo no dia 108 de 120 · sem chuva prevista na janela.' },
  { lote: 'Lote A1', cultura: 'Manga Tommy', inicio: '2026-10-22', fim: '2026-10-29', confianca: 78, motivo: 'Graus-dia 1.840 de 2.200 · ciclo no dia 98 de 120 · estresse térmico pode adiantar 2 dias.' },
  { lote: 'Lote B2', cultura: 'Uva Itália', inicio: '2026-11-05', fim: '2026-11-12', confianca: 54, motivo: 'Faltam 37 dias; a previsão só cobre 7. A estimativa refina a cada semana.' },
];

const DIA_MS = 86_400_000;
const toDate = (iso: string) => new Date(iso + 'T00:00:00');
const diasEntre = (a: string, b: string) => Math.round((toDate(b).getTime() - toDate(a).getTime()) / DIA_MS);
const TOTAL_DIAS = diasEntre(EIXO_INICIO, EIXO_FIM);
const pos = (iso: string) => (diasEntre(EIXO_INICIO, iso) / TOTAL_DIAS) * 100;
const ddmm = (iso: string) => { const d = toDate(iso); return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`; };
const confiancaAlta = (c: number) => c >= 70;

export default function JanelaColheitaPage() {
  const ordenadas = [...janelas].sort((a, b) => a.inicio.localeCompare(b.inicio));

  return (
    <>
    <div>
      <h1 style={{margin: '0', fontFamily: "'Plus Jakarta Sans', Inter, sans-serif", fontSize: '26px', lineHeight: '32px', fontWeight: '700', letterSpacing: '-.01em'}}>
        Janela de Colheita
      </h1>
      <div style={{fontSize: '12px', color: 'var(--hp-text-2)', marginTop: '4px'}}>
        Estimada por ciclo da cultura, graus-dia e previsão regional · {janelas.length} lotes
      </div>
    </div>

    <div style={{background: 'var(--hp-surface)', border: '1px solid var(--hp-border)', borderRadius: 'var(--hp-radius)', padding: 'var(--hp-pad)', display: 'flex', flexDirection: 'column', gap: '18px'}}>
      <div style={{display: 'grid', gridTemplateColumns: '220px 1fr', gap: '16px', fontSize: '12px', color: 'var(--hp-text-3)'}}>
        <span />
        <div style={{position: 'relative', height: '16px'}}>
          {MARCAS_EIXO.map((m) => (
            <span key={m} style={{position: 'absolute', left: `${pos(m)}%`, transform: 'translateX(-50%)', fontVariantNumeric: 'tabular-nums'}}>{ddmm(m)}</span>
          ))}
        </div>
      </div>
      {ordenadas.map((j) => (
        <div key={j.lote} style={{display: 'grid', gridTemplateColumns: '220px 1fr', gap: '16px', alignItems: 'center'}}>
          <div>
            <div style={{fontSize: '14px', fontWeight: '700'}}>{j.lote} · {j.cultura}</div>
            <div style={{fontSize: '12px', color: 'var(--hp-text-2)', fontVariantNumeric: 'tabular-nums'}}>
              {ddmm(j.inicio)} – {ddmm(j.fim)} · faltam {diasEntre(HOJE_MOCK, j.inicio)} dias
            </div>
          </div>
          <div style={{position: 'relative', height: '28px', borderRadius: '6px', background: 'var(--hp-surface-2)'}}>
            <div style={{position: 'absolute', left: `${pos(HOJE_MOCK)}%`, top: '-4px', bottom: '-4px', width: '2px', background: 'var(--hp-text)'}} />
            <div style={{position: 'absolute', left: `${pos(j.inicio)}%`, width: `${pos(j.fim) - pos(j.inicio)}%`, top: 0, bottom: 0, borderRadius: '6px', background: 'var(--hp-accent)', opacity: confiancaAlta(j.confianca) ? 1 : 0.55}} />
          </div>
        </div>
      ))}
      <div style={{fontSize: '12px', color: 'var(--hp-text-2)', display: 'flex', alignItems: 'center', gap: '8px'}}>
        <span style={{width: '2px', height: '12px', background: 'var(--hp-text)', display: 'block'}} />
        hoje, {ddmm(HOJE_MOCK)} · barra mais clara = confiança média
      </div>
    </div>

    <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 'var(--hp-gap)'}}>
      {ordenadas.map((j) => {
        const alta = confiancaAlta(j.confianca);
        const cor = alta ? 'var(--hp-accent)' : 'var(--hp-atencao)';
        return (
          <div key={j.lote} style={{background: 'var(--hp-surface)', border: '1px solid var(--hp-border)', borderRadius: 'var(--hp-radius)', padding: 'var(--hp-pad)', display: 'flex', flexDirection: 'column', gap: '10px'}}>
            <div style={{fontSize: '14px', fontWeight: '700'}}>{j.lote} · {j.cultura}</div>
            <div style={{fontSize: '20px', fontWeight: '700', fontVariantNumeric: 'tabular-nums'}}>{ddmm(j.inicio)} – {ddmm(j.fim)}</div>
            <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '12px'}}>
              <span style={{color: 'var(--hp-text-2)'}}>Confiança</span>
              <span style={{fontWeight: '700', fontVariantNumeric: 'tabular-nums', color: alta ? 'var(--hp-text)' : 'var(--hp-atencao)'}}>
                {j.confianca} % · {alta ? 'alta' : 'média'}
              </span>
            </div>
            <div style={{height: '6px', borderRadius: '3px', background: 'var(--hp-surface-2)'}}>
              <div style={{width: `${j.confianca}%`, height: '6px', borderRadius: '3px', background: cor}} />
            </div>
            <div style={{fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-3)', marginTop: '4px'}}>
              POR QUE ESSA JANELA
            </div>
            <div style={{fontSize: '12px', lineHeight: '18px', color: 'var(--hp-text)'}}>{j.motivo}</div>
          </div>
        );
      })}
    </div>
    </>
  );
}
