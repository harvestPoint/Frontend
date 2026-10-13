import { useState, useEffect } from 'react';
import { listUsuarios, type AuthUser } from '@/lib/api';

export default function ProdutoresPage() {
  const [produtores, setProdutores] = useState<AuthUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busca, setBusca] = useState('');

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError('');
        const data = await listUsuarios('PRODUTOR');
        setProdutores(Array.isArray(data) ? data : []);
      } catch (err: unknown) {
        const e = err as { message?: string };
        setError(e?.message || 'Falha ao carregar produtores.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = produtores.filter((p) =>
    (p.nome || '').toLowerCase().includes(busca.toLowerCase()) ||
    (p.email || '').toLowerCase().includes(busca.toLowerCase()) ||
    (p.cpf_cnpj || '').includes(busca)
  );

  if (loading) {
    return <div style={{ padding: '24px', fontSize: '14px', color: 'var(--hp-text-2)' }}>Carregando produtores...</div>;
  }

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '24px' }}>
        <div>
          <h1 style={{ margin: '0', fontFamily: "'Plus Jakarta Sans', Inter, sans-serif", fontSize: '28px', lineHeight: '34px', fontWeight: '700', letterSpacing: '-.01em' }}>
            Produtores do Vale
          </h1>
          <div style={{ fontSize: '12px', color: 'var(--hp-text-2)', marginTop: '4px' }}>
            Produtores e cooperativas agrícolas cadastradas · {produtores.length} produtores
          </div>
        </div>
      </div>

      {error && (
        <div style={{ padding: '16px', background: 'var(--hp-critico-bg)', color: 'var(--hp-critico)', borderRadius: '12px', margin: '16px 0' }}>
          {error}
        </div>
      )}

      <div style={{ height: '64px', background: 'var(--hp-surface)', border: '1px solid var(--hp-border)', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '12px', padding: '0 16px', marginTop: '16px' }}>
        <div style={{ flex: '1', minWidth: '0', height: '44px', border: '1px solid var(--hp-input-border)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px', padding: '0 12px' }}>
          <span style={{ fontFamily: "'Material Symbols Outlined'", fontSize: '18px', lineHeight: '1', color: 'var(--hp-text-3)' }}>
            search
          </span>
          <input
            type="text"
            placeholder="Buscar por nome, e-mail ou CPF/CNPJ..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', fontSize: '14px', color: 'var(--hp-text)' }}
          />
        </div>
      </div>

      <div style={{ background: 'var(--hp-surface)', border: '1px solid var(--hp-border)', borderRadius: '16px', overflow: 'hidden', marginTop: '16px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ height: '48px', background: 'var(--hp-surface-2)' }}>
              <th style={{ textAlign: 'left', padding: '0 16px', fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-2)' }}>
                NOME / RAZÃO SOCIAL
              </th>
              <th style={{ textAlign: 'left', padding: '0 16px', fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-2)' }}>
                E-MAIL
              </th>
              <th style={{ textAlign: 'left', padding: '0 16px', fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-2)' }}>
                CPF / CNPJ
              </th>
              <th style={{ textAlign: 'left', padding: '0 16px', fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-2)' }}>
                TELEFONE
              </th>
              <th style={{ textAlign: 'left', padding: '0 16px', fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-2)' }}>
                FAZENDA PRINCIPAL
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '32px', textAlign: 'center', color: 'var(--hp-text-2)' }}>
                  Nenhum produtor encontrado.
                </td>
              </tr>
            ) : (
              filtered.map((prod) => (
                <tr key={prod.id} style={{ height: '52px', borderTop: '1px solid var(--hp-border)' }}>
                  <td style={{ padding: '0 16px', fontSize: '14px', fontWeight: '600', color: 'var(--hp-accent)' }}>
                    {prod.nome}
                  </td>
                  <td style={{ padding: '0 16px', fontSize: '14px', color: 'var(--hp-text)' }}>
                    {prod.email}
                  </td>
                  <td style={{ padding: '0 16px', fontSize: '13px', color: 'var(--hp-text-2)', fontVariantNumeric: 'tabular-nums' }}>
                    {prod.cpf_cnpj || '—'}
                  </td>
                  <td style={{ padding: '0 16px', fontSize: '13px', color: 'var(--hp-text-2)', fontVariantNumeric: 'tabular-nums' }}>
                    {prod.telefone || '—'}
                  </td>
                  <td style={{ padding: '0 16px', fontSize: '13px', color: 'var(--hp-text)' }}>
                    {prod.propriedade || 'Propriedade Padrão'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
