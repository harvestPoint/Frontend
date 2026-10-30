// Gerado a partir do design aprovado no Claude Design (HarvestPoint.dc.html)
// e adaptado para React + TypeScript + Tailwind pelo pipeline de migração.
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import LotesVazioState from '@/components/LotesVazioState';
import { useProperty } from '@/contexts/PropertyContext';
import {
  createLote,
  deleteLote,
  listCulturas,
  listLotes,
  readApiError,
  statusLoteLabel,
  STATUS_LOTE,
  updateLote,
  type Cultura,
  type Lote,
} from '@/lib/api';

// "variedade" saiu do formulário: o banco não tem coluna para ela e o valor
// digitado era descartado (depois de salvar, a tela mostrava o nome da cultura).
type FormState = {
  codigo: string;
  propriedade_id: string;
  cultura: string;
  area_ha: string;
  data_plantio: string;
  sensor_vinculado: string;
  status: string;
};

const emptyForm = (propriedadeId: number | null | undefined): FormState => ({
  codigo: '',
  propriedade_id: propriedadeId ? String(propriedadeId) : '',
  cultura: '',
  area_ha: '',
  data_plantio: '',
  sensor_vinculado: '',
  status: 'ATIVO',
});

const iconBtn: React.CSSProperties = {
  fontFamily: "'Material Symbols Outlined'", fontSize: '18px', lineHeight: '1', color: 'var(--hp-text-2)',
  cursor: 'pointer', border: 'none', background: 'transparent', padding: '6px', borderRadius: '8px',
};

function formatDate(value: string | null) {
  if (!value) return '—';
  const [y, m, d] = value.split('-');
  if (!y || !m || !d) return value;
  return `${d}/${m}/${y}`;
}

