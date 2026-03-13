import {useState} from 'react';
import {
  View,
  Modal,
  TextInput,
  StyleSheet,
  Pressable,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';

import {supabase} from '../../lib/supabase';
import {theme} from '../../themes';
import CustomText from '../CustomText';
import CustomButton from '../CustomButton';

interface PaymentModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  loanId: string;
  agreementId?: string;
  customerId: string;
  currentDebt: number;
}

export default function PaymentModal({
  visible,
  onClose,
  onSuccess,
  loanId,
  agreementId,
  customerId,
  currentDebt,
}: PaymentModalProps) {
  const [valor, setValor] = useState('');
  const [saving, setSaving] = useState(false);

  function reset() {
    setValor('');
    setSaving(false);
  }

  function handleClose() {
    reset();
    onClose();
  }

  async function handleSave() {
    const parsedValor = parseFloat(valor.replace(',', '.'));

    if (!parsedValor || parsedValor <= 0) {
      Alert.alert('Atenção', 'Informe um valor válido.');
      return;
    }

    if (parsedValor > currentDebt) {
      Alert.alert(
        'Atenção',
        `O valor não pode ser maior que o saldo devedor (${currentDebt.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}).`,
      );
      return;
    }

    setSaving(true);

    try {
      // Insere o pagamento
      const {error: paymentError} = await supabase.from('payments').insert([
        {
          loan_id: loanId,
          agreement_id: agreementId ?? null,
          customer_id: customerId,
          valor: parsedValor,
        },
      ]);

      if (paymentError) {
        Alert.alert('Erro', paymentError.message);
        setSaving(false);
        return;
      }

      // Verifica se a dívida foi quitada
      const remainingDebt = currentDebt - parsedValor;

      if (remainingDebt <= 0) {
        // Atualiza status do empréstimo para finalizado
        const {error: updateError} = await supabase
          .from('loans')
          .update({
            status: 'finalizado',
            data_pagamento: new Date().toISOString().split('T')[0],
          })
          .eq('id', loanId);

        if (updateError) {
          console.error('Erro ao finalizar empréstimo:', updateError);
        }
      }

      Alert.alert('Sucesso', 'Pagamento registrado!');
      reset();
      onSuccess();
    } catch (err) {
      console.error('Erro inesperado ao registrar pagamento:', err);
      Alert.alert('Erro', 'Ocorreu um erro inesperado.');
    } finally {
      setSaving(false);
    }
  }

  const formattedDebt = currentDebt.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalWrapper}>
        <Pressable style={{flex: 1}} onPress={handleClose} />
        <View style={styles.modalContent}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled">
            <View style={styles.dragIndicator} />

            <CustomText
              text="Registrar Pagamento"
              fontSize="lg"
              weight="bold"
              style={{marginBottom: theme.spacing.md}}
            />

            <View style={styles.debtBox}>
              <CustomText
                text="Saldo Devedor Atual"
                fontSize="xs"
                color={theme.colors.purpleSecondary}
              />
              <CustomText
                text={formattedDebt}
                fontSize="lg"
                weight="bold"
                color={theme.colors.danger}
              />
            </View>

            <CustomText
              text="Valor do Pagamento (R$)"
              fontSize="xs"
              color={theme.colors.purpleSecondary}
              style={{marginTop: theme.spacing.md}}
            />
            <TextInput
              placeholder="0,00"
              keyboardType="numeric"
              value={valor}
              onChangeText={setValor}
              style={styles.modalInput}
              editable={!saving}
            />

            {saving ? (
              <ActivityIndicator
                size="large"
                color={theme.colors.green}
                style={{marginVertical: theme.spacing.md}}
              />
            ) : (
              <CustomButton text="Confirmar Pagamento" onPress={handleSave} />
            )}

            <CustomButton
              text="Cancelar"
              onPress={handleClose}
              backgroundColor="transparent"
              textColor={theme.colors.danger}
              style={{marginTop: 10}}
              disabled={saving}
            />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    maxHeight: '90%',
    width: '100%',
    elevation: 25,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -10},
    shadowOpacity: 0.12,
    shadowRadius: 10,
  },
  dragIndicator: {
    width: 40,
    height: 5,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 15,
  },
  debtBox: {
    backgroundColor: theme.colors.page,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    gap: theme.spacing.xs,
    alignItems: 'center',
  },
  modalInput: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.green,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 20,
    color: '#333',
  },
});
