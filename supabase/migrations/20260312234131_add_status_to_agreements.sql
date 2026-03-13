-- Adiciona coluna status à tabela agreements
-- Reutiliza o mesmo enum status_tipo dos loans
ALTER TABLE "public"."agreements"
  ADD COLUMN "status" "public"."status_tipo" NOT NULL DEFAULT 'ativo'::"public"."status_tipo";

COMMENT ON COLUMN "public"."agreements"."status" IS 'Status do acordo: ativo, atrasado, finalizado, acordo.';
