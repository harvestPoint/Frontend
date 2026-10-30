// Logística de Exportação: por onde e como a manga e a uva saem do Brasil.
// Dados oficiais do Comex Stat (via de transporte e porto/aeroporto de saída), via nosso backend.
import { useEffect, useState, type CSSProperties } from 'react';
import { fetchLogistica, formatDateTime, readApiError, type FatiaLogistica, type LogisticaProduto } from '@/lib/api';

const cartao: CSSProperties = { background: 'var(--hp-surface)', border: '1px solid var(--hp-border)', borderRadius: '16px', padding: '20px' };
const rotulo: CSSProperties = { fontSize: '11px', fontWeight: 700, letterSpacing: '.08em', color: 'var(--hp-text-3)' };

/** Lista de barras horizontais com a participação de cada item (%). */
function Barras({ titulo, itens, cor }: { titulo: string; itens?: FatiaLogistica[]; cor: string }) {
  return (
    <div>
      <div style={rotulo}>{titulo}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
        {(itens ?? []).map((item) => (
          <div key={item.nome}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', fontSize: '13px' }}>
              <span>{item.nome}</span>
              <span style={{ color: 'var(--hp-text-2)', whiteSpace: 'nowrap' }}>{item.participacao}%</span>
            </div>
            <div style={{ height: '6px', borderRadius: '4px', background: 'var(--hp-surface-2)', marginTop: '4px' }}>
              <div style={{ width: `${item.participacao}%`, height: '100%', borderRadius: '4px', background: cor }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function LogisticaPage() {
  const [produtos, setProdutos] = useState<LogisticaProduto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLogistica()
      .then(setProdutos)
      .catch((err) => setError(readApiError(err).message || 'Falha ao carregar dados de logística.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <div>
        <h1 style={{ margin: '0', fontFamily: "'Plus Jakarta Sans', Inter, sans-serif", fontSize: '28px', lineHeight: '34px', fontWeight: 700, letterSpacing: '-.01em' }}>
          Logística de Exportação
        </h1>
        <div style={{ fontSize: '12px', color: 'var(--hp-text-2)', marginTop: '4px' }}>
          Modal de transporte e local de saída das exportações brasileiras · Fonte: Comex Stat (MDIC)
        </div>
      </div>

      {loading ? <div style={{ fontSize: '14px', color: 'var(--hp-text-2)' }}>Consultando o Comex Stat...</div> : null}
      {error ? <div style={{ padding: '16px', background: 'var(--hp-critico-bg)', color: 'var(--hp-critico)', borderRadius: '12px' }}>{error}</div> : null}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
        {produtos.map((p) => (
          <div key={p.produto} style={cartao}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <div style={{ fontFamily: "'Plus Jakarta Sans', Inter, sans-serif", fontSize: '18px', fontWeight: 700 }}>{p.produto}</div>
              {p.total_kg != null ? (
                <div style={{ fontSize: '12px', color: 'var(--hp-text-2)' }}>
                  {(p.total_kg / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 0 })} t nos últimos 12 meses
                </div>
              ) : null}
            </div>

            {p.erro ? (
              <div style={{ color: 'var(--hp-critico)', fontSize: '13px', marginTop: '12px' }}>{p.erro}</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '16px' }}>
                <Barras titulo="MODAL DE TRANSPORTE" itens={p.modais} cor="var(--hp-accent)" />
                <Barras titulo="PORTO / AEROPORTO DE SAÍDA" itens={p.saidas} cor="var(--hp-info)" />
                <div style={{ fontSize: '11px', color: 'var(--hp-text-3)' }}>
                  NCM {p.ncm} · período {p.periodo?.from} a {p.periodo?.to} · {p.fonte === 'cache' ? 'cópia salva' : 'consulta ao vivo'} de {formatDateTime(p.atualizado_em)}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
