const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes'); 
const transactionRoutes = require('./routes/transactionRoutes'); 
const goalRoutes = require('./routes/goalRoutes');

const app = express();

app.use(cors());
app.use(express.json());

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

// Rota de Documentação Swagger (Requisito Obrigatório)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);   // <-- Mudado para plural
app.use('/api/transactions', transactionRoutes); // <-- Mudado para plural
app.use('/api/goals', goalRoutes);

const PORT = process.env.PORT || 5000;

// Middleware de tratamento de erro global (Clean Code / Segurança)
app.use((err, req, res, next) => {
    console.error('Erro Detectado na API:', err.stack || err);
    
    // Evita expor informações internas em produção
    const isProduction = process.env.NODE_ENV === 'production';
    const message = isProduction && !err.status 
        ? 'Ocorreu um erro inesperado no servidor.' 
        : err.message;

    res.status(err.status || 500).json({
        error: message || 'Erro interno do servidor.'
    });
});

if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`Servidor rodando na porta ${PORT}`);
    });
}

module.exports = app;