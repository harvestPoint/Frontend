# Build Stage
FROM node:20-alpine AS build

WORKDIR /app

# Copia manifestos de pacotes
COPY package.json package-lock.json ./

# Instala dependências
RUN npm ci

# Copia código fonte
COPY . .

# Compila para produção
RUN npm run build

# Production Stage (Nginx)
FROM nginx:alpine

# Copia arquivos compilados do React
COPY --from=build /app/dist /usr/share/nginx/html

# Copia configuração do Nginx com fallback SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
