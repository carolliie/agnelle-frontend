# Agnelle Frontend

Frontend do painel administrativo da aplicação **Agnelle**, construído com Next.js + React + Tailwind CSS, para consumo da API com autenticação via Bearer token.

## 🧭 Visão geral

Este projeto tem como objetivo oferecer uma interface administrativa responsiva, estruturada e escalável, que permita:

- Autenticação e autorização de usuários logados (nome, e-mail, cargo, unidade acadêmica, empresa terceirizada)  
- Exibição de dados dinâmicos do usuário (via cartão de perfil, dropdowns, menus, etc)  
- Funcionalidades de CRUD (criação, leitura, edição, exclusão) para entidades como unidades acadêmicas  
- Tabelas com botões de ação por linha (ícone de três pontos → modal de edição/exclusão)  
- Layout moderno com animação lateral, centralização de elementos ao lado de imagem, conforme necessidade de UX  

## 📦 Tecnologias principais

- Next.js (TypeScript)  
- React  
- Tailwind CSS  
- Axios (para chamadas à API com token Bearer)  
- ESLint / Prettier (para padronização de código)  
- Outras dependências comuns (ver `package.json`)  

## 🚀 Como executar

### Pré-requisitos  
- Node.js (recomendado v16+ ou compatível com Next.js)  
- Yarn, npm ou pnpm (segundo sua preferência)  

### Passos  
```bash
# 1. Clone o repositório
git clone https://github.com/carolliie/agnelle-frontend.git
cd agnelle-frontend

# 2. Instale as dependências
npm install
# ou
yarn
# ou
pnpm install

# 3. Configure variáveis de ambiente
# Crie um arquivo `.env.local` (ou conforme convém) com:
# NEXT_PUBLIC_API_BASE_URL=<URL da API>
# NEXT_PUBLIC_AUTH_TOKEN=<token de autenticação inicial (se aplicável)>

# 4. Execute em modo de desenvolvimento
npm run dev
# ou
yarn dev
# ou
pnpm dev

# 5. Abra o navegador em http://localhost:3000 para ver o app
````

### Build para produção

```bash
npm run build
npm start
# ou o equivalente com yarn/pnpm
```

## 🗂 Estrutura do projeto

```
/agnelle-frontend
│
├─ public/               # arquivos públicos estáticos
├─ src/
│   ├─ components/        # componentes React reutilizáveis (UserMetaCard, Dropdowns, etc)
│   ├─ features/          # módulos de domínio (autenticação, unidades acadêmicas, etc)
│   ├─ pages/             # páginas do Next.js (login, dashboard, etc)
│   ├─ styles/            # arquivos de estilo Tailwind ou CSS extra
│   ├─ services/          # chamada à API via Axios, configuração de token, interceptors
│   └─ utils/             # utilitários comuns
├─ tailwind.config.ts     # configuração do Tailwind CSS
├─ next.config.ts         # configuração do Next.js
├─ tsconfig.json          # TypeScript
└─ package.json
```

## 🔐 Autenticação & Sessão

* Ao logar, o usuário recebe um token Bearer, que deve ser armazenado em um local seguro (contexto, Redux, React Query, ou localStorage conforme arquitetura).
* As requisições Axios são configuradas com esse token nos cabeçalhos (`Authorization: Bearer <token>`).
* O painel exibe informações do usuário logado (nome, e-mail, cargo, unidade acadêmica, empresa terceirizada).
* Componentes específicos, como cartões de perfil ou dropdowns, consomem esses dados para renderização dinâmica.

## 📋 Funcionalidades do painel

* Visualizar perfil e dados do usuário logado
* Navegação lateral com animações e centralização de elementos visuais (ex: imagem + seleção de procedimento)
* Tabela de unidades acadêmicas com colunas relevantes e, por linha, botão de “3 pontos” para ações (editar/excluir)
* Modais para edição (PUT) e exclusão (DELETE) de entidades
* Layout responsivo, limpo e acessível com Tailwind

## 📝 Boas práticas e convenções

* Componentes React funcionais (hooks) em TypeScript
* Organização modular por “feature” (facilita manutenção e escalabilidade)
* Uso de Tailwind CSS para estilização — classes utilitárias, estilo consistente
* Separação entre lógica de dados (services) e apresentação (components)
* Código lintado e formatado (ESLint/Prettier)
* Versionamento suave com commits claros e mensagens significativas

## 💭 Possíveis melhorias / próximos passos

* Adicionar cobertura de testes (unitário/integrado) com Jest + React Testing Library
* Implementar paginação, filtros avançados e ordenação nas tabelas
* Gerenciamento de estado global (ex: React Query, Redux Toolkit ou Zustand)
* Internacionalização (i18n) para suportar múltiplos idiomas
* Autorização mais refinada (roles/permissions) para diferentes tipos de usuários
* Pipeline de CI/CD para testes automáticos e deploy contínuo

## 👤 Autora

Esse repositório é mantido por **Ana Caroline Monteiro Vieira Pinto**.

## 📄 Licença

Este projeto está licenciado sob a **MIT License** — consulte o arquivo `LICENSE` para detalhes (caso exista) ou adicione conforme necessidade.
