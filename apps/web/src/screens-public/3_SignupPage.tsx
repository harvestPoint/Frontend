// Gerado a partir do design aprovado no Claude Design (HarvestPoint.dc.html)
// e adaptado para React + TypeScript + Tailwind pelo pipeline de migração.
// Revise os TODOs antes de ligar em dados reais da API.
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { roleCardStyle } from '@/lib/uiHelpers';
import { signup, readApiError } from '@/lib/api';
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

// Estilos repetidos dos campos (a tela de cadastro é sempre clara, por isso cores fixas)
const labelStyle: React.CSSProperties = { fontSize: '13px', lineHeight: '16px', fontWeight: 600, color: '#1F211D', margin: '14px 0 6px' };
const inputStyle: React.CSSProperties = { width: '100%', border: 'none', outline: 'none', background: 'transparent', fontSize: '14px', color: '#1F211D' };
const erroStyle: React.CSSProperties = { fontSize: '12px', color: '#B42318', marginTop: '4px' };
function caixaStyle(comErro: boolean): React.CSSProperties {
  return { height: '48px', borderRadius: '12px', background: '#FFFFFF', border: `1px solid ${comErro ? '#B42318' : '#D6D4CB'}`, display: 'flex', alignItems: 'center', gap: '10px', padding: '0 14px' };
}

/** Um campo do formulário: rótulo, caixa e a mensagem de erro embaixo (se houver). */
function Campo(props: { label: string; erro?: string; icone?: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={labelStyle}>{props.label}</div>
      <div style={caixaStyle(Boolean(props.erro))}>
        {props.icone ? (
          <span style={{ fontFamily: "'Material Symbols Outlined'", fontSize: '18px', lineHeight: '1', color: '#8B8D82' }}>{props.icone}</span>
        ) : null}
        {props.children}
      </div>
      {props.erro ? <div style={erroStyle}>{props.erro}</div> : null}
    </div>
  );
}

