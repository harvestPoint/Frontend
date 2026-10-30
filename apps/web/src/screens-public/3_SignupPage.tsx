// Tela de cadastro. Mesmo esqueleto do Login (estilos em auth.css).
// O card não tem altura máxima nem rolagem própria: quem rola é a página.
import { useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { signup, readApiError } from '@/lib/api';
import Logo from '@/components/Logo';
import {
  validarConta,
  validarFazenda,
  fazendaParaApi,
  errosDoBackend,
  pegarLocalizacao,
  fazendaVazia,
  type Erros,
  type FazendaForm,
} from '@/lib/validacao';
import './auth.css';

/** Rótulo + caixa + mensagem de erro embaixo (ligada ao input por aria-describedby) */
function Campo(props: { id: string; label: string; erro?: string; icone?: string; children: ReactNode }) {
  return (
    <div>
      <label className="hp-auth-label" htmlFor={props.id}>{props.label}</label>
      <div className={`hp-auth-campo${props.erro ? ' erro' : ''}`}>
        {props.icone ? <span className="hp-auth-ic" aria-hidden="true">{props.icone}</span> : null}
        {props.children}
        {props.erro ? <span className="hp-auth-ic" aria-hidden="true">error</span> : null}
      </div>
      {props.erro ? <div id={`${props.id}-erro`} className="hp-auth-erro-campo">{props.erro}</div> : null}
    </div>
  );
}

/** Props de acessibilidade do input conforme o erro do campo */
function a11y(id: string, erro?: string) {
  return { id, 'aria-invalid': erro ? true : undefined, 'aria-describedby': erro ? `${id}-erro` : undefined };
}

export default function SignupPage() {
  const navigate = useNavigate();
  const { user, ready, login } = useAuth();
  const [role, setRole] = useState<'proprietario' | 'tecnico'>('proprietario');
  const [cad, setCad] = useState({ nome: '', email: '', senha: '' });
  // Proprietário escolhe cadastrar a fazenda agora ou deixar para depois
  const [fazendaAgora, setFazendaAgora] = useState(true);
  const [fazenda, setFazenda] = useState<FazendaForm>(fazendaVazia);

  const [erros, setErros] = useState<Erros>({});
  const [erroGeral, setErroGeral] = useState('');
  const [errosLista, setErrosLista] = useState<string[]>([]);
  const [enviando, setEnviando] = useState(false);
  const [localizando, setLocalizando] = useState(false);

  const escolherPerfil = (r: 'proprietario' | 'tecnico') => {
    setRole(r);
    setErros({});
    setErroGeral('');
  };

  // Altera um campo da conta e apaga o erro daquele campo na hora
  const onCad = (campo: 'nome' | 'email' | 'senha') => (e: ChangeEvent<HTMLInputElement>) => {
    setCad((c) => ({ ...c, [campo]: e.target.value }));
    setErros((er) => ({ ...er, [campo]: '' }));
    setErroGeral('');
  };

  // Mesma ideia para os campos da fazenda
  const onFazenda = (campo: keyof FazendaForm, chaveErro: string) => (e: ChangeEvent<HTMLInputElement>) => {
    setFazenda((f) => ({ ...f, [campo]: e.target.value }));
    setErros((er) => ({ ...er, [chaveErro]: '' }));
    setErroGeral('');
  };

  const usarMinhaLocalizacao = async () => {
    setLocalizando(true);
    try {
      const pos = await pegarLocalizacao();
      setFazenda((f) => ({ ...f, ...pos }));
      setErros((er) => ({ ...er, fazenda_latitude: '', fazenda_longitude: '' }));
    } catch (err) {
      setErroGeral((err as Error).message);
    } finally {
      setLocalizando(false);
    }
  };

  const vaiCadastrarFazenda = role === 'proprietario' && fazendaAgora;

  const criarConta = async (e: FormEvent) => {
    e.preventDefault();
    if (enviando) return;
    setErroGeral('');
    setErrosLista([]);

    // 1) Validação no próprio navegador antes de chamar a API
    const novosErros: Erros = {
      ...validarConta(cad),
      ...(vaiCadastrarFazenda ? validarFazenda(fazenda) : {}),
    };
    setErros(novosErros);
    if (Object.keys(novosErros).length > 0) {
      setErroGeral('Confira os campos destacados em vermelho:');
      setErrosLista(Object.values(novosErros));
      return;
    }

    // 2) Envio para a API do HarvestPoint
    setEnviando(true);
    try {
      const novo = await signup({
        nome: cad.nome.trim(),
        email: cad.email.trim(),
        senha: cad.senha,
        role,
        fazenda: vaiCadastrarFazenda ? fazendaParaApi(fazenda) : undefined,
      });
      login(novo);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      // 3) Se o backend recusar, marca o campo exato com erro
      const apiErr = readApiError(err);
      const doBackend = errosDoBackend(apiErr.fields);
      setErros(doBackend);
      setErroGeral(apiErr.message || 'Não foi possível criar a conta');
      setErrosLista(Object.keys(doBackend).length > 0 ? Object.values(doBackend) : (apiErr.details ?? []));
      setEnviando(false);
    }
  };

  if (ready && user && !enviando) return <Navigate to="/dashboard" replace />;

  return (
    <div className="hp-auth hp-auth--signup hp-page-in" style={{ backgroundImage: "url('/images/signup-bg.jpg')" }}>
      <div className="hp-auth-scrim" />
      <div className="hp-auth-shell">
        <header className="hp-auth-top">
          <Link to="/" className="hp-auth-logo" aria-label="HarvestPoint: voltar para a página inicial">
            <Logo size={36} textColor="#FFFFFF" />
          </Link>
          <nav className="hp-auth-acoes" aria-label="Conta">
            <span className="hp-auth-status">Plataforma ativa no Vale do São Francisco</span>
            <Link to="/login" className="hp-auth-btn-ghost">Entrar</Link>
          </nav>
        </header>

        <main className="hp-auth-main">
          <section className="hp-auth-hero" aria-label="Sobre o HarvestPoint">
            <div className="hp-auth-sobrelinha">HARVESTPOINT · PROJETO INTEGRADOR</div>
            <h1 className="hp-auth-h1">
              Gestão da safra no <em>Vale do São Francisco</em>.
            </h1>
            <p className="hp-auth-p" style={{ maxWidth: '440px' }}>
              Monitore temperatura e umidade com o ESP32, cruze com a previsão do Open-Meteo e planeje a janela de exportação.
            </p>
            <ul className="hp-auth-lista">
              <li>Integração direta com o kit IoT ESP32</li>
              <li>Câmbio PTAX (Banco Central) e dados do Comex Stat</li>
              <li>Janela de colheita estimada por lote</li>
            </ul>
          </section>

          <form className="hp-auth-card" onSubmit={criarConta} noValidate aria-labelledby="cad-titulo">
            <div className="hp-auth-card-icone">
              <Logo size={32} showText={false} />
            </div>
            <h2 id="cad-titulo" className="hp-auth-card-titulo">Criar sua conta</h2>
            <p className="hp-auth-card-sub">Acompanhe clima, sensores, lotes e janelas de colheita.</p>

            <Campo id="cad-nome" label="Nome completo" erro={erros.nome}>
              <input {...a11y('cad-nome', erros.nome)} type="text" autoComplete="name" placeholder="Seu nome" value={cad.nome} onChange={onCad('nome')} />
            </Campo>
            <Campo id="cad-email" label="E-mail profissional" erro={erros.email} icone="mail">
              <input {...a11y('cad-email', erros.email)} type="email" autoComplete="email" placeholder="seu@email.com" value={cad.email} onChange={onCad('email')} />
            </Campo>
            <Campo id="cad-senha" label="Senha" erro={erros.senha} icone="lock">
              <input {...a11y('cad-senha', erros.senha)} type="password" autoComplete="new-password" placeholder="Mínimo 6 caracteres" value={cad.senha} onChange={onCad('senha')} />
            </Campo>

            <div className="hp-auth-secao" id="cad-perfil">QUAL SUA FUNÇÃO NO CAMPO</div>
            <div className="hp-auth-perfis" role="radiogroup" aria-labelledby="cad-perfil">
              {([
                ['proprietario', 'potted_plant', 'Proprietário', 'Gestor da fazenda'],
                ['tecnico', 'engineering', 'Técnico de campo', 'Operação e telemetria'],
              ] as const).map(([valor, icone, nome, desc]) => (
                <button
                  key={valor}
                  type="button"
                  role="radio"
                  aria-checked={role === valor}
                  className="hp-auth-perfil"
                  onClick={() => escolherPerfil(valor)}
                >
                  <span className="hp-auth-ic" aria-hidden="true" style={{ fontSize: '20px', color: role === valor ? '#4A6950' : '#8B8D82' }}>{icone}</span>
                  <span className="hp-auth-perfil-nome">{nome}</span>
                  <span className="hp-auth-perfil-desc">{desc}</span>
                </button>
              ))}
            </div>

            {role === 'tecnico' ? (
              <div className="hp-auth-dica">
                O técnico acompanha todas as propriedades cadastradas na plataforma, então não precisa informar uma fazenda.
              </div>
            ) : (
              <div style={{ marginTop: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap' }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#1F211D' }} id="cad-fazenda">Sua fazenda</div>
                  <div className="hp-auth-alterna" role="group" aria-labelledby="cad-fazenda">
                    <button type="button" aria-pressed={fazendaAgora} onClick={() => setFazendaAgora(true)}>Cadastrar agora</button>
                    <button type="button" aria-pressed={!fazendaAgora} onClick={() => setFazendaAgora(false)}>Deixar para depois</button>
                  </div>
                </div>

                {fazendaAgora ? (
                  <>
                    <Campo id="faz-nome" label="Nome da fazenda" erro={erros.fazenda_nome} icone="cottage">
                      <input {...a11y('faz-nome', erros.fazenda_nome)} type="text" placeholder="Ex.: Fazenda Boa Vista" value={fazenda.nome} onChange={onFazenda('nome', 'fazenda_nome')} />
                    </Campo>
                    <div className="hp-auth-grade">
                      <Campo id="faz-municipio" label="Município" erro={erros.fazenda_municipio} icone="location_on">
                        <input {...a11y('faz-municipio', erros.fazenda_municipio)} type="text" placeholder="Petrolina - PE" value={fazenda.municipio} onChange={onFazenda('municipio', 'fazenda_municipio')} />
                      </Campo>
                      <Campo id="faz-area" label="Área (ha)" erro={erros.fazenda_area_total}>
                        <input {...a11y('faz-area', erros.fazenda_area_total)} type="text" inputMode="decimal" placeholder="120" value={fazenda.area} onChange={onFazenda('area', 'fazenda_area_total')} />
                      </Campo>
                    </div>
                    <div className="hp-auth-grade">
                      <Campo id="faz-lat" label="Latitude" erro={erros.fazenda_latitude}>
                        <input {...a11y('faz-lat', erros.fazenda_latitude)} type="text" inputMode="decimal" placeholder="-9.3891" value={fazenda.latitude} onChange={onFazenda('latitude', 'fazenda_latitude')} />
                      </Campo>
                      <Campo id="faz-lon" label="Longitude" erro={erros.fazenda_longitude}>
                        <input {...a11y('faz-lon', erros.fazenda_longitude)} type="text" inputMode="decimal" placeholder="-40.5027" value={fazenda.longitude} onChange={onFazenda('longitude', 'fazenda_longitude')} />
                      </Campo>
                    </div>
                    <button type="button" className="hp-auth-link-btn" onClick={usarMinhaLocalizacao} disabled={localizando} style={{ marginTop: '12px' }}>
                      <span className="hp-auth-ic" aria-hidden="true" style={{ fontSize: '16px', color: 'inherit' }}>my_location</span>
                      {localizando ? 'Buscando coordenadas GPS...' : 'Usar minha localização atual (GPS)'}
                    </button>
                  </>
                ) : (
                  <div className="hp-auth-dica">
                    Sem problema: você pode adicionar a fazenda depois em <b>Perfil › Minhas fazendas</b>, com nome, município, área e coordenadas.
                  </div>
                )}
              </div>
            )}

            {erroGeral ? (
              <div className="hp-auth-alerta" role="alert">
                <div style={{ fontWeight: 700 }}>{erroGeral}</div>
                {errosLista.length > 0 ? (
                  <ul>
                    {errosLista.map((msg, idx) => <li key={idx}>{msg}</li>)}
                  </ul>
                ) : null}
              </div>
            ) : null}

            <button type="submit" className="hp-auth-btn" disabled={enviando}>
              {enviando ? 'Criando sua conta...' : 'Criar conta'}
            </button>

            <div className="hp-auth-rodape-card">
              Já tem uma conta? <Link to="/login">Entrar</Link>
            </div>
          </form>
        </main>

        <footer className="hp-auth-foot">
          <span>© 2026 HarvestPoint · Vale do São Francisco</span>
          <span>Projeto Integrador</span>
        </footer>
      </div>
    </div>
  );
}
