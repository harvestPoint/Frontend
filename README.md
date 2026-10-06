# HarvestPoint

Plataforma de inteligência agroclimática para fruticultura irrigada no Vale
do São Francisco. Integra sensores de campo, histórico climático e regras de
negócio por cultura para apoiar três decisões operacionais: quando colher,
quando exportar e quando agir diante de um desvio climático.

## Contexto do projeto

O Vale do São Francisco concentra parte relevante da produção nacional de
manga e uva irrigada, num cenário de aumento mensurável da temperatura média
regional nas últimas décadas. Produtores hoje decidem o momento da colheita
majoritariamente por observação direta e experiência, sem um histórico
estruturado de microclima por lote. O HarvestPoint propõe substituir essa
decisão por dado: cada lote tem sensores associados, cada cultura tem uma
faixa térmica e de umidade de referência, e o sistema aponta quando as
condições se desviam do esperado ou quando a janela ideal de colheita se
aproxima.

O projeto nasceu como parte de um Projeto Integrador e é desenvolvido por:
Angelo Mascarenhas, Abraão Freitas, Fabio Faustino, Gabriel Feliciano, Julio
Cesar e Kauã.

## Funcionalidades

- **Dashboard climático** — leitura consolidada de temperatura, umidade do
  ar e umidade do solo por lote, com comparação direta contra a faixa ideal
  da cultura e histórico em gráfico.
- **Simulador de telemetria** — geração de leituras simuladas de sensores em
  intervalo configurável, usado tanto para demonstração quanto para
  desenvolvimento sem depender de hardware físico em campo.
- **Alertas por lote e cultura** — disparo automático quando uma leitura sai
  da faixa configurada, com severidade e tempo decorrido.
- **Janela de colheita e de exportação** — recomendação do período ideal de
  colheita a partir do histórico climático acumulado do lote, cruzada com
  prazo logístico e cotação de mercado para a janela de exportação.
- **Mercado e logística** — cotação por cultura e destino, e cadastro de
  operações de transporte com custo e prazo por modal.
- **Acesso por perfil** — Proprietário e Técnico de campo têm menus
  distintos; cadastros operacionais (produtores, propriedades, culturas,
  sensores) ficam restritos ao perfil Técnico.
- **Landing page pública** — apresentação do produto para visitantes não
  autenticados, com demonstração do funcionamento e captura de conta.

## Arquitetura

O repositório segue um modelo de monorepo. Hoje contém a aplicação web;
backend e pipeline de dados estão planejados para as próximas entregas
(ver Roadmap).

```
harvestpoint/
├── apps/
│   └── web/            aplicação React (este é o app publicado hoje)
├── docs/
│   └── assets/          material de apoio e capturas de tela
└── README.md
```

Dentro de `apps/web`, o código é organizado por domínio, não por tipo de
arquivo: cada funcionalidade vive em `src/features/<nome>/`, com sua própria
pasta `pages/`. Componentes de interface reutilizáveis ficam em
`src/components` e `src/lib`; layout compartilhado (barra lateral, cabeçalho)
em `src/layouts`; autenticação e tema em `src/contexts`. O arquivo
`apps/web/README.md` documenta detalhes técnicos específicos do frontend,
incluindo decisões tomadas durante a última reorganização de código.

## Stack técnica

| Camada | Tecnologia |
|---|---|
| Frontend | React 19, TypeScript, Vite |
| Estilo | Tailwind CSS, tokens de design em `src/theme/tokens.ts` |
| Roteamento | React Router 7 |
| Backend | Node.js, Express, PostgreSQL — planejado, ainda não implementado |
| Ciência de dados | Python (pandas, scikit-learn) — planejado, ainda não implementado |

## Como rodar localmente

Pré-requisitos: Node.js 20 ou superior e npm.

```bash
cd apps/web
npm install
npm run dev
```

A aplicação sobe em `http://localhost:5173`. Para build de produção:

```bash
npm run build
npm run preview
```

Para verificação de tipos isolada:

```bash
npx tsc -b --noEmit
```

### Variáveis de ambiente

O projeto ainda não faz nenhuma chamada de rede a uma API própria — todos os
dados exibidos são simulados no próprio frontend. Quando o backend for
integrado, a URL da API será lida de uma variável de ambiente documentada em
`apps/web/.env.example`.

## Estado atual e roadmap

O projeto está estruturado em duas entregas.

**Primeira entrega — concluída no frontend.** Autenticação (interface),
cadastros operacionais, telemetria simulada, dashboard climático, alertas,
mercado, logística e landing page pública estão implementados como interface
funcional, com dados simulados.

**Segunda entrega — pendente.** API e banco de dados relacional, pipeline de
tratamento de dados climáticos, modelo de recomendação de janela de colheita
e de exportação, testes automatizados, integração contínua e adaptação da
interface para uso confortável em tela de celular.

Pendências conhecidas do frontend atual, sem solução ainda:

- A interface não é responsiva para telas de celular; foi construída e
  validada para uso em desktop.
- Não há integração com API real; toda a persistência é local ao
  carregamento da página.

## Convenções de contribuição

- Commits seguem o padrão `tipo(escopo): descrição` — por exemplo,
  `feat(dashboard): adiciona faixa de decisão`.
- Chamadas de API ficam isoladas em `features/<recurso>/api.ts`; nenhum
  componente de página faz requisição diretamente.
- Cor na interface é sempre lida dos tokens em `src/theme/tokens.ts` ou das
  variáveis CSS em `src/index.css` — não se introduz valor hexadecimal solto
  em componentes novos.
- Números exibidos na interface usam separador decimal por vírgula e fonte
  tabular, conforme convenção já aplicada em todo o projeto.

## Licença

Projeto acadêmico, desenvolvido para fins educacionais.