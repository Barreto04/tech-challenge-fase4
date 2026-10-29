import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../theme';
import AppButton from './AppButton';

export default function Paginador({ meta, onAnterior, onProxima }) {
  if (!meta || meta.totalPages <= 1) return null;

  return (
    <View style={styles.wrapper}>
      <AppButton
        titulo="Anterior"
        icone="chevron-back"
        variante="secondary"
        compacto
        desabilitado={!meta.hasPrevPage}
        onPress={onAnterior}
      />
      <Text style={styles.indicador}>
        Página {meta.page} de {meta.totalPages}
      </Text>
      <AppButton
        titulo="Próxima"
        icone="chevron-forward"
        variante="secondary"
        compacto
        desabilitado={!meta.hasNextPage}
        onPress={onProxima}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.lg,
    gap: spacing.md
  },
  indicador: { ...typography.small, fontWeight: '600' }
});
