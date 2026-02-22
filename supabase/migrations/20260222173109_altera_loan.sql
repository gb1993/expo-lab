alter table public.loans
drop column if exists frequencia_pagamento,
drop column if exists numero_parcelas;