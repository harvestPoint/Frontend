// Janela de Exportação: em quais meses o Brasil mais exporta manga e uva
// (dados oficiais do Comex Stat, via nosso backend) e se a colheita dos seus lotes
// cai nesses meses.
import { useEffect, useState, type CSSProperties } from 'react';
import { fetchExportacao, formatDate, formatDateTime, readApiError, type ExportacaoProduto, type JanelaExportacao } from '@/lib/api';

const MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
const cartao: CSSProperties = { background: 'var(--hp-surface)', border: '1px solid var(--hp-border)', borderRadius: '16px', padding: '20px' };
const rotulo: CSSProperties = { fontSize: '11px', fontWeight: 700, letterSpacing: '.08em', color: 'var(--hp-text-3)' };

/** 1234567 -> "1.234,6 t" (toneladas) */
function toneladas(kg?: number) {
  if (kg == null) return '--';
  return `${(kg / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 1 })} t`;
}

export default function JanelaExportacaoPage() {
  const [produtos, setProdutos] = useState<ExportacaoProduto[]>([]);
  const [janelas, setJanelas] = useState<JanelaExportacao[]>([]);
  const [ativo, setAtivo] = useState(0); // índice do produto na aba (0 = Manga, 1 = Uva)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchExportacao()
      .then((res) => {
        setProdutos(res.data);
        setJanelas(res.minhas_janelas);
      })
      .catch((err) => setError(readApiError(err).message || 'Falha ao carregar dados de exportação.'))
      .finally(() => setLoading(false));
  }, []);

  const produto = produtos[ativo];
  const maiorMes = Math.max(1, ...(produto?.media_por_mes ?? []).map((m) => m.kg_medio));

  return (
    <>
      <div>
        <h1 style={{ margin: '0', fontFamily: "'Plus Jakarta Sans', Inter, sans-serif", fontSize: '28px', lineHeight: '34px', fontWeight: 700, letterSpacing: '-.01em' }}>
          Janela de Exportação
        </h1>
        <div style={{ fontSize: '12px', color: 'var(--hp-text-2)', marginTop: '4px' }}>
          Meses de maior exportação brasileira e o encaixe da sua colheita · Fonte: Comex Stat (MDIC)
        </div>
      </div>

      {loading ? <div style={{ fontSize: '14px', color: 'var(--hp-text-2)' }}>Consultando o Comex Stat...</div> : null}
      {error ? <div style={{ padding: '16px', background: 'var(--hp-critico-bg)', color: 'var(--hp-critico)', borderRadius: '12px' }}>{error}</div> : null}

      {produtos.length > 0 ? (
        <>
          {/* Abas Manga / Uva */}
          <div style={{ display: 'flex', gap: '4px', background: 'var(--hp-surface-2)', borderRadius: '12px', padding: '3px', alignSelf: 'flex-start', width: 'fit-content' }}>
            {produtos.map((p, i) => (
              <button
                key={p.produto}
                type="button"
                onClick={() => setAtivo(i)}
                style={{ border: 'none', borderRadius: '8px', padding: '8px 16px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', background: i === ativo ? 'var(--hp-surface)' : 'transparent', color: i === ativo ? 'var(--hp-text)' : 'var(--hp-text-2)' }}
              >
                {p.produto}
              </button>
            ))}
          </div>

          {produto?.erro ? (
            <div style={{ ...cartao, color: 'var(--hp-critico)' }}>{produto.erro}</div>
          ) : produto ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
              {/* Volume médio por mês */}
              <div style={cartao}>
                <div style={rotulo}>VOLUME MÉDIO EXPORTADO POR MÊS</div>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '180px', marginTop: '16px' }}>
                  {(produto.media_por_mes ?? []).map((m) => {
                    const pico = produto.meses_pico?.includes(m.mes);
                    return (
                      <div key={m.mes} title={`${m.nome}: ${toneladas(m.kg_medio)}`} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', height: '100%', justifyContent: 'flex-end' }}>
                        <div style={{ width: '100%', height: `${(m.kg_medio / maiorMes) * 100}%`, minHeight: '2px', borderRadius: '6px 6px 2px 2px', background: pico ? 'var(--hp-accent)' : 'var(--hp-border)' }} />
                        <span style={{ fontSize: '11px', color: pico ? 'var(--hp-accent)' : 'var(--hp-text-2)', fontWeight: pico ? 700 : 400 }}>{m.nome}</span>
                      </div>
                    );
                  })}
                </div>
                <div style={{ fontSize: '13px', color: 'var(--hp-text-2)', marginTop: '14px' }}>
                  Janela de maior demanda: <b style={{ color: 'var(--hp-accent)' }}>{(produto.meses_pico ?? []).map((m) => MESES[m - 1]).join(', ') || '--'}</b>
                </div>
              </div>

              {/* Números e destinos */}
              <div style={cartao}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <div style={rotulo}>ÚLTIMOS 12 MESES</div>
                    <div style={{ fontSize: '24px', fontWeight: 700, marginTop: '6px' }}>{toneladas(produto.total_kg_12m)}</div>
                    <div style={{ fontSize: '12px', color: 'var(--hp-text-2)' }}>US$ {(produto.total_fob_usd_12m ?? 0).toLocaleString('pt-BR')}</div>
                  </div>
                  <div>
                    <div style={rotulo}>PREÇO MÉDIO FOB</div>
                    <div style={{ fontSize: '24px', fontWeight: 700, marginTop: '6px' }}>
                      {produto.preco_medio_usd_kg != null ? `US$ ${produto.preco_medio_usd_kg.toFixed(2)}` : '--'}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--hp-text-2)' }}>por kg embarcado</div>
                  </div>
                </div>
                <div style={{ ...rotulo, marginTop: '20px' }}>PRINCIPAIS DESTINOS</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                  {(produto.top_destinos ?? []).map((d) => (
                    <div key={d.pais}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                        <span>{d.pais}</span>
                        <span style={{ color: 'var(--hp-text-2)' }}>{d.participacao}%</span>
                      </div>
                      <div style={{ height: '6px', borderRadius: '4px', background: 'var(--hp-surface-2)', marginTop: '4px' }}>
                        <div style={{ width: `${d.participacao}%`, height: '100%', borderRadius: '4px', background: 'var(--hp-info)' }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--hp-text-3)', marginTop: '16px' }}>
                  NCM {produto.ncm} · {produto.fonte === 'cache' ? 'cópia salva' : 'consulta ao vivo'} de {formatDateTime(produto.atualizado_em)}
                </div>
              </div>
            </div>
          ) : null}

          {/* Cruzamento com as janelas de colheita dos lotes */}
          <div style={cartao}>
            <div style={{ fontFamily: "'Plus Jakarta Sans', Inter, sans-serif", fontSize: '16px', fontWeight: 600 }}>Sua colheita × janela de exportação</div>
            <div style={{ fontSize: '12px', color: 'var(--hp-text-2)', marginTop: '4px' }}>
              Recomendações de colheita (pendentes ou aceitas) dos seus lotes, comparadas com os meses de pico
            </div>
            {janelas.length === 0 ? (
              <div style={{ fontSize: '13px', color: 'var(--hp-text-2)', marginTop: '14px' }}>
                Nenhuma janela de colheita ainda. Gere em Inteligência → Janela de colheita.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '14px' }}>
                {janelas.map((j) => (
                  <div key={j.id} style={{ border: '1px solid var(--hp-border)', borderRadius: '12px', padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 600 }}>{j.lote_nome} · {j.cultura}</div>
                      <div style={{ fontSize: '12px', color: 'var(--hp-text-2)', marginTop: '2px' }}>
                        Colheita de {formatDate(j.data_inicio)} a {formatDate(j.data_fim)} ({j.meses_colheita.map((m) => MESES[m - 1]).join(', ')})
                      </div>
                    </div>
                    <span style={{ fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '12px', background: j.em_alta_demanda ? 'var(--hp-accent-soft)' : 'var(--hp-surface-2)', color: j.em_alta_demanda ? 'var(--hp-accent)' : 'var(--hp-text-2)' }}>
                      {!j.produto_exportacao ? 'Cultura sem dado de exportação' : j.em_alta_demanda ? '✓ Em mês de alta exportação' : 'Fora do pico de exportação'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      ) : null}
    </>
  );
}
