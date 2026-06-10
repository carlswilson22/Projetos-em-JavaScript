# 📘 Guia de Apresentação Técnica — Backend Financial Control

Este documento serve como um roteiro de estudos e colas para a apresentação do código do backend do projeto. Selecionamos os **3 arquivos mais importantes e estratégicos** do backend, detalhando o que eles fazem, suas principais funções e os conceitos teóricos de engenharia de software aplicados neles que você pode usar para impressionar a banca/professor.

---

## 1. O Modelo do Banco de Dados: `schema.prisma`
*   **Caminho do Arquivo:** [prisma/schema.prisma](file:///d:/Programação/ProjFinalQuarta/Proj_Final_Des.Sistemas/backend/prisma/schema.prisma)
*   **O que é?** É o arquivo declarativo que define o banco de dados físico, os relacionamentos entre as tabelas e o comportamento do ORM (Prisma).

### Principais Destaques para Explicar:
1.  **Uso do ORM (Object-Relational Mapping):** Explique que em vez de escrever SQL manualmente no código (`INSERT INTO...`), utilizamos o **Prisma ORM**. Ele mapeia as tabelas como objetos no código TypeScript/JavaScript, prevenindo erros de sintaxe de banco e garantindo segurança contra SQL Injection.
2.  **Modelagem Relacional Estrita:** O banco possui 4 entidades relacionadas:
    *   `User`: O usuário logado.
    *   `Category`: Categorias de despesa/receita pertencentes a um usuário.
    *   `Transaction`: O registro financeiro individual da transação.
    *   `Goal`: Metas de economia financeiras.
3.  **Integridade Referencial com Exclusão em Cascata (`onDelete: Cascade`):** 
    *   Mostre no código as linhas: `@relation(fields: [categoryId], references: [id], onDelete: Cascade)`.
    *   **Explicação Acadêmica:** *"Definimos a deleção em cascata diretamente na modelagem do banco. Se um usuário decidir excluir uma categoria, o banco de dados apaga automaticamente todas as transações daquela categoria em cascata. Isso evita 'órfãos de dados' e mantém o banco de dados 100% higienizado e íntegro."*

---

## 2. O Middleware de Validação: `validationMiddleware.js`
*   **Caminho do Arquivo:** [src/middlewares/validationMiddleware.js](file:///d:/Programação/ProjFinalQuarta/Proj_Final_Des.Sistemas/backend/src/middlewares/validationMiddleware.js)
*   **O que é?** É um componente interceptador de requisições. Ele valida todos os campos enviados pelo usuário (se o e-mail é válido, se o valor é positivo, se o tipo é correto) antes de enviar a requisição para a lógica do banco.

### Principais Destaques para Explicar:
1.  **Arquitetura Desacoplada e Princípio de Responsabilidade Única (Clean Code):**
    *   **Explicação Acadêmica:** *"Em vez de poluir a lógica de criação de transações ou rotas com dezenas de validações manuais de 'if/else', criamos uma estrutura declarativa isolada. O validador roda como um middleware do Express, o que garante que se o payload for inválido, a requisição é rejeitada na hora com um status HTTP 400 (Bad Request), economizando processamento e banda do servidor."*
2.  **Validação Declarativa (`rules`):**
    *   Mostre a estrutura `rules.transactionCreate`. Ela exige que `amount` seja número e positivo, `type` seja 0 (despesa) ou 1 (receita), e `currency` seja uma das moedas aceitas (`BRL`, `USD`, `EUR`, `BIT`).
    *   *Nota de Ajuste:* Foi aqui que adicionamos o suporte ao ticker `'BIT'`, resolvendo a inconsistência das receitas em Bitcoin no sistema!

---

## 3. O Controlador de Transações: `transactionController.js`
*   **Caminho do Arquivo:** [src/controllers/transactionController.js](file:///d:/Programação/ProjFinalQuarta/Proj_Final_Des.Sistemas/backend/src/controllers/transactionController.js)
*   **O que é?** É o cérebro das operações financeiras. Contém a lógica de negócio do CRUD de transações.

### Principais Destaques para Explicar:
1.  **Segurança e Escopo de Acesso por Usuário (`userId`):**
    *   Mostre a linha: `const userId = req.user.userId;` no início das funções.
    *   **Explicação Acadêmica:** *"Esta é a implementação da nossa principal regra de negócio do BRD. O controlador extrai o `userId` diretamente do token JWT decodificado pelo middleware de autenticação. Assim, todas as consultas no banco contêm obrigatoriamente a cláusula `where: { userId }`, impossibilitando que um usuário visualize ou manipule transações de terceiros."*
2.  **Criação Dinâmica de Categorias (Auto-categorização):**
    *   Mostre a função `createTransaction` onde ela verifica se a categoria passada é um UUID ou um texto. Se for texto e não existir no banco do usuário, ela cria a categoria dinamicamente:
        ```javascript
        if (!dbCategory) {
            dbCategory = await prisma.category.create({ data: { name: categoryInput, userId } });
        }
        ```
    *   **Explicação Acadêmica:** *"Demos inteligência à API. Se o usuário cadastrar uma transação com uma nova categoria (ex: 'Academia'), a API detecta automaticamente que essa categoria não existe para este usuário, cria o registro da categoria e associa à transação no mesmo fluxo. Isso simplifica a experiência de uso (UX) e reduz a quantidade de cliques."*
3.  **Tratamento Elegante de Erros (Try/Catch):**
    *   Todo o fluxo do controlador roda envolto em blocos `try/catch`. Caso ocorra qualquer falha de conexão ou erro no banco, a exceção é capturada, e o sistema responde elegantemente com `res.status(500).json({ error: error.message })` em vez de deixar a requisição travada em timeout ou derrubar o servidor.
