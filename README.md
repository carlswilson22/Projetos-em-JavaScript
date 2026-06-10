# 💰 Financial Control App

O **Financial Control** é um sistema completo (Full-Stack) voltado para a gestão de finanças pessoais. Ele permite que o usuário gerencie receitas, despesas, categorize lançamentos dinamicamente e acompanhe gráficos de evolução de forma limpa e intuitiva. 

Este projeto foi totalmente reestruturado e corrigido para seguir os mais rigorosos padrões da engenharia de software acadêmica e profissional, incluindo **CRUD completo**, **autenticação JWT real**, **integridade referencial com remoção em cascata (onDelete: Cascade)**, **documentação de engenharia completa (BRD e SRS com diagramas)**, **testes automatizados e integrados** e **documentação interativa Swagger**.

---

## ✨ Novidades e Melhorias Implementadas (Fintech de Elite)

A aplicação evoluiu de um gerenciador financeiro simples para uma **plataforma inteligente de bem-estar financeiro**, incorporando diferenciais robustos de mercado inspirados nas fintechs mais modernas do mundo:

### 🌟 Diferenciais Inovadores e Premium

1.  **Assistente de Insights Inteligentes (IA Local) 🔮:** Uma central integrada que analisa localmente despesas e receitas, alertando instantaneamente sobre riscos de déficit orçamentário, calculando taxas de poupança ideais e detectando o principal gargalo de consumo nas despesas por categoria.
2.  **Simulador FIRE (Independência Financeira) 🌅:** Calculadora interativa inspirada no movimento *Financial Independence, Retire Early* baseada na **Regra dos 4%** (patrimônio FIRE = custo de vida anual × 25). Um algoritmo calcula em tempo real o patrimônio necessário e projeta o tempo restante (anos e meses) para viver de renda a partir dos aportes mensais e juros compostos.
3.  **Metas de Economia com Depósitos Rápidos Inline 🎯:** Criação dinâmica de metas financeiras com acompanhamento visual em barras de progresso gradientes animadas, permitindo realizar **aportes inline rápidos clicando no botão "+ de depósito"** direto no Dashboard.
4.  **Evolução Matemática Real do Saldo 📈:** O gráfico de saldo foi inteiramente redesenhado. Agora ele ordena transações cronologicamente e plota a curva cumulativa real do saldo (evitando flutuações diárias isoladas incorretas), exibindo um painel com o **Saldo Atual, Pico Histórico e Menor Saldo** da conta em uma linha neon degradê ultra responsiva.
5.  **Gráfico Donut de Despesas por Categoria 🍩:** Gráfico de rosca elegante (Recharts) que agrupa automaticamente todas as saídas por categoria, exibindo o percentual exato consumido de cada uma e o total consolidado de gastos no centro do donut.
6.  **Painel de Configurações Geral e Funcional ⚙️:** A engrenagem da barra lateral agora abre uma central de preferências completa:
    - **Modo Escuro (Dark Mode):** Alternador de tema em um clique que persiste a escolha do usuário no `localStorage`.
    - **Teto de Alerta de Gastos:** Define um limite em R$ para destacar transações consideradas de luxo ou de alto valor.
    - **Backup & Portabilidade:** Exportação de todo o extrato financeiro em planilhas **CSV (Excel)** e arquivos estruturados **JSON**.
    - **Reset Seguro (Zona de Perigo):** Permite zerar a conta de forma segura exigindo que o usuário digite "REDEFINIR" para evitar perdas acidentais.
7.  **Autocompletar Inteligente de Categorias 🧠:** O modal de nova transação autocompleta automaticamente o campo usando as categorias reais cadastradas pelo usuário no banco via API (`api.get('/categories')`), prevenindo erros de digitação e facilitando o uso no dia a dia.
8.  **CRUD Completo & Cascata (onDelete: Cascade):** Banco de dados SQLite configurado no padrão profissional de integridade relacional via Prisma ORM: deletar um usuário ou meta remove de forma limpa tudo no banco em efeito cascata.
9.  **API REST Swagger & OpenAPI 3.0:** Documentação completa e interativa de todas as rotas e regras do backend em `/api-docs`.
10. **Testes de Integração Jest (14/14 PASS):** Cobertura total de testes cobrindo autenticação, perfil, transações, categorias dinâmicas e CRUD/cascata completo de metas.
11. **Carteiras Multi-Moedas e Câmbio Rápido (BRL, USD, BIT) 💱:** Seções e abas isoladas por moeda no Dashboard (`BRL`, `USD`, `BIT`) com gráficos e listas dinâmicas, integradas com a AwesomeAPI em tempo real para obter cotações, conversor de câmbio rápido automatizado com transações de contrapartida automáticas e cálculo de Patrimônio Consolidado em BRL no topo.

---

## 🛠️ Tecnologias Utilizadas

### **Frontend**
- **React (SPA) + Vite:** Interface SPA ultra-veloz, modular e reativa.
- **TypeScript:** Tipagem estrita ponta a ponta e máxima segurança contra erros em runtime.
- **Tailwind CSS:** Design de alta fidelidade visual com micro-transições, glassmorphism e cores HSL harmônicas.
- **Recharts:** Gráficos interativos elegantes (área e donut) para visualização premium de dados.
- **Axios:** Cliente HTTP com interceptor para autenticação JWT transparente e automática.
- **Lucide React & Date-fns:** Ícones modernos e formatação precisa de datas em português do Brasil.

