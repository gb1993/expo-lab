-- 1️⃣ Criar o tipo ENUM
CREATE TYPE public.cobranca_tipo AS ENUM (
  'mensal',
  'semanal',
  'quinzenal'
);

-- 2️⃣ Adicionar a coluna usando o ENUM
ALTER TABLE public.loans
ADD COLUMN cobranca public.cobranca_tipo NOT NULL DEFAULT 'mensal';