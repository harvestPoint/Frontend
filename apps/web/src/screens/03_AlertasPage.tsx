import { useState, useEffect } from 'react';
import { listAlertas, resolverAlerta, type Alerta } from '@/lib/api';

function getSeveridade(tipo: string): { label: string; color: string } {
  const t = (tipo || '').toUpperCase();
  if (t.includes('CRITICO') || t.includes('ALTA') || t.includes('ESTRESSE')) {
    return { label: 'crítico', color: 'var(--hp-critico)' };
  }
  if (t.includes('BAIXA') || t.includes('ATENCAO')) {
    return { label: 'atenção', color: 'var(--hp-atencao)' };
  }
  return { label: 'informação', color: 'var(--hp-info)' };
}

export default function AlertasPage() {
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [resolvendo, setResolvendo] = useState<number | null>(null);

  // Filtros reais
  const [busca, setBusca] = useState('');
  const [filtroSeveridade, setFiltroSeveridade] = useState('TODAS');
  const [filtroStatus, setFiltroStatus] = useState('TODOS');

  async function load() {
    try {
      setLoading(true);
      setError('');
      const res = await listAlertas();
      const list = Array.isArray(res) ? res : (res as { data: Alerta[] }).data ?? [];
      setAlertas(list);
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string; error?: string } }; message?: string };
      setError(err?.response?.data?.message || err?.response?.data?.error || err?.message || 'Erro ao buscar alertas');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleResolver(id: number) {
    try {
      setResolvendo(id);
      await resolverAlerta(id);
      setAlertas((prev) => prev.map((a) => (a.id === id ? { ...a, resolvido: true } : a)));
    } catch {
      alert('Erro ao resolver alerta');
    } finally {
      setResolvendo(null);
    }
  }

  const alertasFiltrados = alertas.filter((a) => {
    // Busca por mensagem, lote ou sensor
    const q = busca.toLowerCase();
    const matchBusca =
      !busca.trim() ||
      (a.mensagem || '').toLowerCase().includes(q) ||
      (a.lote_nome || '').toLowerCase().includes(q) ||
      (a.sensor_codigo || '').toLowerCase().includes(q) ||
      (a.tipo || '').toLowerCase().includes(q);

    // Severidade condizente com o banco
    const sev = getSeveridade(a.tipo).label;
    const matchSev =
      filtroSeveridade === 'TODAS' ||
      (filtroSeveridade === 'CRITICO' && sev === 'crítico') ||
      (filtroSeveridade === 'ATENCAO' && sev === 'atenção') ||
      (filtroSeveridade === 'INFORMACAO' && sev === 'informação');

    // Status condizente com o campo resolvido do banco
    const matchStatus =
      filtroStatus === 'TODOS' ||
      (filtroStatus === 'ABERTO' && !a.resolvido) ||
      (filtroStatus === 'RESOLVIDO' && a.resolvido);

    return matchBusca && matchSev && matchStatus;
  });

  const abertosCount = alertas.filter((a) => !a.resolvido).length;

  if (loading) return <div style={{ padding: '24px', color: 'var(--hp-text-2)' }}>Carregando alertas...</div>;
  if (error) return <div style={{ padding: '20px', color: 'var(--hp-critico)', background: 'var(--hp-critico-bg)', borderRadius: '12px' }}>{error}</div>;

  return (
    <>
      <div>
        <h1 style={{ margin: '0', fontFamily: "'Plus Jakarta Sans', Inter, sans-serif", fontSize: '28px', lineHeight: '34px', fontWeight: '700', letterSpacing: '-.01em' }}>
          Alertas do Campo
        </h1>
        <div style={{ fontSize: '12px', color: 'var(--hp-text-2)', marginTop: '4px' }}>
          Notificações climáticas e desvios de microclima · {abertosCount} pendente{abertosCount === 1 ? '' : 's'}
        </div>
      </div>

      {/* Barra de Filtros Totalmente Funcional */}
      <div style={{ height: '64px', background: 'var(--hp-surface)', border: '1px solid var(--hp-border)', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '12px', padding: '0 16px' }}>
        <div style={{ flex: '1', minWidth: '0', height: '44px', border: '1px solid var(--hp-input-border)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px', padding: '0 12px' }}>
          <span style={{ fontFamily: "'Material Symbols Outlined'", fontSize: '18px', lineHeight: '1', color: 'var(--hp-text-3)' }}>
            search
          </span>
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por alerta, lote ou sensor..."
            style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', fontSize: '14px', color: 'var(--hp-text)' }}
          />
          {busca && (
            <span
              style={{ fontFamily: "'Material Symbols Outlined'", fontSize: '18px', cursor: 'pointer', color: 'var(--hp-text-3)' }}
              onClick={() => setBusca('')}
            >
              close
            </span>
          )}
        </div>

        {/* Filtro Severidade */}
        <select
          value={filtroSeveridade}
          onChange={(e) => setFiltroSeveridade(e.target.value)}
          style={{
            height: '44px',
            padding: '0 14px',
            borderRadius: '12px',
            border: '1px solid var(--hp-input-border)',
            background: 'var(--hp-surface)',
            color: 'var(--hp-text)',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          <option value="TODAS">Todas as Severidades</option>
          <option value="CRITICO">Crítico (Alta/Estresse)</option>
          <option value="ATENCAO">Atenção (Baixa)</option>
          <option value="INFORMACAO">Informação</option>
        </select>

        {/* Filtro Status (Banco de Dados: resolvido true/false) */}
        <select
          value={filtroStatus}
          onChange={(e) => setFiltroStatus(e.target.value)}
          style={{
            height: '44px',
            padding: '0 14px',
            borderRadius: '12px',
            border: '1px solid var(--hp-input-border)',
            background: 'var(--hp-surface)',
            color: 'var(--hp-text)',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          <option value="TODOS">Todos os Status</option>
          <option value="ABERTO">Aberto (Não resolvido)</option>
          <option value="RESOLVIDO">Resolvido</option>
        </select>
      </div>

      {/* Tabela de Alertas */}
      <div style={{ background: 'var(--hp-surface)', border: '1px solid var(--hp-border)', borderRadius: '16px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
          <thead>
            <tr style={{ height: '48px', background: 'var(--hp-surface-2)' }}>
              <th style={{ width: '12%', textAlign: 'left', padding: '0 16px', fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-2)' }}>
                SEVERIDADE
              </th>
              <th style={{ width: '38%', textAlign: 'left', padding: '0 16px', fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-2)' }}>
                MENSAGEM DO ALERTA
              </th>
              <th style={{ width: '12%', textAlign: 'left', padding: '0 16px', fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-2)' }}>
                LOTE
              </th>
              <th style={{ width: '14%', textAlign: 'left', padding: '0 16px', fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-2)' }}>
                TIPO (BANCO)
              </th>
              <th style={{ width: '14%', textAlign: 'left', padding: '0 16px', fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-2)' }}>
                DATA / HORA
              </th>
              <th style={{ width: '10%', textAlign: 'center', padding: '0 16px', fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-2)' }}>
                AÇÕES
              </th>
            </tr>
          </thead>
          <tbody>
            {alertasFiltrados.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '36px 16px', textAlign: 'center', fontSize: '14px', color: 'var(--hp-text-2)' }}>
                  {alertas.length === 0 ? 'Nenhum alerta registrado no sistema.' : 'Nenhum alerta corresponde aos filtros selecionados.'}
                </td>
              </tr>
            ) : (
              alertasFiltrados.map((alerta) => {
                const sev = getSeveridade(alerta.tipo);
                return (
                  <tr key={alerta.id} style={{ height: '52px', borderTop: '1px solid var(--hp-border)' }}>
                    <td style={{ padding: '0 16px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '600', color: sev.color }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: sev.color, display: 'inline-block' }} />
                        {sev.label}
                      </span>
                    </td>
                    <td style={{ padding: '0 16px', fontSize: '14px', color: 'var(--hp-text)' }}>
                      {alerta.mensagem}
                    </td>
                    <td style={{ padding: '0 16px', fontSize: '14px', color: 'var(--hp-accent)', fontWeight: '600' }}>
                      {alerta.lote_nome || '-'}
                    </td>
                    <td style={{ padding: '0 16px', fontSize: '12px', color: 'var(--hp-text-2)', fontFamily: "'JetBrains Mono', monospace" }}>
                      {alerta.tipo || '—'}
                    </td>
                    <td style={{ padding: '0 16px', fontSize: '13px', color: 'var(--hp-text-2)' }}>
                      {new Date(alerta.data_hora).toLocaleString('pt-BR')}
                    </td>
                    <td style={{ padding: '0 16px', textAlign: 'center' }}>
                      {alerta.resolvido ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', height: '24px', padding: '0 8px', borderRadius: '12px', background: 'var(--hp-accent-soft)', color: 'var(--hp-accent)', fontSize: '11px', fontWeight: '700' }}>
                          ✓ RESOLVIDO
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleResolver(alerta.id)}
                          disabled={resolvendo === alerta.id}
                          style={{
                            height: '28px',
                            padding: '0 12px',
                            borderRadius: '8px',
                            border: '1px solid var(--hp-input-border)',
                            background: 'var(--hp-surface)',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            color: 'var(--hp-text)',
                            opacity: resolvendo === alerta.id ? 0.6 : 1,
                          }}
                        >
                          {resolvendo === alerta.id ? '...' : 'Resolver'}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
