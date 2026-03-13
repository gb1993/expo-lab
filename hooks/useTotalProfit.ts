import {useEffect, useState} from 'react';
import {supabase} from '../lib/supabase';
import {Database} from '../database.types';

type LoanRow = Database['public']['Tables']['loans']['Row'];
type AgreementRow = Database['public']['Tables']['agreements']['Row'];

export function useTotalProfit() {
  const [totalProfit, setTotalProfit] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTotalProfit();
  }, []);

  async function fetchTotalProfit() {
    setLoading(true);
    try {
      // Busca todos os empréstimos não finalizados
      const {data: loans, error: loansError} = await supabase
        .from('loans')
        .select('*')
        .neq('status', 'finalizado');

      if (loansError) {
        console.error('Erro ao buscar empréstimos:', loansError);
        return;
      }

      if (!loans || loans.length === 0) {
        setTotalProfit(0);
        return;
      }

      // Separa empréstimos com acordo dos demais
      const acordoLoans = loans.filter(
        (loan: LoanRow) => loan.status === 'acordo',
      );
      const normalLoans = loans.filter(
        (loan: LoanRow) => loan.status !== 'acordo',
      );

      // Calcula lucro dos empréstimos normais: valor * juros
      let profit = normalLoans.reduce(
        (sum: number, loan: LoanRow) => sum + loan.valor * loan.juros,
        0,
      );

      // Para empréstimos com acordo, busca os respectivos agreements
      if (acordoLoans.length > 0) {
        const acordoLoanIds = acordoLoans.map((loan: LoanRow) => loan.id);

        const {data: agreements, error: agreementsError} = await supabase
          .from('agreements')
          .select('*')
          .in('loan_id', acordoLoanIds);

        if (agreementsError) {
          console.error('Erro ao buscar acordos:', agreementsError);
          return;
        }

        // Cria mapa de acordo por loan_id para acesso rápido
        const agreementMap = new Map<string, AgreementRow>();
        agreements?.forEach((agreement: AgreementRow) => {
          agreementMap.set(agreement.loan_id, agreement);
        });

        // Lucro do acordo = agreement.valor - loan.valor
        acordoLoans.forEach((loan: LoanRow) => {
          const agreement = agreementMap.get(loan.id);
          if (agreement) {
            profit += agreement.valor - loan.valor;
          }
        });
      }

      setTotalProfit(profit);
    } catch (err) {
      console.error('Erro inesperado ao calcular lucro:', err);
    } finally {
      setLoading(false);
    }
  }

  return {totalProfit, loading};
}
