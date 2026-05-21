const request = require('supertest');
const app = require('../src/server');
const prisma = require('../src/config/db');

describe('🧪 Testes de Integração da API Financial Control', () => {
    let testToken;
    let testUserId;
    let testCategoryId;
    let testTransactionId;
    let testGoalId;
    const testEmail = `test_${Date.now()}@test.com`;
    const testPassword = 'senha_segura_123';

    // Limpeza após todos os testes para manter o banco higienizado
    afterAll(async () => {
        if (testUserId) {
            // Devido ao onDelete: Cascade configurado no Prisma, excluir o User
            // limpa automaticamente todas as suas categorias e transações associadas!
            await prisma.user.delete({
                where: { id: testUserId }
            }).catch(() => {});
        }
        await prisma.$disconnect();
    });

    test('1. Deve registrar um novo usuário com sucesso', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                name: 'Usuário Teste Jest',
                email: testEmail,
                password: testPassword
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('userId');
        expect(res.body.message).toContain('sucesso');
        testUserId = res.body.userId;
    });

    test('2. Deve autenticar (login) o usuário criado', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: testEmail,
                password: testPassword
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
        expect(res.body).toHaveProperty('user');
        expect(res.body.user.name).toEqual('Usuário Teste Jest');
        testToken = res.body.token;
    });

    test('3. Deve atualizar o perfil do usuário logado', async () => {
        const res = await request(app)
            .put('/api/auth/profile')
            .set('Authorization', `Bearer ${testToken}`)
            .send({
                name: 'Usuário Teste Atualizado',
                avatar: 'https://avatar.url/jest.png'
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body.user.name).toEqual('Usuário Teste Atualizado');
        expect(res.body.user.avatar).toEqual('https://avatar.url/jest.png');
    });

    test('4. Deve criar categoria automaticamente e salvar transação', async () => {
        const res = await request(app)
            .post('/api/transactions')
            .set('Authorization', `Bearer ${testToken}`)
            .send({
                amount: 150.75,
                description: 'Compras de Teste Jest',
                date: new Date().toISOString(),
                type: 0, // Despesa
                categoryId: 'Lazer e Diversão' // Categoria de texto dinâmica
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body.description).toEqual('Compras de Teste Jest');
        expect(res.body).toHaveProperty('category');
        expect(res.body.category.name).toEqual('Lazer e Diversão');

        testTransactionId = res.body.id;
        testCategoryId = res.body.category.id;
    });

    test('5. Deve listar todas as transações do usuário', async () => {
        const res = await request(app)
            .get('/api/transactions')
            .set('Authorization', `Bearer ${testToken}`);

        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThanOrEqual(1);
        expect(res.body[0].description).toEqual('Compras de Teste Jest');
    });

    test('6. Deve demonstrar integridade referencial: deletar categoria exclui transação em cascata', async () => {
        // Exclui a categoria criada
        const deleteRes = await request(app)
            .delete(`/api/categories/${testCategoryId}`)
            .set('Authorization', `Bearer ${testToken}`);

        expect(deleteRes.statusCode).toEqual(200);
        expect(deleteRes.body.message).toContain('sucesso');

        // Busca a transação associada diretamente no banco de dados via Prisma para provar a cascata
        const tx = await prisma.transaction.findUnique({
            where: { id: testTransactionId }
        });

        // Deve retornar null, pois foi excluída em cascata no banco físico!
        expect(tx).toBeNull();
    });

    test('7. Deve criar uma nova meta de economia com sucesso', async () => {
        const res = await request(app)
            .post('/api/goals')
            .set('Authorization', `Bearer ${testToken}`)
            .send({
                title: 'Comprar Computador de Teste',
                target: 3500.00,
                current: 500.00,
                deadline: '2026-12-31T00:00:00.000Z'
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body.title).toEqual('Comprar Computador de Teste');
        expect(res.body.target).toEqual(3500.00);
        expect(res.body.current).toEqual(500.00);
        testGoalId = res.body.id;
    });

    test('8. Deve listar todas as metas do usuário', async () => {
        const res = await request(app)
            .get('/api/goals')
            .set('Authorization', `Bearer ${testToken}`);

        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThanOrEqual(1);
        expect(res.body[0].title).toEqual('Comprar Computador de Teste');
    });

    test('9. Deve atualizar o progresso economizado da meta', async () => {
        const res = await request(app)
            .put(`/api/goals/${testGoalId}`)
            .set('Authorization', `Bearer ${testToken}`)
            .send({
                current: 1200.00
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body.current).toEqual(1200.00);
    });

    test('10. Deve excluir a meta de economia com sucesso', async () => {
        const res = await request(app)
            .delete(`/api/goals/${testGoalId}`)
            .set('Authorization', `Bearer ${testToken}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toContain('sucesso');

        // Garante que foi excluída do banco físico
        const goal = await prisma.goal.findUnique({
            where: { id: testGoalId }
        });
        expect(goal).toBeNull();
    });
});
