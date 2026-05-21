const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/db');

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Verifica se o usuário já existe
        const userExists = await prisma.user.findUnique({ where: { email } });
        if (userExists) {
            return res.status(400).json({ error: 'Este e-mail já está em uso.' });
        }

        // Criptografa a senha
        const hashedPassword = await bcrypt.hash(password, 10);

        // Cria o usuário no banco
        const user = await prisma.user.create({
            data: {
                email,
                name: name || "",
                passwordHash: hashedPassword
            }
        });

        res.status(201).json({ message: 'Usuário criado com sucesso!', userId: user.id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Busca o usuário
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: 'E-mail ou senha inválidos.' });
        }

        // Verifica a senha
        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'E-mail ou senha inválidos.' });
        }

        // Gera o Token JWT
        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET || 'SuaChaveSecretaAqui',
            { expiresIn: '1d' }
        );

        res.json({ 
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                avatar: user.avatar
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { name, email, avatar } = req.body;
        const userId = req.user.userId;

        if (email) {
            const emailExists = await prisma.user.findFirst({
                where: { email, NOT: { id: userId } }
            });
            if (emailExists) {
                return res.status(400).json({ error: 'Este e-mail já está em uso.' });
            }
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                name,
                email,
                avatar
            }
        });

        res.json({
            user: {
                id: updatedUser.id,
                email: updatedUser.email,
                name: updatedUser.name,
                avatar: updatedUser.avatar
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { register, login, updateProfile };