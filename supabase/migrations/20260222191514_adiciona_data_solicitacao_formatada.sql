-- Cria ou substitui a view formatada
CREATE OR REPLACE VIEW vw_loans_formatada AS
SELECT
  id,
  TO_CHAR(created_at AT TIME ZONE 'America/Sao_Paulo', 'DD/MM/YYYY HH24:MI') AS data_solicitacao_formatada,
  valor,
  status,
  created_at
FROM public.loans;