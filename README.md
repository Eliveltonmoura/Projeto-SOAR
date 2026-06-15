# Sistema de Gerenciamento SOAR — Instituto Carrascal

Aplicação web desenvolvida para a disciplina de **Engenharia de Software (2026)** na **UFC Campus Quixadá**. O sistema substitui o uso de Google Forms e planilhas, informatizando a gestão pedagógica, o controle de vagas e o módulo de doações do projeto social.

---

## 👥 Integrantes e Atribuições Técnicas

Cada integrante é responsável direto pela implementação de, no mínimo, duas funcionalidades (*Histórias de Usuário*) de ponta a ponta:

- **Antonio Elivelton Moura da Silva ** — `velton@alu.ufc.br`
  - *HUs Principais:* `[HU-03]` Diário de Presença Mobile e `[HU-04]` Módulo de Doações e Registro de PIX.
- **Cíntia Gonçalves Dias** — `diascintia@alu.ufc.br`
  - *HUs Principais:* `[HU-01]` Matrícula Online com Trava LGPD e `[HU-02]` Fila de Espera Dinâmica.
- **Gleydson Rodrigues Lins** — `gleydsonlins@alu.ufc.br`
  - *HU Principal / UI-UX:* `[HU-05]` Emissão de Relatório de Impacto Social & Modelagem Arquitetural.

---

## 🎯 Escopo do Sistema (Projeto SOAR)

O projeto atende ~50 alunos em Quixadá com oficinas gratuitas de música (violão, percussão, acordeon e canto). O sistema core abrange:

- **Matrícula Online & Fila de Espera:** Controle de vagas por horário (16h às 19h) com ordenação automática por *timestamp* para excedentes.
- **Aprovação de Matrículas:** Toda matrícula recebida pelo formulário público entra como *pendente* até que um administrador a aceite ou rejeite. Ao aceitar, o sistema decide automaticamente entre matricular o aluno (status *ativo*) ou colocá-lo na fila de espera, conforme a disponibilidade de vagas no horário escolhido.
- **Frequência & Diário de Classe:** Lançamento rápido de presença/conteúdo pelos professores via mobile e bloqueio de retroativos.
- **Módulo Filantrópico:** Cadastro e auditoria de comprovantes de doações via PIX para sustentabilidade do instituto.
- **Conformidade LGPD:** Trava obrigatória para coleta de dados de menores de 18 anos mediante termo dos responsáveis. Alunos maiores de idade são seu próprio responsável.
- **Login e Controle de Acesso:** Autenticação via JWT com três perfis (`admin`, `professor` e `aluno`), cada um com permissões e telas próprias.
- **Portal do Aluno:** Ao ser aprovado, o aluno recebe automaticamente uma conta de acesso para acompanhar sua matrícula, instrumento, horário, posição na fila (se aplicável) e histórico de frequência.

---

## 🏗️ Arquitetura e Stack

O ecossistema adota o padrão de **API REST** desacoplada no Back-End e **Componentização Rígida** no Front-End.

**Stack:** `NestJS` · `React` · `TypeScript` · `PostgreSQL` · `TypeORM`

### Front-End (React + TypeScript)

| Pasta | Responsabilidade |
|---|---|
| `components/` | Widgets atômicos e reutilizáveis (inputs, botões, cards) — DRY |
| `screens/` | Telas completas do fluxo de navegação |
| `services/` | Chamadas assíncronas HTTP à API |
| `types/` | Interfaces TypeScript espelhando as entidades do back-end |

### Back-End (NestJS — Arquitetura em Camadas)

| Camada | Responsabilidade |
|---|---|
| `Controller` | Endpoints REST e validação de status HTTP |
| `DTO / Mapper` | Segurança e isolamento das entidades cruas na rede |
| `Service` | 100% das regras e lógicas de negócio |
| `Repository` | Abstração de persistência via TypeORM |

---

## 🔐 Autenticação e Perfis de Acesso

A autenticação é feita via **JWT** (`@nestjs/jwt` + `passport-jwt`), com senhas protegidas por `bcrypt`. Existem três perfis (`PapelUsuario`):

| Perfil | Acesso |
|---|---|
| `admin` / `professor` | Painel administrativo completo: alunos, matrículas pendentes, frequência, turmas, doações e relatórios. |
| `aluno` | Portal restrito (`/meu-painel`) com os próprios dados de matrícula e histórico de frequência. |

**Fluxo de criação de conta do aluno:** ao aprovar uma matrícula pendente, o sistema cria automaticamente uma conta com perfil `aluno`:
- **Login:** e-mail informado na matrícula.
- **Senha inicial:** CPF do responsável (somente números).

Um `RolesGuard` (`@Roles()`) garante que contas `aluno` não acessem rotas administrativas (ex: `GET /alunos`, `/turmas`, `/relatorios`), e que só vejam o próprio histórico em `/presenca/aluno`.

