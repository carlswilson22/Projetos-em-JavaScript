# 📄 Business Requirements Document (BRD) - Financial Control

## 1. Visão Geral do Produto
O **Financial Control** é uma aplicação web voltada ao gerenciamento de finanças pessoais. O principal objetivo do produto é simplificar o controle diário de receitas e despesas por parte de pessoas físicas, fornecendo visibilidade clara de sua saúde financeira e permitindo tomadas de decisão conscientes para evitar o endividamento e promover hábitos saudáveis de economia.

---

## 2. Escopo Comercial e Dores a Serem Resolvidas
Segundo dados de pesquisas nacionais de endividamento, mais de 70% das famílias brasileiras possuem algum tipo de dívida em aberto. A maior parte desse problema decorre da ausência de hábitos de planejamento e do desconhecimento exato de onde o dinheiro está sendo gasto.

As principais dores dos usuários identificadas no mercado são:
*   **Falta de clareza financeira:** Dificuldade em categorizar despesas rápidas do dia a dia (alimentação, transporte, lazer).
*   **Planilhas complexas:** O uso de planilhas de Excel tradicionais assusta usuários comuns devido à complexidade técnica e falta de interfaces amigáveis.
*   **Falta de acessibilidade:** Dificuldade para registrar uma despesa no exato momento da compra a partir do smartphone.
*   **Segurança e Privacidade:** Medo de expor dados de cartões e contas bancárias em aplicativos integrados diretamente com instituições bancárias.

O **Financial Control** soluciona essas dores oferecendo uma interface limpa, intuitiva, baseada em cadastro manual seguro, sem a necessidade de integração direta ou exposição de contas reais, operando como um livro de registro financeiro inteligente com organização dinâmica por categorias.

---

## 3. Público-Alvo (Persona)
O sistema é direcionado a:
1.  **Jovens Profissionais e Universitários:** Pessoas que estão iniciando sua independência financeira e precisam monitorar pequenos gastos com rigor.
2.  **Profissionais Autônomos e Freelancers:** Pessoas que têm rendas sazonais e variáveis e necessitam separar com exatidão suas entradas e saídas de caixa.
3.  **Famílias em Processo de Economia:** Casais que possuem metas conjuntas (compra de imóvel, viagem) e precisam identificar despesas supérfluas para cortar.

---

## 4. Objetivos de Negócio (Business Goals)
*   **Retenção e Engajamento:** Estimular o usuário a registrar pelo menos 3 despesas/receitas semanais através de uma interface ágil de um clique.
*   **Adoção de Boas Práticas:** Facilitar a categorização de 100% dos lançamentos financeiros para fins de análise estruturada.
*   **Flexibilidade Operacional:** Permitir que o usuário edite transações passadas em caso de digitação incorreta ou estornos.

---

## 5. Principais Regras de Negócio (Business Rules)
1.  **Privacidade Absoluta:** Um usuário autenticado **jamais** poderá visualizar as transações ou categorias criadas por outro usuário.
2.  **Controle Saldo Real:** O saldo disponível deve ser atualizado instantaneamente a cada adição, edição ou exclusão de transação.
3.  **Categorização Obrigatória:** Nenhuma transação financeira pode ser criada sem estar vinculada a uma categoria (seja ela pré-existente ou criada sob demanda pelo sistema).
4.  **Integridade Referencial:** Caso uma categoria seja excluída pelo usuário, todas as transações pertencentes a ela devem ser removidas em cascata para evitar órfãos de dados desestruturados.

---

## 6. Indicadores de Sucesso (KPIs)
*   **Active Users Ratio (DAU/MAU):** Frequência com que o usuário abre a aplicação para registrar gastos.
*   **Taxa de Categorização Dinâmica:** Número de categorias criadas sob demanda em comparação às padrões para entender a necessidade de personalização do usuário.
*   **Tempo Médio de Registro:** Tempo gasto pelo usuário para realizar um novo lançamento financeiro (meta: menos de 10 segundos).
