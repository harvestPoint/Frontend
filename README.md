# 🌾 HarvestPoint — Frontend (React + TypeScript)

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38BDF8?logo=tailwindcss)
![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?logo=vite)
![Status](https://img.shields.io/badge/status-estável-success)

> Interface web do sistema de monitoramento agrícola HarvestPoint. Permite que agricultores e técnicos visualizem leituras de sensores IoT, gerenciem propriedades e lotes, e tomem decisões de colheita com base em recomendações de IA.

---

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Requisitos](#requisitos)
- [Instalação e Execução](#instalação-e-execução)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [Páginas Disponíveis](#páginas-disponíveis)
- [Conexão com a API](#conexão-com-a-api)
- [Autenticação no Frontend](#autenticação-no-frontend)
- [Temas (Claro/Escuro)](#temas-claroescuro)
- [Scripts Disponíveis](#scripts-disponíveis)

---

## Visão Geral

O frontend HarvestPoint é uma **SPA (Single Page Application)** construída com:

- **React 19** + **TypeScript 6** — UI reativa com tipagem estática completa
- **Tailwind CSS 3.4** — estilização utilitária com suporte a tema claro/escuro
- **Vite 8** — bundler ultrarrápido com proxy de API embutido
- **React Router DOM 7** — roteamento declarativo com proteção de rotas
- **Axios** — cliente HTTP com interceptors para Bearer Token automático
- **Lucide React** — ícones SVG consistentes

---

## Requisitos

| Componente | Versão mínima |
|------------|---------------|
| Node.js    | 18+           |
| npm        | 9+            |

> O backend Rails deve estar rodando em `http://localhost:3333` antes de iniciar o frontend.

---

## Instalação e Execução

### 1. Instalar dependências

```powershell
cd Frontend\apps\web
npm install
```

### 2. Iniciar em modo de desenvolvimento

```powershell
npm run dev
```

O frontend ficará disponível em **`http://localhost:5173`**.

O Vite faz proxy automático de `/api/*` para `http://localhost:3333`, então não há problema de CORS no desenvolvimento.

### 3. Build para produção

```powershell
npm run build
```

Os arquivos compilados são gerados na pasta `dist/`, prontos para servir com qualquer servidor estático (Nginx, Vercel, etc.).

### 4. Preview do build de produção

```powershell
npm run preview
```

---

## Variáveis de Ambiente

O frontend utiliza o proxy do Vite para apontar `/api` ao backend, portanto **não é necessário configurar `VITE_API_URL` em desenvolvimento**.

Para build de produção apontando para uma API remota, crie um arquivo `.env.production` na pasta `Frontend/apps/web/`:

```env
# Frontend/apps/web/.env.production
VITE_API_URL=https://api.seudominio.com
```

E ajuste o `vite.config.ts` para usar a variável:

```typescript
server: {
  proxy: {
    '/api': process.env.VITE_API_URL ?? 'http://localhost:3333',
  },
}
```

| Variável       | Padrão                      | Descrição                       |
|----------------|-----------------------------|---------------------------------|
| `VITE_API_URL` | `http://localhost:3333`     | URL base da API Rails           |

---

## Estrutura de Pastas

```
Frontend/
├── apps/
│   └── web/                        # Aplicação principal
│       ├── public/
│       │   ├── favicon.svg
│       │   ├── icons.svg
│       │   └── images/
│       ├── src/
│       │   ├── assets/
│       │   │   └── login-bg.png    # Imagem de fundo da tela de login
│       │   ├── contexts/
│       │   │   ├── AuthContext.tsx      # Estado global de autenticação
│       │   │   ├── PropertyContext.tsx  # Propriedade selecionada globalmente
│       │   │   └── ThemeContext.tsx     # Gerenciamento de tema claro/escuro
│       │   ├── features/           # Módulos por domínio de negócio
│       │   │   ├── alertas/
│       │   │   │   └── pages/AlertasPage.tsx
│       │   │   ├── auth/
│       │   │   │   └── pages/
│       │   │   │       ├── LoginPage.tsx
│       │   │   │       └── SignupPage.tsx
│       │   │   ├── cadastros/      # Submódulos de cadastro
│       │   │   │   ├── culturas/pages/
│       │   │   │   ├── produtores/pages/
│       │   │   │   ├── propriedades/pages/
│       │   │   │   └── sensores/pages/
│       │   │   ├── conta/
│       │   │   │   └── pages/PerfilPage.tsx
│       │   │   ├── dashboard/
│       │   │   │   └── pages/DashboardPage.tsx
│       │   │   ├── inteligencia/
│       │   │   │   └── pages/
│       │   │   │       ├── JanelaColheitaPage.tsx
│       │   │   │       └── JanelaExportacaoPage.tsx
│       │   │   ├── landing/
│       │   │   │   └── pages/LandingPage.tsx
│       │   │   ├── leituras/
│       │   │   │   └── pages/LeiturasPage.tsx
│       │   │   ├── logistica/
│       │   │   │   └── pages/LogisticaPage.tsx
│       │   │   ├── lotes/
│       │   │   │   ├── components/LotesVazioState.tsx
│       │   │   │   └── pages/
│       │   │   │       ├── LotesPage.tsx
│       │   │   │       └── LoteDetalhePage.tsx
│       │   │   └── mercado/
│       │   │       └── pages/MercadoPage.tsx
│       │   ├── layouts/
│       │   │   ├── AppShell.tsx         # Layout principal com sidebar
│       │   │   └── parts/Sidebar.tsx    # Navegação lateral
│       │   ├── lib/
│       │   │   ├── api.ts               # Cliente Axios + todas as chamadas de API
│       │   │   └── uiHelpers.ts         # Utilitários de UI
│       │   ├── routes/
│       │   │   ├── index.tsx            # Definição de todas as rotas
│       │   │   └── RequireAuth.tsx      # Guard de rota autenticada
│       │   ├── theme/
│       │   │   ├── index.ts
│       │   │   └── tokens.ts            # Tokens de design (cores, espaçamento)
│       │   ├── App.tsx                  # Raiz da aplicação com Providers
│       │   ├── index.css                # CSS global + variáveis de tema
│       │   └── main.tsx                 # Entry point React
│       ├── vite.config.ts
│       ├── tailwind.config.ts
│       ├── tsconfig.json
│       └── package.json
└── docs/
    └── assets/
        ├── screenshot-1440.png
        └── screenshot-1600.png
```

---

## Páginas Disponíveis

### Públicas (sem login)

| Rota       | Componente          | Descrição                                                    |
|------------|---------------------|--------------------------------------------------------------|
| `/`        | `LandingPage`       | Página inicial de apresentação do HarvestPoint               |
| `/login`   | `LoginPage`         | Formulário de login com email e senha                        |
| `/signup`  | `SignupPage`        | Cadastro de novo produtor ou técnico                         |

---

### Protegidas (requerem login)

| Rota                        | Componente                | Descrição                                                        |
|-----------------------------|---------------------------|------------------------------------------------------------------|
| `/dashboard`                | `DashboardPage`           | Visão geral: KPIs, alertas recentes, lotes, clima                |
| `/lotes`                    | `LotesPage`               | Lista de lotes com temperatura/umidade em tempo real             |
| `/lotes/:id`                | `LoteDetalhePage`         | Detalhe do lote: histórico de leituras, alertas, recomendação    |
| `/alertas`                  | `AlertasPage`             | Central de alertas — filtro por status e lote, resolução         |
| `/leituras`                 | `LeiturasPage`            | Histórico de leituras de sensores com exportação CSV             |
| `/inteligencia/colheita`    | `JanelaColheitaPage`      | Recomendações de janela de colheita geradas por IA               |
| `/inteligencia/exportacao`  | `JanelaExportacaoPage`    | Exportação de dados e relatórios                                 |
| `/mercado`                  | `MercadoPage`             | Cotações de mercado por cultura                                  |
| `/logistica`                | `LogisticaPage`           | Visão logística de colheita e transporte                         |
| `/cadastros/propriedades`   | `PropriedadesPage`        | Gerenciamento de fazendas/sítios                                 |
| `/cadastros/culturas`       | `CulturasPage`            | Gerenciamento de tipos de cultura                                |
| `/cadastros/sensores`       | `SensoresPage`            | Listagem e vinculação de sensores IoT a lotes                    |
| `/cadastros/produtores`     | `ProdutoresPage`          | Listagem de produtores (visão técnico)                           |
| `/conta/perfil`             | `PerfilPage`              | Perfil do usuário logado — edição de nome, telefone, senha       |

---

## Conexão com a API

Toda a comunicação com o backend Rails é centralizada em [`src/lib/api.ts`](./apps/web/src/lib/api.ts).

### Configuração do Axios

```typescript
// src/lib/api.ts
export const api = axios.create({
  baseURL: '/api',  // Vite faz proxy para http://localhost:3333
  headers: { 'Content-Type': 'application/json' },
});

// Interceptor: injeta o Bearer Token automaticamente em todas as requisições
api.interceptors.request.use((config) => {
  const token = getToken(); // lê de localStorage('hp_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Funções de API disponíveis

O arquivo `api.ts` exporta funções tipadas para cada recurso:

| Função                        | Endpoint                          |
|-------------------------------|-----------------------------------|
| `signup(payload)`             | `POST /auth/signup`               |
| `login(payload)`              | `POST /auth/login`                |
| `fetchMe()`                   | `GET /auth/me`                    |
| `logoutRequest()`             | `DELETE /auth/logout`             |
| `listLotes()`                 | `GET /lotes`                      |
| `getLote(id)`                 | `GET /lotes/:id`                  |
| `createLote(payload)`         | `POST /lotes`                     |
| `updateLote(id, payload)`     | `PATCH /lotes/:id`                |
| `deleteLote(id)`              | `DELETE /lotes/:id`               |
| `fetchDashboard(propId?)`     | `GET /dashboard`                  |
| `listAlertas(params?)`        | `GET /alertas`                    |
| `resolverAlerta(id)`          | `PATCH /alertas/:id/resolver`     |
| `listLeituras(params?)`       | `GET /leituras`                   |
| `exportLeiturasCsv()`         | `GET /leituras?format=csv`        |
| `listSensores(params?)`       | `GET /sensores`                   |
| `createSensor(payload)`       | `POST /sensores`                  |
| `listPropriedades()`          | `GET /propriedades`               |
| `listCulturas()`              | `GET /culturas`                   |
| `listRecomendacoes(params?)`  | `GET /recomendacoes`              |
| `gerarRecomendacoes()`        | `POST /recomendacoes/gerar`       |
| `aceitarRecomendacao(id)`     | `PATCH /recomendacoes/:id/aceitar`|
| `rejeitarRecomendacao(id)`    | `PATCH /recomendacoes/:id/rejeitar`|
| `listMercado()`               | `GET /mercado`                    |
| `listClima(propId?)`          | `GET /clima`                      |
| `listUsuarios(tipo?)`         | `GET /usuarios`                   |

### Utilitários de formatação

```typescript
formatDate(value)      // "2026-10-15" → "15/10/2026"
formatDateTime(value)  // ISO → "15/10 18:30"
iniciais(nome)         // "João Silva" → "JS"
```

---

## Autenticação no Frontend

Gerenciada pelo [`AuthContext`](./apps/web/src/contexts/AuthContext.tsx):

```
App.tsx
└── AuthProvider
    ├── Ao montar: chama fetchMe() para restaurar sessão do localStorage
    ├── login(user) — atualiza estado após POST /auth/login
    └── logout() — chama DELETE /auth/logout + limpa localStorage
```

### Proteção de rotas

O componente [`RequireAuth`](./apps/web/src/routes/RequireAuth.tsx) envolve todas as rotas protegidas. Se o usuário não estiver autenticado (sem token ou token inválido), redireciona para `/login`.

```tsx
// src/routes/RequireAuth.tsx
// Bloqueia acesso a rotas privadas caso não haja sessão ativa
```

### Fluxo completo

```
1. Usuário acessa /dashboard
2. RequireAuth verifica AuthContext.ready + AuthContext.user
3. Se não autenticado → redireciona para /login
4. LoginPage chama login() do api.ts
5. api.ts salva token em localStorage('hp_token')
6. AuthContext.login(user) atualiza estado global
7. Todas as requisições subsequentes têm Authorization: Bearer <token>
```

---

## Seleção de Propriedade

O [`PropertyContext`](./apps/web/src/contexts/PropertyContext.tsx) mantém qual propriedade está selecionada globalmente (persiste em `localStorage('hp_propriedade_id')`). Isso filtra automaticamente o dashboard, alertas, leituras e clima para a propriedade escolhida.

---

## Temas (Claro/Escuro)

Gerenciado pelo [`ThemeContext`](./apps/web/src/contexts/ThemeContext.tsx):

- **Detecção automática** da preferência do sistema operacional (`prefers-color-scheme`)
- **Persistência** da escolha do usuário em `localStorage('harvestpoint:theme')`
- **Aplicação** via atributo `data-theme="dark"` no elemento `<html>`, integrado ao Tailwind CSS

```tsx
// Usar em qualquer componente:
const { theme, toggleTheme } = useTheme();
```

O Tailwind está configurado com a estratégia `class` para dark mode, ativado pelo `data-theme` no `tailwind.config.ts`.

---

## Scripts Disponíveis

Execute dentro de `Frontend/apps/web/`:

| Comando           | Descrição                                               |
|-------------------|---------------------------------------------------------|
| `npm run dev`     | Inicia o servidor de desenvolvimento Vite (porta 5173)  |
| `npm run build`   | Compila TypeScript e gera build de produção em `dist/`  |
| `npm run preview` | Serve o build de produção localmente para validação      |
| `npm run lint`    | Executa o linter OXLint no código TypeScript/React       |

---

## Alias de Importação

O projeto usa o alias `@` para simplificar imports:

```typescript
// Em vez de:
import { api } from '../../../lib/api';

// Use:
import { api } from '@/lib/api';
```

Configurado em `vite.config.ts` e `tsconfig.app.json`.