No primeiro start do backend, um usuário **admin** é criado automaticamente a partir das variáveis `ADMIN_NOME`, `ADMIN_EMAIL` e `ADMIN_PASSWORD` do `.env`.

---

## 📅 Planejamento da Release (3 Sprints)

Ciclo de desenvolvimento fixado entre **18/05/2026 e 28/06/2026**:

| Sprint | Período | Entregas |
|---|---|---|
| Sprint 1 | 18/05 – 31/05 | Infraestrutura base, banco relacional,  e  Matrícula Online |
| Sprint 2 | 01/06 – 14/06 |  Fila de Espera e Inplemetação do login, lista de presença e atualização do layout.|
| Sprint 3 | 15/06 – 28/06 |  Relatórios PDF e homologação com Flávio França |

---

## 🔗 Links e Artefatos

- 📐 **Figma (Protótipos):** [Acesse o Projeto de Interface](https://www.figma.com/design/A4lwRlMKkauaInJb1nYzm0/Sistema-SOAR?node-id=0-1&t=NaZwsV39OrZZs60A-1)
- 📊 **Trello / Jira (Board):** [Acesse o Quadro de Sprints](https://trello.com/b/EZvS9GiB/projeto-do-soar)
- 📑 **Documento 1 (Requisitos SRS):** [Download do PDF Técnico](https://docs.google.com/document/d/1F7cVL5bvnvLtRE6WHnex3Q87s-SxPla6edRK9vS85YE/edit?usp=drive_link)
- 🏗️ **Documento 2 (Arquitetura):** [Download do PDF de Engenharia](https://docs.google.com/document/d/1gXg4DbZqmC58q4UCmk_YPuqZxu_YaRgzCd0a1ZPD5LA/edit?usp=drive_link)

---

## 🛠️ Instalação e Execução Local

### Pré-requisitos

- [Node.js](https://nodejs.org/) v18+
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (para o PostgreSQL)

### 1. Clonar o repositório

```bash
git clone https://github.com/Eliveltonmoura/Projeto-SOAR.git
cd Projeto-SOAR
```

### 2. Subir o banco de dados

```bash
docker-compose up -d
```

> Isso sobe um PostgreSQL na porta `5432` com as credenciais já configuradas no `.env` do backend.

### 3. Rodar o Back-End

```bash
cd backend
npm install
npm run start:dev
```

API disponível em `http://localhost:3000`
Documentação Swagger em `http://localhost:3000/api/docs`

### 4. Rodar o Front-End

```bash
# Em outro terminal, a partir da raiz do projeto
cd frontend
npm install
npm run dev
```

Aplicação disponível em `http://localhost:5173`

- `/login` — Login (admin/professor/aluno)
- `/matricula` — Formulário público de matrícula
- `/doacoes` — Formulário público de doação via PIX
- `/meu-painel` — Portal do aluno (após login com perfil `aluno`)

---

## 📁 Estrutura do Projeto

```
Projeto-SOAR/
│
├── docker-compose.yml             # PostgreSQL local
│
├── backend/                        # API REST — NestJS + TypeORM
│   └── src/
│       ├── main.ts                 # Bootstrap, Swagger, ValidationPipe
│       ├── app.module.ts           # Módulo raiz
│       └── modules/
│           ├── auth/                # Login, JWT, RBAC (admin · professor · aluno)
│           ├── alunos/              # HU-01 · HU-02 · aprovação de matrículas
│           ├── matriculas/          # Suporte ao fluxo de matrícula
│           ├── presenca/            # HU-03 — Diário de presença
│           ├── turmas/              # Agrupamento por instrumento/horário
│           ├── doacoes/             # HU-04 — Doações via PIX
│           └── relatorios/          # HU-05 — Relatório de impacto social
│
└── frontend/                       # SPA — React + TypeScript
    └── src/
        ├── components/
        │   └── layout/              # AdminLayout · AlunoLayout · Layout (público)
        ├── context/                 # AuthContext — sessão e JWT
        ├── screens/
        │   ├── login/                # Tela de login
        │   ├── matricula/             # Matrícula online (pública)
        │   ├── aluno/                 # Portal do aluno → /meu-painel
        │   ├── alunos/                # Listar · Fila de espera · Pendentes
        │   ├── frequencia/            # Turmas e chamada de presença
        │   ├── turmas/                # Gestão de turmas
        │   ├── doacoes/               # Doação pública e auditoria
        │   ├── relatorios/            # Relatório de impacto social
        │   └── dashboard/             # Painel inicial (admin/professor)
        ├── services/                # Chamadas HTTP à API
        ├── types/                   # Interfaces espelhando o backend
        └── utils/                   # Helpers (ex: cálculo de idade)
```