import { StyleSheet, Text, TextInput, View } from 'react-native';
import { colors, radius, spacing, typography } from '../theme';

export default function AppInput({
  label,
  erro,
  ajuda,
  multiline = false,
  style,
  ...props
}) {
  return (
    <View style={[styles.wrapper, style]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        placeholderTextColor={colors.textMuted}
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
        style={[styles.input, multiline && styles.inputMultilinha, erro && styles.inputErro]}
        {...props}
      />
      {erro ? <Text style={styles.erro}>{erro}</Text> : null}
      {!erro && ajuda ? <Text style={styles.ajuda}>{ajuda}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: spacing.lg },
  label: { ...typography.label, marginBottom: spacing.xs },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: 15,
    color: colors.text,
    minHeight: 48
  },
  inputMultilinha: { minHeight: 160, paddingTop: spacing.md },
  inputErro: { borderColor: colors.danger },
  erro: { ...typography.small, color: colors.danger, marginTop: spacing.xs },
  ajuda: { ...typography.small, marginTop: spacing.xs }
});
