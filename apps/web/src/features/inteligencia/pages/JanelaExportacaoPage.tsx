// Janela de Exportação — redesign v2 · direção "1b Campo" (APLICAR.md §5 e
// especificacao.md §6): Gantt por rota com três segmentos — colheita
// (acento), packing e embarque (neutro) e trânsito (info) —, terminando em
// "chega dd/mm"; e um card por rota com embarque, preço no destino, demanda,
// pílula de situação e uma frase de folga ou risco.

// TODO: substituir por dado real da API (janela de colheita do lote +
// logística da rota + preço/demanda do destino).
interface RotaExportacao {
  rota: string;
  detalhe: string;
  colheita: [string, string]; // ISO, fim exclusivo
  embarque: [string, string];
  transito: [string, string];
  confiancaColheitaAlta: boolean;
  embarqueLabel: string;
  preco: string;
  demanda: string;
  situacao: 'janela boa' | 'confirmar colheita';
  nota: string;
}

const EIXO_INICIO = '2026-10-20';
const EIXO_FIM = '2026-11-25';
const MARCAS_EIXO = ['2026-10-20', '2026-11-01', '2026-11-15', '2026-11-25'];

const rotas: RotaExportacao[] = [
  {
    rota: 'Manga → União Europeia',
    detalhe: 'Lote A1 · marítimo · Rotterdam',
    colheita: ['2026-10-22', '2026-10-30'],
    embarque: ['2026-10-30', '2026-11-03'],
    transito: ['2026-11-03', '2026-11-18'],
    confiancaColheitaAlta: true,
    embarqueLabel: '30/10 – 02/11',
    preco: 'EUR 2,80 ▲',
    demanda: '1.500 t',
    situacao: 'janela boa',
    nota: 'Chega a Rotterdam antes do pico de demanda de dezembro. Folga de 3 dias se a colheita atrasar.',
  },
  {
    rota: 'Uva → Estados Unidos',
    detalhe: 'Lote B2 · aéreo · Miami',
    colheita: ['2026-11-05', '2026-11-13'],
    embarque: ['2026-11-13', '2026-11-14'],
    transito: ['2026-11-14', '2026-11-15'],
    confiancaColheitaAlta: false,
    embarqueLabel: '13/11',
    preco: 'USD 3,20 ▬',
    demanda: '820 t',
    situacao: 'confirmar colheita',
    nota: 'Colheita do B2 ainda com confiança média. Reservar o voo só depois da estimativa de 22/10.',
  },
];

