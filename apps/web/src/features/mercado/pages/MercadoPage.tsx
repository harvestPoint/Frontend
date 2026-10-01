import { useState, useEffect } from 'react';
import { listMercado, formatDate, type PrecoMercado } from '@/lib/api';

export default function MercadoPage() {
  const [precos, setPrecos] = useState<PrecoMercado[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError('');
        const res = await listMercado();
        const list = Array.isArray(res) ? res : res.data ?? [];
        setPrecos(list);
      } catch (err: unknown) {
        const e = err as { message?: string };
        setError(e?.message || 'Falha ao carregar cotações de mercado.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return <div style={{ padding: '24px', fontSize: '14px', color: 'var(--hp-text-2)' }}>Carregando dados de mercado...</div>;
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
      <div>
        <h1 style={{ margin: '0', fontFamily: "'Plus Jakarta Sans', Inter, sans-serif", fontSize: '28px', lineHeight: '34px', fontWeight: '700', letterSpacing: '-.01em' }}>
          Mercado & Preços
        </h1>
        <div style={{ fontSize: '12px', color: 'var(--hp-text-2)', marginTop: '4px' }}>
          Cotações de mercado e referência de exportação
        </div>
      </div>

      {precos.length === 0 ? (
        <div style={{ background: 'var(--hp-surface)', border: '1px solid var(--hp-border)', borderRadius: '16px', padding: '48px 24px', textAlign: 'center', marginTop: '20px' }}>
          <span style={{ fontFamily: "'Material Symbols Outlined'", fontSize: '48px', color: 'var(--hp-text-3)', display: 'block', marginBottom: '12px' }}>
            payments
          </span>
          <div style={{ fontSize: '16px', fontWeight: '700', color: 'var(--hp-text)' }}>
            Nenhuma cotação de mercado disponível no momento
          </div>
          <p style={{ fontSize: '13px', color: 'var(--hp-text-2)', maxWidth: '480px', margin: '8px auto 0', lineHeight: '20px' }}>
            A integração com a API de preços agrícolas e cotações de exportação será conectada em breve.
          </p>
        </div>
      ) : (
        <div style={{ background: 'var(--hp-surface)', border: '1px solid var(--hp-border)', borderRadius: '16px', overflow: 'hidden', marginTop: '20px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
            <thead>
              <tr style={{ height: '48px', background: 'var(--hp-surface-2)' }}>
                <th style={{ width: '35%', textAlign: 'left', padding: '0 16px', fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-2)' }}>
                  CULTURA
                </th>
                <th style={{ width: '20%', textAlign: 'left', padding: '0 16px', fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-2)' }}>
                  MOEDA
                </th>
                <th style={{ width: '25%', textAlign: 'right', padding: '0 16px', fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-2)' }}>
                  PREÇO MÉDIO
                </th>
                <th style={{ width: '20%', textAlign: 'right', padding: '0 16px', fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-2)' }}>
                  DATA DA COTAÇÃO
                </th>
              </tr>
            </thead>
            <tbody>
              {precos.map((p) => (
                <tr key={p.id} style={{ height: '52px', borderTop: '1px solid var(--hp-border)' }}>
                  <td style={{ padding: '0 16px', fontSize: '14px', fontWeight: '600', color: 'var(--hp-text)' }}>
                    {p.cultura_nome || `Cultura #${p.cultura_id}`}
                  </td>
                  <td style={{ padding: '0 16px', fontSize: '14px', color: 'var(--hp-text-2)' }}>
                    {p.moeda}
                  </td>
                  <td style={{ padding: '0 16px', textAlign: 'right', fontSize: '14px', fontWeight: '600', color: 'var(--hp-accent)', fontVariantNumeric: 'tabular-nums' }}>
                    {p.moeda} {Number(p.preco_medio).toFixed(2)} / kg
                  </td>
                  <td style={{ padding: '0 16px', textAlign: 'right', fontSize: '14px', color: 'var(--hp-text-2)', fontVariantNumeric: 'tabular-nums' }}>
                    {formatDate(p.data_cotacao)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
