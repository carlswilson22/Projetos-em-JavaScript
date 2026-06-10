# 📄 Software Requirements Specification (SRS) - Financial Control

## 1. Introdução
Este documento detalha as especificações técnicas de software para o **Financial Control**. Apresenta a infraestrutura arquitetural, os requisitos do sistema e os diagramas UML e lógicos que governam o comportamento e a estrutura da aplicação.

---

## 2. Requisitos do Sistema

### 2.1 Requisitos Funcionais (RF)
*   **RF-01 (Autenticação):** O sistema deve permitir que os usuários se registrem e façam login com e-mail e senha segura, gerando um token JWT.
*   **RF-02 (Gestão de Perfil):** O usuário autenticado deve poder editar seu nome, e-mail e avatar/foto de perfil de forma persistente.
*   **RF-03 (CRUD de Transações):** O sistema deve oferecer inserção, leitura, atualização e exclusão completa de transações financeiras (receitas e despesas).
*   **RF-04 (CRUD de Categorias):** O sistema deve gerenciar categorias de gastos personalizáveis de forma independente e integrada.
*   **RF-05 (Categorização Dinâmica):** Ao criar uma transação digitando um nome de categoria novo, o backend deve criar a categoria de forma autônoma e associar o respectivo ID na transação.
*   **RF-06 (Painel Financeiro / Dashboard):** A aplicação deve calcular e mostrar o saldo acumulado total, as receitas e despesas agregadas dinamicamente.
*   **RF-07 (Documentação Interativa):** A API deve dispor de uma interface interativa Swagger na rota `/api-docs` listando todas as assinaturas operacionais.

### 2.2 Requisitos Não Funcionais (RNF)
*   **RNF-01 (Segurança de Acesso):** As senhas dos usuários devem ser criptografadas no banco usando hash seguro do pacote `bcrypt`.
*   **RNF-02 (Persistência Leve):** A persistência física deve utilizar o mecanismo relacional embarcado SQLite, facilitando execução zero-config.
*   **RNF-03 (Desempenho da API):** O tempo de resposta para qualquer CRUD básico deve ser inferior a 200 milissegundos sob conexões de internet estáveis.
*   **RNF-04 (Portabilidade e Deploy):** A infraestrutura deve suportar empacotamento completo usando contêineres Docker (`docker-compose`).
*   **RNF-05 (Integridade de Dados):** O banco de dados deve forçar regras de integridade referencial, como remoção de dependências em cascata (`onDelete: Cascade`) em transações ao excluir categorias ou usuários.

---

## 3. Arquitetura do Sistema
O sistema adota uma arquitetura em duas camadas principais (**Client-Server**):

1.  **Frontend (Camada de Apresentação):** Uma aplicação Single Page Application (SPA) reativa construída com React, TypeScript e TailwindCSS. Utiliza context providers de estado global para controlar o fluxo de autenticação e comunicação com os recursos REST.
2.  **Backend (Camada de Serviço e Negócio):** Um servidor REST API com Node.js e Express, utilizando o padrão Controller-Route.
3.  **Persistência (Banco de Dados):** Banco relacional SQLite manipulado programaticamente via Prisma ORM, garantindo migrations estruturadas e tipagem estrita de consultas.

---

## 4. Diagramas de Engenharia de Software

### 4.1 Diagrama de Casos de Uso
Demonstra a interação do ator (Usuário) com as principais fronteiras operacionais da aplicação:

```mermaid
graph LR
    %% Ator
    User["👤 Usuário / Ator"]

    %% Fronteira do Sistema
    subgraph Fronteira ["Fronteira da Aplicação (Financial Control)"]
        UC01("(UC01) Cadastrar Novo Usuário")
        UC02("(UC02) Autenticar-se (Login JWT)")
        UC03("(UC03) Atualizar Perfil (Nome, E-mail, Foto)")
        UC04("(UC04) Gerenciar Categorias (CRUD)")
        UC05("(UC05) Gerenciar Transações (CRUD)")
        UC06("(UC06) Visualizar Dashboard")
        UC07("(UC07) Consultar Docs (Swagger)")
    end

    %% Associações
    User --> UC01
    User --> UC02
    User --> UC03
    User --> UC04
    User --> UC05
    User --> UC06
    User --> UC07
```

---

### 4.2 Diagrama de Classes (Domínio de Negócio)
Representa as classes lógicas presentes no domínio de negócio do backend e suas relações multiplicativas:

```mermaid
classDiagram
    direction LR
    class User {
        +String id (PK)
        +String name
        +String email
        +String password
        +String avatar
        +register() Promise
        +login() Promise
        +updateProfile() Promise
    }

    class Category {
        +String id (PK)
        +String name
        +String userId (FK)
        +create() Promise
        +update() Promise
        +delete() Promise
    }

    class Transaction {
        +String id (PK)
        +Float amount
        +String description
        +Date date
        +Int type
        +String categoryId (FK)
        +String userId (FK)
        +create() Promise
        +update() Promise
        +delete() Promise
    }

    User "1" --> "0..*" Category : "possui"
    User "1" --> "0..*" Transaction : "registra"
    Category "1" --> "0..*" Transaction : "classifica"
```

---

### 4.3 Diagrama Entidade-Relacionamento (DER Lógico)
Descreve a estrutura física das tabelas do banco de dados relacional gerado pelo Prisma:

```mermaid
erDiagram
    USER {
        String id PK "UUID"
        String email UK "Varchar(255)"
        String name "Varchar(255)"
        String password "Varchar(255)"
        String avatar "Varchar(255) NULL"
    }

    CATEGORY {
        String id PK "UUID"
        String name "Varchar(255)"
        String userId FK "UUID"
    }

    TRANSACTION {
        String id PK "UUID"
        Float amount "Float"
        String description "Varchar(255)"
        DateTime date "DateTime"
        Int type "Integer (0: Despesa, 1: Receita)"
        String categoryId FK "UUID"
        String userId FK "UUID"
    }

    USER ||--o{ CATEGORY : "cria"
    USER ||--o{ TRANSACTION : "realiza"
    CATEGORY ||--o{ TRANSACTION : "agrupa"
```

---

### 4.4 Diagrama de Sequência: Fluxo de Autenticação (Login)
Ilustra as mensagens e invocações de métodos necessárias para efetuar o login JWT no sistema:

```mermaid
sequenceDiagram
    autonumber
    actor User as Usuário
    participant Frontend as Frontend (React App)
    participant router as Express Router
    participant controller as AuthController
    participant prisma as Prisma Client
    participant db as Banco SQLite

    User->>Frontend: Digita E-mail/Senha e Clica em "Entrar"
    Frontend->>router: POST /api/auth/login (Payload JSON)
    router->>controller: login(req, res)
    controller->>prisma: prisma.user.findUnique({ email })
    prisma->>db: SELECT * FROM User WHERE email = ...
    db-->>prisma: Dados do Usuário Encontrado (Hash)
    prisma-->>controller: Retorna Instância do User
    controller->>controller: bcrypt.compare(password, hash)
    note over controller: Valida correspondência de credenciais
    controller->>controller: jwt.sign({ userId }, secret)
    note over controller: Gera Token JWT Expirável
    controller-->>router: Retorna { token, user: { name, email, avatar } }
    router-->>Frontend: HTTP 200 OK
    Frontend-->>User: Redireciona ao Dashboard e atualiza Header com Nome do Usuário
```
