# Sistema de Gerenciamento SOAR — Instituto Carrascal

Aplicação web desenvolvida para a disciplina de **Engenharia de Software (2026)** na **UFC Campus Quixadá**. O sistema substitui o uso de Google Forms e planilhas, informatizando a gestão pedagógica, o controle de vagas e o módulo de doações do projeto social.

---

## 👥 Integrantes e Atribuições Técnicas

Cada integrante é responsável direto pela implementação de, no mínimo, duas funcionalidades (*Histórias de Usuário*) de ponta a ponta:

* **Antonio Elivelton Moura da Silva (Dalton)** — `velton@alu.ufc.br`
  * *HUs Principais:* `[HU-03]` Diário de Presença Mobile e `[HU-04]` Módulo de Doações e Registro de PIX.
* **Cíntia Gonçalves Dias** — `diascintia@alu.ufc.br`
  * *HUs Principais:* `[HU-01]` Matrícula Online com Trava LGPD e `[HU-02]` Fila de Espera Dinâmica.
* **Gleydson Rodrigues Lins** — `gleydsonlins@alu.ufc.br`
  * *HU Principal / UI-UX:* `[HU-05]` Emissão de Relatório de Impacto Social & Modelagem Arquitetural.

---

## 🎯 Escopo do Sistema (Projeto SOAR)

O projeto atende ~50 alunos em Quixadá com oficinas gratuitas de música (violão, percussão, acordeon e canto). O sistema core abrange:
* **Matrícula Online & Fila de Espera:** Controle de vagas por horário (16h às 19h) com ordenação automática por *timestamp* para excedentes.
* **Frequência & Diário de Classe:** Lançamento rápido de presença/conteúdo pelos professores via mobile e bloqueio de retroativos.
* **Módulo Filantrópico:** Cadastro e auditoria de comprovantes de doações via PIX para sustentabilidade do instituto.
* **Conformidade LGPD:** Trava obrigatória para coleta de dados de menores (a partir de 6 anos) mediante termo dos responsáveis.

---

## 🏗️ Arquitetura e Divisão de Camadas

O ecossistema adota o padrão de **API REST** desacoplada no Back-End e **Componentização Rígida** no Front-End:

* **Front-End (Web Responsivo):**
  * `components/`: Widgets atômicos e reutilizáveis (inputs com máscaras, botões, cards) para evitar código duplicado (DRY).
  * `screens/`: Telas completas do fluxo de navegação.
  * `services/`: Chamadas assíncronas HTTP da API.
* **Back-End (Arquitetura em Camadas):**
  * `Controller`: Endpoints REST e validação de status HTTP.
  * `DTO / Mapper`: Segurança e isolamento das entidades cruas na rede.
  * `Service`: Concentração exclusiva de 100% das regras e lógicas de negócio.
  * `Repository`: Abstração de persistência via ORM.

---

## 📅 Planejamento da Release (3 Sprints)

Ciclo de desenvolvimento fixado entre **18/05/2026 e 28/06/2026**:

* **Sprint 1 (18/05 a 31/05):** Infraestrutura base, banco relacional, segurança de senhas via Bcrypt e Matrícula Online `[HU-01]`.
* **Sprint 2 (01/06 a 14/06):** Algoritmo da Fila de Espera `[HU-02]` e Diário de Presença Mobile `[HU-03]`.
* **Sprint 3 (15/06 a 28/06):** Upload de PIX `[HU-04]`, Relatórios PDF `[HU-05]` e homologação com o cliente Flávio França.

---

## 🔗 Links e Artefatos

* 📐 **Figma (Protótipos):** [Acesse o Projeto de Interface](https://figma.com/seu-link-aqui)
* 📊 **Trello / Jira (Board):** [Acesse o Quadro de Sprints](https://trello.com/seu-link-aqui)
* 📑 **Documento 1 (Requisitos SRS):** [Download do PDF Técnico](Documento_1_Especificacao_Requisitos_SRS.pdf)
* 🏗️ **Documento 2 (Arquitetura):** [Download do PDF de Engenharia](Documento_2_Arquitetura_e_Planejamento_Sprints.pdf)

---

## 🛠️ Instalação e Execução Local

```bash
# 1. Clonar o repositório
git clone [https://github.com/seu-usuario/projeto-soar.git](https://github.com/seu-usuario/projeto-soar.git)
cd projeto-soar

# 2. Instalar dependências
npm install

# 3. Rodar o ambiente de desenvolvimento
npm run dev