# 📊 Roteiro de Apresentação — Projeto Final (Financial Control)

Este documento contém a estrutura sugerida para a criação dos seus slides de apresentação do Projeto Final. Ele foi dividido de forma lógica para cobrir a parte de negócios, a modelagem de engenharia de software e os diferenciais técnicos implementados.

---

# Slide 1: Capa (Título do Projeto)
*   **Título:** 💰 Financial Control — Gestão Financeira Pessoal Inteligente e Segura
*   **Tópicos:**
    *   Trabalho Final de Desenvolvimento de Sistemas
    *   Autores: [Seu Nome / Equipe]
    *   Orientador: [Nome do Professor/Orientador]
*   **Notas e Sugestões Visuais:** 
    *   Use uma imagem limpa que remeta a finanças e tecnologia (ex: gráficos ascendentes combinados com elementos móveis).
    *   Esquema de cores sugerido: Azul Royal, Roxo e Branco (refletindo a paleta de cores premium do sistema).

---

# Slide 2: Contextualização e O Problema
*   **Título:** 📉 O Desafio do Controle Financeiro Pessoal
*   **Tópicos:**
    *   **Cenário Real:** Mais de 70% das famílias brasileiras possuem algum nível de endividamento (dados nacionais).
    *   **Gargalo:** Falta de clareza sobre para onde o dinheiro está indo no dia a dia.
    *   **Barreira Técnica:** Planilhas tradicionais (Excel) são complexas, assustadoras e pouco amigáveis para usuários comuns.
    *   **Privacidade:** Receio em expor dados bancários reais em aplicativos com integrações automáticas.
*   **Notas e Sugestões Visuais:** 
    *   Adicione um gráfico ou ícone de endividamento/alerta.
    *   Destaque a palavra **"Privacidade"** e **"Complexidade das Planilhas"** como as principais dores resolvidas.

---

# Slide 3: A Proposta de Solução
*   **Título:** ✨ A Solução: Financial Control App
*   **Tópicos:**
    *   Plataforma web intuitiva de cadastro financeiro manual seguro.
    *   Acessível e responsiva (funciona perfeitamente em dispositivos móveis e desktop).
    *   Organização automática de receitas e despesas por categorias.
    *   Garantia de privacidade: sem integrações com contas bancárias reais.
    *   Painéis visuais rápidos com micro-transações fluidas.
*   **Notas e Sugestões Visuais:** 
    *   Coloque um print de alta qualidade da tela inicial (Dashboard) mostrando os cards degradê de saldo.

---

# Slide 4: Arquitetura e Tecnologia
*   **Título:** ⚙️ Arquitetura de Software e Stack Tecnológica
*   **Tópicos:**
    *   **Padrão:** Camada Cliente-Servidor (desacoplada).
    *   **Frontend (Apresentação):** React (SPA), Vite, TypeScript, TailwindCSS e Recharts.
    *   **Backend (Serviços):** Node.js com Express e REST API.
    *   **Persistência (Banco de Dados):** SQLite relacional e Prisma ORM para mapeamento físico.
*   **Notas e Sugestões Visuais:** 
    *   Desenhe um fluxograma simples contendo três blocos interligados: `React Client (Vite)` ➔ `Express API (Node)` ➔ `Prisma ORM` ➔ `SQLite Database`.

---

# Slide 5: Engenharia de Requisitos (SRS)
*   **Título:** 📋 Requisitos Funcionais e Não Funcionais
*   **Tópicos:**
    *   **Requisitos Funcionais Principais:**
        *   RF-01: Autenticação via Login e Cadastro de Usuários (JWT).
        *   RF-03/04: CRUD completo de Transações, Metas e Categorias.
        *   RF-05: Auto-categorização inteligente (criação dinâmica de categorias).
    *   **Requisitos Não Funcionais Principais:**
        *   RNF-01: Criptografia de senhas usando hashing com `bcrypt`.
        *   RNF-04: Portabilidade completa rodando em containers Docker.
        *   RNF-05: Integridade referencial com remoção em cascata no banco.
*   **Notas e Sugestões Visuais:** 
    *   Utilize uma tabela dividida em duas colunas (Funcionais vs Não Funcionais) para facilitar a leitura.

---

