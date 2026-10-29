import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, typography } from '../theme';
import AppButton from './AppButton';

export function Loading({ texto = 'Carregando...' }) {
  return (
    <View style={styles.centro}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.textoCentro}>{texto}</Text>
    </View>
  );
}

export function EmptyState({ icone = 'document-text-outline', titulo, descricao, acao }) {
  return (
    <View style={styles.centro}>
      <View style={styles.iconeCirculo}>
        <Ionicons name={icone} size={30} color={colors.primary} />
      </View>
      <Text style={styles.tituloVazio}>{titulo}</Text>
      {descricao ? <Text style={styles.textoCentro}>{descricao}</Text> : null}
      {acao ? <View style={styles.acao}>{acao}</View> : null}
    </View>
  );
}

export function ErrorState({ mensagem, onTentarNovamente }) {
  return (
    <View style={styles.centro}>
      <View style={[styles.iconeCirculo, styles.iconeErro]}>
        <Ionicons name="cloud-offline-outline" size={30} color={colors.danger} />
      </View>
      <Text style={styles.tituloVazio}>Algo deu errado</Text>
      <Text style={styles.textoCentro}>{mensagem}</Text>
      {onTentarNovamente ? (
        <View style={styles.acao}>
          <AppButton titulo="Tentar novamente" icone="refresh" onPress={onTentarNovamente} variante="secondary" />
        </View>
      ) : null}
    </View>
  );
}

export function Alerta({ tipo = 'erro', mensagem, style }) {
  if (!mensagem) return null;

  const cores = {
    erro: { fundo: colors.dangerSoft, texto: colors.danger, icone: 'alert-circle' },
    sucesso: { fundo: colors.successSoft, texto: colors.success, icone: 'checkmark-circle' },
    aviso: { fundo: colors.warningSoft, texto: colors.warning, icone: 'warning' },
    info: { fundo: colors.primarySoft, texto: colors.primaryDark, icone: 'information-circle' }
  }[tipo];

  return (
    <View style={[styles.alerta, { backgroundColor: cores.fundo }, style]}>
      <Ionicons name={cores.icone} size={18} color={cores.texto} />
      <Text style={[styles.alertaTexto, { color: cores.texto }]}>{mensagem}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  centro: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    gap: spacing.sm
  },
  iconeCirculo: {
    width: 64,
    height: 64,
    borderRadius: radius.pill,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm
  },
  iconeErro: { backgroundColor: colors.dangerSoft },
  tituloVazio: { ...typography.subtitle, textAlign: 'center' },
  textoCentro: { ...typography.small, textAlign: 'center' },
  acao: { marginTop: spacing.md },
  alerta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.lg
  },
  alertaTexto: { flex: 1, fontSize: 13, fontWeight: '500' }
});
