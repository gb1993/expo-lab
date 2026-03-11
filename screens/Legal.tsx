import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import CustomText from '../components/CustomText';
import {theme} from '../themes';

export default function Legal() {
  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <CustomText
          fontSize="lg"
          weight="bold"
          text="Termos de Uso e Políticas"
          color={theme.colors.primary}
          style={styles.mainTitle}
        />

        {/* Aviso Legal */}
        <View style={styles.section}>
          <CustomText
            fontSize="md"
            weight="bold"
            text="AVISO IMPORTANTE"
            color={theme.colors.primary}
            style={styles.sectionTitle}
          />
          <CustomText
            fontSize="sm"
            text="Este aplicativo é uma ferramenta de gestão destinada exclusivamente ao registro e organização de informações financeiras inseridas pelo próprio usuário."
            color={theme.colors.primary}
            style={styles.paragraph}
          />
          <CustomText
            fontSize="sm"
            text="A plataforma:"
            color={theme.colors.primary}
            style={styles.paragraph}
          />
          <CustomText
            fontSize="sm"
            text="• não intermedia empréstimos"
            color={theme.colors.primary}
            style={styles.listItem}
          />
          <CustomText
            fontSize="sm"
            text="• não realiza transações financeiras"
            color={theme.colors.primary}
            style={styles.listItem}
          />
          <CustomText
            fontSize="sm"
            text="• não participa de cobranças entre usuários e terceiros"
            color={theme.colors.primary}
            style={styles.listItem}
          />
          <CustomText
            fontSize="sm"
            text="O usuário é o único responsável pelos dados inseridos, pelas condições de pagamento acordadas com seus clientes e pelo cumprimento da legislação aplicável."
            color={theme.colors.primary}
            style={styles.paragraph}
          />
          <CustomText
            fontSize="sm"
            text="O aplicativo não se responsabiliza por relações comerciais estabelecidas entre o usuário e terceiros."
            color={theme.colors.primary}
            style={styles.paragraph}
          />
        </View>

        {/* LGPD */}
        <View style={styles.section}>
          <CustomText
            fontSize="md"
            weight="bold"
            text="POLÍTICA DE PRIVACIDADE"
            color={theme.colors.primary}
            style={styles.sectionTitle}
          />
          <CustomText
            fontSize="sm"
            text="Esta Política de Privacidade descreve como as informações são coletadas, utilizadas e protegidas ao utilizar o aplicativo."
            color={theme.colors.primary}
            style={styles.paragraph}
          />

          <CustomText
            fontSize="sm"
            weight="bold"
            text="1. Coleta de Informações"
            color={theme.colors.primary}
            style={styles.topicTitle}
          />
          <CustomText
            fontSize="sm"
            text="O aplicativo pode coletar informações fornecidas diretamente pelo usuário, incluindo:"
            color={theme.colors.primary}
            style={styles.paragraph}
          />
          <CustomText
            fontSize="sm"
            text="• nome"
            color={theme.colors.primary}
            style={styles.listItem}
          />
          <CustomText
            fontSize="sm"
            text="• telefone"
            color={theme.colors.primary}
            style={styles.listItem}
          />
          <CustomText
            fontSize="sm"
            text="• registros de clientes"
            color={theme.colors.primary}
            style={styles.listItem}
          />
          <CustomText
            fontSize="sm"
            text="• valores de dívidas ou vendas a prazo"
            color={theme.colors.primary}
            style={styles.listItem}
          />
          <CustomText
            fontSize="sm"
            text="• histórico de pagamentos"
            color={theme.colors.primary}
            style={styles.listItem}
          />
          <CustomText
            fontSize="sm"
            text="• dados de login e conta"
            color={theme.colors.primary}
            style={styles.listItem}
          />
          <CustomText
            fontSize="sm"
            text="Essas informações são inseridas diretamente pelo usuário com a finalidade de organizar e gerenciar registros financeiros."
            color={theme.colors.primary}
            style={styles.paragraph}
          />

          <CustomText
            fontSize="sm"
            weight="bold"
            text="2. Finalidade do Tratamento de Dados"
            color={theme.colors.primary}
            style={styles.topicTitle}
          />
          <CustomText
            fontSize="sm"
            text="Os dados coletados são utilizados exclusivamente para:"
            color={theme.colors.primary}
            style={styles.paragraph}
          />
          <CustomText
            fontSize="sm"
            text="• permitir o funcionamento do aplicativo"
            color={theme.colors.primary}
            style={styles.listItem}
          />
          <CustomText
            fontSize="sm"
            text="• armazenar registros de controle financeiro"
            color={theme.colors.primary}
            style={styles.listItem}
          />
          <CustomText
            fontSize="sm"
            text="• fornecer relatórios e histórico de transações registradas"
            color={theme.colors.primary}
            style={styles.listItem}
          />
          <CustomText
            fontSize="sm"
            text="• melhorar a experiência de uso da plataforma"
            color={theme.colors.primary}
            style={styles.listItem}
          />

          <CustomText
            fontSize="sm"
            weight="bold"
            text="3. Responsabilidade sobre os Dados Inseridos"
            color={theme.colors.primary}
            style={styles.topicTitle}
          />
          <CustomText
            fontSize="sm"
            text="O usuário é responsável pelos dados pessoais que inserir na plataforma, incluindo informações relacionadas a seus clientes ou terceiros."
            color={theme.colors.primary}
            style={styles.paragraph}
          />
          <CustomText
            fontSize="sm"
            text="O usuário declara que possui base legal para registrar essas informações conforme a Lei Geral de Proteção de Dados (Lei nº 13.709/2018)."
            color={theme.colors.primary}
            style={styles.paragraph}
          />

          <CustomText
            fontSize="sm"
            weight="bold"
            text="4. Compartilhamento de Dados"
            color={theme.colors.primary}
            style={styles.topicTitle}
          />
          <CustomText
            fontSize="sm"
            text="A plataforma não vende, aluga ou compartilha dados pessoais com terceiros, exceto quando:"
            color={theme.colors.primary}
            style={styles.paragraph}
          />
          <CustomText
            fontSize="sm"
            text="• necessário para funcionamento técnico do serviço"
            color={theme.colors.primary}
            style={styles.listItem}
          />
          <CustomText
            fontSize="sm"
            text="• exigido por obrigação legal ou ordem judicial"
            color={theme.colors.primary}
            style={styles.listItem}
          />

          <CustomText
            fontSize="sm"
            weight="bold"
            text="5. Segurança das Informações"
            color={theme.colors.primary}
            style={styles.topicTitle}
          />
          <CustomText
            fontSize="sm"
            text="São adotadas medidas técnicas e administrativas razoáveis para proteger as informações armazenadas contra acesso não autorizado, perda ou alteração."
            color={theme.colors.primary}
            style={styles.paragraph}
          />

          <CustomText
            fontSize="sm"
            weight="bold"
            text="6. Armazenamento de Dados"
            color={theme.colors.primary}
            style={styles.topicTitle}
          />
          <CustomText
            fontSize="sm"
            text="Os dados permanecerão armazenados enquanto a conta do usuário estiver ativa ou pelo período necessário para cumprimento de obrigações legais."
            color={theme.colors.primary}
            style={styles.paragraph}
          />

          <CustomText
            fontSize="sm"
            weight="bold"
            text="7. Direitos do Usuário"
            color={theme.colors.primary}
            style={styles.topicTitle}
          />
          <CustomText
            fontSize="sm"
            text="Nos termos da Lei Geral de Proteção de Dados (Lei nº 13.709/2018), o usuário pode solicitar:"
            color={theme.colors.primary}
            style={styles.paragraph}
          />
          <CustomText
            fontSize="sm"
            text="• acesso aos dados armazenados"
            color={theme.colors.primary}
            style={styles.listItem}
          />
          <CustomText
            fontSize="sm"
            text="• correção de informações"
            color={theme.colors.primary}
            style={styles.listItem}
          />
          <CustomText
            fontSize="sm"
            text="• exclusão de dados quando aplicável"
            color={theme.colors.primary}
            style={styles.listItem}
          />

          <CustomText
            fontSize="sm"
            weight="bold"
            text="8. Alterações nesta Política"
            color={theme.colors.primary}
            style={styles.topicTitle}
          />
          <CustomText
            fontSize="sm"
            text="Esta Política de Privacidade poderá ser atualizada periodicamente para refletir melhorias ou mudanças no serviço."
            color={theme.colors.primary}
            style={styles.paragraph}
          />
        </View>

        {/* Termos de Uso */}
        <View style={styles.section}>
          <CustomText
            fontSize="md"
            weight="bold"
            text="TERMOS DE USO DO APLICATIVO"
            color={theme.colors.primary}
            style={styles.sectionTitle}
          />

          <CustomText
            fontSize="sm"
            weight="bold"
            text="1. Aceitação dos Termos"
            color={theme.colors.primary}
            style={styles.topicTitle}
          />
          <CustomText
            fontSize="sm"
            text="Ao acessar ou utilizar este aplicativo, o usuário declara que leu, compreendeu e concorda com os presentes Termos de Uso. Caso não concorde, não deverá utilizar o aplicativo."
            color={theme.colors.primary}
            style={styles.paragraph}
          />

          <CustomText
            fontSize="sm"
            weight="bold"
            text="2. Descrição do Serviço"
            color={theme.colors.primary}
            style={styles.topicTitle}
          />
          <CustomText
            fontSize="sm"
            text="O aplicativo é uma ferramenta digital para gestão de registros financeiros, incluindo vendas a prazo, fiado, controle de pagamentos e acompanhamento de contas a receber."
            color={theme.colors.primary}
            style={styles.paragraph}
          />
          <CustomText
            fontSize="sm"
            text="Funciona exclusivamente como ferramenta de registro, sem intermediação de crédito ou movimentação de dinheiro."
            color={theme.colors.primary}
            style={styles.paragraph}
          />

          <CustomText
            fontSize="sm"
            weight="bold"
            text="3. Natureza da Plataforma"
            color={theme.colors.primary}
            style={styles.topicTitle}
          />
          <CustomText
            fontSize="sm"
            text="O aplicativo não é instituição financeira e não oferece serviços regulados pela Banco Central do Brasil. Não realiza transações financeiras ou intermediação de empréstimos."
            color={theme.colors.primary}
            style={styles.paragraph}
          />

          <CustomText
            fontSize="sm"
            weight="bold"
            text="4. Responsabilidade do Usuário"
            color={theme.colors.primary}
            style={styles.topicTitle}
          />
          <CustomText
            fontSize="sm"
            text="O usuário é responsável por todas as informações inseridas, incluindo valores, condições de pagamento e histórico de clientes. O usuário declara que utilizará o app em conformidade com a legislação brasileira."
            color={theme.colors.primary}
            style={styles.paragraph}
          />

          <CustomText
            fontSize="sm"
            weight="bold"
            text="5. Cobrança e Assinatura"
            color={theme.colors.primary}
            style={styles.topicTitle}
          />
          <CustomText
            fontSize="sm"
            text="O acesso a funcionalidades avançadas pode depender de assinatura paga. O pagamento refere-se apenas ao uso do software, sem participação ou comissão sobre dívidas registradas."
            color={theme.colors.primary}
            style={styles.paragraph}
          />

          <CustomText
            fontSize="sm"
            weight="bold"
            text="6. Indisponibilidade do Sistema"
            color={theme.colors.primary}
            style={styles.topicTitle}
          />
          <CustomText
            fontSize="sm"
            text="O app pode sofrer interrupções temporárias por manutenção, falhas técnicas ou eventos fora do controle do fornecedor."
            color={theme.colors.primary}
            style={styles.paragraph}
          />

          <CustomText
            fontSize="sm"
            weight="bold"
            text="7. Limitação de Responsabilidade"
            color={theme.colors.primary}
            style={styles.topicTitle}
          />
          <CustomText
            fontSize="sm"
            text="A plataforma não se responsabiliza por relações comerciais, inadimplência ou decisões baseadas no aplicativo. Em nenhuma hipótese a responsabilidade da plataforma excederá o valor pago pelo usuário nos últimos 12 meses."
            color={theme.colors.primary}
            style={styles.paragraph}
          />

          <CustomText
            fontSize="sm"
            weight="bold"
            text="8. Backup e Segurança de Dados"
            color={theme.colors.primary}
            style={styles.topicTitle}
          />
          <CustomText
            fontSize="sm"
            text="Embora a plataforma adote medidas de segurança e backup, o usuário é responsável por manter cópias das informações inseridas."
            color={theme.colors.primary}
            style={styles.paragraph}
          />

          <CustomText
            fontSize="sm"
            weight="bold"
            text="9. Suspensão de Conta por Uso Indevido"
            color={theme.colors.primary}
            style={styles.topicTitle}
          />
          <CustomText
            fontSize="sm"
            text="Contas que utilizem o app para atividades ilegais, fraude, cobrança abusiva ou exposição indevida de terceiros poderão ser suspensas ou encerradas."
            color={theme.colors.primary}
            style={styles.paragraph}
          />

          <CustomText
            fontSize="sm"
            weight="bold"
            text="10. Modificação do Serviço"
            color={theme.colors.primary}
            style={styles.topicTitle}
          />
          <CustomText
            fontSize="sm"
            text="A plataforma pode alterar, atualizar ou descontinuar funcionalidades a qualquer momento para melhorias ou adequação legal."
            color={theme.colors.primary}
            style={styles.paragraph}
          />

          <CustomText
            fontSize="sm"
            weight="bold"
            text="11. Uso Adequado"
            color={theme.colors.primary}
            style={styles.topicTitle}
          />
          <CustomText
            fontSize="sm"
            text="O usuário compromete-se a não usar o app para práticas ilegais, constrangimento de terceiros, violação de privacidade ou fraude."
            color={theme.colors.primary}
            style={styles.paragraph}
          />

          <CustomText
            fontSize="sm"
            weight="bold"
            text="12. Proteção de Dados"
            color={theme.colors.primary}
            style={styles.topicTitle}
          />
          <CustomText
            fontSize="sm"
            text="O tratamento de dados segue a Lei Geral de Proteção de Dados (Lei nº 13.709/2018). O usuário é responsável pela veracidade dos dados inseridos."
            color={theme.colors.primary}
            style={styles.paragraph}
          />

          <CustomText
            fontSize="sm"
            weight="bold"
            text="13. Alterações nos Termos de Uso"
            color={theme.colors.primary}
            style={styles.topicTitle}
          />
          <CustomText
            fontSize="sm"
            text="Os termos podem ser atualizados, e o uso contínuo indica aceitação."
            color={theme.colors.primary}
            style={styles.paragraph}
          />

          <CustomText
            fontSize="sm"
            weight="bold"
            text="14. Legislação Aplicável"
            color={theme.colors.primary}
            style={styles.topicTitle}
          />
          <CustomText
            fontSize="sm"
            text="Regido pelas leis da Brasil, incluindo o Código de Defesa do Consumidor (Lei nº 8.078/1990)."
            color={theme.colors.primary}
            style={styles.paragraph}
          />

          <CustomText
            fontSize="sm"
            weight="bold"
            text="15. Foro"
            color={theme.colors.primary}
            style={styles.topicTitle}
          />
          <CustomText
            fontSize="sm"
            text="Fica eleito o foro da comarca do domicílio do usuário ou outro competente para resolver disputas."
            color={theme.colors.primary}
            style={styles.paragraph}
          />
        </View>

        {/* Contrato de Assinatura */}
        <View style={styles.section}>
          <CustomText
            fontSize="md"
            weight="bold"
            text="CONTRATO DE ASSINATURA DO SOFTWARE"
            color={theme.colors.primary}
            style={styles.sectionTitle}
          />

          <CustomText
            fontSize="sm"
            weight="bold"
            text="1. Objeto"
            color={theme.colors.primary}
            style={styles.topicTitle}
          />
          <CustomText
            fontSize="sm"
            text="O presente contrato tem como objeto a concessão de licença de uso do aplicativo, que consiste em uma ferramenta digital para organização e controle de registros financeiros, incluindo vendas a prazo e fiado."
            color={theme.colors.primary}
            style={styles.paragraph}
          />

          <CustomText
            fontSize="sm"
            weight="bold"
            text="2. Licença de Uso"
            color={theme.colors.primary}
            style={styles.topicTitle}
          />
          <CustomText
            fontSize="sm"
            text="O usuário recebe uma licença limitada, não exclusiva e intransferível para utilizar o aplicativo durante o período de assinatura contratado. A licença refere-se apenas ao uso do software, não havendo transferência de propriedade intelectual."
            color={theme.colors.primary}
            style={styles.paragraph}
          />

          <CustomText
            fontSize="sm"
            weight="bold"
            text="3. Assinatura e Pagamento"
            color={theme.colors.primary}
            style={styles.topicTitle}
          />
          <CustomText
            fontSize="sm"
            text="O acesso ao aplicativo poderá depender do pagamento de assinatura periódica. A assinatura garante acesso às funcionalidades da plataforma durante o período contratado. O pagamento refere-se exclusivamente ao uso do software, sem participação, comissão ou intermediação sobre dívidas registradas pelo usuário."
            color={theme.colors.primary}
            style={styles.paragraph}
          />

          <CustomText
            fontSize="sm"
            weight="bold"
            text="4. Cancelamento"
            color={theme.colors.primary}
            style={styles.topicTitle}
          />
          <CustomText
            fontSize="sm"
            text="O usuário poderá cancelar a assinatura a qualquer momento, permanecendo com acesso até o final do período já pago."
            color={theme.colors.primary}
            style={styles.paragraph}
          />

          <CustomText
            fontSize="sm"
            weight="bold"
            text="5. Responsabilidade do Usuário"
            color={theme.colors.primary}
            style={styles.topicTitle}
          />
          <CustomText
            fontSize="sm"
            text="O usuário é responsável por todas as informações inseridas na plataforma, incluindo registros de dívidas, valores, condições de pagamento e histórico de clientes. O usuário declara que utilizará o aplicativo em conformidade com a legislação brasileira, incluindo normas relacionadas à cobrança de dívidas e relações de consumo."
            color={theme.colors.primary}
            style={styles.paragraph}
          />

          <CustomText
            fontSize="sm"
            weight="bold"
            text="6. Limitação de Responsabilidade"
            color={theme.colors.primary}
            style={styles.topicTitle}
          />
          <CustomText
            fontSize="sm"
            text="O software é fornecido como ferramenta de apoio à organização de dados. A plataforma não se responsabiliza por decisões comerciais tomadas pelo usuário nem por relações estabelecidas com terceiros. Em nenhuma hipótese a responsabilidade da plataforma excederá o valor total pago pelo usuário nos últimos 12 meses de utilização do serviço."
            color={theme.colors.primary}
            style={styles.paragraph}
          />

          <CustomText
            fontSize="sm"
            weight="bold"
            text="7. Indisponibilidade do Sistema"
            color={theme.colors.primary}
            style={styles.topicTitle}
          />
          <CustomText
            fontSize="sm"
            text="A plataforma poderá sofrer interrupções temporárias por manutenção, falhas técnicas ou eventos fora do controle do fornecedor, não sendo garantida disponibilidade ininterrupta do serviço."
            color={theme.colors.primary}
            style={styles.paragraph}
          />

          <CustomText
            fontSize="sm"
            weight="bold"
            text="8. Backup e Dados do Usuário"
            color={theme.colors.primary}
            style={styles.topicTitle}
          />
          <CustomText
            fontSize="sm"
            text="Embora a plataforma adote medidas de segurança e backup, o usuário é responsável por manter cópias e controle das informações inseridas no sistema."
            color={theme.colors.primary}
            style={styles.paragraph}
          />

          <CustomText
            fontSize="sm"
            weight="bold"
            text="9. Suspensão de Conta por Uso Indevido"
            color={theme.colors.primary}
            style={styles.topicTitle}
          />
          <CustomText
            fontSize="sm"
            text="A plataforma poderá suspender ou encerrar contas que utilizem o serviço para atividades ilegais, fraudulentas ou que violem estes termos de uso, incluindo tentativa de cobrança abusiva ou exposição indevida de terceiros."
            color={theme.colors.primary}
            style={styles.paragraph}
          />

          <CustomText
            fontSize="sm"
            weight="bold"
            text="10. Modificação do Serviço"
            color={theme.colors.primary}
            style={styles.topicTitle}
          />
          <CustomText
            fontSize="sm"
            text="A plataforma poderá modificar, atualizar ou descontinuar funcionalidades do serviço a qualquer momento, visando melhorias, ajustes operacionais ou adequação à legislação vigente."
            color={theme.colors.primary}
            style={styles.paragraph}
          />

          <CustomText
            fontSize="sm"
            weight="bold"
            text="11. Propriedade Intelectual"
            color={theme.colors.primary}
            style={styles.topicTitle}
          />
          <CustomText
            fontSize="sm"
            text="Todos os direitos sobre o aplicativo, incluindo software, design e funcionalidades, pertencem ao desenvolvedor da plataforma."
            color={theme.colors.primary}
            style={styles.paragraph}
          />

          <CustomText
            fontSize="sm"
            weight="bold"
            text="12. Legislação Aplicável"
            color={theme.colors.primary}
            style={styles.topicTitle}
          />
          <CustomText
            fontSize="sm"
            text="Este contrato será regido pelas leis da Brasil, incluindo disposições do Código de Defesa do Consumidor (Lei nº 8.078/1990) quando aplicáveis."
            color={theme.colors.primary}
            style={styles.paragraph}
          />

          <CustomText
            fontSize="sm"
            weight="bold"
            text="13. Foro"
            color={theme.colors.primary}
            style={styles.topicTitle}
          />
          <CustomText
            fontSize="sm"
            text="Fica eleito o foro da comarca do domicílio do usuário ou outro foro competente conforme a legislação brasileira para dirimir eventuais controvérsias decorrentes deste contrato."
            color={theme.colors.primary}
            style={styles.paragraph}
          />
        </View>

        <View style={{height: theme.spacing.xl}} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.page,
  },
  scrollContent: {
    flexGrow: 1,
    padding: theme.spacing.lg,
  },
  mainTitle: {
    marginBottom: theme.spacing.xl,
    textAlign: 'center',
  },
  section: {
    marginBottom: theme.spacing.xl,
    backgroundColor: theme.colors.secondary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    boxShadow: theme.boxShadow.sm,
  },
  sectionTitle: {
    marginBottom: theme.spacing.sm,
  },
  topicTitle: {
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  paragraph: {
    marginBottom: theme.spacing.sm,
    lineHeight: 20,
  },
  listItem: {
    marginBottom: theme.spacing.xs,
    marginLeft: theme.spacing.md,
    lineHeight: 20,
  },
});
