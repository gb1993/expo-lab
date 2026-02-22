-- Migration: create customers and loans tables with RLS
-- Each user sees only their own customers; loans are accessed via ownership of the customer.

-- =============================================================================
-- table: customers (one user has many customers)
-- =============================================================================
create table public.customers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  email text not null,
  address text,
  cpf text,
  celular text,
  created_at timestamptz not null default now()
);

-- index for listing customers by owner
create index customers_user_id_idx on public.customers (user_id);

comment on table public.customers is 'Customers belonging to the authenticated user.';
comment on column public.customers.celular is 'Phone number (mobile).';

-- =============================================================================
-- table: loans (one customer has many loans; one loan belongs to one customer)
-- =============================================================================
create table public.loans (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers (id) on delete cascade,
  valor numeric(12, 2) not null check (valor > 0),
  data_solicitacao date not null default current_date,
  juros numeric(5, 4) not null check (juros >= 0),
  frequencia_pagamento text not null check (frequencia_pagamento in ('semanal', 'quinzenal', 'mensal')),
  numero_parcelas int not null check (numero_parcelas > 0),
  created_at timestamptz not null default now()
);

create index loans_customer_id_idx on public.loans (customer_id);

comment on table public.loans is 'Loans belonging to a customer; access controlled via customer ownership.';
comment on column public.loans.valor is 'Loan amount.';
comment on column public.loans.data_solicitacao is 'Request date.';
comment on column public.loans.juros is 'Interest rate (e.g. 0.0150 for 1.5%).';
comment on column public.loans.frequencia_pagamento is 'Payment frequency: semanal, quinzenal, mensal.';
comment on column public.loans.numero_parcelas is 'Number of installments.';

-- =============================================================================
-- RLS: customers (user only sees/edits their own rows)
-- =============================================================================
alter table public.customers enable row level security;

create policy "customers_select_own"
  on public.customers for select
  to authenticated
  using (user_id = auth.uid());

create policy "customers_insert_own"
  on public.customers for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "customers_update_own"
  on public.customers for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "customers_delete_own"
  on public.customers for delete
  to authenticated
  using (user_id = auth.uid());

-- =============================================================================
-- RLS: loans (user only sees/edits loans of their customers)
-- =============================================================================
alter table public.loans enable row level security;

create policy "loans_select_own_customers"
  on public.loans for select
  to authenticated
  using (
    exists (
      select 1 from public.customers c
      where c.id = loans.customer_id and c.user_id = auth.uid()
    )
  );

create policy "loans_insert_own_customers"
  on public.loans for insert
  to authenticated
  with check (
    exists (
      select 1 from public.customers c
      where c.id = loans.customer_id and c.user_id = auth.uid()
    )
  );

create policy "loans_update_own_customers"
  on public.loans for update
  to authenticated
  using (
    exists (
      select 1 from public.customers c
      where c.id = loans.customer_id and c.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.customers c
      where c.id = loans.customer_id and c.user_id = auth.uid()
    )
  );

create policy "loans_delete_own_customers"
  on public.loans for delete
  to authenticated
  using (
    exists (
      select 1 from public.customers c
      where c.id = loans.customer_id and c.user_id = auth.uid()
    )
  );
