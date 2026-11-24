-- CreateTable
CREATE TABLE "archivos" (
    "id" UUID NOT NULL,
    "nombre" VARCHAR(150) NOT NULL,
    "contenido" JSONB NOT NULL,
    "tamano" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "datos_usuario_id" UUID NOT NULL,

    CONSTRAINT "archivos_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "archivos" ADD CONSTRAINT "archivos_datos_usuario_id_fkey" FOREIGN KEY ("datos_usuario_id") REFERENCES "datos_usuarios"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE;
