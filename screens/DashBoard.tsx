import {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import {supabase} from '../lib/supabase';
import {theme} from '../themes';
import CustomText from '../components/CustomText';

export default function DashBoard() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    customers: 0,
    totalAtivoValue: 0,
    totalAtivoCount: 0,
    totalAtrasadoValue: 0,
    totalAtrasadoCount: 0,
    totalAcordoValue: 0,
    totalAcordoCount: 0,
  });

  useEffect(() => {
    fetchMetrics();
  }, []);

  async function fetchMetrics() {
    setLoading(true);

    try {
      // Clientes
      const {count: customersCount} = await supabase
        .from('customers')
        .select('*', {count: 'exact', head: true});

      // Empréstimos (Ativos e Atrasados)
      const {data: loans} = await supabase
        .from('loans')
        .select('valor, status')
        .in('status', ['ativo', 'atrasado', 'acordo']); // Pegamos todos os status relevantes

      // Acordos (buscamos a tabela agreements separada porque a regra de negócio os contabiliza independente de seu status lá no loans, ou podíamos basear no loan.status === 'acordo')
      const {data: agreements} = await supabase
        .from('agreements')
        .select('valor');

      // Calcula as métricas de loans
      let ativoValue = 0;
      let ativoCount = 0;
      let atrasadoValue = 0;
      let atrasadoCount = 0;
      let acordoValue = 0;
      let acordoCount = 0;

      if (loans) {
        loans.forEach((l) => {
          const val = Number(l.valor) || 0;
          if (l.status === 'ativo') {
            ativoValue += val;
            ativoCount++;
          } else if (l.status === 'atrasado') {
            atrasadoValue += val;
            atrasadoCount++;
          }
           // Se a sua regra atualiza o status do loan para acordo:
           else if (l.status === 'acordo') {
              // Somamos baseando nos Empréstimos ou nos Acordos? 
              // O valor do acordo está na tabela agreements. Entao calcularemos os acordos usando a query da tabela agreements abaixo.
           }
        });
      }

      if (agreements) {
         agreements.forEach(a => {
            acordoValue += (Number(a.valor) || 0);
            acordoCount++;
         });
      }

      setMetrics({
        customers: customersCount ?? 0,
        totalAtivoValue: ativoValue,
        totalAtivoCount: ativoCount,
        totalAtrasadoValue: atrasadoValue,
        totalAtrasadoCount: atrasadoCount,
        totalAcordoValue: acordoValue,
        totalAcordoCount: acordoCount,
      });

    } catch (error) {
      console.log('Error fetching metrics', error);
    } finally {
      setLoading(false);
    }
  }

  const formatCurrency = (val: number) => {
    return val.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});
  };

  const totalNaRua =
    metrics.totalAtivoValue +
    metrics.totalAtrasadoValue +
    metrics.totalAcordoValue;

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.colors.green} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <CustomText
          text="Visão Geral"
          fontSize="xl"
          weight="bold"
          color="#333"
        />
        <CustomText
          text="Resumo das suas operações"
          fontSize="sm"
          color={theme.colors.purpleSecondary}
        />
      </View>

      {/* Card Principal - Total na Rua */}
      <View style={styles.mainCard}>
        <View style={styles.mainCardHeader}>
          <View style={styles.iconCircleMain}>
            <FontAwesome6 name="money-bills" size={20} color="#fff" />
          </View>
          <CustomText text="Total na Rua" color="#fff" fontSize="md" />
        </View>
        <CustomText
          text={formatCurrency(totalNaRua)}
          color="#fff"
          fontSize="xl"
          weight="bold"
          style={styles.mainCardValue}
        />
      </View>

      {/* Grid de Cards Menores */}
      <View style={styles.grid}>
        {/* Ativos */}
        <View style={styles.gridCard}>
          <View style={styles.cardHeader}>
            <View
              style={[
                styles.iconCircle,
                {backgroundColor: theme.colors.page},
              ]}>
              <FontAwesome6
                name="circle-check"
                size={16}
                color={theme.colors.green}
              />
            </View>
            <CustomText
              text={`${metrics.totalAtivoCount} Empréstimos`}
              fontSize="xs"
              color={theme.colors.purpleSecondary}
            />
          </View>
          <CustomText text="Em Dia (Ativos)" fontSize="sm" color="#333" />
          <CustomText
            text={formatCurrency(metrics.totalAtivoValue)}
            fontSize="lg"
            weight="bold"
            color={theme.colors.green}
            style={styles.cardValue}
          />
        </View>

        {/* Atrasados */}
        <View style={styles.gridCard}>
          <View style={styles.cardHeader}>
            <View
              style={[
                styles.iconCircle,
                {backgroundColor: '#FFEBEE'},
              ]}>
              <FontAwesome6
                name="circle-exclamation"
                size={16}
                color={theme.colors.danger}
              />
            </View>
            <CustomText
              text={`${metrics.totalAtrasadoCount} Empréstimos`}
              fontSize="xs"
              color={theme.colors.purpleSecondary}
            />
          </View>
          <CustomText text="Atrasados" fontSize="sm" color="#333" />
          <CustomText
            text={formatCurrency(metrics.totalAtrasadoValue)}
            fontSize="lg"
            weight="bold"
            color={theme.colors.danger}
            style={styles.cardValue}
          />
        </View>

        {/* Acordos */}
        <View style={styles.gridCard}>
          <View style={styles.cardHeader}>
            <View
              style={[
                styles.iconCircle,
                {backgroundColor: '#F3E5F5'},
              ]}>
              <FontAwesome6
                name="handshake"
                size={16}
                color={theme.colors.primary}
              />
            </View>
            <CustomText
              text={`${metrics.totalAcordoCount} Empréstimos`}
              fontSize="xs"
              color={theme.colors.purpleSecondary}
            />
          </View>
          <CustomText text="Em Acordo" fontSize="sm" color="#333" />
          <CustomText
            text={formatCurrency(metrics.totalAcordoValue)}
            fontSize="lg"
            weight="bold"
            color={theme.colors.primary}
            style={styles.cardValue}
          />
        </View>

        {/* Clientes */}
        <View style={styles.gridCard}>
          <View style={styles.cardHeader}>
            <View
              style={[
                styles.iconCircle,
                {backgroundColor: '#E3F2FD'},
              ]}>
              <FontAwesome6
                name="users"
                size={16}
                color="#1976D2"
              />
            </View>
          </View>
          <CustomText text="Total de Clientes" fontSize="sm" color="#333" />
          <CustomText
            text={metrics.customers.toString()}
            fontSize="xl"
            weight="bold"
            color="#1976D2"
            style={styles.cardValue}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.page,
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.page,
  },
  contentContainer: {
    padding: theme.spacing.md,
    paddingBottom: 40,
  },
  header: {
    marginBottom: theme.spacing.lg,
    marginTop: theme.spacing.sm,
  },
  mainCard: {
    backgroundColor: theme.colors.green,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 10,
    marginBottom: theme.spacing.lg,
  },
  mainCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconCircleMain: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainCardValue: {
    marginTop: theme.spacing.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16, // Use gap se suportado no RN para o flex container
  },
  gridCard: {
    backgroundColor: '#fff',
    width: '47%', // Fallback rudimentar p/ duas colunas com margin entre
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 5,
    marginBottom: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardValue: {
    marginTop: 4,
  },
});
