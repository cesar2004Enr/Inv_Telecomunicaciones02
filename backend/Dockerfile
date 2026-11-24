FROM node:20-bookworm-slim

# Instalar herramientas de red requeridas por scanService y pingService, más OpenSSL para Prisma
RUN apt-get update && apt-get install -y --no-install-recommends \
    nmap \
    arp-scan \
    iputils-ping \
    openssl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copiar manifiestos de dependencias y configuración de Prisma v7
COPY package.json package-lock.json ./
COPY prisma.config.js ./
COPY prisma ./prisma

# Instalar dependencias exactas de producción
RUN npm ci --omit=dev

# Generar el cliente de Prisma
RUN npx prisma generate

# Copiar el código fuente del backend
COPY src ./src

EXPOSE 4000

# Aplicar migraciones pendientes en PostgreSQL y arrancar el servidor
CMD ["sh", "-c", "npx prisma migrate deploy && node src/app.js"]