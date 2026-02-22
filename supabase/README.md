# Migrations Supabase

## Tabelas

- **customers**: clientes do usuário (nome, email, endereço, cpf, celular, data de criação). Cada linha tem `user_id` = usuário autenticado.
- **loans**: empréstimos de um customer (valor, data da solicitação, juros, frequência de pagamento, número de parcelas). Cada loan pertence a um único customer; um customer pode ter 0 ou vários loans.

RLS garante que cada usuário só vê e altera seus próprios customers e os loans desses customers.

## Como aplicar

### Opção 1: SQL Editor no Dashboard

1. Abra [Supabase Dashboard](https://supabase.com/dashboard) → seu projeto → **SQL Editor**.
2. Copie o conteúdo de `migrations/20250221120000_create_customers_and_loans.sql`.
3. Cole no editor e execute (**Run**).

### Opção 2: Supabase CLI

Se tiver o [Supabase CLI](https://supabase.com/docs/guides/cli) instalado e o projeto linkado:

```bash
supabase db push
```

Ou para aplicar apenas esta migration em um projeto remoto já linkado:

```bash
supabase migration up
```

Depois de aplicar, as tabelas `customers` e `loans` estarão disponíveis via API com as políticas RLS ativas.