### **Backend**
- **Node.js & Express:** Arquitetura REST robusta, assíncrona e desacoplada.
- **Prisma ORM & SQLite:** ORM moderno tipado e banco de dados relacional embarcado de alta eficiência.
- **Bcrypt.js & JWT (JSON Web Tokens):** Criptografia de senhas (salt rounds 10) e controle de sessões seguro.
- **Swagger UI Express & swagger-jsdoc:** Swagger autogerado pelas anotações JSDoc das rotas.
- **Jest & Supertest:** Testes integrados determinísticos que rodam mockados sob banco temporário.


---

## 📂 Estrutura do Projeto

```plaintext
Proj_Final_Des.Sistemas/
 ├── docs/                   # Documentação Acadêmica de Engenharia
 │    ├── BRD.md             # Business Requirements Document (Escopo e Negócio)
 │    └── SRS.md             # Software Requirements Specification (Diagramas & RFs)
 ├── backend/                # Servidor Node.js / Express
 │    ├── prisma/            # Schema do banco de dados e migrations do Prisma
 │    ├── src/
 │    │    ├── config/       # Conexões com banco e configurações (Swagger, DB)
 │    │    ├── controllers/  # Controladores de negócio (Auth, Categories, Transactions)
 │    │    ├── middlewares/  # Proteção de rotas (Auth JWT) e Tratamento de Erros
 │    │    ├── routes/       # Definição dos endpoints documentados com JSDoc
 │    │    └── server.js     # Inicialização e middlewares globais
 │    ├── tests/             # Suíte de testes automatizados (Jest/Supertest)
 │    ├── Dockerfile         # Configuração de imagem Docker
 │    └── docker-compose.yml # Orquestração do container de desenvolvimento
 └── frontend/               # Cliente React + TypeScript
      ├── src/
           ├── components/   # Botões, Modais, Gráficos (Dashboard)
           ├── context/      # Provedores Globais de Contexto (AuthContext, TransactionContext)
           ├── services/     # API Axios com injeção automática de JWT
           └── types/        # Definições estritas de interfaces TypeScript
```

---

## 🚀 Como Executar o Projeto Localmente

### **Pré-requisitos**
Antes de começar, certifique-se de ter instalado:
*   [Git](https://git-scm.com/)
*   [Node.js](https://nodejs.org/) (v18 ou superior)
*   [Docker](https://www.docker.com/) (opcional, para rodar via container)

---

### **1. Configurando e Rodando o Backend (API)**

**Opção A: Rodar Localmente com Node.js (Recomendado para Testes rápidos)**
1. Navegue até a pasta do backend:
   ```bash
   cd backend
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Crie e configure o arquivo `.env` na raiz do backend baseado no `.env.example` ou conforme abaixo:
   ```env
   DATABASE_URL="file:./dev.db"
   JWT_SECRET="sua_chave_secreta_super_segura"
   PORT=5000
   ```
4. Execute as migrations do Prisma para estruturar o banco SQLite local:
   ```bash
   npx prisma migrate dev --name init
   ```
5. Inicie o servidor em modo de desenvolvimento (Reload automático via nodemon):
   ```bash
   npm run dev
   ```
   *A API estará ativa em: `http://localhost:5000/api`*

---

**Opção B: Rodar com Docker & Docker Compose**
1. Na pasta `backend`, certifique-se de que o `.env` está configurado corretamente.
2. Suba o container da aplicação:
   ```bash
   docker-compose up -d --build
   ```
   *O backend subirá em container rodando na porta 5000.*

---

### **2. Acessando a Documentação Swagger**
Com o backend em execução (Opção A ou B), acesse no seu navegador:
👉 **[http://localhost:5000/api-docs](http://localhost:5000/api-docs)**

*Nela, você pode testar todos os endpoints de Autenticação, Perfil, Categorias e Transações de forma 100% interativa.*

---

### **3. Rodando os Testes Automatizados**
A suíte de testes de integração roda de forma independente sem interferir na API ativa:
1. Acesse a pasta `backend`.
2. Execute o comando de teste:
   ```bash
   npm test
   ```
   *Isso executará 10 casos de testes de integração robustos (Registro, Login, Perfil, Categorização Dinâmica, Transações e CRUD Completo com Cascata de Metas Financeiras) imprimindo os resultados e garantindo a integridade total do sistema.*

---

### **4. Configurando e Rodando o Frontend (React Client)**

1. Abra uma nova janela do terminal e navegue até a pasta do frontend:
   ```bash
   cd frontend
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Crie um arquivo `.env` na raiz do frontend com o endpoint da API:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
4. Inicie o servidor do Vite:
   ```bash
   npm run dev
   ```
5. Acesse o endereço indicado no seu terminal (geralmente **`http://localhost:5173`**).

---

## 📈 Documentação de Engenharia e Negócios (BRD & SRS)

Para aprofundar na engenharia de requisitos do Financial Control, consulte os documentos detalhados criados na pasta `/docs`:
*   **[docs/BRD.md](file:///d:/Programação/ProjFinalQuarta/Proj_Final_Des.Sistemas/docs/BRD.md):** Apresenta o escopo de negócios, dores do usuário, personas, objetivos comerciais e indicadores de sucesso (KPIs).
*   **[docs/SRS.md](file:///d:/Programação/ProjFinalQuarta/Proj_Final_Des.Sistemas/docs/SRS.md):** Apresenta a infraestrutura arquitetural técnica, requisitos funcionais/não funcionais e os **4 diagramas lógicos em Mermaid** (Caso de Uso, Diagrama de Classes, DER Físico/Lógico e Diagrama de Sequência do Login).

---

## 📝 Licença
Este projeto é livre e está sob a licença MIT.

Desenvolvido para fins acadêmicos com ☕, 💻.
