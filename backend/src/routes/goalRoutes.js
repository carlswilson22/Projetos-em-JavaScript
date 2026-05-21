const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { getGoals, createGoal, updateGoal, deleteGoal } = require('../controllers/GoalController');

// Todas as rotas de metas passam pelo authMiddleware
router.use(authMiddleware);

/**
 * @openapi
 * /api/goals:
 *   post:
 *     summary: Criar uma nova meta de economia para o usuário logado
 *     tags: [Metas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - target
 *             properties:
 *               title:
 *                 type: string
 *                 example: Viagem de Fim de Ano
 *               target:
 *                 type: number
 *                 example: 5000.00
 *               current:
 *                 type: number
 *                 example: 1000.00
 *               deadline:
 *                 type: string
 *                 format: date-time
 *                 example: 2026-12-31T00:00:00.000Z
 *     responses:
 *       201:
 *         description: Meta de economia criada com sucesso
 *       400:
 *         description: Dados incompletos ou inválidos
 *       401:
 *         description: Token inválido ou não fornecido
 *       500:
 *         description: Erro interno no servidor
 *   get:
 *     summary: Listar todas as metas de economia do usuário logado
 *     tags: [Metas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de metas retornada com sucesso
 *       401:
 *         description: Token inválido ou não fornecido
 *       500:
 *         description: Erro interno no servidor
 */
router.post('/', createGoal);
router.get('/', getGoals);

/**
 * @openapi
 * /api/goals/{id}:
 *   put:
 *     summary: Atualizar detalhes de uma meta de economia existente
 *     tags: [Metas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID da meta a ser atualizada
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Viagem de Fim de Ano (Atualizada)
 *               target:
 *                 type: number
 *                 example: 6000.00
 *               current:
 *                 type: number
 *                 example: 1500.00
 *               deadline:
 *                 type: string
 *                 format: date-time
 *                 example: 2026-12-25T00:00:00.000Z
 *     responses:
 *       200:
 *         description: Meta atualizada com sucesso
 *       404:
 *         description: Meta não encontrada
 *       401:
 *         description: Token inválido ou não fornecido
 *       500:
 *         description: Erro interno no servidor
 *   delete:
 *     summary: Excluir uma meta de economia
 *     tags: [Metas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID da meta a ser excluída
 *     responses:
 *       200:
 *         description: Meta excluída com sucesso
 *       404:
 *         description: Meta não encontrada
 *       401:
 *         description: Token inválido ou não fornecido
 *       500:
 *         description: Erro interno no servidor
 */
router.put('/:id', updateGoal);
router.delete('/:id', deleteGoal);

module.exports = router;
