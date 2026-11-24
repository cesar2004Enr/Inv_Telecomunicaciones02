-- CreateTable
CREATE TABLE "fiscalias" (
    "id_fiscalia" UUID NOT NULL,
    "nombre_empresa" VARCHAR(200) NOT NULL,
    "telefono_empresa" VARCHAR(20) NOT NULL,
    "pais" VARCHAR(100) NOT NULL DEFAULT 'México',
    "estado" VARCHAR(100) NOT NULL,
    "ciudad" VARCHAR(100) NOT NULL,
    "codigo_postal" VARCHAR(5) NOT NULL,
    "calle" VARCHAR(200) NOT NULL,
    "numero_exterior" VARCHAR(10) NOT NULL,
    "numero_interior" VARCHAR(10),
    "colonia" VARCHAR(200) NOT NULL,
    "id_creacion" VARCHAR(50) NOT NULL,
    "creacion_empresa" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "fiscalias_pkey" PRIMARY KEY ("id_fiscalia")
);

-- CreateTable
CREATE TABLE "datos_usuarios" (
    "id_usuario" UUID NOT NULL,
    "primer_nombre" VARCHAR(10) NOT NULL,
    "segundo_nombre" VARCHAR(10),
    "apellido_paterno" VARCHAR(10) NOT NULL,
    "apellido_materno" VARCHAR(10),
    "telefono_personal" VARCHAR(10) NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "fiscalia_id" UUID,

    CONSTRAINT "datos_usuarios_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "correos_usuarios" (
    "id_correo" UUID NOT NULL,
    "email_usuario" VARCHAR(255) NOT NULL,
    "password_usuario" VARCHAR(255) NOT NULL,
    "fecha_creacion" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "datos_usuario_id" UUID NOT NULL,

    CONSTRAINT "correos_usuarios_pkey" PRIMARY KEY ("id_correo")
);

-- CreateTable
CREATE TABLE "verificaciones_usuarios" (
    "id_verificacion" UUID NOT NULL,
    "codigo_verificacion" VARCHAR(6),
    "verificacion_usuario" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "datos_usuario_id" UUID NOT NULL,

    CONSTRAINT "verificaciones_usuarios_pkey" PRIMARY KEY ("id_verificacion")
);

-- CreateTable
CREATE TABLE "marcas" (
    "id_marca" UUID NOT NULL,
    "marca_dispositivo" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "marcas_pkey" PRIMARY KEY ("id_marca")
);

-- CreateTable
CREATE TABLE "tipos_dispositivos" (
    "id_tipo_dispositivo" UUID NOT NULL,
    "tipo_dispositivo" VARCHAR(50) NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tipos_dispositivos_pkey" PRIMARY KEY ("id_tipo_dispositivo")
);

-- CreateTable
CREATE TABLE "dispositivos" (
    "id_dispositivo" UUID NOT NULL,
    "nombre_equipo" VARCHAR(50) NOT NULL,
    "nombre_inventario" VARCHAR(100),
    "modelo" VARCHAR(50) NOT NULL,
    "numero_serie" VARCHAR(50) NOT NULL,
    "actividad" VARCHAR(20) NOT NULL DEFAULT 'Activo',
    "sitio" VARCHAR(100),
    "fecha_registro" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMPTZ NOT NULL,
    "datos_usuario_id" UUID NOT NULL,
    "fiscalia_id" UUID,
    "marca_id" UUID NOT NULL,
    "tipo_dispositivo_id" UUID NOT NULL,

    CONSTRAINT "dispositivos_pkey" PRIMARY KEY ("id_dispositivo")
);

-- CreateTable
CREATE TABLE "interfaces" (
    "id_interfaz" UUID NOT NULL,
    "direccion_ipv4" VARCHAR(15) NOT NULL,
    "mascara_subred" VARCHAR(15) NOT NULL,
    "direccion_mac" VARCHAR(17) NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dispositivo_id" UUID NOT NULL,

    CONSTRAINT "interfaces_pkey" PRIMARY KEY ("id_interfaz")
);

-- CreateIndex
CREATE UNIQUE INDEX "correos_usuarios_email_usuario_key" ON "correos_usuarios"("email_usuario");

-- CreateIndex
CREATE UNIQUE INDEX "correos_usuarios_datos_usuario_id_key" ON "correos_usuarios"("datos_usuario_id");

-- CreateIndex
CREATE UNIQUE INDEX "verificaciones_usuarios_datos_usuario_id_key" ON "verificaciones_usuarios"("datos_usuario_id");

-- CreateIndex
CREATE UNIQUE INDEX "marcas_marca_dispositivo_key" ON "marcas"("marca_dispositivo");

-- CreateIndex
CREATE UNIQUE INDEX "tipos_dispositivos_tipo_dispositivo_key" ON "tipos_dispositivos"("tipo_dispositivo");

-- AddForeignKey
ALTER TABLE "datos_usuarios" ADD CONSTRAINT "datos_usuarios_fiscalia_id_fkey" FOREIGN KEY ("fiscalia_id") REFERENCES "fiscalias"("id_fiscalia") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "correos_usuarios" ADD CONSTRAINT "correos_usuarios_datos_usuario_id_fkey" FOREIGN KEY ("datos_usuario_id") REFERENCES "datos_usuarios"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "verificaciones_usuarios" ADD CONSTRAINT "verificaciones_usuarios_datos_usuario_id_fkey" FOREIGN KEY ("datos_usuario_id") REFERENCES "datos_usuarios"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dispositivos" ADD CONSTRAINT "dispositivos_datos_usuario_id_fkey" FOREIGN KEY ("datos_usuario_id") REFERENCES "datos_usuarios"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dispositivos" ADD CONSTRAINT "dispositivos_fiscalia_id_fkey" FOREIGN KEY ("fiscalia_id") REFERENCES "fiscalias"("id_fiscalia") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dispositivos" ADD CONSTRAINT "dispositivos_marca_id_fkey" FOREIGN KEY ("marca_id") REFERENCES "marcas"("id_marca") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dispositivos" ADD CONSTRAINT "dispositivos_tipo_dispositivo_id_fkey" FOREIGN KEY ("tipo_dispositivo_id") REFERENCES "tipos_dispositivos"("id_tipo_dispositivo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interfaces" ADD CONSTRAINT "interfaces_dispositivo_id_fkey" FOREIGN KEY ("dispositivo_id") REFERENCES "dispositivos"("id_dispositivo") ON DELETE CASCADE ON UPDATE CASCADE;
