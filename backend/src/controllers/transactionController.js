const prisma = require('../config/db');

const createTransaction = async (req, res) => {
    try {
        const { amount, description, date, type, categoryId } = req.body;
        const userId = req.user.userId;

        // Se categoryId não for um UUID, tratamos como nome de categoria
        let category;
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(categoryId);

        if (isUUID) {
            category = await prisma.category.findFirst({
                where: { id: categoryId, userId }
            });
        } else {
            category = await prisma.category.findFirst({
                where: { name: categoryId, userId }
            });
        }

        // Se não existir, criamos a categoria dinamicamente
        if (!category) {
            category = await prisma.category.create({
                data: {
                    name: categoryId,
                    userId
                }
            });
        }

        const transaction = await prisma.transaction.create({
            data: {
                amount,
                description,
                date: new Date(date),
                type,
                categoryId: category.id,
                userId
            },
            include: { category: true }
        });

        res.status(201).json(transaction);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getTransactions = async (req, res) => {
    try {
        const userId = req.user.userId;
        const transactions = await prisma.transaction.findMany({
            where: { userId },
            include: { category: true }
        });

        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        const { amount, description, date, type, categoryId } = req.body;
        const userId = req.user.userId;

        const transactionExists = await prisma.transaction.findFirst({
            where: { id, userId }
        });

        if (!transactionExists) {
            return res.status(404).json({ error: 'Transação não encontrada.' });
        }

        let actualCategoryId = transactionExists.categoryId;

        if (categoryId) {
            let category;
            const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(categoryId);

            if (isUUID) {
                category = await prisma.category.findFirst({
                    where: { id: categoryId, userId }
                });
            } else {
                category = await prisma.category.findFirst({
                    where: { name: categoryId, userId }
                });
            }

            if (!category) {
                category = await prisma.category.create({
                    data: {
                        name: categoryId,
                        userId
                    }
                });
            }
            actualCategoryId = category.id;
        }

        const updatedTransaction = await prisma.transaction.update({
            where: { id },
            data: {
                amount: amount !== undefined ? amount : undefined,
                description: description !== undefined ? description : undefined,
                date: date ? new Date(date) : undefined,
                type: type !== undefined ? type : undefined,
                categoryId: actualCategoryId
            },
            include: { category: true }
        });

        res.status(200).json(updatedTransaction);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;

        const transaction = await prisma.transaction.findFirst({
            where: { id, userId }
        });

        if (!transaction) {
            return res.status(404).json({ error: 'Transação não encontrada.' });
        }

        await prisma.transaction.delete({
            where: { id }
        });

        res.status(200).json({ message: 'Transação excluída com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { createTransaction, getTransactions, updateTransaction, deleteTransaction };