export default function LotesPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { propriedades, selectedId } = useProperty();
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [culturas, setCulturas] = useState<Cultura[]>([]);
  const [busca, setBusca] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<Lote | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm(selectedId));
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  const load = useCallback(async () => {
    setCarregando(true);
    try {
      setLotes(await listLotes());
    } catch (err) {
      setErro(readApiError(err).message || 'Não foi possível carregar os lotes');
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    void load();
    listCulturas().then(setCulturas).catch(() => setCulturas([]));
  }, [load]);

  const openCreate = () => {
    setEditing(null);
    setErro('');
    setForm(emptyForm(selectedId ?? propriedades[0]?.id));
    setDrawerOpen(true);
  };

  const openEdit = useCallback((lote: Lote) => {
    setEditing(lote);
    setErro('');
    setForm({
      codigo: lote.codigo,
      propriedade_id: lote.propriedade_id ? String(lote.propriedade_id) : '',
      // sem cultura o backend manda "Não definida"; isso não pode virar cultura nova
      cultura: lote.cultura_id ? lote.cultura : '',
      area_ha: String(lote.area_ha ?? ''),
      data_plantio: lote.data_plantio || '',
      sensor_vinculado: lote.sensor_vinculado || '',
      status: (lote.status || '').toUpperCase() === 'FINALIZADO' ? 'FINALIZADO' : 'ATIVO',
    });
    setDrawerOpen(true);
  }, []);

  // O botão "Editar" do detalhe do lote chega aqui como /lotes?editar=ID
  const editarId = searchParams.get('editar');
  useEffect(() => {
    if (!editarId || lotes.length === 0) return;
    const alvo = lotes.find((l) => String(l.id) === editarId);
    if (alvo) openEdit(alvo);
    setSearchParams({}, { replace: true });
  }, [editarId, lotes, openEdit, setSearchParams]);

  const closeDrawer = () => {
    setDrawerOpen(false);
    setEditing(null);
  };

  const onField = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
  };

  const salvar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (salvando) return; // evita envio duplicado (duplo clique ou Enter repetido)
    setErro('');
    const parsedArea = Number(String(form.area_ha).replace(',', '.'));
    if (!form.codigo.trim()) return setErro('Informe o código do lote.');
    if (!form.propriedade_id) return setErro('Escolha a propriedade do lote.');
    if (!(parsedArea > 0)) return setErro('Informe uma área maior que zero, em hectares.');
    const payload = {
      codigo: form.codigo.trim(),
      propriedade_id: Number(form.propriedade_id),
      cultura: form.cultura,
      area_ha: parsedArea,
      data_plantio: form.data_plantio || null,
      sensor_vinculado: form.sensor_vinculado.trim() || null,
      status: form.status,
    };
    setSalvando(true);
    try {
      if (editing) await updateLote(editing.id, payload);
      else await createLote(payload);
      closeDrawer();
      await load();
    } catch (err) {
      const apiErr = readApiError(err);
      setErro(apiErr.details?.join(' ') || apiErr.message || 'Não foi possível salvar o lote');
    } finally {
      setSalvando(false);
    }
  };

  const excluir = async (lote: Lote) => {
    if (!window.confirm(`Excluir ${lote.codigo}?`)) return;
    try {
      await deleteLote(lote.id);
      await load();
    } catch (err) {
      setErro(readApiError(err).message || 'Não foi possível excluir o lote');
    }
  };

  const [filtroPropriedade, setFiltroPropriedade] = useState('TODAS');
  const [filtroStatus, setFiltroStatus] = useState('TODOS');
  const [compacto, setCompacto] = useState(false);

  const propriedadesDisponiveis = useMemo(() => {
    return Array.from(new Set(lotes.map((l) => l.propriedade).filter(Boolean)));
  }, [lotes]);

  const filtrados = useMemo(() => {
    const q = busca.trim().toLowerCase();
    return lotes.filter((l) => {
      const matchBusca =
        !q ||
        [l.codigo, l.cultura, l.propriedade]
          .filter(Boolean)
          .some((v) => v.toLowerCase().includes(q));

      const matchProp =
        filtroPropriedade === 'TODAS' ||
        l.propriedade === filtroPropriedade;

      const matchStatus =
        filtroStatus === 'TODOS' ||
        (l.status || '').toUpperCase() === filtroStatus;

      return matchBusca && matchProp && matchStatus;
    });
  }, [lotes, busca, filtroPropriedade, filtroStatus]);

  const exportarLotes = () => {
    const headers = ['Código', 'Propriedade', 'Cultura', 'Área (ha)', 'Plantio', 'Status'];
    const rows = filtrados.map((l) => [
      `"${l.codigo}"`,
      `"${l.propriedade}"`,
      `"${l.cultura}"`,
      `"${l.area_ha}"`,
      `"${l.data_plantio || ''}"`,
      `"${statusLoteLabel(l.status)}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `lotes_harvestpoint_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const inputBox: React.CSSProperties = {
    height: '44px',
    border: '1px solid var(--hp-input-border)',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    padding: '0 12px',
    fontSize: '14px',
    width: '100%',
    background: 'transparent',
    color: 'var(--hp-text)',
    outline: 'none',
  };

  if (!carregando && lotes.length === 0 && !drawerOpen) {
    return <LotesVazioState onNovoLote={openCreate} />;
  }

  return (
    <>
      <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
        <div style={{ flex: '1', minWidth: '0', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '24px' }}>
            <div>
              <h1 style={{ margin: '0', fontFamily: "'Plus Jakarta Sans', Inter, sans-serif", fontSize: '28px', lineHeight: '34px', fontWeight: '700', letterSpacing: '-.01em' }}>
                Lotes / Talhões
              </h1>
              <div style={{ fontSize: '12px', color: 'var(--hp-text-2)', marginTop: '4px' }}>
                Divisão produtiva por propriedade · {lotes.length} registro{lotes.length === 1 ? '' : 's'}
              </div>
            </div>
            <button type="button" style={{ height: '40px', padding: '0 16px', display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--hp-accent)', color: '#FFFFFF', border: 'none', borderRadius: '12px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }} onClick={openCreate}>
              <span aria-hidden="true" style={{ fontFamily: "'Material Symbols Outlined'", fontSize: '18px', lineHeight: '1' }}>
                add
              </span>
              Novo lote
            </button>
          </div>
          {erro && !drawerOpen ? (
            <div style={{ fontSize: '13px', color: 'var(--hp-critico)' }}>{erro}</div>
          ) : null}
          <div style={{ height: '64px', background: 'var(--hp-surface)', border: '1px solid var(--hp-border)', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '12px', padding: '0 16px' }}>
            <div style={{ flex: '1', minWidth: '0', height: '44px', border: '1px solid var(--hp-input-border)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px', padding: '0 12px' }}>
              <span style={{ fontFamily: "'Material Symbols Outlined'", fontSize: '18px', lineHeight: '1', color: 'var(--hp-text-3)' }}>
                search
              </span>
              <input
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar por código, cultura ou variedade"
                style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: '14px', color: 'var(--hp-text)' }}
              />
            </div>
            <select
              value={filtroPropriedade}
              onChange={(e) => setFiltroPropriedade(e.target.value)}
              style={{
                height: '44px',
                padding: '0 12px',
                borderRadius: '12px',
                border: '1px solid var(--hp-input-border)',
                background: 'var(--hp-surface)',
                color: 'var(--hp-text)',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <option value="TODAS">Todas as Propriedades</option>
              {propriedadesDisponiveis.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <select
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
              style={{
                height: '44px',
                padding: '0 12px',
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
              {Object.entries(STATUS_LOTE).map(([valor, rotulo]) => (
                <option key={valor} value={valor}>{rotulo}</option>
              ))}
            </select>
            <div style={{ width: '1px', height: '28px', background: 'var(--hp-border)' }} />
            <button
              type="button"
              title={compacto ? 'Visualização normal' : 'Visualização compacta'}
              aria-label={compacto ? 'Visualização normal' : 'Visualização compacta'}
              aria-pressed={compacto}
              style={{ ...iconBtn, fontSize: '20px', color: compacto ? 'var(--hp-accent)' : 'var(--hp-text-2)', background: compacto ? 'var(--hp-accent-soft)' : 'transparent' }}
              onClick={() => setCompacto((c) => !c)}
            >
              density_medium
            </button>
            <button
              type="button"
              title="Exportar lotes (CSV)"
              aria-label="Exportar lotes (CSV)"
              style={{ ...iconBtn, fontSize: '20px' }}
              onClick={exportarLotes}
            >
              download
            </button>
          </div>
          <div style={{ background: 'var(--hp-surface)', border: '1px solid var(--hp-border)', borderRadius: '16px', overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1000px', tableLayout: 'fixed' }}>
                <thead>
                  <tr style={{ height: '48px', background: 'var(--hp-surface-2)' }}>
                    <th style={{ width: '170px', textAlign: 'left', padding: '0 16px', fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-2)', whiteSpace: 'nowrap' }}>
                      CÓDIGO ↓
                    </th>
                    <th style={{ width: '24%', textAlign: 'left', padding: '0 16px', fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-2)', whiteSpace: 'nowrap' }}>
                      PROPRIEDADE
                    </th>
                    <th style={{ width: '15%', textAlign: 'left', padding: '0 16px', fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-2)', whiteSpace: 'nowrap' }}>
                      CULTURA
                    </th>
                    <th style={{ width: '84px', textAlign: 'right', padding: '0 16px', fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-2)', whiteSpace: 'nowrap' }}>
                      ÁREA
                    </th>
                    <th style={{ width: '104px', textAlign: 'left', padding: '0 16px', fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-2)', whiteSpace: 'nowrap' }}>
                      PLANTIO
                    </th>
                    <th style={{ width: '116px', textAlign: 'left', padding: '0 16px', fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-2)', whiteSpace: 'nowrap' }}>
                      STATUS
                    </th>
                    <th style={{ width: '88px', textAlign: 'right', padding: '0 16px', fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-2)', whiteSpace: 'nowrap' }}>
                      AÇÕES
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtrados.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ padding: '32px 16px', textAlign: 'center', fontSize: '14px', color: 'var(--hp-text-2)' }}>
                        Nenhum lote encontrado com os filtros aplicados.
                      </td>
                    </tr>
                  ) : (
                    filtrados.map((lote) => (
                      <tr key={lote.id} style={{ height: compacto ? '40px' : '52px', borderTop: '1px solid var(--hp-border)' }}>
                        <td style={{ padding: '0 16px', fontSize: '14px', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={lote.codigo}>
                          <a
                            href={`/lotes/${lote.id}`}
                            onClick={(e) => { e.preventDefault(); navigate(`/lotes/${lote.id}`); }}
                            style={{ color: 'var(--hp-accent)' }}
                          >
                            {lote.codigo}
                          </a>
                        </td>
                        <td style={{ padding: '0 16px', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {lote.propriedade}
                        </td>
                        <td style={{ padding: '0 16px', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={lote.cultura}>
                          {lote.cultura}
                        </td>
                        <td style={{ padding: '0 16px', fontSize: '14px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                          {lote.area_ha} ha
                        </td>
                        <td style={{ padding: '0 16px', fontSize: '14px', whiteSpace: 'nowrap' }}>
                          {formatDate(lote.data_plantio)}
                        </td>
                        <td style={{ padding: '0 16px' }}>
                          {(() => {
                            const finalizado = (lote.status || '').toUpperCase() === 'FINALIZADO';
                            const cor = finalizado ? 'var(--hp-text-2)' : 'var(--hp-accent)';
                            return (
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', height: '24px', padding: '0 10px', borderRadius: '12px', background: finalizado ? 'var(--hp-surface-2)' : 'var(--hp-accent-soft)', color: cor, fontSize: '12px', fontWeight: '600' }}>
                                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: cor }} />
                                {statusLoteLabel(lote.status)}
                              </span>
                            );
                          })()}
                        </td>
                        <td style={{ padding: '0 16px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                          <button type="button" style={{ ...iconBtn, marginRight: '4px' }} onClick={() => openEdit(lote)} aria-label={`Editar ${lote.codigo}`} title="Editar">
                            edit
                          </button>
                          <button type="button" style={iconBtn} onClick={() => void excluir(lote)} aria-label={`Excluir ${lote.codigo}`} title="Excluir">
                            delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div style={{ height: '56px', borderTop: '1px solid var(--hp-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', fontSize: '12px', color: 'var(--hp-text-2)' }}>
              {/* A paginação "10 por página" era só desenho (a lista mostra tudo); saiu para não enganar */}
              <span>
                Mostrando {filtrados.length} de {lotes.length}
              </span>
            </div>
          </div>
        </div>
        {Boolean(drawerOpen) && (
          <React.Fragment>
            <form onSubmit={(e) => void salvar(e)} aria-labelledby="lote-form-titulo" style={{ width: '480px', flex: '0 0 480px', background: 'var(--hp-surface)', border: '1px solid var(--hp-border)', borderRadius: '16px', boxShadow: '-12px 0 48px rgba(22,21,15,.14)', display: 'flex', flexDirection: 'column', minHeight: '720px' }}>
              <div style={{ padding: '20px', borderBottom: '1px solid var(--hp-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h2 id="lote-form-titulo" style={{ margin: 0, fontFamily: "'Plus Jakarta Sans', Inter, sans-serif", fontSize: '20px', lineHeight: '28px', fontWeight: '700' }}>
                  {editing ? 'Editar lote' : 'Novo lote'}
                </h2>
                <button type="button" style={{ ...iconBtn, fontSize: '20px' }} onClick={closeDrawer} aria-label="Fechar formulário">
                  close
                </button>
              </div>
              <div style={{ flex: '1', padding: '20px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {erro ? <div role="alert" style={{ fontSize: '13px', color: 'var(--hp-critico)' }}>{erro}</div> : null}
                <div>
                  <div style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-3)', marginBottom: '12px' }}>
                    IDENTIFICAÇÃO
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div>
                      <label htmlFor="lote-codigo" style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
                        Código do lote
                      </label>
                      <input id="lote-codigo" style={inputBox} placeholder="Ex.: Lote D4" value={form.codigo} onChange={onField('codigo')} />
                    </div>
                    <div>
                      <label htmlFor="lote-propriedade" style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
                        Propriedade
                      </label>
                      {/* Lista em vez de texto livre: antes um erro de digitação criava uma propriedade nova
                          e, na edição, a troca de propriedade nem era gravada. */}
                      <select id="lote-propriedade" style={inputBox} value={form.propriedade_id} onChange={onField('propriedade_id')}>
                        <option value="">Escolha a propriedade</option>
                        {propriedades.map((p) => (
                          <option key={p.id} value={p.id}>{p.nome}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="lote-cultura" style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
                        Cultura
                      </label>
                      <select id="lote-cultura" style={inputBox} value={form.cultura} onChange={onField('cultura')}>
                        <option value="">Sem cultura definida</option>
                        {form.cultura && !culturas.some((c) => c.nome === form.cultura) ? (
                          <option value={form.cultura}>{form.cultura}</option>
                        ) : null}
                        {culturas.map((c) => (
                          <option key={c.id} value={c.nome}>{c.nome}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <div style={{ height: '1px', background: 'var(--hp-border)' }} />
                <div>
                  <div style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-3)', marginBottom: '12px' }}>
                    PLANTIO
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label htmlFor="lote-area" style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
                          Área (ha)
                        </label>
                        <input id="lote-area" style={inputBox} inputMode="decimal" placeholder="0,0" value={form.area_ha} onChange={onField('area_ha')} />
                      </div>
                      <div>
                        <label htmlFor="lote-plantio" style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
                          Data de plantio
                        </label>
                        <input id="lote-plantio" type="date" style={inputBox} value={form.data_plantio} onChange={onField('data_plantio')} />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="lote-sensor" style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
                        Sensor vinculado
                      </label>
                      <input id="lote-sensor" style={inputBox} placeholder="Ex.: 24:6F:28:AB:CD:01" value={form.sensor_vinculado} onChange={onField('sensor_vinculado')} />
                      <div style={{ fontSize: '12px', color: 'var(--hp-text-2)', marginTop: '6px' }}>
                        Código do ESP32. Para tirar ou trocar um sensor de lote, use Cadastros › Sensores.
                      </div>
                    </div>
                    <div>
                      <label htmlFor="lote-status" style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
                        Status
                      </label>
                      <select id="lote-status" style={inputBox} value={form.status} onChange={onField('status')}>
                        {Object.entries(STATUS_LOTE).map(([valor, rotulo]) => (
                          <option key={valor} value={valor}>{rotulo}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ padding: '16px 20px', borderTop: '1px solid var(--hp-border)', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" style={{ height: '40px', padding: '0 16px', display: 'flex', alignItems: 'center', border: '1px solid var(--hp-input-border)', background: 'transparent', color: 'var(--hp-text)', borderRadius: '12px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }} onClick={closeDrawer}>
                  Cancelar
                </button>
                <button type="submit" disabled={salvando} style={{ height: '40px', padding: '0 16px', display: 'flex', alignItems: 'center', background: 'var(--hp-accent)', color: '#FFFFFF', border: 'none', borderRadius: '12px', fontSize: '13px', fontWeight: '600', cursor: salvando ? 'progress' : 'pointer', opacity: salvando ? 0.7 : 1 }}>
                  {salvando ? 'Salvando...' : 'Salvar lote'}
                </button>
              </div>
            </form>
          </React.Fragment>
        )}
      </div>
    </>
  );
}