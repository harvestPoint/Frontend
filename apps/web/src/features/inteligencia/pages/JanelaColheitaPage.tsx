import { useState, useEffect } from 'react';
import { listRecomendacoes, aceitarRecomendacao, rejeitarRecomendacao, gerarRecomendacoes, formatDate, type Recomendacao } from '@/lib/api';

export default function JanelaColheitaPage() {
  const [recomendacoes, setRecomendacoes] = useState<Recomendacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [gerando, setGerando] = useState(false);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [error, setError] = useState('');

  async function loadData() {
    try {
      setLoading(true);
      setError('');
      const data = await listRecomendacoes();
      setRecomendacoes(Array.isArray(data) ? data : []);
    } catch (err: unknown) {
      const e = err as { message?: string };
      setError(e?.message || 'Falha ao carregar recomendações de colheita.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleGerar() {
    try {
      setGerando(true);
      await gerarRecomendacoes();
      await loadData();
    } catch {
      alert('Não foi possível gerar novas recomendações neste momento.');
    } finally {
      setGerando(false);
    }
  }

  async function handleAceitar(id: number) {
    try {
      setActionLoading(id);
      await aceitarRecomendacao(id);
      setRecomendacoes((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: 'ACEITA' } : r))
      );
    } catch {
      alert('Erro ao aceitar recomendação.');
    } finally {
      setActionLoading(null);
    }
  }

  async function handleRejeitar(id: number) {
    try {
      setActionLoading(id);
      await rejeitarRecomendacao(id);
      setRecomendacoes((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: 'REJEITADA' } : r))
      );
    } catch {
      alert('Erro ao rejeitar recomendação.');
    } finally {
      setActionLoading(null);
    }
  }

  function getStatusBadge(status: string) {
    const s = (status || '').toUpperCase();
    if (s === 'ACEITA') {
      return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', height: '22px', padding: '0 8px', borderRadius: '12px', background: 'var(--hp-accent-soft)', color: 'var(--hp-accent)', fontSize: '11px', fontWeight: '700' }}>
          ✓ ACEITA
        </span>
      );
    }
    if (s === 'REJEITADA') {
      return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', height: '22px', padding: '0 8px', borderRadius: '12px', background: 'var(--hp-surface-2)', color: 'var(--hp-text-3)', fontSize: '11px', fontWeight: '700' }}>
          ✕ REJEITADA
        </span>
      );
    }
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', height: '22px', padding: '0 8px', borderRadius: '12px', background: 'var(--hp-atencao-bg)', color: 'var(--hp-atencao)', fontSize: '11px', fontWeight: '700' }}>
        ● PENDENTE
      </span>
    );
  }

  if (loading) {
    return <div style={{ padding: '24px', fontSize: '14px', color: 'var(--hp-text-2)' }}>Carregando dados de colheita...</div>;
  }

  if (error) {
    return (
      <div style={{ padding: '20px', background: 'var(--hp-critico-bg)', color: 'var(--hp-critico)', borderRadius: '12px', margin: '20px 0' }}>
        {error}
      </div>
    );
  }

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '24px' }}>
        <div>
          <h1 style={{ margin: '0', fontFamily: "'Plus Jakarta Sans', Inter, sans-serif", fontSize: '28px', lineHeight: '34px', fontWeight: '700', letterSpacing: '-.01em' }}>
            Janela de Colheita (Inteligência Artificial)
          </h1>
          <div style={{ fontSize: '12px', color: 'var(--hp-text-2)', marginTop: '4px' }}>
            Previsão e janela ideal de safra calculadas pelo motor heurístico · {recomendacoes.length} recomendações
          </div>
        </div>
        <button
          type="button"
          onClick={handleGerar}
          disabled={gerando}
          style={{ height: '40px', padding: '0 16px', display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--hp-accent)', color: '#FFFFFF', borderRadius: '12px', fontSize: '13px', fontWeight: '600', border: 'none', cursor: gerando ? 'not-allowed' : 'pointer' }}
        >
          <span style={{ fontFamily: "'Material Symbols Outlined'", fontSize: '18px', lineHeight: '1' }}>
            {gerando ? 'autorenew' : 'psychology'}
          </span>
          {gerando ? 'Analisando...' : 'Recalcular Janelas'}
        </button>
      </div>

      {recomendacoes.length === 0 ? (
        <div style={{ background: 'var(--hp-surface)', border: '1px solid var(--hp-border)', borderRadius: '16px', padding: '40px', textAlign: 'center', marginTop: '20px', color: 'var(--hp-text-2)' }}>
          <span style={{ fontFamily: "'Material Symbols Outlined'", fontSize: '48px', color: 'var(--hp-text-3)', display: 'block', marginBottom: '8px' }}>
            psychology
          </span>
          <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--hp-text)' }}>Nenhuma recomendação disponível</div>
          <p style={{ fontSize: '13px', marginTop: '6px' }}>Clique em "Recalcular Janelas" ou envie novas leituras de sensores para a IA gerar estimativas.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px', marginTop: '20px' }}>
          {recomendacoes.map((rec) => {
            const isPendente = rec.status === 'PENDENTE';
            const diasRestantes = rec.dias_restantes ?? 0;
            const ciclo = rec.ciclo_medio_dias ?? 120;
            const decorridos = rec.dias_decorridos ?? 0;

            return (
              <div
                key={rec.id}
                style={{
                  background: 'var(--hp-surface)',
                  border: '1px solid var(--hp-border)',
                  borderTop: `4px solid ${rec.status === 'ACEITA' ? 'var(--hp-accent)' : rec.status === 'REJEITADA' ? 'var(--hp-border)' : 'var(--hp-atencao)'}`,
                  borderRadius: '16px',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-3)' }}>
                    LOTE {rec.lote_nome?.toUpperCase() || rec.lote_id} · {rec.cultura?.toUpperCase() || 'CULTURA'}
                  </div>
                  {getStatusBadge(rec.status)}
                </div>

                <div>
                  <div style={{ fontSize: '12px', color: 'var(--hp-text-2)' }}>Janela Recomendada</div>
                  <div style={{ fontSize: '22px', fontWeight: '700', marginTop: '4px', letterSpacing: '-0.02em', color: 'var(--hp-text)' }}>
                    {formatDate(rec.data_inicio)} – {formatDate(rec.data_fim)}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: 'var(--hp-surface-2)', borderRadius: '10px', fontSize: '12px' }}>
                  <span style={{ color: 'var(--hp-text-2)' }}>Grau de Confiança IA:</span>
                  <strong style={{ color: 'var(--hp-accent)', fontSize: '13px' }}>{rec.grau_confianca?.toFixed(1)}%</strong>
                </div>

                <div style={{ fontSize: '12px', color: 'var(--hp-text-2)' }}>
                  Ciclo: dia {decorridos} de {ciclo} dias {diasRestantes > 0 ? `· faltam ~${diasRestantes} dias` : '· ciclo concluído'}
                </div>

                {isPendente && (
                  <div style={{ display: 'flex', gap: '10px', marginTop: 'auto', paddingTop: '8px' }}>
                    <button
                      type="button"
                      disabled={actionLoading === rec.id}
                      onClick={() => handleAceitar(rec.id)}
                      style={{
                        flex: 1,
                        height: '36px',
                        background: 'var(--hp-accent)',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '10px',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer',
                      }}
                    >
                      {actionLoading === rec.id ? 'Salvando...' : 'Aceitar'}
                    </button>
                    <button
                      type="button"
                      disabled={actionLoading === rec.id}
                      onClick={() => handleRejeitar(rec.id)}
                      style={{
                        flex: 1,
                        height: '36px',
                        background: 'transparent',
                        color: 'var(--hp-text-2)',
                        border: '1px solid var(--hp-input-border)',
                        borderRadius: '10px',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer',
                      }}
                    >
                      Rejeitar
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
