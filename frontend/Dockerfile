# Etapa 1: Compilación de la aplicación React + Vite
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Variables de entorno inyectadas en tiempo de compilación por Vite
ARG VITE_API_URL=http://localhost:3000/api
ARG VITE_RECAPTCHA_SITE_KEY

ENV VITE_API_URL=$VITE_API_URL
ENV VITE_RECAPTCHA_SITE_KEY=$VITE_RECAPTCHA_SITE_KEY

RUN npm run build

# Etapa 2: Servidor web Nginx para producción
FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]