const DIA_MS = 86_400_000;
const toDate = (iso: string) => new Date(iso + 'T00:00:00');
const diasEntre = (a: string, b: string) => Math.round((toDate(b).getTime() - toDate(a).getTime()) / DIA_MS);
const TOTAL_DIAS = diasEntre(EIXO_INICIO, EIXO_FIM);
const pos = (iso: string) => (diasEntre(EIXO_INICIO, iso) / TOTAL_DIAS) * 100;
const larg = ([a, b]: [string, string]) => pos(b) - pos(a);
const ddmm = (iso: string) => { const d = toDate(iso); return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`; };

function Legenda({ cor, texto }: { cor: string; texto: string }) {
  return (
    <span style={{display: 'flex', alignItems: 'center', gap: '6px'}}>
      <span style={{width: '14px', height: '8px', borderRadius: '2px', background: cor, display: 'block'}} />
      {texto}
    </span>
  );
}

export default function JanelaExportacaoPage() {
  return (
    <>
    <div>
      <h1 style={{margin: '0', fontFamily: "'Plus Jakarta Sans', Inter, sans-serif", fontSize: '26px', lineHeight: '32px', fontWeight: '700', letterSpacing: '-.01em'}}>
        Janela de Exportação
      </h1>
      <div style={{fontSize: '12px', color: 'var(--hp-text-2)', marginTop: '4px'}}>
        Da colheita até a chegada no destino · {rotas.length} rotas planejadas
      </div>
    </div>

    <div style={{background: 'var(--hp-surface)', border: '1px solid var(--hp-border)', borderRadius: 'var(--hp-radius)', padding: 'var(--hp-pad)', display: 'flex', flexDirection: 'column', gap: '22px'}}>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px'}}>
        <div style={{display: 'flex', gap: '16px', fontSize: '12px', color: 'var(--hp-text-2)'}}>
          <Legenda cor="var(--hp-accent)" texto="Colheita" />
          <Legenda cor="var(--hp-text-3)" texto="Packing e embarque" />
          <Legenda cor="var(--hp-info)" texto="Trânsito" />
        </div>
        <div style={{fontSize: '12px', color: 'var(--hp-text-3)', fontVariantNumeric: 'tabular-nums'}}>{ddmm(EIXO_INICIO)} → {ddmm(EIXO_FIM)}</div>
      </div>
      <div style={{display: 'grid', gridTemplateColumns: '240px 1fr', gap: '16px', fontSize: '12px', color: 'var(--hp-text-3)'}}>
        <span />
        <div style={{position: 'relative', height: '16px'}}>
          {MARCAS_EIXO.map((m, i) => (
            <span
              key={m}
              style={{
                position: 'absolute',
                left: i === MARCAS_EIXO.length - 1 ? undefined : `${pos(m)}%`,
                right: i === MARCAS_EIXO.length - 1 ? 0 : undefined,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {ddmm(m)}
            </span>
          ))}
        </div>
      </div>
      {rotas.map((r) => (
        <div key={r.rota} style={{display: 'grid', gridTemplateColumns: '240px 1fr', gap: '16px', alignItems: 'center'}}>
          <div>
            <div style={{fontSize: '14px', fontWeight: '700'}}>{r.rota}</div>
            <div style={{fontSize: '12px', color: 'var(--hp-text-2)'}}>{r.detalhe}</div>
          </div>
          <div style={{position: 'relative', height: '28px', borderRadius: '6px', background: 'var(--hp-surface-2)'}}>
            <div style={{position: 'absolute', left: `${pos(r.colheita[0])}%`, width: `${larg(r.colheita)}%`, top: 0, bottom: 0, borderRadius: '6px 0 0 6px', background: 'var(--hp-accent)', opacity: r.confiancaColheitaAlta ? 1 : 0.55}} />
            <div style={{position: 'absolute', left: `${pos(r.embarque[0])}%`, width: `${larg(r.embarque)}%`, top: 0, bottom: 0, background: 'var(--hp-text-3)'}} />
            <div style={{position: 'absolute', left: `${pos(r.transito[0])}%`, width: `${larg(r.transito)}%`, top: 0, bottom: 0, borderRadius: '0 6px 6px 0', background: 'var(--hp-info)'}} />
            <span style={{position: 'absolute', left: `calc(${pos(r.transito[1])}% + 8px)`, top: '5px', fontSize: '12px', fontWeight: '700', whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums'}}>
              chega {ddmm(r.transito[1])}
            </span>
          </div>
        </div>
      ))}
    </div>

    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--hp-gap)'}}>
      {rotas.map((r) => {
        const boa = r.situacao === 'janela boa';
        return (
          <div key={r.rota} style={{background: 'var(--hp-surface)', border: '1px solid var(--hp-border)', borderRadius: 'var(--hp-radius)', padding: 'var(--hp-pad)', display: 'flex', flexDirection: 'column', gap: '10px'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px'}}>
              <div style={{fontSize: '14px', fontWeight: '700'}}>{r.rota}</div>
              <span style={{display: 'inline-flex', alignItems: 'center', gap: '6px', height: '24px', padding: '0 10px', borderRadius: '12px', background: boa ? 'var(--hp-accent-soft)' : 'var(--hp-atencao-bg)', color: boa ? 'var(--hp-accent-hover)' : 'var(--hp-atencao)', fontSize: '12px', fontWeight: '600', whiteSpace: 'nowrap'}}>
                <span style={{width: '6px', height: '6px', borderRadius: '50%', background: boa ? 'var(--hp-accent)' : 'var(--hp-atencao)'}} />
                {r.situacao}
              </span>
            </div>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', fontSize: '12px', color: 'var(--hp-text-2)'}}>
              <div>Embarque<div style={{fontSize: '14px', fontWeight: '700', color: 'var(--hp-text)', fontVariantNumeric: 'tabular-nums'}}>{r.embarqueLabel}</div></div>
              <div>Preço no destino<div style={{fontSize: '14px', fontWeight: '700', color: 'var(--hp-text)', fontVariantNumeric: 'tabular-nums'}}>{r.preco}</div></div>
              <div>Demanda<div style={{fontSize: '14px', fontWeight: '700', color: 'var(--hp-text)', fontVariantNumeric: 'tabular-nums'}}>{r.demanda}</div></div>
            </div>
            <div style={{fontSize: '12px', lineHeight: '18px', color: 'var(--hp-text-2)', paddingTop: '10px', borderTop: '1px solid var(--hp-border)'}}>{r.nota}</div>
          </div>
        );
      })}
    </div>
    </>
  );
}
