// Tela de Perfil: dados da conta (editáveis), fazendas do usuário e preferências.
// O proprietário que deixou a fazenda "para depois" no cadastro adiciona ela aqui.
import { useEffect, useState, type ChangeEvent, type CSSProperties, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useProperty } from '@/contexts/PropertyContext';
import { useTheme } from '@/contexts/ThemeContext';
import { updateUsuario, createPropriedade, fetchMe, readApiError, iniciais } from '@/lib/api';
import {
  validarFazenda,
  fazendaParaApi,
  errosDoBackend,
  pegarLocalizacao,
  fazendaVazia,
  type Erros,
  type FazendaForm,
} from '@/lib/validacao';

const cartao: CSSProperties = { background: 'var(--hp-surface)', border: '1px solid var(--hp-border)', borderRadius: '16px', padding: '20px' };
const secao: CSSProperties = { fontSize: '11px', fontWeight: 700, letterSpacing: '.08em', color: 'var(--hp-text-3)', marginBottom: '12px' };
const input: CSSProperties = { width: '100%', height: '44px', border: '1px solid var(--hp-input-border)', borderRadius: '12px', padding: '0 12px', fontSize: '14px', background: 'var(--hp-surface)', color: 'var(--hp-text)', outline: 'none', boxSizing: 'border-box' };
const botao: CSSProperties = { height: '40px', padding: '0 16px', display: 'inline-flex', alignItems: 'center', gap: '8px', borderRadius: '12px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', border: '1px solid var(--hp-input-border)', background: 'var(--hp-surface)', color: 'var(--hp-text)' };
const botaoPrincipal: CSSProperties = { ...botao, border: 'none', background: 'var(--hp-accent)', color: '#FFFFFF' };

/** Rótulo + campo + erro embaixo */
function Campo({ label, erro, children, largo }: { label: string; erro?: string; children: ReactNode; largo?: boolean }) {
  return (
    <div style={largo ? { gridColumn: '1 / -1' } : undefined}>
      <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>{label}</div>
      {children}
      {erro ? <div style={{ fontSize: '12px', color: 'var(--hp-critico)', marginTop: '4px' }}>{erro}</div> : null}
    </div>
  );
}

function bordaErro(erro?: string): CSSProperties {
  return erro ? { ...input, borderColor: 'var(--hp-critico)' } : input;
}

