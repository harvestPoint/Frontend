// Tela de login. Mesmo esqueleto do Cadastro (estilos em auth.css) e mesma
// tipografia da landing. O perfil (proprietário/técnico) vem da conta no
// backend, por isso não há mais seletor de perfil aqui.
import { useState, type FormEvent } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { login as loginRequest, readApiError } from '@/lib/api';
import Logo from '@/components/Logo';
import './auth.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const { user, ready, login } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [showSenha, setShowSenha] = useState(false);

  const handleEntrar = async (e: FormEvent) => {
    e.preventDefault();
    if (enviando) return;
    if (!email.trim() || !senha) {
      setErro('Informe o e-mail e a senha.');
      return;
    }
    setErro('');
    setEnviando(true);
    try {
      const u = await loginRequest({ email: email.trim(), senha });
      login(u);
      // replace: o "voltar" do navegador não cai de novo no login
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setErro(readApiError(err).message || 'Não foi possível entrar');
      setEnviando(false);
    }
  };

  // Quem já está logado não precisa ver o login
  if (ready && user) return <Navigate to="/dashboard" replace />;

  return (
    <div className="hp-auth hp-auth--login hp-page-in" style={{ backgroundImage: "url('/images/auth-bg.jpg')" }}>
      <div className="hp-auth-scrim" />
      <div className="hp-auth-shell">
        <header className="hp-auth-top">
          <Link to="/" className="hp-auth-logo" aria-label="HarvestPoint: voltar para a página inicial">
            <Logo size={36} textColor="#FFFFFF" />
          </Link>
          <nav className="hp-auth-acoes" aria-label="Conta">
            <span className="hp-auth-status">Plataforma ativa no Vale do São Francisco</span>
            <Link to="/criar-conta" className="hp-auth-btn-ghost">Criar conta</Link>
          </nav>
        </header>

        <main className="hp-auth-main">
          <section className="hp-auth-hero" aria-label="Sobre o HarvestPoint">
            <div className="hp-auth-sobrelinha">HARVESTPOINT · VALE DO SÃO FRANCISCO</div>
            <h1 className="hp-auth-h1">
              Tecnologia para uma colheita no <em>ponto certo</em>.
            </h1>
            <p className="hp-auth-p">Mais produtividade, menos desperdício e frutas de qualidade para o mundo.</p>
            <ul className="hp-auth-lista">
              <li>Temperatura e umidade de cada lote, direto do ESP32</li>
              <li>Alerta quando o lote sai da faixa da cultura</li>
              <li>Janela de colheita e de exportação por lote</li>
            </ul>
          </section>

          <form className="hp-auth-card" onSubmit={handleEntrar} noValidate aria-labelledby="login-titulo">
            <div className="hp-auth-card-icone">
              <Logo size={32} showText={false} />
            </div>
            <h2 id="login-titulo" className="hp-auth-card-titulo">Bem-vindo de volta</h2>
            <p className="hp-auth-card-sub">Acompanhe clima, lotes e operações do Vale.</p>

            <label className="hp-auth-label" htmlFor="login-email">E-mail profissional</label>
            <div className="hp-auth-campo">
              <span className="hp-auth-ic" aria-hidden="true">mail</span>
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setErro(''); }}
              />
            </div>

            <label className="hp-auth-label" htmlFor="login-senha">Senha</label>
            <div className="hp-auth-campo">
              <span className="hp-auth-ic" aria-hidden="true">lock</span>
              <input
                id="login-senha"
                type={showSenha ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="••••••••"
                value={senha}
                onChange={(e) => { setSenha(e.target.value); setErro(''); }}
              />
              <button
                type="button"
                className="hp-auth-olho"
                onClick={() => setShowSenha((v) => !v)}
                aria-label={showSenha ? 'Esconder senha' : 'Mostrar senha'}
                aria-pressed={showSenha}
              >
                <span className="hp-auth-ic" aria-hidden="true" style={{ color: 'inherit' }}>
                  {showSenha ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>

            {erro ? (
              <div className="hp-auth-alerta" role="alert">{erro}</div>
            ) : null}

            <button type="submit" className="hp-auth-btn" disabled={enviando}>
              {enviando ? 'Entrando...' : 'Entrar na plataforma'}
              <span className="hp-auth-ic" aria-hidden="true" style={{ color: 'inherit' }}>arrow_forward</span>
            </button>

            <div className="hp-auth-rodape-card">
              Não tem uma conta? <Link to="/criar-conta">Criar conta gratuitamente</Link>
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
