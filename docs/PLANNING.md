# 📅 Planejamento de Atividades e Cronograma de Execução

Este documento apresenta o planejamento das atividades, cronograma e divisão de tarefas adotados para o desenvolvimento do **Financial Control**, seguindo os preceitos das metodologias ágeis (Scrum) e garantindo conformidade com os requisitos de governança do projeto.

---

## 1. Estrutura e Divisão da Equipe (Papéis e Atribuições)

Para garantir a divisão clara de responsabilidades, o projeto foi segmentado em papéis lógicos, simulando um time de engenharia ágil composto por:

*   **Product Owner (PO) / Analista de Negócios:** Responsável pelo levantamento do escopo, regras de negócio (BRD), aprovação dos requisitos e refinamento das histórias de usuário.
*   **Scrum Master / Arquiteto de Software:** Responsável por garantir o fluxo de atividades (Sprints), organizar a documentação de engenharia (SRS), arquitetura do sistema e provisionamento do ambiente de desenvolvimento (Docker).
*   **Desenvolvedor Backend:** Responsável pelo desenvolvimento da REST API Express, integração do Prisma ORM, banco SQLite, testes automatizados e anotações do Swagger.
*   **Desenvolvedor Frontend:** Responsável por criar a SPA baseada em React/TypeScript, consumo das rotas, dashboards reativos (Recharts), controle de estados globais (Contexts) e recursos estéticos avançados (Câmbio Rápido, Dark Mode, FIRE).

---

## 2. EAP (Estrutura Analítica do Projeto) / WBS (Work Breakdown Structure)

As atividades de engenharia do projeto foram organizadas na seguinte árvore hierárquica:

```plaintext
Financial Control
 ├── 1. Iniciação e Requisitos (Sprint 0)
 │    ├── 1.1 Mapeamento e dores de negócio (BRD)
 │    ├── 1.2 Modelagem de Requisitos Funcionais e Não Funcionais (SRS)
 │    └── 1.3 Design de diagramas Uml (Casos de Uso, Classes, Sequência, DER)
 ├── 2. Infraestrutura e API Backend (Sprint 1)
 │    ├── 2.1 Modelagem lógica do banco com Prisma ORM
 │    ├── 2.2 Rotas de Autenticação JWT e cadastro criptografado com bcrypt
 │    ├── 2.3 Roteamento e Controllers de Transações, Categorias e Metas
 │    ├── 2.4 Middleware global de validação e tratamento de erros
 │    ├── 2.5 Criação e execução dos testes integrados com Jest/Supertest
 │    └── 2.6 Documentação de rotas com Swagger / OpenAPI 3.0
 ├── 3. Interface Visual e Conectividade (Sprint 2)
 │    ├── 3.1 Criação do cliente SPA React com TypeScript e Tailwind CSS
 │    ├── 3.2 Implementação do Login, Cadastro de Conta e fluxos de autenticação
 │    ├── 3.3 Consumo da API das transações com injeção automática de token JWT
 │    └── 3.4 Listagem de transações com autocompletar dinâmico de categorias
 ├── 4. Funcionalidades Avançadas e Polimento (Sprint 3)
 │    ├── 4.1 Painel analítico de gráficos de saldo e categorias com Recharts
 │    ├── 4.2 Simulador FIRE (Liberdade Financeira) com juros compostos
 │    ├── 4.3 Metas de Economia com aportes dinâmicos no Dashboard
 │    ├── 4.4 Câmbio rápido de moedas isoladas e Patrimônio Consolidado
 │    └── 4.5 Persistência e aplicação imediata do Tema Escuro (Dark Mode)
 └── 5. Homologação, Docker e Entrega (Sprint 4)
      ├── 5.1 Dockerização da API Backend e persistência de volumes SQLite
      ├── 5.2 Testes e validações de tipos do compilador TypeScript
      └── 5.3 Elaboração do Guia de Uso (README) e consolidação da entrega
```

---

## 3. Cronograma de Execução (Sprints)

O projeto foi planejado em 5 Sprints sequenciais de duração igualitária, com o cronograma detalhado de entregas conforme a tabela a seguir:

| Sprint | Atividades Realizadas | Entregáveis Principais | Evidências e Status |
| :--- | :--- | :--- | :--- |
| **Sprint 0** | Levantamento de escopo, regras de negócio e modelagem lógicos do banco. | BRD e SRS com diagramas UML e DER criados em `/docs`. | **Concluído** (100%) |
| **Sprint 1** | Desenvolvimento da REST API Backend, testes automatizados e Swagger. | Servidor Express, banco SQLite provisionado e Swagger ativo em `/api-docs`. | **Concluído** (100%) |
| **Sprint 2** | Desenvolvimento da interface React base, Login e consumo das rotas do CRUD. | SPA conectada, tela de autenticação funcional e gerenciamento de transações. | **Concluído** (100%) |
| **Sprint 3** | Implementação de gráficos, Simulador FIRE, Câmbio Rápido, Backup e Dark Mode. | Interface analítica completa com widgets dinâmicos de metas e conversão. | **Concluído** (100%) |
| **Sprint 4** | Dockerização do backend, compilação de produção e documentação de uso (README). | Dockerfile, docker-compose ativo, build do frontend otimizado (pasta `dist/`). | **Concluído** (100%) |

---

## 4. Evidências de Acompanhamento (Quadro de Tarefas)

A execução das atividades seguiu o fluxo de controle de tarefas do projeto:

*   **Pendente:** Nenhuma tarefa pendente.
*   **Em Andamento:** Fase de homologação final.
*   **Concluído:** 100% das histórias de usuário de negócio e requisitos técnicos implementados, testados de forma automatizada e empacotados.