# Slide 6: Modelagem do Banco de Dados
*   **Título:** 🗄️ Modelo Relacional e Integridade de Dados (DER)
*   **Tópicos:**
    *   **Entidades:** `User`, `Category`, `Transaction` e `Goal`.
    *   **Chaves Estrangeiras:** Relações seguras de 1-para-N (um usuário possui muitas transações/categorias/metas).
    *   **Boas Práticas de Banco:** Uso do Prisma ORM para migrações tipadas e consultas seguras.
    *   **Efeito Cascata (`onDelete: Cascade`):** Garantia de que a deleção de uma categoria limpe automaticamente suas transações associadas, evitando inconsistências.
*   **Notas e Sugestões Visuais:** 
    *   Adicione uma imagem do diagrama de Entidade-Relacionamento (DER) presente no arquivo `docs/SRS.md`.

---

# Slide 7: Autenticação e Segurança
*   **Título:** 🔒 Autenticação Segura JWT e Criptografia
*   **Tópicos:**
    *   **Cadastro:** Criptografia irreversível de senhas com `bcrypt` (salt rounds 10) antes de salvar no banco.
    *   **Login:** Geração de Tokens JWT (JSON Web Tokens) expiráveis e assinados.
    *   **Segurança de Rotas:** Middleware interceptador no backend que valida a presença e integridade do token JWT em requisições privadas.
    *   **Frontend Seguro:** Interceptor Axios que anexa automaticamente o token JWT no cabeçalho das chamadas.
*   **Notas e Sugestões Visuais:** 
    *   Adicione o fluxograma de login (Diagrama de Sequência) presente em `docs/SRS.md`.

---

# Slide 8: Diferenciais Premium e Recursos Inovadores
*   **Título:** 🚀 Recursos Avançados (O Diferencial Fintech)
*   **Tópicos:**
    *   **Carteiras Multi-moedas (BRL, USD, BIT):** Separação de abas e saldos por moeda com cotações automáticas via AwesomeAPI em tempo real.
    *   **Câmbio Rápido:** Lógica de conversão direta com criação automática de transações contábeis de contrapartida.
    *   **Simulador FIRE:** Projeção matemática da regra de 4% para independência financeira baseada em juros compostos.
    *   **Central de Insights:** Algoritmo local que gera alertas inteligentes de saúde financeira para o usuário.
*   **Notas e Sugestões Visuais:** 
    *   Insira um print do widget de Câmbio Rápido ou da calculadora do FIRE rodando no modo escuro.

---

# Slide 9: Qualidade e Resiliência
*   **Título:** 🧪 Garantia de Qualidade e Testes Automatizados
*   **Tópicos:**
    *   **Testes de Integração:** 14 casos de testes automatizados implementados com **Jest** e **Supertest**.
    *   **Escopo dos Testes:** Cobertura de rotas de login seguro, validação de inputs incorretos, cascade referencial e CRUD completo.
    *   **Documentação Viva (Swagger):** API documentada com a rota `/api-docs` para testes online imediatos pela banca.
    *   **Tratamento de Erros:** Middleware global de tratamento de exceções garantindo resiliência e estabilidade do servidor (HTTP 500).
*   **Notas e Sugestões Visuais:** 
    *   Coloque um print da saída do terminal executando `npm test` verde com 100% de sucesso.

---

# Slide 10: Portabilidade e Dockerização
*   **Título:** 🐋 Infraestrutura em Containers Docker
*   **Tópicos:**
    *   **Dockerfile:** Criação de imagem otimizada com Node.js Alpine (versão leve e segura).
    *   **Docker Compose:** Orquestração da API e do banco SQLite relacional em um único container.
    *   **Mapeamento de Volumes:** Persistência garantida do arquivo de banco de dados (`dev.db`) no diretório do host.
    *   **Zero-Setup:** O container já roda o build do cliente do Prisma e aplica as migrações de forma autônoma na inicialização.
*   **Notas e Sugestões Visuais:** 
    *   Mostre o trecho do `docker-compose.yml` ou um ícone do Docker.

---

# Slide 11: Conclusão
*   **Título:** 🏁 Conclusão e Demonstração Prática
*   **Tópicos:**
    *   Projeto Full-Stack concluído em conformidade com as boas práticas de Engenharia de Software.
    *   Código limpo, documentado, tipado e com validações robustas.
    *   Resiliência arquitetural e segurança de dados ponta a ponta.
    *   **Demonstração Prática:** Execução e simulação do app em tempo real.
*   **Notas e Sugestões Visuais:** 
    *   Insira a frase: *"Obrigado! Aberto a perguntas da banca."*
