import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppButton from '../components/AppButton';
import { EmptyState } from '../components/Feedback';
import { useAuth } from '../contexts/AuthContext';
import { API_URL } from '../api/client';
import { iniciais } from '../utils/formatadores';
import { colors, radius, shadow, spacing, typography } from '../theme';

export default function PerfilScreen({ navigation }) {
  const { user, autenticado, ehProfessor, logout } = useAuth();

  if (!autenticado) {
    return (
      <View style={styles.tela}>
        <EmptyState
          icone="person-circle-outline"
          titulo="Você não está autenticado"
          descricao="Entre com sua conta para publicar posts e acessar o painel administrativo."
          acao={
            <AppButton
              titulo="Entrar"
              icone="log-in-outline"
              onPress={() => navigation.navigate('Login')}
            />
          }
        />
        <Text style={styles.rodape}>API: {API_URL}</Text>
      </View>
    );
  }

  const confirmarSaida = () => {
    Alert.alert('Sair da conta', 'Deseja encerrar a sessão neste aparelho?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: logout }
    ]);
  };

  return (
    <ScrollView style={styles.tela} contentContainerStyle={styles.conteudo}>
      <View style={styles.card}>
        <View style={styles.avatar}>
          <Text style={styles.avatarTexto}>{iniciais(user.nome)}</Text>
        </View>

        <Text style={styles.nome}>{user.nome}</Text>
        <Text style={styles.email}>{user.email}</Text>

        <View style={[styles.badge, ehProfessor ? styles.badgeProfessor : styles.badgeAluno]}>
          <Ionicons
            name={ehProfessor ? 'briefcase-outline' : 'school-outline'}
            size={14}
            color={ehProfessor ? colors.primaryDark : colors.success}
          />
          <Text style={[styles.badgeTexto, { color: ehProfessor ? colors.primaryDark : colors.success }]}>
            {ehProfessor ? 'Professor' : 'Aluno'}
          </Text>
        </View>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitulo}>Permissões desta conta</Text>
        <Linha icone="eye-outline" texto="Ler todos os posts publicados" ativo />
        <Linha icone="create-outline" texto="Criar e editar postagens" ativo={ehProfessor} />
        <Linha icone="people-outline" texto="Administrar professores e alunos" ativo={ehProfessor} />
      </View>

      {ehProfessor ? (
        <AppButton
          titulo="Abrir painel administrativo"
          icone="grid-outline"
          variante="secondary"
          onPress={() => navigation.navigate('Admin')}
          style={styles.acao}
        />
      ) : null}

      <AppButton
        titulo="Sair da conta"
        icone="log-out-outline"
        variante="danger"
        onPress={confirmarSaida}
        style={styles.acao}
      />

      <Text style={styles.rodape}>API: {API_URL}</Text>
    </ScrollView>
  );
}

function Linha({ icone, texto, ativo }) {
  return (
    <View style={styles.linha}>
      <Ionicons
        name={ativo ? 'checkmark-circle' : 'close-circle-outline'}
        size={18}
        color={ativo ? colors.success : colors.textMuted}
      />
      <Ionicons name={icone} size={16} color={colors.textMuted} />
      <Text style={[styles.linhaTexto, !ativo && styles.linhaInativa]}>{texto}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: colors.background },
  conteudo: { padding: spacing.lg, paddingBottom: spacing.xxl },
  card: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
    ...shadow.card
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: radius.pill,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md
  },
  avatarTexto: { color: colors.primaryDark, fontWeight: '700', fontSize: 24 },
  nome: { ...typography.subtitle, fontSize: 19 },
  email: { ...typography.small, marginTop: 2 },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    marginTop: spacing.md
  },
  badgeProfessor: { backgroundColor: colors.primarySoft },
  badgeAluno: { backgroundColor: colors.successSoft },
  badgeTexto: { fontSize: 12, fontWeight: '700' },
  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginTop: spacing.lg,
    gap: spacing.md,
    ...shadow.card
  },
  infoTitulo: { ...typography.label, marginBottom: spacing.xs },
  linha: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  linhaTexto: { ...typography.body, flex: 1, fontSize: 14 },
  linhaInativa: { color: colors.textMuted, textDecorationLine: 'line-through' },
  acao: { marginTop: spacing.lg },
  rodape: { ...typography.small, textAlign: 'center', marginTop: spacing.xl, fontSize: 11 }
});
