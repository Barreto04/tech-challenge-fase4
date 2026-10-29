import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, shadow, spacing, typography } from '../theme';
import { iniciais } from '../utils/formatadores';
import AppButton from './AppButton';

export default function UserRow({ usuario, onEditar, onExcluir }) {
  const detalhe = usuario.role === 'professor' ? usuario.materia : usuario.turma;

  return (
    <View style={styles.linha}>
      <View style={styles.avatar}>
        <Text style={styles.avatarTexto}>{iniciais(usuario.nome)}</Text>
      </View>

      <View style={styles.dados}>
        <Text style={styles.nome} numberOfLines={1}>
          {usuario.nome}
        </Text>
        <Text style={styles.email} numberOfLines={1}>
          {usuario.email}
        </Text>
        {detalhe ? (
          <Text style={styles.detalhe} numberOfLines={1}>
            {usuario.role === 'professor' ? 'Matéria: ' : 'Turma: '}
            {detalhe}
          </Text>
        ) : null}
      </View>

      <View style={styles.acoes}>
        <AppButton titulo="Editar" icone="create-outline" variante="secondary" compacto onPress={onEditar} />
        <AppButton titulo="Excluir" icone="trash-outline" variante="danger" compacto onPress={onExcluir} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadow.card
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatarTexto: { color: colors.primaryDark, fontWeight: '700', fontSize: 15 },
  dados: { flex: 1, minWidth: 0 },
  nome: { ...typography.label, fontSize: 15 },
  email: { ...typography.small },
  detalhe: { ...typography.small, marginTop: 2 },
  acoes: { gap: spacing.xs }
});