export default function PerfilPage() {
  const navigate = useNavigate();
  const { user, isTecnico, logout, login } = useAuth();
  const { propriedades, reload, setSelectedId } = useProperty();
  const { theme, toggleTheme } = useTheme();

  // ---------- Dados pessoais ----------
  const original = { nome: user?.nome ?? '', telefone: user?.telefone ?? '', email: user?.email ?? '' };
  const [dados, setDados] = useState(original);
  const [erros, setErros] = useState<Erros>({});
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState('');

  // Quando o usuário termina de carregar (ou muda), preenche o formulário
  useEffect(() => {
    setDados({ nome: user?.nome ?? '', telefone: user?.telefone ?? '', email: user?.email ?? '' });
  }, [user?.id, user?.nome, user?.telefone, user?.email]);

  const mudou = dados.nome !== original.nome || dados.telefone !== original.telefone || dados.email !== original.email;

  const onDado = (campo: 'nome' | 'telefone' | 'email') => (e: ChangeEvent<HTMLInputElement>) => {
    setDados((d) => ({ ...d, [campo]: e.target.value }));
    setErros((er) => ({ ...er, [campo]: '' }));
    setMensagem('');
  };

  const salvarDados = async () => {
    const novos: Erros = {};
    if (dados.nome.trim().length < 3) novos.nome = 'Informe seu nome completo';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dados.email.trim())) novos.email = 'E-mail inválido';
    if (dados.telefone.replace(/\D/g, '').length < 10) novos.telefone = 'Telefone com DDD, ex.: (87) 99123-4567';
    setErros(novos);
    if (Object.keys(novos).length > 0) return;

    setSalvando(true);
    try {
      const atualizado = await updateUsuario('me', {
        nome: dados.nome.trim(),
        telefone: dados.telefone.trim(),
        email: dados.email.trim(),
      });
      login(atualizado); // atualiza o usuário no contexto (menu lateral, cabeçalho...)
      setMensagem('Dados salvos.');
    } catch (err) {
      const apiErr = readApiError(err);
      setErros(errosDoBackend(apiErr.fields));
      setMensagem(apiErr.message || 'Não foi possível salvar.');
    } finally {
      setSalvando(false);
    }
  };

  // ---------- Fazendas ----------
  const [formAberto, setFormAberto] = useState(false);
  const [fazenda, setFazenda] = useState<FazendaForm>(fazendaVazia);
  const [errosFazenda, setErrosFazenda] = useState<Erros>({});
  const [salvandoFazenda, setSalvandoFazenda] = useState(false);
  const [msgFazenda, setMsgFazenda] = useState('');

  const onFazenda = (campo: keyof FazendaForm, chaveErro: string) => (e: ChangeEvent<HTMLInputElement>) => {
    setFazenda((f) => ({ ...f, [campo]: e.target.value }));
    setErrosFazenda((er) => ({ ...er, [chaveErro]: '' }));
  };

  const usarLocalizacao = async () => {
    try {
      const pos = await pegarLocalizacao();
      setFazenda((f) => ({ ...f, ...pos }));
    } catch (err) {
      setMsgFazenda((err as Error).message);
    }
  };

  const salvarFazenda = async () => {
    const novos = validarFazenda(fazenda);
    setErrosFazenda(novos);
    if (Object.keys(novos).length > 0) return;

    setSalvandoFazenda(true);
    try {
      const criada = await createPropriedade(fazendaParaApi(fazenda));
      await reload(); // recarrega a lista do seletor de propriedades
      setSelectedId(criada.id); // já deixa a nova selecionada
      login(await fetchMe()); // atualiza o nome da fazenda que aparece no menu
      setFazenda(fazendaVazia);
      setFormAberto(false);
      setMsgFazenda(`Fazenda "${criada.nome}" cadastrada.`);
    } catch (err) {
      const apiErr = readApiError(err);
      // o backend devolve "nome", "municipio"...; no formulário as chaves começam com "fazenda_"
      const doBack = errosDoBackend(apiErr.fields);
      const comPrefixo: Erros = {};
      Object.entries(doBack).forEach(([k, v]) => {
        comPrefixo[`fazenda_${k}`] = v;
      });
      setErrosFazenda(comPrefixo);
      setMsgFazenda(apiErr.message || 'Não foi possível cadastrar a fazenda.');
    } finally {
      setSalvandoFazenda(false);
    }
  };

  const sair = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <>
      <div>
        <h1 style={{ margin: '0', fontFamily: "'Plus Jakarta Sans', Inter, sans-serif", fontSize: '28px', lineHeight: '34px', fontWeight: 700, letterSpacing: '-.01em' }}>
          Perfil
        </h1>
        <div style={{ fontSize: '12px', color: 'var(--hp-text-2)', marginTop: '4px' }}>
          Seus dados, suas fazendas e preferências
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(220px, 280px) 1fr', gap: '20px', alignItems: 'start' }}>
        {/* Cartão de identificação */}
        <div style={{ ...cartao, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'var(--hp-accent)', color: '#FFFFFF', fontSize: '22px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {iniciais(user?.nome)}
          </div>
          <div style={{ fontFamily: "'Plus Jakarta Sans', Inter, sans-serif", fontSize: '16px', fontWeight: 700, marginTop: '14px' }}>
            {user?.nome ?? 'Usuário'}
          </div>
          <div style={{ fontSize: '13px', color: 'var(--hp-text-2)', marginTop: '2px' }}>
            {isTecnico ? 'Técnico de campo' : 'Proprietário'}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--hp-text-2)', marginTop: '10px', paddingTop: '10px', borderTop: '1px solid var(--hp-border)', width: '100%' }}>
            {isTecnico
              ? `Acompanha ${propriedades.length} propriedade(s)`
              : propriedades.length > 0
                ? `${propriedades.length} fazenda(s) cadastrada(s)`
                : 'Nenhuma fazenda cadastrada ainda'}
          </div>
          <button type="button" style={{ ...botao, marginTop: '16px', background: 'var(--hp-critico-bg)', color: 'var(--hp-critico)', border: 'none' }} onClick={sair}>
            <span style={{ fontFamily: "'Material Symbols Outlined'", fontSize: '18px', lineHeight: 1 }}>logout</span>
            Sair
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Dados pessoais */}
          <div style={cartao}>
            <div style={secao}>DADOS PESSOAIS</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <Campo label="Nome completo" erro={erros.nome}>
                <input style={bordaErro(erros.nome)} value={dados.nome} onChange={onDado('nome')} />
              </Campo>
              <Campo label="Telefone" erro={erros.telefone}>
                <input style={bordaErro(erros.telefone)} value={dados.telefone} onChange={onDado('telefone')} placeholder="(87) 99123-4567" />
              </Campo>
              <Campo label="E-mail profissional" erro={erros.email} largo>
                <input style={bordaErro(erros.email)} value={dados.email} onChange={onDado('email')} type="email" />
              </Campo>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
              {mensagem ? <span style={{ fontSize: '12px', color: 'var(--hp-text-2)', marginRight: 'auto' }}>{mensagem}</span> : null}
              <button type="button" style={botao} disabled={!mudou || salvando} onClick={() => { setDados(original); setErros({}); }}>
                Cancelar
              </button>
              <button type="button" style={{ ...botaoPrincipal, opacity: mudou ? 1 : 0.5 }} disabled={!mudou || salvando} onClick={salvarDados}>
                {salvando ? 'Salvando...' : 'Salvar alterações'}
              </button>
            </div>
          </div>

          {/* Fazendas */}
          <div style={cartao}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ ...secao, marginBottom: 0 }}>{isTecnico ? 'PROPRIEDADES ACOMPANHADAS' : 'MINHAS FAZENDAS'}</div>
              {isTecnico ? (
                <button type="button" style={botao} onClick={() => navigate('/cadastros/propriedades')}>
                  Gerenciar em Cadastros
                </button>
              ) : !formAberto ? (
                <button type="button" style={botaoPrincipal} onClick={() => { setFormAberto(true); setMsgFazenda(''); }}>
                  <span style={{ fontFamily: "'Material Symbols Outlined'", fontSize: '18px', lineHeight: 1 }}>add</span>
                  Adicionar fazenda
                </button>
              ) : null}
            </div>

            {propriedades.length === 0 ? (
              <div style={{ fontSize: '13px', color: 'var(--hp-text-2)', marginTop: '12px' }}>
                {isTecnico ? 'Nenhuma propriedade cadastrada no sistema.' : 'Você ainda não cadastrou sua fazenda. Clique em "Adicionar fazenda".'}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
                {propriedades.map((p) => (
                  <div key={p.id} style={{ border: '1px solid var(--hp-border)', borderRadius: '12px', padding: '12px 14px', display: 'flex', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 600 }}>{p.nome}</div>
                      <div style={{ fontSize: '12px', color: 'var(--hp-text-2)', marginTop: '2px' }}>
                        {p.municipio} · {p.area_total} ha{isTecnico && p.produtor ? ` · ${p.produtor}` : ''}
                      </div>
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--hp-text-2)', fontVariantNumeric: 'tabular-nums' }}>
                      {Number(p.latitude).toFixed(4)}, {Number(p.longitude).toFixed(4)}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {formAberto ? (
              <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--hp-border)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <Campo label="Nome da fazenda" erro={errosFazenda.fazenda_nome} largo>
                    <input style={bordaErro(errosFazenda.fazenda_nome)} value={fazenda.nome} onChange={onFazenda('nome', 'fazenda_nome')} placeholder="Ex.: Fazenda Boa Vista" />
                  </Campo>
                  <Campo label="Município" erro={errosFazenda.fazenda_municipio}>
                    <input style={bordaErro(errosFazenda.fazenda_municipio)} value={fazenda.municipio} onChange={onFazenda('municipio', 'fazenda_municipio')} placeholder="Petrolina - PE" />
                  </Campo>
                  <Campo label="Área (ha)" erro={errosFazenda.fazenda_area_total}>
                    <input style={bordaErro(errosFazenda.fazenda_area_total)} value={fazenda.area} onChange={onFazenda('area', 'fazenda_area_total')} inputMode="decimal" placeholder="120" />
                  </Campo>
                  <Campo label="Latitude" erro={errosFazenda.fazenda_latitude}>
                    <input style={bordaErro(errosFazenda.fazenda_latitude)} value={fazenda.latitude} onChange={onFazenda('latitude', 'fazenda_latitude')} inputMode="decimal" placeholder="-9.3891" />
                  </Campo>
                  <Campo label="Longitude" erro={errosFazenda.fazenda_longitude}>
                    <input style={bordaErro(errosFazenda.fazenda_longitude)} value={fazenda.longitude} onChange={onFazenda('longitude', 'fazenda_longitude')} inputMode="decimal" placeholder="-40.5027" />
                  </Campo>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '14px', flexWrap: 'wrap' }}>
                  <button type="button" style={botao} onClick={usarLocalizacao}>
                    <span style={{ fontFamily: "'Material Symbols Outlined'", fontSize: '18px', lineHeight: 1 }}>my_location</span>
                    Usar minha localização
                  </button>
                  <span style={{ flex: 1 }} />
                  <button type="button" style={botao} onClick={() => { setFormAberto(false); setErrosFazenda({}); }}>
                    Cancelar
                  </button>
                  <button type="button" style={botaoPrincipal} disabled={salvandoFazenda} onClick={salvarFazenda}>
                    {salvandoFazenda ? 'Salvando...' : 'Salvar fazenda'}
                  </button>
                </div>
              </div>
            ) : null}
            {msgFazenda ? <div style={{ fontSize: '12px', color: 'var(--hp-text-2)', marginTop: '10px' }}>{msgFazenda}</div> : null}
          </div>

          {/* Preferências */}
          <div style={cartao}>
            <div style={secao}>PREFERÊNCIAS</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600 }}>Perfil de acesso</div>
                <div style={{ fontSize: '12px', color: 'var(--hp-text-2)', marginTop: '2px' }}>
                  {isTecnico ? 'Técnico de campo: vê todas as propriedades e acessa os Cadastros' : 'Proprietário: vê só as próprias fazendas'}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginTop: '16px' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600 }}>Modo noturno</div>
                <div style={{ fontSize: '12px', color: 'var(--hp-text-2)', marginTop: '2px' }}>Fica salvo neste navegador</div>
              </div>
              <button type="button" style={botao} onClick={toggleTheme}>
                <span style={{ fontFamily: "'Material Symbols Outlined'", fontSize: '18px', lineHeight: 1 }}>{theme === 'dark' ? 'light_mode' : 'dark_mode'}</span>
                {theme === 'dark' ? 'Usar tema claro' : 'Usar tema escuro'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
