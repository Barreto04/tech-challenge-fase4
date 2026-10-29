import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppButton from '../components/AppButton';
import AppInput from '../components/AppInput';
import { Alerta } from '../components/Feedback';
import { useAuth } from '../contexts/AuthContext';
import { ehEmailValido } from '../utils/formatadores';
import { colors, radius, shadow, spacing, typography } from '../theme';

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', senha: '' });
  const [erros, setErros] = useState({});
  const [erroGeral, setErroGeral] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const alterar = (campo) => (valor) => {
    setForm((atual) => ({ ...atual, [campo]: valor }));
    setErros((atual) => ({ ...atual, [campo]: undefined }));
  };

  const validar = () => {
    const novos = {};
    if (!form.email.trim()) novos.email = 'Informe o e-mail';
    else if (!ehEmailValido(form.email)) novos.email = 'E-mail inválido';
    if (!form.senha) novos.senha = 'Informe a senha';

    setErros(novos);
    return Object.keys(novos).length === 0;
  };

  const entrar = async () => {
    setErroGeral('');
    if (!validar()) return;

    setEnviando(true);
    const resultado = await login(form.email.trim(), form.senha);
    setEnviando(false);

    if (!resultado.ok) {
      setErroGeral(resultado.mensagem);
      return;
    }

    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.conteudo} keyboardShouldPersistTaps="handled">
        <View style={styles.marca}>
          <View style={styles.logo}>
            <Ionicons name="school" size={30} color={colors.textInverse} />
          </View>
          <Text style={styles.titulo}>Blog POSTECH</Text>
          <Text style={styles.subtitulo}>Entre para publicar e administrar o conteúdo da turma</Text>
        </View>

        <View style={styles.card}>
          <Alerta tipo="erro" mensagem={erroGeral} />

          <AppInput
            label="E-mail"
            value={form.email}
            onChangeText={alterar('email')}
            placeholder="professor@postech.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            erro={erros.email}
          />

          <View>
            <AppInput
              label="Senha"
              value={form.senha}
              onChangeText={alterar('senha')}
              placeholder="••••••••"
              secureTextEntry={!mostrarSenha}
              autoCapitalize="none"
              erro={erros.senha}
              onSubmitEditing={entrar}
            />
            <Pressable
              style={styles.olho}
              onPress={() => setMostrarSenha((v) => !v)}
              accessibilityLabel={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
              hitSlop={8}
            >
              <Ionicons
                name={mostrarSenha ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color={colors.textMuted}
              />
            </Pressable>
          </View>

          <AppButton titulo="Entrar" icone="log-in-outline" onPress={entrar} carregando={enviando} />

          <AppButton
            titulo="Continuar sem entrar"
            variante="ghost"
            onPress={() => navigation.goBack()}
            style={styles.botaoSecundario}
          />
        </View>

        <View style={styles.dica}>
          <Ionicons name="information-circle-outline" size={16} color={colors.primaryDark} />
          <Text style={styles.dicaTexto}>
            Dados do seed: professor@postech.com / postech2026. Alunos têm acesso apenas de leitura.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  conteudo: { flexGrow: 1, justifyContent: 'center', padding: spacing.xl },
  marca: { alignItems: 'center', marginBottom: spacing.xl },
  logo: {
    width: 64,
    height: 64,
    borderRadius: radius.lg,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md
  },
  titulo: { ...typography.title },
  subtitulo: { ...typography.small, textAlign: 'center', marginTop: spacing.xs },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
    ...shadow.card
  },
  olho: { position: 'absolute', right: spacing.md, top: 38 },
  botaoSecundario: { marginTop: spacing.sm },
  dica: {
    flexDirection: 'row',
    gap: spacing.sm,
    backgroundColor: colors.primarySoft,
    borderRadius: radius.md,
    padding: spacing.md,
    marginTop: spacing.lg
  },
  dicaTexto: { flex: 1, fontSize: 12, color: colors.primaryDark, lineHeight: 18 }
});
