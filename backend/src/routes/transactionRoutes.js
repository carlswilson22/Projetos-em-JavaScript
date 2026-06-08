const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { createTransaction, getTransactions, updateTransaction, deleteTransaction } = require('../controllers/transactionController');

router.use(authMiddleware);

/**
 * @openapi
 * /api/transactions:
 *   post:
 *     summary: Registrar uma nova transação (receita ou despesa)
 *     tags: [Transações]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - description
 *               - date
 *               - type
 *               - categoryId
 *             properties:
 *               amount:
 *                 type: number
 *                 format: float
 *                 example: 1500.50
 *               description:
 *                 type: string
 *                 example: Salário Mensal
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: 2026-05-19T10:00:00Z
 *               type:
 *                 type: integer
 *                 description: 1 para Receita, 0 para Despesa
 *                 example: 1
 *               categoryId:
 *                 type: string
 *                 description: Pode ser o ID (UUID) ou o nome de texto da categoria (ex. "Alimentação"). O backend trata de forma dinâmica!
 *                 example: Alimentação
 *     responses:
 *       201:
 *         description: Transação criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Transaction'
 *       401:
 *         description: Token inválido ou não fornecido
 *       500:
 *         description: Erro interno no servidor
 *   get:
 *     summary: Listar todas as transações do usuário logado
 *     tags: [Transações]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de transações retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 */
const { validate, rules } = require('../middlewares/validationMiddleware');

router.post('/', validate(rules.transactionCreate), createTransaction);
router.get('/', getTransactions);

/**
 * @openapi
 * /api/transactions/{id}:
 *   put:
 *     summary: Atualizar dados de uma transação existente
 *     tags: [Transações]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID da transação a ser atualizada
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 format: float
 *                 example: 1200.00
 *               description:
 *                 type: string
 *                 example: Salário Reajustado
 *               date:
 *                 type: string
 *                 format: date-time
 *               type:
 *                 type: integer
 *                 description: 1 para Receita, 0 para Despesa
 *               categoryId:
 *                 type: string
 *                 description: Nome ou UUID da categoria
 *     responses:
 *       200:
 *         description: Transação atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Transaction'
 *       404:
 *         description: Transação não encontrada
 *       401:
 *         description: Token inválido ou não fornecido
 *       500:
 *         description: Erro interno no servidor
 *   delete:
 *     summary: Excluir uma transação financeira por ID
 *     tags: [Transações]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID da transação a ser excluída
 *     responses:
 *       200:
 *         description: Transação excluída com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Transação não encontrada
 *       401:
 *         description: Token inválido ou não fornecido
 *       500:
 *         description: Erro interno no servidor
 */
router.put('/:id', validate(rules.transactionUpdate), updateTransaction);
router.delete('/:id', deleteTransaction);

module.exports = router;