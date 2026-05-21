const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { createCategory, getCategories, updateCategory, deleteCategory } = require('../controllers/categoryController');

// Todas as rotas de categoria passam pelo authMiddleware
router.use(authMiddleware);

/**
 * @openapi
 * /api/categories:
 *   post:
 *     summary: Criar uma nova categoria para o usuário logado
 *     tags: [Categorias]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Alimentação
 *     responses:
 *       201:
 *         description: Categoria criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       401:
 *         description: Token inválido ou não fornecido
 *       500:
 *         description: Erro interno no servidor
 *   get:
 *     summary: Listar todas as categorias do usuário logado
 *     tags: [Categorias]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de categorias retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 *       401:
 *         description: Token inválido ou não fornecido
 *       500:
 *         description: Erro interno no servidor
 */
router.post('/', createCategory);
router.get('/', getCategories);

/**
 * @openapi
 * /api/categories/{id}:
 *   put:
 *     summary: Atualizar o nome de uma categoria existente
 *     tags: [Categorias]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID da categoria a ser atualizada
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Alimentação & Lazer
 *     responses:
 *       200:
 *         description: Categoria atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       404:
 *         description: Categoria não encontrada
 *       401:
 *         description: Token inválido ou não fornecido
 *       500:
 *         description: Erro interno no servidor
 *   delete:
 *     summary: Excluir uma categoria (deleta transações associadas em cascata)
 *     tags: [Categorias]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID da categoria a ser excluída
 *     responses:
 *       200:
 *         description: Categoria excluída com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Categoria não encontrada
 *       401:
 *         description: Token inválido ou não fornecido
 *       500:
 *         description: Erro interno no servidor
 */
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);

module.exports = router;