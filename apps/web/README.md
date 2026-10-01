# HarvestPoint — apps/web

Plataforma de inteligência agroclimática para fruticultura irrigada no Vale
do São Francisco. Este pacote é o resultado de aplicar o design aprovado no
Claude Design (`HarvestPoint.dc.html`) dentro da estrutura de projeto
definida no `HarvestPoint-Guia-Arquitetura-e-Design-v2.pdf`.

## Como rodar

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # gera dist/ — já testado, builda limpo
npx tsc -b        # typecheck isolado — já roda sem erro
```

## O que foi feito nesta migração

- Estrutura reorganizada em `apps/web` (a pasta velha
  `Frontend/telas/harvestpoint-login`, o `_backup_refactor` morto e os
  screenshots soltos na raiz saíram; ver Parte II do PDF).
- As **18 telas** do export do Claude Design foram convertidas de verdade
  (não coladas como HTML) para componentes React + TypeScript, com hooks
  reais no lugar da interatividade do protótipo: seletor de perfil, drawer
  do lote, menu de período, chips do dashboard, scroll da landing, tema
  claro/escuro.
- `Sidebar.tsx` liga a condição `isTecnico` (que já vinha pronta no design
  aprovado, escondendo "Cadastros" do Proprietário) ao papel real do usuário
  autenticado, em `AuthContext`.
- Tokens de cor (claro e escuro) extraídos direto do design aprovado — não
  são mais uma proposta, é o que já está valendo.
- `npx tsc -b` e `npm run build` rodam limpos, sem erro.

## Onde cada coisa foi parar

| Tela | Caminho |
|---|---|
| Login | `src/features/auth/pages/LoginPage.tsx` |
| Cadastro | `src/features/auth/pages/SignupPage.tsx` |
| Landing | `src/features/landing/pages/LandingPage.tsx` |
| Dashboard | `src/features/dashboard/pages/DashboardPage.tsx` |
| Lotes / Detalhe do Lote | `src/features/lotes/pages/` |
| Leituras IoT | `src/features/leituras/pages/LeiturasPage.tsx` |
| Alertas | `src/features/alertas/pages/AlertasPage.tsx` |
| Janela de Colheita/Exportação | `src/features/inteligencia/pages/` |
| Mercado / Logística | `src/features/mercado/`, `src/features/logistica/` |
| Perfil | `src/features/conta/pages/PerfilPage.tsx` |
| Produtores/Propriedades/Culturas/Sensores | `src/features/cadastros/*/pages/` (só Técnico) |
| Shell (sidebar + topbar) | `src/layouts/AppShell.tsx`, `src/layouts/parts/Sidebar.tsx` |
| Rotas | `src/routes/index.tsx` |

## Correções que eu apliquei durante a migração (não estavam no design)

Comparado ao export original do Claude Design, estas eu mudei porque eram
bugs reais, não escolha de estilo:

1. **Login e Cadastro não tinham campo de verdade.** No protótipo, e-mail,
   senha, nome e propriedade eram `<div>`s decorativos parecendo input —
   dava pra ver mas não pra digitar. Troquei os quatro por `<input>` reais,
   controlados por `useState`, mantendo exatamente o visual original.
2. **As imagens de fundo do Login/Cadastro apontavam pra um caminho que só
   existe dentro do pacote do Claude Design** (`uploads/pasted-...png`).
   Copiei os arquivos de verdade para `public/images/auth-bg.jpg` e
   `public/images/signup-bg.jpg` e corrigi a referência.
3. **Login, Cadastro e Landing tinham `width: 1440px` fixo** no contêiner
   raiz (herdado do canvas de design). Troquei por `width: 100%`.
4. **Ícones e a logo apareciam como texto** ("warning", "eco",
   "notifications" em vez do desenho do ícone). Não é fonte quebrada nem
   dependência faltando — o Material Symbols é uma fonte de *ligaduras*
   (o navegador troca o nome pelo desenho), e isso exige
   `font-feature-settings: 'liga'` explícito no CSS. Sem essa linha, o
   texto aparece literal mesmo com a fonte carregada certinha. Adicionei a
   regra em `src/index.css` (seletor `[style*="Material Symbols"]`, cobre
   todo ícone do app de uma vez).
5. **Login e Cadastro não tinham rolagem em janelas pequenas.** A camada de
   conteúdo estava com `position: absolute; inset: 0`, presa exatamente ao
   tamanho da janela — se o conteúdo fosse mais alto que a tela (janela
   pequena, zoom, fonte maior), ele era cortado, sem barra de rolagem.
   Troquei para fluxo normal (`position: relative; min-height: 100vh`), que
   mantém a centralização em telas grandes e permite rolar quando precisa.
6. **A rota `/` sempre caía direto no Dashboard**, nunca mostrava a
   Landing. O `AuthContext` começava com um usuário mockado já logado; troquei
   o padrão pra deslogado (`user: null`), que é o que faz sentido pra
   quem chega no site pela primeira vez. Login e Cadastro agora chamam
   `login()` de verdade antes de navegar pro Dashboard.

7. **Os cartões "herói" dos três blocos bento da Landing (Sensor→Alerta,
   85,3%, Simulador de telemetria) apareciam sem borda nem fundo** — só o
   texto flutuando. A causa: esses cartões dependiam inteiramente do hook
   de hover (`useHoverCard`) pra receber toda a aparência (borda, fundo,
   posição na grade), mas o hook só cuidava do efeito de passar o mouse.
   Reescrevi o hook pra aceitar o estilo base de cada cartão (`useHoverCard(base)`)
   e devolver isso mesclado com o realce de hover.
8. **Cartão de perfil (Proprietário/Técnico) tinha altura fixa (`96px`)** —
   quando o texto quebrava em 3 linhas (tela mais estreita), ele vazava e
   sobrepunha o botão do Google logo abaixo. Troquei pra altura mínima:
   agora o cartão cresce se precisar.
9. **A landing não usava a largura da tela — o conteúdo ficava grudado à
   esquerda** (`max-width` sem `margin: auto`), sobrando um vão vazio enorme
   à direita em monitores largos. Centralizei todos os blocos (hero, as 3
   grades bento, rodapé) numa largura de referência comum de 1200px.
10. **Cabeçalho e rodapé da Landing ganharam mais conteúdo**, combinando
    Documentação/Suporte com o contador ao vivo (a mesma combinação que já
    está no Login/Cadastro), e o rodapé passou a ter links reais em vez de
    uma linha solta.

11. **Landing page trocada pela nova versão** (a que veio em
    `ladingpage.zip`) — bem mais completa que a anterior: mockup real do
    dashboard no hero, seção de personas (Produtor/Técnico/Exportação),
    contadores animados nas estatísticas e fundo topográfico gerado por
    JavaScript com paralaxe real no scroll. O algoritmo do fundo e dos
    contadores é o mesmo do arquivo original, só portado para dentro de um
    `useEffect` do React (veja `LandingPage.tsx`). Essa tela **não** passa
    mais pelo pipeline de conversão automática (`assemble.py`) — foi escrita
    à mão a partir do HTML aprovado, então segura ela como está.
12. **A landing estava herdando o tema claro/escuro do resto do app e
    ficando ilegível** (mesma causa-raiz do bug do Login/Cadastro: o fundo e
    a cor de texto dependiam do `<body>` global, não eram fixos). Corrigido
    fixando `background`/`color` direto no contêiner raiz da página.
13. **Animação de entrada (`hpFieldIn`, com atraso crescente) estendida pra
    tela inteira do Login e do Cadastro** — antes só os campos do formulário
    do Cadastro tinham; agora a coluna lateral de ambas as telas e todo o
    conteúdo do card do Login entram em cascata também.

## O que ainda falta (pendências reais, não invenção minha)

- **Mobile não está responsivo de verdade.** Testei em 390px: o texto da
  landing/login vaza da tela. O export do Claude Design foi construído
  pensando em desktop; o comportamento mobile do §4.1/§4.2 do PDF (foto
  virando faixa de 260px, sidebar virando *drawer*) ainda não foi
  implementado aqui.
- **Nada fala com uma API de verdade.** Login, Cadastro, Exportar CSV do
  Dashboard — tudo está marcado com `// TODO` e usa dado mockado ou navega
  direto sem validar. Backend não existe ainda (é a Parte II §2.1 do PDF,
  2ª entrega).
- **`AuthContext` agora começa deslogado por padrão** (pra Landing aparecer
  em "/"). Pra navegar o app sem ficar logando toda hora enquanto não existe
  API, troque o `null` inicial em `src/contexts/AuthContext.tsx` por um
  usuário mockado — tem um exemplo comentado ali do lado.
- **Ícones usam a fonte Material Symbols Outlined** (carregada via Google
  Fonts no `index.html`), não lucide-react como o PDF original propunha —
  mantive fiel ao que foi de fato aprovado e construído no Claude Design.
- Fontes do Google (Plus Jakarta Sans, Inter, JetBrains Mono, Material
  Symbols) dependem de internet no primeiro load — considerar hospedar
  local se isso for um problema em campo.

## Convenção pra continuar

Qualquer tela nova segue o padrão que já está aqui: página em
`features/<recurso>/pages/`, usa os tokens de `src/theme/tokens.ts` e as
variáveis CSS de `src/index.css` (nunca hex solto), navega com
`useNavigate()`/`<NavLink>`, nunca `<a href>`.
