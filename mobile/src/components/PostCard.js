import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, shadow, spacing, typography } from '../theme';
import { formatarData, resumir } from '../utils/formatadores';

export default function PostCard({ post, onPress, acoes }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Abrir post ${post.titulo}`}
      style={({ pressed }) => [styles.card, pressed && styles.pressionado]}
    >
      <Text style={styles.titulo} numberOfLines={2}>
        {post.titulo}
      </Text>

      <View style={styles.meta}>
        <Ionicons name="person-circle-outline" size={15} color={colors.textMuted} />
        <Text style={styles.metaTexto}>{post.autor}</Text>
        <Text style={styles.metaSeparador}>•</Text>
        <Text style={styles.metaTexto}>{formatarData(post.createdAt)}</Text>
      </View>

      <Text style={styles.resumo} numberOfLines={3}>
        {resumir(post.conteudo, 160)}
      </Text>

      {acoes ? <View style={styles.acoes}>{acoes}</View> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadow.card
  },
  pressionado: { opacity: 0.9, borderColor: colors.primary },
  titulo: { ...typography.subtitle, marginBottom: spacing.xs },
  meta: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginBottom: spacing.sm },
  metaTexto: { ...typography.small },
  metaSeparador: { ...typography.small },
  resumo: { ...typography.body, color: colors.textMuted },
  acoes: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border
  }
});
