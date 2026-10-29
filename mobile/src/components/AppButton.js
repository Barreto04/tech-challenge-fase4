import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '../theme';

const variantes = {
  primary: { fundo: colors.primary, texto: colors.textInverse, borda: colors.primary },
  secondary: { fundo: colors.surface, texto: colors.primary, borda: colors.primary },
  danger: { fundo: colors.danger, texto: colors.textInverse, borda: colors.danger },
  ghost: { fundo: 'transparent', texto: colors.textMuted, borda: 'transparent' }
};

export default function AppButton({
  titulo,
  onPress,
  variante = 'primary',
  icone,
  carregando = false,
  desabilitado = false,
  compacto = false,
  style
}) {
  const estilo = variantes[variante] || variantes.primary;
  const inativo = desabilitado || carregando;

  return (
    <Pressable
      onPress={onPress}
      disabled={inativo}
      accessibilityRole="button"
      accessibilityLabel={titulo}
      style={({ pressed }) => [
        styles.base,
        compacto && styles.compacto,
        { backgroundColor: estilo.fundo, borderColor: estilo.borda },
        pressed && !inativo && styles.pressionado,
        inativo && styles.inativo,
        style
      ]}
    >
      {carregando ? (
        <ActivityIndicator color={estilo.texto} />
      ) : (
        <View style={styles.conteudo}>
          {icone ? <Ionicons name={icone} size={compacto ? 15 : 18} color={estilo.texto} /> : null}
          <Text style={[styles.texto, compacto && styles.textoCompacto, { color: estilo.texto }]}>{titulo}</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 48,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg
  },
  compacto: { minHeight: 36, paddingHorizontal: spacing.md, borderRadius: radius.sm },
  conteudo: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  texto: { fontSize: 15, fontWeight: '600' },
  textoCompacto: { fontSize: 13 },
  pressionado: { opacity: 0.85 },
  inativo: { opacity: 0.5 }
});
