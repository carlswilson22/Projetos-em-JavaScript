const prisma = require('../config/db');

const createCategory = async (req, res) => {
    try {
        const { name, budget } = req.body;
        const userId = req.user.userId; // Veio do nosso middleware!

        const category = await prisma.category.create({
            data: { 
                name, 
                budget: budget !== undefined && budget !== null ? Number(budget) : null,
                userId 
            }
        });

        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getCategories = async (req, res) => {
    try {
        const userId = req.user.userId;
        const categories = await prisma.category.findMany({
            where: { userId }
        });

        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, budget } = req.body;
        const userId = req.user.userId;

        const category = await prisma.category.findFirst({
            where: { id, userId }
        });

        if (!category) {
            return res.status(404).json({ error: 'Categoria não encontrada.' });
        }

        const updatedCategory = await prisma.category.update({
            where: { id },
            data: { 
                name: name !== undefined ? name : undefined,
                budget: budget !== undefined ? (budget === null ? null : Number(budget)) : undefined
            }
        });

        res.status(200).json(updatedCategory);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;

        const category = await prisma.category.findFirst({
            where: { id, userId }
        });

        if (!category) {
            return res.status(404).json({ error: 'Categoria não encontrada.' });
        }

        await prisma.category.delete({
            where: { id }
        });

        res.status(200).json({ message: 'Categoria excluída com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { createCategory, getCategories, updateCategory, deleteCategory };