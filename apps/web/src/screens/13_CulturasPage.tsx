import React, { useState, useEffect } from 'react';
import { listCulturas, createCultura, updateCultura, deleteCultura, readApiError, type Cultura } from '@/lib/api';
import { paraNumero } from '@/lib/validacao';

export default function CulturasPage() {
  const [culturas, setCulturas] = useState<Cultura[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busca, setBusca] = useState('');

  // Form state (o mesmo formulário serve para criar e para editar)
  const [showForm, setShowForm] = useState(false);
  const [editando, setEditando] = useState<Cultura | null>(null);
  const [formErro, setFormErro] = useState('');
  const [saving, setSaving] = useState(false);
  const [nome, setNome] = useState('');
  const [ciclo, setCiclo] = useState('120');
  const [tempMin, setTempMin] = useState('20.0');
  const [tempMax, setTempMax] = useState('32.0');
  const [umidMin, setUmidMin] = useState('50.0');
  const [umidMax, setUmidMax] = useState('80.0');

  async function loadData() {
    try {
      setLoading(true);
      setError('');
      const data = await listCulturas();
      setCulturas(Array.isArray(data) ? data : []);
    } catch (err: unknown) {
      setError(readApiError(err).message || 'Falha ao carregar culturas.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function preencher(c: { nome: string; ciclo: string; tMin: string; tMax: string; uMin: string; uMax: string }) {
    setNome(c.nome);
    setCiclo(c.ciclo);
    setTempMin(c.tMin);
    setTempMax(c.tMax);
    setUmidMin(c.uMin);
    setUmidMax(c.uMax);
  }

  function abrirNovo() {
    setEditando(null);
    setFormErro('');
    preencher({ nome: '', ciclo: '120', tMin: '20.0', tMax: '32.0', uMin: '50.0', uMax: '80.0' });
    setShowForm(true);
  }

  function abrirEdicao(c: Cultura) {
    setEditando(c);
    setFormErro('');
    preencher({
      nome: c.nome,
      ciclo: String(c.ciclo_medio_dias),
      tMin: String(c.temperatura_min),
      tMax: String(c.temperatura_max),
      uMin: String(c.umidade_min),
      uMax: String(c.umidade_max),
    });
    setShowForm(true);
  }

  function fecharForm() {
    setShowForm(false);
    setEditando(null);
    setFormErro('');
  }

  async function handleSalvar(e: React.FormEvent) {
    e.preventDefault();
    if (saving) return;
    // Antes "Number(x) || padrão" trocava 0 ou texto inválido por um valor padrão sem avisar
    const dados = {
      nome: nome.trim(),
      ciclo_medio_dias: paraNumero(ciclo),
      temperatura_min: paraNumero(tempMin),
      temperatura_max: paraNumero(tempMax),
      umidade_min: paraNumero(umidMin),
      umidade_max: paraNumero(umidMax),
    };
    const problemas: string[] = [];
    if (!dados.nome) problemas.push('Informe o nome da cultura');
    if (!(dados.ciclo_medio_dias > 0)) problemas.push('Ciclo em dias, maior que zero');
    if ([dados.temperatura_min, dados.temperatura_max, dados.umidade_min, dados.umidade_max].some(Number.isNaN)) {
      problemas.push('Preencha as faixas de temperatura e umidade com números');
    } else {
      if (dados.temperatura_min > dados.temperatura_max) problemas.push('Temperatura mínima maior que a máxima');
      if (dados.umidade_min > dados.umidade_max) problemas.push('Umidade mínima maior que a máxima');
    }
    if (problemas.length > 0) {
      setFormErro(problemas.join(' · '));
      return;
    }

    try {
      setSaving(true);
      setFormErro('');
      if (editando) {
        const salva = await updateCultura(editando.id, dados);
        setCulturas((prev) => prev.map((c) => (c.id === salva.id ? salva : c)));
      } else {
        const nova = await createCultura(dados);
        setCulturas((prev) => [nova, ...prev]);
      }
      fecharForm();
    } catch (err: unknown) {
      const apiErr = readApiError(err);
      setFormErro(apiErr.details?.join(' · ') || apiErr.message || 'Erro ao salvar cultura.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(c: Cultura) {
    if (!window.confirm(`Excluir a cultura "${c.nome}"?`)) return;
    try {
      setError('');
      await deleteCultura(c.id);
      setCulturas((prev) => prev.filter((x) => x.id !== c.id));
    } catch (err: unknown) {
      // ex.: 409 "Esta cultura está em uso por 2 lote(s)..."
      setError(readApiError(err).message || 'Erro ao excluir cultura.');
    }
  }

  const filtered = culturas.filter((c) =>
    (c.nome || '').toLowerCase().includes(busca.toLowerCase())
  );

  if (loading) {
    return <div style={{ padding: '24px', fontSize: '14px', color: 'var(--hp-text-2)' }}>Carregando culturas...</div>;
  }

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '24px' }}>
        <div>
          <h1 style={{ margin: '0', fontFamily: "'Plus Jakarta Sans', Inter, sans-serif", fontSize: '28px', lineHeight: '34px', fontWeight: '700', letterSpacing: '-.01em' }}>
            Culturas Agrícolas
          </h1>
          <div style={{ fontSize: '12px', color: 'var(--hp-text-2)', marginTop: '4px' }}>
            Base de conhecimento agronômico e limites de microclima · {culturas.length} culturas cadastradas
          </div>
        </div>
        <button
          type="button"
          onClick={() => (showForm ? fecharForm() : abrirNovo())}
          style={{ height: '40px', padding: '0 16px', display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--hp-accent)', color: '#FFFFFF', borderRadius: '12px', fontSize: '13px', fontWeight: '600', border: 'none', cursor: 'pointer' }}
        >
          <span style={{ fontFamily: "'Material Symbols Outlined'", fontSize: '18px', lineHeight: '1' }}>
            {showForm ? 'close' : 'add'}
          </span>
          {showForm ? 'Cancelar' : 'Nova cultura'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSalvar} noValidate style={{ background: 'var(--hp-surface)', border: '1px solid var(--hp-accent)', borderRadius: '16px', padding: '20px', marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ fontWeight: '700', fontSize: '15px', color: 'var(--hp-text)' }}>
            {editando ? `Editar cultura · ${editando.nome}` : 'Cadastrar Nova Cultura'}
          </div>
          {formErro ? (
            <div role="alert" style={{ fontSize: '13px', color: 'var(--hp-critico)', background: 'var(--hp-critico-bg)', borderRadius: '10px', padding: '10px 12px' }}>{formErro}</div>
          ) : null}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '6px', color: 'var(--hp-text-2)' }}>
                Nome da Cultura
              </label>
              <input
                type="text"
                placeholder="Ex: Uva Crimson Seedless"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                style={{ width: '100%', height: '40px', padding: '0 12px', borderRadius: '10px', border: '1px solid var(--hp-input-border)', background: 'var(--hp-bg)', color: 'var(--hp-text)', fontSize: '14px' }}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '6px', color: 'var(--hp-text-2)' }}>
                Ciclo Médio (dias)
              </label>
              <input
                type="number"
                value={ciclo}
                onChange={(e) => setCiclo(e.target.value)}
                style={{ width: '100%', height: '40px', padding: '0 12px', borderRadius: '10px', border: '1px solid var(--hp-input-border)', background: 'var(--hp-bg)', color: 'var(--hp-text)', fontSize: '14px' }}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '6px', color: 'var(--hp-text-2)' }}>
                Temperatura Mínima (°C)
              </label>
              <input
                type="number"
                step="0.5"
                value={tempMin}
                onChange={(e) => setTempMin(e.target.value)}
                style={{ width: '100%', height: '40px', padding: '0 12px', borderRadius: '10px', border: '1px solid var(--hp-input-border)', background: 'var(--hp-bg)', color: 'var(--hp-text)', fontSize: '14px' }}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '6px', color: 'var(--hp-text-2)' }}>
                Temperatura Máxima (°C)
              </label>
              <input
                type="number"
                step="0.5"
                value={tempMax}
                onChange={(e) => setTempMax(e.target.value)}
                style={{ width: '100%', height: '40px', padding: '0 12px', borderRadius: '10px', border: '1px solid var(--hp-input-border)', background: 'var(--hp-bg)', color: 'var(--hp-text)', fontSize: '14px' }}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '6px', color: 'var(--hp-text-2)' }}>
                Umidade Mínima (%)
              </label>
              <input
                type="number"
                step="1"
                value={umidMin}
                onChange={(e) => setUmidMin(e.target.value)}
                style={{ width: '100%', height: '40px', padding: '0 12px', borderRadius: '10px', border: '1px solid var(--hp-input-border)', background: 'var(--hp-bg)', color: 'var(--hp-text)', fontSize: '14px' }}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '6px', color: 'var(--hp-text-2)' }}>
                Umidade Máxima (%)
              </label>
              <input
                type="number"
                step="1"
                value={umidMax}
                onChange={(e) => setUmidMax(e.target.value)}
                style={{ width: '100%', height: '40px', padding: '0 12px', borderRadius: '10px', border: '1px solid var(--hp-input-border)', background: 'var(--hp-bg)', color: 'var(--hp-text)', fontSize: '14px' }}
                required
              />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button
              type="button"
              onClick={fecharForm}
              style={{ height: '36px', padding: '0 14px', borderRadius: '10px', border: '1px solid var(--hp-input-border)', background: 'transparent', color: 'var(--hp-text-2)', fontSize: '13px', cursor: 'pointer' }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              style={{ height: '36px', padding: '0 18px', borderRadius: '10px', border: 'none', background: 'var(--hp-accent)', color: '#fff', fontWeight: '600', fontSize: '13px', cursor: 'pointer' }}
            >
              {saving ? 'Salvando...' : editando ? 'Salvar alterações' : 'Salvar Cultura'}
            </button>
          </div>
        </form>
      )}

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
            placeholder="Buscar por nome da cultura..."
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
                CULTURA
              </th>
              <th style={{ textAlign: 'left', padding: '0 16px', fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-2)' }}>
                FAIXA DE TEMPERATURA
              </th>
              <th style={{ textAlign: 'left', padding: '0 16px', fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-2)' }}>
                FAIXA DE UMIDADE
              </th>
              <th style={{ textAlign: 'right', padding: '0 16px', fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-2)' }}>
                CICLO (DIAS)
              </th>
              <th style={{ textAlign: 'right', padding: '0 16px', fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-2)' }}>
                AÇÕES
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '32px', textAlign: 'center', color: 'var(--hp-text-2)', fontSize: '14px' }}>
                  Nenhuma cultura encontrada.
                </td>
              </tr>
            ) : (
              filtered.map((cult) => (
                <tr key={cult.id} style={{ height: '52px', borderTop: '1px solid var(--hp-border)' }}>
                  <td style={{ padding: '0 16px', fontSize: '14px', fontWeight: '600', color: 'var(--hp-accent)' }}>
                    {cult.nome}
                  </td>
                  <td style={{ padding: '0 16px', fontSize: '14px' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                      {cult.temperatura_min} – {cult.temperatura_max} °C
                    </span>
                  </td>
                  <td style={{ padding: '0 16px', fontSize: '14px' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                      {cult.umidade_min} – {cult.umidade_max} %
                    </span>
                  </td>
                  <td style={{ padding: '0 16px', fontSize: '14px', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                    {cult.ciclo_medio_dias} dias
                  </td>
                  <td style={{ padding: '0 16px', textAlign: 'right' }}>
                    <button
                      type="button"
                      onClick={() => abrirEdicao(cult)}
                      title="Editar cultura"
                      aria-label={`Editar ${cult.nome}`}
                      style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--hp-text-2)', padding: '6px' }}
                    >
                      <span aria-hidden="true" style={{ fontFamily: "'Material Symbols Outlined'", fontSize: '18px', lineHeight: '1' }}>
                        edit
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(cult)}
                      title="Excluir cultura"
                      aria-label={`Excluir ${cult.nome}`}
                      style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--hp-critico)', padding: '6px' }}
                    >
                      <span style={{ fontFamily: "'Material Symbols Outlined'", fontSize: '18px', lineHeight: '1' }}>
                        delete
                      </span>
                    </button>
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