export default function SignupPage() {

  const navigate = useNavigate();
  const { login } = useAuth();
  const [role, setRole] = useState<'proprietario' | 'tecnico'>('proprietario');
  const selectRoleProprietario = () => setRole('proprietario');
  const selectRoleTecnico = () => setRole('tecnico');
  const roleCardProprietario = roleCardStyle(role === 'proprietario');
  const roleCardTecnico = roleCardStyle(role === 'tecnico');
  const roleCheckProprietario = role === 'proprietario' ? 1 : 0;
  const roleCheckTecnico = role === 'tecnico' ? 1 : 0;
  const roleIconColorProprietario = role === 'proprietario' ? '#6B8F71' : '#8B8D82';
  const roleIconColorTecnico = role === 'tecnico' ? '#6B8F71' : '#8B8D82';

  const [cad, setCad] = useState({ nome: '', email: '', senha: '' });
  // Fazenda: só o proprietário vê. Ele escolhe cadastrar agora ou deixar para depois (no Perfil).
  const [fazendaAgora, setFazendaAgora] = useState(true);
  const [fazenda, setFazenda] = useState<FazendaForm>(fazendaVazia);
  const [erros, setErros] = useState<Erros>({});
  const [erroGeral, setErroGeral] = useState('');
  const [errosLista, setErrosLista] = useState<string[]>([]); // lista "campo: problema" para o quadro vermelho
  const [enviando, setEnviando] = useState(false);
  const [localizando, setLocalizando] = useState(false);

  // Altera um campo da conta e apaga o erro daquele campo
  const onCad = (campo: 'nome' | 'email' | 'senha') => (e: React.ChangeEvent<HTMLInputElement>) => {
    setCad((c) => ({ ...c, [campo]: e.target.value }));
    setErros((er) => ({ ...er, [campo]: '' }));
  };
  // Mesma ideia para os campos da fazenda
  const onFazenda = (campo: keyof FazendaForm, chaveErro: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFazenda((f) => ({ ...f, [campo]: e.target.value }));
    setErros((er) => ({ ...er, [chaveErro]: '' }));
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
    // 1) valida no próprio navegador antes de chamar a API
    const novosErros: Erros = {
      ...validarConta(cad),
      ...(vaiCadastrarFazenda ? validarFazenda(fazenda) : {}),
    };
    setErros(novosErros);
    if (Object.keys(novosErros).length > 0) {
      setErroGeral('Não foi possível criar a conta. Corrija os campos abaixo:');
      setErrosLista(Object.values(novosErros));
      return;
    }

    // 2) envia; técnico nunca manda fazenda
    setEnviando(true);
    try {
      const user = await signup({
        nome: cad.nome.trim(),
        email: cad.email.trim(),
        senha: cad.senha,
        role,
        fazenda: vaiCadastrarFazenda ? fazendaParaApi(fazenda) : undefined,
      });
      login(user);
      navigate('/dashboard');
    } catch (err) {
      // 3) se o backend recusar, mostra o erro embaixo do campo certo
      const apiErr = readApiError(err);
      const doBackend = errosDoBackend(apiErr.fields);
      setErros(doBackend);
      setErroGeral(apiErr.message || 'Não foi possível criar a conta');
      // lista o que o servidor reclamou (campos ou detalhes), para o usuário saber o que arrumar
      const lista = Object.keys(doBackend).length > 0 ? Object.values(doBackend) : (apiErr.details ?? []);
      setErrosLista(lista);
    } finally {
      setEnviando(false);
    }
  };


  return (
    <>
    <div style={{width: '100%', minHeight: '100vh', position: 'relative', overflowX: 'hidden', backgroundImage: "url('/images/signup-bg.jpg')", backgroundSize: 'cover', backgroundPosition: 'center', boxShadow: '0 20px 48px rgba(22,21,15,.18)'}}>
      <div style={{position: 'absolute', inset: '0', background: 'linear-gradient(280deg, rgba(31,33,29,.82), rgba(31,33,29,.55) 40%, rgba(31,33,29,.08) 70%)'}} />
      <div style={{position: 'absolute', inset: '0', background: 'linear-gradient(180deg, rgba(31,33,29,.40), transparent 30%, rgba(31,33,29,.48))'}} />
      <div style={{position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column', padding: '0 56px'}}>
        <div style={{height: '72px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
            <div style={{width: '36px', height: '36px', borderRadius: '12px', background: 'rgba(255,255,255,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <span style={{fontFamily: "'Material Symbols Outlined'", fontSize: '20px', lineHeight: '1', color: '#FFFFFF'}}>
                eco
              </span>
            </div>
            <div style={{fontFamily: "'Plus Jakarta Sans', Inter, sans-serif", fontSize: '19px', fontWeight: '800', letterSpacing: '-.01em'}}>
              <span style={{color: '#FFFFFF'}}>
                Harvest
              </span>
              <span style={{color: '#B9D0BC'}}>
                Point
              </span>
            </div>
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: '24px'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '20px'}}>
              <span style={{fontSize: '13px', color: 'rgba(255,255,255,.75)', cursor: 'pointer'}}>
                Documentação
              </span>
              <span style={{fontSize: '13px', color: 'rgba(255,255,255,.75)', cursor: 'pointer'}}>
                Suporte
              </span>
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'rgba(255,255,255,.7)', whiteSpace: 'nowrap'}}>
              <span style={{width: '6px', height: '6px', borderRadius: '50%', background: '#8FB596', display: 'inline-block', animation: 'hpPulse 2s ease-in-out infinite'}} />
              3 fazendas ativas no Vale agora
            </div>
            <div style={{fontSize: '13px', fontWeight: '600', color: '#FFFFFF', cursor: 'pointer'}} onClick={goLogin}>
              Entrar
            </div>
          </div>
        </div>
        <div style={{flex: '1', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '56px', paddingBottom: '24px'}}>
          <div style={{width: '440px', padding: '32px', borderRadius: '22px', background: 'rgba(255,255,255,.96)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,.5)', boxShadow: '0 20px 48px rgba(22,21,15,.18)', maxHeight: '780px', overflowY: 'auto'}}>
            <div style={{width: '48px', height: '48px', borderRadius: '16px', background: '#E7EFE7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', opacity: '0', animation: 'hpFieldIn 400ms ease-out forwards', animationDelay: '40ms'}}>
              <span style={{fontFamily: "'Material Symbols Outlined'", fontSize: '24px', lineHeight: '1', color: '#6B8F71'}}>
                eco
              </span>
            </div>
            <div style={{fontFamily: "'Plus Jakarta Sans', Inter, sans-serif", fontSize: '20px', lineHeight: '28px', fontWeight: '700', color: '#1F211D', textAlign: 'center', opacity: '0', animation: 'hpFieldIn 400ms ease-out forwards', animationDelay: '80ms'}}>
              Criar sua conta
            </div>
            <div style={{fontSize: '12px', lineHeight: '16px', color: '#6B6D63', textAlign: 'center', marginTop: '4px', opacity: '0', animation: 'hpFieldIn 400ms ease-out forwards', animationDelay: '110ms'}}>
              Acompanhe clima, lotes e operações do Vale.
            </div>
            <div style={{opacity: '0', animation: 'hpFieldIn 400ms ease-out forwards', animationDelay: '150ms'}}>
              <Campo label="Nome completo" erro={erros.nome}>
                <input type="text" placeholder="Seu nome" value={cad.nome} onChange={onCad('nome')} style={inputStyle} />
              </Campo>
              <Campo label="E-mail profissional" erro={erros.email} icone="mail">
                <input type="email" placeholder="seu@email.com" value={cad.email} onChange={onCad('email')} style={inputStyle} />
              </Campo>
              <Campo label="Senha" erro={erros.senha} icone="lock">
                <input type="password" placeholder="mínimo 6 caracteres" value={cad.senha} onChange={onCad('senha')} style={{ ...inputStyle, letterSpacing: '.04em' }} />
              </Campo>
            </div>
            <div style={{fontSize: '11px', lineHeight: '14px', fontWeight: '700', letterSpacing: '.08em', color: '#8B8D82', margin: '22px 0 10px', opacity: '0', animation: 'hpFieldIn 400ms ease-out forwards', animationDelay: '270ms'}}>
              QUAL SUA FUNÇÃO NA FAZENDA
            </div>

            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', opacity: '0', animation: 'hpFieldIn 400ms ease-out forwards', animationDelay: '270ms'}}>
              <div style={roleCardProprietario} onClick={selectRoleProprietario}>
                <span style={{fontFamily: "'Material Symbols Outlined'", fontSize: '20px', lineHeight: '1', color: roleIconColorProprietario}}>
                  potted_plant
                </span>
                <div style={{fontSize: '13px', lineHeight: '16px', fontWeight: '600', color: '#1F211D', marginTop: '6px'}}>
                  Proprietário
                </div>
                <div style={{fontSize: '12px', lineHeight: '14px', color: '#6B6D63', marginTop: '2px'}}>
                  Visão geral da fazenda
                </div>
                {Boolean(role) && (
                  <React.Fragment>
                  <span style={{position: 'absolute', top: '10px', right: '10px', fontFamily: "'Material Symbols Outlined'", fontSize: '16px', lineHeight: '1', color: '#6B8F71', opacity: roleCheckProprietario}}>
                    check_circle
                  </span>
                  </React.Fragment>
                )}
              </div>
              <div style={roleCardTecnico} onClick={selectRoleTecnico}>
                <span style={{fontFamily: "'Material Symbols Outlined'", fontSize: '20px', lineHeight: '1', color: roleIconColorTecnico}}>
                  engineering
                </span>
                <div style={{fontSize: '13px', lineHeight: '16px', fontWeight: '600', color: '#1F211D', marginTop: '6px'}}>
                  Técnico de campo
                </div>
                <div style={{fontSize: '12px', lineHeight: '14px', color: '#6B6D63', marginTop: '2px'}}>
                  Coleta e operações
                </div>
                {Boolean(role) && (
                  <React.Fragment>
                  <span style={{position: 'absolute', top: '10px', right: '10px', fontFamily: "'Material Symbols Outlined'", fontSize: '16px', lineHeight: '1', color: '#6B8F71', opacity: roleCheckTecnico}}>
                    check_circle
                  </span>
                  </React.Fragment>
                )}
              </div>
            </div>
            {role === 'tecnico' ? (
              <div style={{fontSize: '12px', lineHeight: '18px', color: '#6B6D63', background: '#F4F3EE', borderRadius: '12px', padding: '12px 14px', marginTop: '16px'}}>
                Técnicos acompanham as fazendas dos produtores, então não precisam cadastrar propriedade.
              </div>
            ) : (
              <div style={{marginTop: '16px'}}>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px'}}>
                  <div style={{fontSize: '13px', fontWeight: 600, color: '#1F211D'}}>Sua fazenda</div>
                  <div style={{display: 'flex', gap: '4px', background: '#F4F3EE', borderRadius: '10px', padding: '3px'}}>
                    <button type="button" onClick={() => setFazendaAgora(true)} style={{border: 'none', borderRadius: '8px', padding: '6px 10px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', background: fazendaAgora ? '#FFFFFF' : 'transparent', color: fazendaAgora ? '#1F211D' : '#6B6D63'}}>
                      Cadastrar agora
                    </button>
                    <button type="button" onClick={() => setFazendaAgora(false)} style={{border: 'none', borderRadius: '8px', padding: '6px 10px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', background: !fazendaAgora ? '#FFFFFF' : 'transparent', color: !fazendaAgora ? '#1F211D' : '#6B6D63'}}>
                      Deixar para depois
                    </button>
                  </div>
                </div>
                {fazendaAgora ? (
                  <>
                    <Campo label="Nome da fazenda" erro={erros.fazenda_nome}>
                      <input type="text" placeholder="Ex.: Fazenda Boa Vista" value={fazenda.nome} onChange={onFazenda('nome', 'fazenda_nome')} style={inputStyle} />
                    </Campo>
                    <div style={{display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '10px'}}>
                      <Campo label="Município" erro={erros.fazenda_municipio}>
                        <input type="text" placeholder="Petrolina - PE" value={fazenda.municipio} onChange={onFazenda('municipio', 'fazenda_municipio')} style={inputStyle} />
                      </Campo>
                      <Campo label="Área (ha)" erro={erros.fazenda_area_total}>
                        <input type="text" inputMode="decimal" placeholder="120" value={fazenda.area} onChange={onFazenda('area', 'fazenda_area_total')} style={inputStyle} />
                      </Campo>
                    </div>
                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px'}}>
                      <Campo label="Latitude" erro={erros.fazenda_latitude}>
                        <input type="text" inputMode="decimal" placeholder="-9.3891" value={fazenda.latitude} onChange={onFazenda('latitude', 'fazenda_latitude')} style={inputStyle} />
                      </Campo>
                      <Campo label="Longitude" erro={erros.fazenda_longitude}>
                        <input type="text" inputMode="decimal" placeholder="-40.5027" value={fazenda.longitude} onChange={onFazenda('longitude', 'fazenda_longitude')} style={inputStyle} />
                      </Campo>
                    </div>
                    <button type="button" onClick={usarMinhaLocalizacao} disabled={localizando} style={{marginTop: '10px', border: 'none', background: 'transparent', color: '#6B8F71', fontSize: '12px', fontWeight: 600, cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: '6px'}}>
                      <span style={{fontFamily: "'Material Symbols Outlined'", fontSize: '16px', lineHeight: '1'}}>my_location</span>
                      {localizando ? 'Buscando localização...' : 'Usar minha localização atual'}
                    </button>
                  </>
                ) : (
                  <div style={{fontSize: '12px', lineHeight: '18px', color: '#6B6D63', marginTop: '8px'}}>
                    Tudo bem! Depois é só ir em Perfil → Minhas fazendas e informar nome, município, área e coordenadas.
                  </div>
                )}
              </div>
            )}
            {erroGeral ? (
              <div role="alert" style={{fontSize: '13px', color: '#B42318', marginTop: '12px', background: '#FEF3F2', border: '1px solid #FDA29B', borderRadius: '10px', padding: '10px 12px'}}>
                <div style={{fontWeight: 600}}>{erroGeral}</div>
                {errosLista.length > 0 ? (
                  <ul style={{margin: '6px 0 0', paddingLeft: '18px'}}>
                    {errosLista.map((e) => <li key={e}>{e}</li>)}
                  </ul>
                ) : null}
              </div>
            ) : null}
            <div style={{height: '52px', marginTop: '20px', borderRadius: '12px', background: '#6B8F71', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', fontSize: '15px', fontWeight: '600', cursor: enviando ? 'default' : 'pointer', opacity: '0', animation: 'hpFieldIn 400ms ease-out forwards', animationDelay: '350ms'}} onClick={enviando ? undefined : goDashboard}>
              {enviando ? 'Criando conta...' : 'Criar conta'}
            </div>
            <div style={{textAlign: 'center', fontSize: '12px', color: '#6B6D63', marginTop: '14px', opacity: '0', animation: 'hpFieldIn 400ms ease-out forwards', animationDelay: '380ms'}}>
              Já tem uma conta? 
              <span style={{color: '#6B8F71', fontWeight: '600', cursor: 'pointer'}} onClick={goLogin}>
                Entrar
              </span>
            </div>
          </div>
          <div style={{maxWidth: '480px', alignSelf: 'center', textAlign: 'right', width: '485px', height: '146px'}}>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px', marginBottom: '20px', opacity: '0', animation: 'hpFieldIn 400ms ease-out forwards', animationDelay: '40ms'}}>
              <div style={{fontSize: '11px', lineHeight: '14px', fontWeight: '700', letterSpacing: '.08em', color: 'rgba(255,255,255,.7)'}}>
                HARVESTPOINT
              </div>
              <div style={{width: '3px', height: '16px', borderRadius: '2px', background: '#B9D0BC'}} />
            </div>
            <h1 style={{margin: '0', fontFamily: "'Plus Jakarta Sans', Inter, sans-serif", fontSize: '36px', lineHeight: '42px', fontWeight: '800', letterSpacing: '-.02em', color: '#FFFFFF', textWrap: 'pretty', opacity: '0', animation: 'hpFieldIn 400ms ease-out forwards', animationDelay: '90ms'}}>
              Bem-vindo ao Vale — leva menos de 
              <span style={{color: '#B9D0BC', borderBottom: '3px solid #B9D0BC', borderRadius: '3px', paddingBottom: '3px'}}>
                dois minutos
              </span>
              .
            </h1>
            <p style={{margin: '18px 0 0', fontSize: '15px', lineHeight: '23px', color: 'rgba(255,255,255,.85)', maxWidth: '420px', marginLeft: 'auto', opacity: '0', animation: 'hpFieldIn 400ms ease-out forwards', animationDelay: '140ms'}}>
              Cadastre sua fazenda e comece a acompanhar clima, lotes e operações em tempo real.
            </p>
            <div style={{height: '1px', background: 'rgba(255,255,255,.2)', margin: '24px 0 18px', opacity: '0', animation: 'hpFieldIn 400ms ease-out forwards', animationDelay: '170ms'}} />
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px', opacity: '0', animation: 'hpFieldIn 400ms ease-out forwards', animationDelay: '200ms'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: 'rgba(255,255,255,.75)'}}>
                Sem cartão de crédito, sem compromisso
                <span style={{width: '6px', height: '6px', background: '#B9D0BC', display: 'block'}} />
              </div>
              <div style={{display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: 'rgba(255,255,255,.75)'}}>
                Painel de clima e alertas já no primeiro acesso
                <span style={{width: '6px', height: '6px', background: '#B9D0BC', display: 'block'}} />
              </div>
              <div style={{display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: 'rgba(255,255,255,.75)'}}>
                Simulador de telemetria pronto para testar
                <span style={{width: '6px', height: '6px', background: '#B9D0BC', display: 'block'}} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
