const prisma = require('../config/db');

const getGoals = async (req, res) => {
    try {
        const userId = req.user.userId;
        const goals = await prisma.goal.findMany({
            where: { userId }
        });
        res.json(goals);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createGoal = async (req, res) => {
    try {
        const { title, target, deadline, current } = req.body;
        const userId = req.user.userId;

        if (!title || target === undefined) {
            return res.status(400).json({ error: 'Título e valor alvo (target) são obrigatórios.' });
        }

        const goal = await prisma.goal.create({
            data: {
                title,
                target: Number(target),
                current: current !== undefined ? Number(current) : 0,
                deadline: deadline ? new Date(deadline) : null,
                userId
            }
        });

        res.status(201).json(goal);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateGoal = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, target, current, deadline } = req.body;
        const userId = req.user.userId;

        // Verifica se a meta existe e pertence ao usuário
        const goalExists = await prisma.goal.findFirst({
            where: { id, userId }
        });

        if (!goalExists) {
            return res.status(404).json({ error: 'Meta não encontrada ou não pertence a este usuário.' });
        }

        const updatedGoal = await prisma.goal.update({
            where: { id },
            data: {
                title: title !== undefined ? title : undefined,
                target: target !== undefined ? Number(target) : undefined,
                current: current !== undefined ? Number(current) : undefined,
                deadline: deadline !== undefined ? (deadline ? new Date(deadline) : null) : undefined
            }
        });

        res.json(updatedGoal);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteGoal = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;

        const goalExists = await prisma.goal.findFirst({
            where: { id, userId }
        });

        if (!goalExists) {
            return res.status(404).json({ error: 'Meta não encontrada ou não pertence a este usuário.' });
        }

        await prisma.goal.delete({
            where: { id }
        });

        res.json({ message: 'Meta removida com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getGoals, createGoal, updateGoal, deleteGoal };
