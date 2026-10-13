import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { roleCardStyle } from '@/lib/uiHelpers';
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

// Estilos dos campos
const labelStyle: React.CSSProperties = { fontSize: '13px', lineHeight: '16px', fontWeight: 600, color: '#1F211D', margin: '14px 0 6px' };
const inputStyle: React.CSSProperties = { width: '100%', border: 'none', outline: 'none', background: 'transparent', fontSize: '14px', color: '#1F211D' };
const erroStyle: React.CSSProperties = { fontSize: '12px', color: '#B42318', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' };
function caixaStyle(comErro: boolean): React.CSSProperties {
  return {
    height: '48px',
    borderRadius: '12px',
    background: comErro ? '#FEF3F2' : '#FFFFFF',
    border: `1.5px solid ${comErro ? '#D92D20' : '#D6D4CB'}`,
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '0 14px',
    transition: 'border-color 0.2s, background-color 0.2s',
  };
}

/** Um campo do formulário: rótulo, caixa e a mensagem de erro embaixo com realce */
function Campo(props: { label: string; erro?: string; icone?: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={labelStyle}>{props.label}</div>
      <div style={caixaStyle(Boolean(props.erro))}>
        {props.icone ? (
          <span style={{ fontFamily: "'Material Symbols Outlined'", fontSize: '18px', lineHeight: '1', color: props.erro ? '#D92D20' : '#8B8D82' }}>
            {props.icone}
          </span>
        ) : null}
        {props.children}
        {props.erro ? (
          <span style={{ fontFamily: "'Material Symbols Outlined'", fontSize: '18px', color: '#D92D20', marginLeft: 'auto' }}>
            error
          </span>
        ) : null}
      </div>
      {props.erro ? (
        <div style={erroStyle}>
          <span>{props.erro}</span>
        </div>
      ) : null}
    </div>
  );
}

export default function SignupPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [role, setRole] = useState<'proprietario' | 'tecnico'>('proprietario');
  const selectRoleProprietario = () => {
    setRole('proprietario');
    setErros({});
  };
  const selectRoleTecnico = () => {
    setRole('tecnico');
    setErros({});
  };
  const roleCardProprietario = roleCardStyle(role === 'proprietario');
  const roleCardTecnico = roleCardStyle(role === 'tecnico');
  const roleCheckProprietario = role === 'proprietario' ? 1 : 0;
  const roleCheckTecnico = role === 'tecnico' ? 1 : 0;
  const roleIconColorProprietario = role === 'proprietario' ? '#6B8F71' : '#8B8D82';
  const roleIconColorTecnico = role === 'tecnico' ? '#6B8F71' : '#8B8D82';

  const [cad, setCad] = useState({ nome: '', email: '', senha: '' });
  // Para Proprietário: escolher cadastrar agora ou deixar para depois
  const [fazendaAgora, setFazendaAgora] = useState(true);
  const [fazenda, setFazenda] = useState<FazendaForm>(fazendaVazia);
  // Para Técnico: opção de vincular o nome da propriedade atendida (ou deixar em branco)
  const [tecnicoPropriedade, setTecnicoPropriedade] = useState('');

  const [erros, setErros] = useState<Erros>({});
  const [erroGeral, setErroGeral] = useState('');
  const [errosLista, setErrosLista] = useState<string[]>([]);
  const [enviando, setEnviando] = useState(false);
  const [localizando, setLocalizando] = useState(false);

  // Altera um campo da conta e apaga o erro daquele campo instantaneamente
  const onCad = (campo: 'nome' | 'email' | 'senha') => (e: React.ChangeEvent<HTMLInputElement>) => {
    setCad((c) => ({ ...c, [campo]: e.target.value }));
    setErros((er) => ({ ...er, [campo]: '' }));
    setErroGeral('');
  };

  // Mesma ideia para os campos da fazenda
  const onFazenda = (campo: keyof FazendaForm, chaveErro: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const goLogin = () => navigate('/login');
  const vaiCadastrarFazenda = role === 'proprietario' && fazendaAgora;

  const goDashboard = async () => {
    setErroGeral('');
    setErrosLista([]);

    // 1) Validação no próprio navegador antes de chamar a API
    const novosErros: Erros = {
      ...validarConta(cad),
      ...(vaiCadastrarFazenda ? validarFazenda(fazenda) : {}),
    };

    setErros(novosErros);
    if (Object.keys(novosErros).length > 0) {
      setErroGeral('Atenção: verifique os campos destacados em vermelho abaixo:');
      setErrosLista(Object.values(novosErros));
      return;
    }

    // 2) Envio para a API do HarvestPoint
    setEnviando(true);
    try {
      const user = await signup({
        nome: cad.nome.trim(),
        email: cad.email.trim(),
        senha: cad.senha,
        role,
        propriedade: role === 'tecnico' && tecnicoPropriedade.trim() ? tecnicoPropriedade.trim() : undefined,
        fazenda: vaiCadastrarFazenda ? fazendaParaApi(fazenda) : undefined,
      });
      login(user);
      navigate('/dashboard');
    } catch (err) {
      // 3) Se o backend recusar, marca o campo exato com erro
      const apiErr = readApiError(err);
      const doBackend = errosDoBackend(apiErr.fields);
      setErros(doBackend);
      setErroGeral(apiErr.message || 'Não foi possível criar a conta');
      const lista = Object.keys(doBackend).length > 0 ? Object.values(doBackend) : (apiErr.details ?? []);
      setErrosLista(lista);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <>
      <div style={{ width: '100%', minHeight: '100vh', position: 'relative', overflowX: 'hidden', backgroundImage: "url('/images/signup-bg.jpg')", backgroundSize: 'cover', backgroundPosition: 'center', boxShadow: '0 20px 48px rgba(22,21,15,.18)' }}>
        <div style={{ position: 'absolute', inset: '0', background: 'linear-gradient(280deg, rgba(31,33,29,.82), rgba(31,33,29,.55) 40%, rgba(31,33,29,.08) 70%)' }} />
        <div style={{ position: 'absolute', inset: '0', background: 'linear-gradient(180deg, rgba(31,33,29,.40), transparent 30%, rgba(31,33,29,.48))' }} />
        <div style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column', padding: '0 56px' }}>
          {/* Header Superior */}
          <div style={{ height: '72px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Logo size={36} textColor="#FFFFFF" />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'rgba(255,255,255,.7)', whiteSpace: 'nowrap' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#8FB596', display: 'inline-block', animation: 'hpPulse 2s ease-in-out infinite' }} />
                Plataforma ativa no Vale do São Francisco
              </div>
              <div style={{ fontSize: '13px', fontWeight: '600', color: '#FFFFFF', cursor: 'pointer' }} onClick={goLogin}>
                Já tem conta? Entrar
              </div>
            </div>
          </div>

          <div style={{ flex: '1', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '56px', paddingBottom: '24px' }}>
            {/* Card de Formulário */}
            <div style={{ width: '450px', padding: '32px', borderRadius: '22px', background: 'rgba(255,255,255,.96)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,.5)', boxShadow: '0 20px 48px rgba(22,21,15,.18)', maxHeight: '820px', overflowY: 'auto' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: '#E7EFE7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <Logo size={32} showText={false} />
              </div>
              <div style={{ fontFamily: "'Plus Jakarta Sans', Inter, sans-serif", fontSize: '20px', lineHeight: '28px', fontWeight: '700', color: '#1F211D', textAlign: 'center' }}>
                Criar sua conta
              </div>
              <div style={{ fontSize: '12px', lineHeight: '16px', color: '#6B6D63', textAlign: 'center', marginTop: '4px' }}>
                Acompanhe clima, sensores ESP-32, lotes e janelas de colheita.
              </div>

              {/* Campos Pessoais */}
              <div>
                <Campo label="Nome completo" erro={erros.nome}>
                  <input type="text" placeholder="Seu nome" value={cad.nome} onChange={onCad('nome')} style={inputStyle} />
                </Campo>
                <Campo label="E-mail profissional" erro={erros.email} icone="mail">
                  <input type="email" placeholder="seu@email.com" value={cad.email} onChange={onCad('email')} style={inputStyle} />
                </Campo>
                <Campo label="Senha" erro={erros.senha} icone="lock">
                  <input type="password" placeholder="Mínimo 6 caracteres" value={cad.senha} onChange={onCad('senha')} style={{ ...inputStyle, letterSpacing: '.04em' }} />
                </Campo>
              </div>

              {/* Seleção de Função */}
              <div style={{ fontSize: '11px', lineHeight: '14px', fontWeight: '700', letterSpacing: '.08em', color: '#8B8D82', margin: '22px 0 10px' }}>
                QUAL SUA FUNÇÃO NO CAMPO
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={roleCardProprietario} onClick={selectRoleProprietario}>
                  <span style={{ fontFamily: "'Material Symbols Outlined'", fontSize: '20px', lineHeight: '1', color: roleIconColorProprietario }}>
                    potted_plant
                  </span>
                  <div style={{ fontSize: '13px', lineHeight: '16px', fontWeight: '600', color: '#1F211D', marginTop: '6px' }}>
                    Proprietário
                  </div>
                  <div style={{ fontSize: '12px', lineHeight: '14px', color: '#6B6D63', marginTop: '2px' }}>
                    Gestor da fazenda
                  </div>
                  {Boolean(role) && (
                    <span style={{ position: 'absolute', top: '10px', right: '10px', fontFamily: "'Material Symbols Outlined'", fontSize: '16px', lineHeight: '1', color: '#6B8F71', opacity: roleCheckProprietario }}>
                      check_circle
                    </span>
                  )}
                </div>
                <div style={roleCardTecnico} onClick={selectRoleTecnico}>
                  <span style={{ fontFamily: "'Material Symbols Outlined'", fontSize: '20px', lineHeight: '1', color: roleIconColorTecnico }}>
                    engineering
                  </span>
                  <div style={{ fontSize: '13px', lineHeight: '16px', fontWeight: '600', color: '#1F211D', marginTop: '6px' }}>
                    Técnico de campo
                  </div>
                  <div style={{ fontSize: '12px', lineHeight: '14px', color: '#6B6D63', marginTop: '2px' }}>
                    Operação e telemetria
                  </div>
                  {Boolean(role) && (
                    <span style={{ position: 'absolute', top: '10px', right: '10px', fontFamily: "'Material Symbols Outlined'", fontSize: '16px', lineHeight: '1', color: '#6B8F71', opacity: roleCheckTecnico }}>
                      check_circle
                    </span>
                  )}
                </div>
              </div>

              {/* Se for Técnico: opção de vincular nome da propriedade atendida */}
              {role === 'tecnico' ? (
                <div style={{ marginTop: '16px' }}>
                  <Campo label="Nome da propriedade atendida (opcional)" erro={erros.propriedade} icone="domain">
                    <input
                      type="text"
                      placeholder="Ex.: Fazenda Boa Vista ou Cooperativa Vale"
                      value={tecnicoPropriedade}
                      onChange={(e) => setTecnicoPropriedade(e.target.value)}
                      style={inputStyle}
                    />
                  </Campo>
                  <div style={{ fontSize: '12px', lineHeight: '18px', color: '#6B6D63', background: '#F4F3EE', borderRadius: '12px', padding: '10px 12px', marginTop: '10px' }}>
                    💡 Técnicos têm visão ampla e podem deixar a propriedade em branco para vincular posteriormente no painel de perfil.
                  </div>
                </div>
              ) : (
                /* Se for Proprietário: opção clara de cadastrar agora ou deixar para depois */
                <div style={{ marginTop: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#1F211D' }}>Sua fazenda</div>
                    <div style={{ display: 'flex', gap: '4px', background: '#F4F3EE', borderRadius: '10px', padding: '3px' }}>
                      <button
                        type="button"
                        onClick={() => setFazendaAgora(true)}
                        style={{ border: 'none', borderRadius: '8px', padding: '6px 10px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', background: fazendaAgora ? '#FFFFFF' : 'transparent', color: fazendaAgora ? '#1F211D' : '#6B6D63' }}
                      >
                        Cadastrar agora
                      </button>
                      <button
                        type="button"
                        onClick={() => setFazendaAgora(false)}
                        style={{ border: 'none', borderRadius: '8px', padding: '6px 10px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', background: !fazendaAgora ? '#FFFFFF' : 'transparent', color: !fazendaAgora ? '#1F211D' : '#6B6D63' }}
                      >
                        Deixar para depois
                      </button>
                    </div>
                  </div>

                  {fazendaAgora ? (
                    <>
                      <Campo label="Nome da fazenda" erro={erros.fazenda_nome} icone="cottage">
                        <input type="text" placeholder="Ex.: Fazenda Boa Vista" value={fazenda.nome} onChange={onFazenda('nome', 'fazenda_nome')} style={inputStyle} />
                      </Campo>
                      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '10px' }}>
                        <Campo label="Município" erro={erros.fazenda_municipio} icone="location_on">
                          <input type="text" placeholder="Petrolina - PE" value={fazenda.municipio} onChange={onFazenda('municipio', 'fazenda_municipio')} style={inputStyle} />
                        </Campo>
                        <Campo label="Área (ha)" erro={erros.fazenda_area_total}>
                          <input type="text" inputMode="decimal" placeholder="120" value={fazenda.area} onChange={onFazenda('area', 'fazenda_area_total')} style={inputStyle} />
                        </Campo>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <Campo label="Latitude" erro={erros.fazenda_latitude}>
                          <input type="text" inputMode="decimal" placeholder="-9.3891" value={fazenda.latitude} onChange={onFazenda('latitude', 'fazenda_latitude')} style={inputStyle} />
                        </Campo>
                        <Campo label="Longitude" erro={erros.fazenda_longitude}>
                          <input type="text" inputMode="decimal" placeholder="-40.5027" value={fazenda.longitude} onChange={onFazenda('longitude', 'fazenda_longitude')} style={inputStyle} />
                        </Campo>
                      </div>
                      <button
                        type="button"
                        onClick={usarMinhaLocalizacao}
                        disabled={localizando}
                        style={{ marginTop: '10px', border: 'none', background: 'transparent', color: '#6B8F71', fontSize: '12px', fontWeight: 600, cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        <span style={{ fontFamily: "'Material Symbols Outlined'", fontSize: '16px', lineHeight: '1' }}>my_location</span>
                        {localizando ? 'Buscando coordenadas GPS...' : 'Usar minha localização atual (GPS)'}
                      </button>
                    </>
                  ) : (
                    <div style={{ fontSize: '12px', lineHeight: '18px', color: '#6B6D63', background: '#F4F3EE', borderRadius: '12px', padding: '12px 14px', marginTop: '12px' }}>
                      ✓ Sem problemas! Você pode deixar a fazenda em branco agora e adicioná-la a qualquer momento em <b>Perfil → Minhas Fazendas</b> com os 4 dados: <b>Nome, Município, Área e Coordenadas</b>.
                    </div>
                  )}
                </div>
              )}

              {/* Quadro de Erro com Indicação Específica dos Campos ("ADICIONAR O CAMPO ERRADO NO CADASTRO") */}
              {erroGeral ? (
                <div role="alert" style={{ fontSize: '13px', color: '#B42318', marginTop: '16px', background: '#FEF3F2', border: '1.5px solid #FDA29B', borderRadius: '12px', padding: '12px 14px' }}>
                  <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontFamily: "'Material Symbols Outlined'", fontSize: '18px' }}>warning</span>
                    {erroGeral}
                  </div>
                  {errosLista.length > 0 ? (
                    <ul style={{ margin: '8px 0 0', paddingLeft: '20px', lineHeight: '18px' }}>
                      {errosLista.map((e, idx) => (
                        <li key={idx} style={{ fontWeight: 500 }}>{e}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              ) : null}

              {/* Botão de Envio */}
              <div
                style={{ height: '52px', marginTop: '20px', borderRadius: '12px', background: '#6B8F71', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', fontSize: '15px', fontWeight: '600', cursor: enviando ? 'default' : 'pointer', transition: 'background 0.2s' }}
                onClick={enviando ? undefined : goDashboard}
              >
                {enviando ? 'Criando conta no HarvestPoint...' : 'Criar conta'}
              </div>

              <div style={{ textAlign: 'center', fontSize: '12px', color: '#6B6D63', marginTop: '14px' }}>
                Já tem uma conta?{' '}
                <span style={{ color: '#6B8F71', fontWeight: '600', cursor: 'pointer' }} onClick={goLogin}>
                  Entrar
                </span>
              </div>
            </div>

            {/* Painel Lateral de Boas-vindas */}
            <div style={{ maxWidth: '480px', alignSelf: 'center', textAlign: 'right', width: '485px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px', marginBottom: '20px' }}>
                <div style={{ fontSize: '11px', lineHeight: '14px', fontWeight: '700', letterSpacing: '.08em', color: 'rgba(255,255,255,.7)' }}>
                  HARVESTPOINT · PROJETO INTEGRADOR
                </div>
                <div style={{ width: '3px', height: '16px', borderRadius: '2px', background: '#B9D0BC' }} />
              </div>
              <h1 style={{ margin: '0', fontFamily: "'Plus Jakarta Sans', Inter, sans-serif", fontSize: '36px', lineHeight: '42px', fontWeight: '800', letterSpacing: '-.02em', color: '#FFFFFF', textWrap: 'pretty' }}>
                Gestão inteligente da safra no{' '}
                <span style={{ color: '#B9D0BC', borderBottom: '3px solid #B9D0BC', borderRadius: '3px', paddingBottom: '3px' }}>
                  Vale do São Francisco
                </span>
                .
              </h1>
              <p style={{ margin: '18px 0 0', fontSize: '15px', lineHeight: '23px', color: 'rgba(255,255,255,.85)', maxWidth: '420px', marginLeft: 'auto' }}>
                Monitore temperatura e umidade com telemetria ESP-32, cruze dados climáticos do Open-Meteo e maximize sua janela de exportação.
              </p>
              <div style={{ height: '1px', background: 'rgba(255,255,255,.2)', margin: '24px 0 18px' }} />
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: 'rgba(255,255,255,.8)' }}>
                  Integração direta com hardware IoT ESP-32
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#B9D0BC', display: 'block' }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: 'rgba(255,255,255,.8)' }}>
                  Dados oficiais de mercado BACEN PTAX e Comex Stat
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#B9D0BC', display: 'block' }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: 'rgba(255,255,255,.8)' }}>
                  Motor de Inteligência Artificial para janelas de safra
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#B9D0BC', display: 'block' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
