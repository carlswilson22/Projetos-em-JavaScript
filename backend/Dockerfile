# Usar a imagem oficial do Node.js (versão 18 é bem estável)
FROM node:18-alpine

# Definir o diretório de trabalho dentro do container
WORKDIR /app

# Copiar os arquivos de dependência primeiro (isso otimiza o cache do Docker)
COPY package*.json ./
COPY prisma ./prisma/
COPY prisma.config.ts ./

# Instalar as dependências
RUN npm install

# Gerar o cliente do Prisma (a variável é necessária no build para o config.ts)
RUN DATABASE_URL="file:./prisma/dev.db" npx prisma generate

# Copiar o restante do código do backend
COPY . .

# Expor a porta que a API vai rodar
EXPOSE 5000

# Comando para aplicar migrations e iniciar a aplicação
CMD ["sh", "-c", "npx prisma migrate deploy && npm run dev"]