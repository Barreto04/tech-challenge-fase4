import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { colors, radius, shadow, spacing, typography } from '../../theme';

const atalhos = [
  {
    rota: 'AdminPosts',
    params: {},
    icone: 'documents-outline',
    titulo: 'Postagens',
    descricao: 'Criar, editar e excluir os posts do blog'
  },
  {
    rota: 'ProfessorList',
    params: {},
    icone: 'briefcase-outline',
    titulo: 'Professores',
    descricao: 'Cadastrar, editar e remover docentes'
  },
  {
    rota: 'AlunoList',
    params: {},
    icone: 'people-outline',
    titulo: 'Alunos',
    descricao: 'Cadastrar, editar e remover estudantes'
  }
];

export default function AdminHomeScreen({ navigation }) {
  const { user } = useAuth();

  return (
    <ScrollView style={styles.tela} contentContainerStyle={styles.conteudo}>
      <Text style={styles.titulo}>Painel administrativo</Text>
      <Text style={styles.subtitulo}>
        {user?.nome} · acesso de professor
      </Text>

      <View style={styles.grade}>
        {atalhos.map((atalho) => (
          <Pressable
            key={atalho.rota}
            onPress={() => navigation.navigate(atalho.rota, atalho.params)}
            accessibilityRole="button"
            accessibilityLabel={atalho.titulo}
            style={({ pressed }) => [styles.card, pressed && styles.cardPressionado]}
          >
            <View style={styles.icone}>
              <Ionicons name={atalho.icone} size={22} color={colors.primary} />
            </View>
            <View style={styles.cardTexto}>
              <Text style={styles.cardTitulo}>{atalho.titulo}</Text>
              <Text style={styles.cardDescricao}>{atalho.descricao}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: colors.background },
  conteudo: { padding: spacing.lg },
  titulo: { ...typography.title },
  subtitulo: { ...typography.small, marginTop: 2 },
  grade: { marginTop: spacing.xl, gap: spacing.md },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    ...shadow.card
  },
  cardPressionado: { borderColor: colors.primary, opacity: 0.95 },
  icone: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center'
  },
  cardTexto: { flex: 1 },
  cardTitulo: { ...typography.subtitle, fontSize: 16 },
  cardDescricao: { ...typography.small, marginTop: 2 }
});
