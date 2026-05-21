const swaggerJSDoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: '💰 Financial Control API',
            version: '1.0.0',
            description: 'API completa para gerenciamento de finanças pessoais. Permite controle de receitas, despesas, categorias e atualização de perfil do usuário.',
            contact: {
                name: 'Suporte Dev',
                email: 'suporte@financialcontrol.com'
            }
        },
        servers: [
            {
                url: 'http://localhost:5000',
                description: 'Servidor Local de Desenvolvimento'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Insira o token JWT gerado no login para acessar as rotas protegidas. Exemplo: "eyJhbGciOi..."'
                }
            },
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                        email: { type: 'string', format: 'email' },
                        name: { type: 'string' },
                        avatar: { type: 'string', nullable: true }
                    }
                },
                Category: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                        name: { type: 'string' },
                        userId: { type: 'string', format: 'uuid' }
                    }
                },
                Transaction: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                        amount: { type: 'number', format: 'float' },
                        description: { type: 'string' },
                        date: { type: 'string', format: 'date-time' },
                        type: { type: 'integer', description: '1 para Receita, 0 para Despesa' },
                        categoryId: { type: 'string', format: 'uuid' },
                        userId: { type: 'string', format: 'uuid' },
                        category: { $ref: '#/components/schemas/Category' }
                    }
                }
            }
        },
        security: [
            {
                bearerAuth: []
            }
        ]
    },
    apis: [
        './src/routes/*.js',
        './src/controllers/*.js'
    ]
};

const spec = swaggerJSDoc(options);

module.exports = spec;
