CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA pg_catalog;

-- Agendar para rodar todo dia à meia noite
SELECT cron.schedule(
  'atualiza_status_atrasado',
  '0 0 * * *',
  $$
    UPDATE public.loans 
    SET status = 'atrasado' 
    WHERE status = 'ativo' AND data_vencimento < CURRENT_DATE
  $$
);
