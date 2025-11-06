# Agnelle Frontend

Catálogo de Produtos — Frontend da aplicação web desenvolvido com **React + Next.js + TypeScript**, responsável pela **interface pública** (catálogo de produtos) e pelo **painel administrativo** (gestão via autenticação JWT).
Este projeto consome a API REST do [Agnelle Backend](https://github.com/carolliie/agnelle-backend) e segue os artefatos definidos no documento de visão do sistema.

---

## Sumário

* [Visão geral](#visão-geral)
* [Funcionalidades (MVP)](#funcionalidades-mvp)
* [Tecnologias](#tecnologias)
* [Arquitetura e componentes principais](#arquitetura-e-componentes-principais)
* [Pré-requisitos](#pré-requisitos)
* [Instalação e execução local](#instalação-e-execução-local)
* [Variáveis de ambiente](#variáveis-de-ambiente)
* [Estrutura de pastas (sugerida)](#estrutura-de-pastas-sugerida)
* [Rotas principais](#rotas-principais)
* [Protótipo de telas](#protótipo-de-telas)
* [Integração com o backend](#integração-com-o-backend)
* [Roadmap e entregas iniciais](#roadmap-e-entregas-iniciais)
* [Boas práticas e checklist técnico](#boas-práticas-e-checklist-técnico)
* [Riscos e mitigações](#riscos-e-mitigações)
* [Licença](#licença)

---

## Visão geral

Aplicação web voltada para **divulgação e gestão de produtos**, permitindo:

* Exposição pública de produtos e categorias com busca e filtros;
* Página de detalhes com redirecionamento dinâmico (ex.: WhatsApp);
* Painel administrativo protegido (login, CRUD de produtos e categorias);
* Upload de imagens e gerenciamento de status (ativo/inativo).

---

## Funcionalidades (MVP)

* **Frontend público:**

  * Home / Listagem de produtos com filtros (categoria, preço, tags)
  * Página de produto com galeria e botão de contato (WhatsApp ou link externo)
* **Painel Administrativo:**

  * Login via JWT
  * Listagem e edição de produtos (Admin/Editor)
  * Upload assíncrono de imagens
  * Gerenciamento de categorias e tags
* **Autenticação e roles:**

  * Admin (gerencia tudo)
  * Editor (CRUD de produtos e categorias)

---

## Tecnologias

* **Next.js 14+** (React Framework)
* **TypeScript**
* **Axios** (integração com API backend)
* **TailwindCSS** (estilização)
* **NextAuth / JWT Context** (autenticação)
* **Framer Motion** (animações)
* **ShadCN UI / Radix UI** (componentes reutilizáveis)
* **Vercel** (deploy sugerido)

---

## Arquitetura e componentes principais

```
Frontend (Next.js)
├── Public Catalog Pages
│   ├── Home (Listagem com filtros e busca)
│   ├── Produto ([slug]) → Página de detalhes
│
├── Admin Panel
│   ├── Login
│   ├── Dashboard
│   ├── Produtos (lista, edição, novo)
│   ├── Categorias (CRUD)
│
└── Shared Components
    ├── Header / Footer
    ├── ProductCard / ProductGrid
    ├── Modal / Toast / Loading
    ├── AuthProvider / ProtectedRoute
```

---

## Pré-requisitos

* Node.js 18+
* npm ou yarn
* Backend configurado e rodando ([Agnelle Backend](https://github.com/carolliie/agnelle-backend))

---

## Instalação e execução local

1. Clone o repositório:

```bash
git clone https://github.com/carolliie/agnelle-frontend.git
cd agnelle-frontend
```

2. Instale as dependências:

```bash
npm install
# ou
yarn install
```

3. Configure o arquivo `.env.local` conforme abaixo.

4. Execute o projeto:

```bash
npm run dev
```

5. Acesse: [http://localhost:3000](http://localhost:3000)

---

## Variáveis de ambiente

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
NEXT_PUBLIC_STORAGE_URL=https://agnelle-uploads.s3.amazonaws.com
NEXT_PUBLIC_APP_NAME=Agnelle

# JWT
NEXT_PUBLIC_JWT_SECRET=chave_super_secreta
NEXT_PUBLIC_JWT_EXPIRE=3600
```

---

## Estrutura de pastas sugerida

```
src/
 ├── app/
 │   ├── page.tsx
 │   ├── produto/[slug]/page.tsx
 │   ├── admin/
 │   │   ├── page.tsx
 │   │   ├── produtos/
 │   │   │   ├── page.tsx
 │   │   │   ├── novo/page.tsx
 │   │   │   ├── [id]/editar/page.tsx
 │   │   └── categorias/
 │   │       ├── page.tsx
 │   │       ├── novo/page.tsx
 │   │       ├── [id]/editar/page.tsx
 │
 ├── components/
 │   ├── ProductCard.tsx
 │   ├── ProductForm.tsx
 │   ├── CategorySelect.tsx
 │   ├── Header.tsx
 │   ├── Footer.tsx
 │
 ├── lib/
 │   ├── api.ts
 │   ├── auth.ts
 │   ├── storage.ts
 │
 ├── context/
 │   ├── AuthContext.tsx
 │
 └── styles/
     ├── globals.css
```

---

## Rotas principais

| Rota                          | Descrição                                         |
| ----------------------------- | ------------------------------------------------- |
| `/`                           | Página inicial — listagem de produtos com filtros |
| `/produto/[slug]`             | Página de detalhes do produto                     |
| `/admin`                      | Dashboard administrativo                          |
| `/admin/login`                | Tela de login                                     |
| `/admin/produtos`             | Lista de produtos                                 |
| `/admin/produtos/novo`        | Criar novo produto                                |
| `/admin/produtos/[id]/editar` | Editar produto existente                          |

---

## Protótipo de telas

### Público

* **Home:** Grid de produtos com busca e filtros laterais.
* **Produto:** Galeria de imagens, nome, descrição curta, preço e botão “Entrar em contato”.

### Painel Administrativo

* **Login:** Autenticação JWT.
* **Dashboard:** Resumo de métricas.
* **Editor de Produto:** Formulário dividido em abas (Geral, Imagens, Categorias & Tags, SEO & Redirect).
* **Upload:** Preview instantâneo de imagens.

---

## Integração com o backend

* API base: `https://api.agnelle.com/api` (ou localhost em dev)
* Autenticação via **Bearer Token (JWT)**
* Endpoints principais:

  * `GET /api/products`
  * `GET /api/products/:slug`
  * `POST /api/auth/login`
  * `POST /api/products`
  * `POST /api/uploads`

---

## Boas práticas e checklist técnico

* Usar **TypeScript** e **componentes acessíveis (a11y)**
* Reutilização de UI com **ShadCN / Tailwind**
* Testes unitários em componentes principais
* Autenticação protegida via **JWT Context / Middleware Next.js**
* Evitar `any` e manter tipagem completa
* Não commitar `.env.local`
* Implementar ESLint e Prettier

---

**Referência:**
Documento *Catálogo de Produtos — Artefatos Iniciais* elaborado por Ana Caroline Monteiro Vieira Pinto (UFOPA, 2025).
