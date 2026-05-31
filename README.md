# Sistema de Gerenciamento SOAR — Instituto Carrascal

Aplicação web desenvolvida para a disciplina de **Engenharia de Software (2026)** na **UFC Campus Quixadá**. O sistema substitui o uso de Google Forms e planilhas, informatizando a gestão pedagógica, o controle de vagas e o módulo de doações do projeto social.

---

## 👥 Integrantes e Atribuições Técnicas

Cada integrante é responsável direto pela implementação de, no mínimo, duas funcionalidades (*Histórias de Usuário*) de ponta a ponta:

- **Antonio Elivelton Moura da Silva (Dalton)** — `velton@alu.ufc.br`
  - *HUs Principais:* `[HU-03]` Diário de Presença Mobile e `[HU-04]` Módulo de Doações e Registro de PIX.
- **Cíntia Gonçalves Dias** — `diascintia@alu.ufc.br`
  - *HUs Principais:* `[HU-01]` Matrícula Online com Trava LGPD e `[HU-02]` Fila de Espera Dinâmica.
- **Gleydson Rodrigues Lins** — `gleydsonlins@alu.ufc.br`
  - *HU Principal / UI-UX:* `[HU-05]` Emissão de Relatório de Impacto Social & Modelagem Arquitetural.

---

## 🎯 Escopo do Sistema (Projeto SOAR)

O projeto atende ~50 alunos em Quixadá com oficinas gratuitas de música (violão, percussão, acordeon e canto). O sistema core abrange:

- **Matrícula Online & Fila de Espera:** Controle de vagas por horário (16h às 19h) com ordenação automática por *timestamp* para excedentes.
- **Frequência & Diário de Classe:** Lançamento rápido de presença/conteúdo pelos professores via mobile e bloqueio de retroativos.
- **Módulo Filantrópico:** Cadastro e auditoria de comprovantes de doações via PIX para sustentabilidade do instituto.
- **Conformidade LGPD:** Trava obrigatória para coleta de dados de menores (a partir de 6 anos) mediante termo dos responsáveis.

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

## 📅 Planejamento da Release (3 Sprints)

Ciclo de desenvolvimento fixado entre **18/05/2026 e 28/06/2026**:

| Sprint | Período | Entregas |
|---|---|---|
| Sprint 1 | 18/05 – 31/05 | Infraestrutura base, banco relacional, Bcrypt e `[HU-01]` Matrícula Online |
| Sprint 2 | 01/06 – 14/06 | `[HU-02]` Fila de Espera e `[HU-03]` Diário de Presença Mobile |
| Sprint 3 | 15/06 – 28/06 | `[HU-04]` Upload PIX, `[HU-05]` Relatórios PDF e homologação com Flávio França |

---

## 🔗 Links e Artefatos

- 📐 **Figma (Protótipos):** [Acesse o Projeto de Interface](https://figma.com/seu-link-aqui)
- 📊 **Trello / Jira (Board):** [Acesse o Quadro de Sprints](https://trello.com/seu-link-aqui)
- 📑 **Documento 1 (Requisitos SRS):** [Download do PDF Técnico](https://github.com/Eliveltonmoura/Projeto-SOAR/blob/main/Documento_1_Especificacao_Requisitos_SRS.pdf)
- 🏗️ **Documento 2 (Arquitetura):** [Download do PDF de Engenharia](https://github.com/Eliveltonmoura/Projeto-SOAR/blob/main/Documento_2_Arquitetura_e_Planejamento_Sprints.pdf)

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

---

## 📁 Estrutura do Projeto

```
Projeto-SOAR/
├── backend/                  # API REST — NestJS + TypeORM
│   └── src/
│       └── modules/
│           ├── alunos/       # HU-01 e HU-02
│           ├── presenca/     # HU-03
│           ├── doacoes/      # HU-04
│           └── relatorios/   # HU-05
├── frontend/                 # SPA — React + TypeScript
│   └── src/
│       ├── screens/
│       ├── services/
│       ├── components/
│       └── types/
└── docker-compose.yml        # PostgreSQL local
```