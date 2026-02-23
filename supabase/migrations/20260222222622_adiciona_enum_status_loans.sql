-- 1️⃣ Criar o ENUM (se ainda não existir)
CREATE TYPE public.status_tipo AS ENUM (
  'finalizado',
  'ativo',
  'atrasado'
);

-- 2️⃣ Remover DEFAULT antigo da coluna
ALTER TABLE public.loans
ALTER COLUMN status DROP DEFAULT;

-- 3️⃣ Alterar o tipo da coluna para ENUM
ALTER TABLE public.loans
ALTER COLUMN status TYPE public.status_tipo
USING status::public.status_tipo;

-- 4️⃣ Definir novo DEFAULT
ALTER TABLE public.loans
ALTER COLUMN status SET DEFAULT 'ativo';

-- 5️⃣ Definir NOT NULL (opcional, mas recomendado)
ALTER TABLE public.loans
ALTER COLUMN status SET NOT NULL;