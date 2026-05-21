const express = require('express');
const routes = express.Router();
const { register, login, updateProfile } = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     summary: Cadastrar um novo usuário
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: João Silva
 *               email:
 *                 type: string
 *                 format: email
 *                 example: joao@email.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: senha123
 *     responses:
 *       201:
 *         description: Usuário cadastrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 userId:
 *                   type: string
 *       400:
 *         description: E-mail em uso ou dados inválidos
 *       500:
 *         description: Erro interno no servidor
 */
routes.post('/register', register);

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: Autenticar usuário (efetuar login)
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: joao@email.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: senha123
 *     responses:
 *       200:
 *         description: Login efetuado com sucesso (retorna Token JWT e dados do usuário)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Credenciais inválidas
 *       500:
 *         description: Erro interno no servidor
 */
routes.post('/login', login);

/**
 * @openapi
 * /api/auth/profile:
 *   put:
 *     summary: Atualizar perfil do usuário logado
 *     tags: [Perfil]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: João Silva Editado
 *               email:
 *                 type: string
 *                 format: email
 *                 example: joao.editado@email.com
 *               avatar:
 *                 type: string
 *                 example: https://avatar.url/joao.png
 *     responses:
 *       200:
 *         description: Perfil atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: E-mail em uso
 *       401:
 *         description: Token ausente ou inválido
 *       500:
 *         description: Erro interno no servidor
 */
routes.put('/profile', authMiddleware, updateProfile);

module.exports = routes;