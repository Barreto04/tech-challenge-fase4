import { useEffect, useLayoutEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import AppButton from '../../components/AppButton';
import AppInput from '../../components/AppInput';
import { Alerta, Loading } from '../../components/Feedback';
import { servicePorRole } from '../../api/services';
import { extrairMensagemDeErro } from '../../api/client';
import { ehEmailValido } from '../../utils/formatadores';
import { colors, spacing } from '../../theme';

const textos = {
  professor: { singular: 'professor', campoExtra: 'materia', labelExtra: 'Matéria', placeholderExtra: 'Ex.: Matemática' },
  aluno: { singular: 'aluno', campoExtra: 'turma', labelExtra: 'Turma', placeholderExtra: 'Ex.: 3º ano A' }
};

export default function UserFormScreen({ route, navigation }) {
  const role = route.params?.role || 'professor';
  const id = route.params?.id;
  const edicao = Boolean(id);
  const copy = textos[role];
  const service = servicePorRole(role);

  const [form, setForm] = useState({ nome: '', email: '', senha: '', extra: '' });
  const [erros, setErros] = useState({});
  const [erroGeral, setErroGeral] = useState('');
  const [carregando, setCarregando] = useState(edicao);
  const [salvando, setSalvando] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: `${edicao ? 'Editar' : 'Novo'} ${copy.singular}`
    });
  }, [navigation, edicao, copy.singular]);

  // Carrega os dados atuais quando a tela está em modo de edição
  useEffect(() => {
    if (!edicao) return;

    const carregar = async () => {
      try {
        const { data } = await service.porId(id);
        setForm({
          nome: data.data.nome,
          email: data.data.email,
          senha: '',
          extra: data.data[copy.campoExtra] || ''
        });
      } catch (error) {
        setErroGeral(extrairMensagemDeErro(error, 'Não foi possível carregar o cadastro.'));
      } finally {
        setCarregando(false);
      }
    };

    carregar();
  }, [edicao, id, service, copy.campoExtra]);

  const alterar = (campo) => (valor) => {
    setForm((atual) => ({ ...atual, [campo]: valor }));
    setErros((atual) => ({ ...atual, [campo]: undefined }));
  };

  const validar = () => {
    const novos = {};
    if (!form.nome.trim()) novos.nome = 'Informe o nome';
    if (!form.email.trim()) novos.email = 'Informe o e-mail';
    else if (!ehEmailValido(form.email)) novos.email = 'E-mail inválido';

    // Na edição a senha é opcional: em branco significa "manter a atual"
    if (!edicao && !form.senha) novos.senha = 'Informe a senha';
    else if (form.senha && form.senha.length < 6) novos.senha = 'A senha deve ter no mínimo 6 caracteres';

    setErros(novos);
    return Object.keys(novos).length === 0;
  };

  const salvar = async () => {
    setErroGeral('');
    if (!validar()) return;

    const payload = {
      nome: form.nome.trim(),
      email: form.email.trim().toLowerCase(),
      [copy.campoExtra]: form.extra.trim()
    };
    if (form.senha) payload.senha = form.senha;

    setSalvando(true);
    try {
      if (edicao) await service.atualizar(id, payload);
      else await service.criar(payload);

      navigation.goBack();
    } catch (error) {
      setErroGeral(extrairMensagemDeErro(error, 'Não foi possível salvar o cadastro.'));
    } finally {
      setSalvando(false);
    }
  };

  if (carregando) return <Loading texto="Carregando cadastro..." />;

  return (
    <KeyboardAvoidingView
      style={styles.tela}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      <ScrollView contentContainerStyle={styles.conteudo} keyboardShouldPersistTaps="handled">
        <Alerta tipo="erro" mensagem={erroGeral} />

        <AppInput
          label="Nome completo"
          value={form.nome}
          onChangeText={alterar('nome')}
          placeholder="Nome do cadastro"
          erro={erros.nome}
        />

        <AppInput
          label="E-mail"
          value={form.email}
          onChangeText={alterar('email')}
          placeholder="email@postech.com"
          keyboardType="email-address"
          autoCapitalize="none"
          erro={erros.email}
        />

        <AppInput
          label={copy.labelExtra}
          value={form.extra}
          onChangeText={alterar('extra')}
          placeholder={copy.placeholderExtra}
        />

        <AppInput
          label="Senha"
          value={form.senha}
          onChangeText={alterar('senha')}
          placeholder={edicao ? 'Deixe em branco para manter' : 'Mínimo de 6 caracteres'}
          secureTextEntry
          autoCapitalize="none"
          erro={erros.senha}
          ajuda={edicao ? 'Preencha apenas se quiser trocar a senha.' : undefined}
        />

        <View style={styles.acoes}>
          <AppButton
            titulo="Cancelar"
            variante="secondary"
            onPress={() => navigation.goBack()}
            style={styles.acaoFlex}
          />
          <AppButton
            titulo={edicao ? 'Salvar alterações' : 'Cadastrar'}
            icone="checkmark"
            carregando={salvando}
            onPress={salvar}
            style={styles.acaoFlex}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: colors.background },
  conteudo: { padding: spacing.lg, paddingBottom: spacing.xxl },
  acoes: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.sm },
  acaoFlex: { flex: 1 }
});
