import { useEffect, useLayoutEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import AppButton from '../../components/AppButton';
import AppInput from '../../components/AppInput';
import { Alerta, Loading } from '../../components/Feedback';
import { postService } from '../../api/services';
import { extrairMensagemDeErro } from '../../api/client';
import { useAuth } from '../../contexts/AuthContext';
import { colors, spacing } from '../../theme';

export default function PostFormScreen({ route, navigation }) {
  const id = route.params?.id;
  const edicao = Boolean(id);
  const { user } = useAuth();

  const [form, setForm] = useState({ titulo: '', conteudo: '', autor: user?.nome || '' });
  const [erros, setErros] = useState({});
  const [erroGeral, setErroGeral] = useState('');
  const [carregando, setCarregando] = useState(edicao);
  const [salvando, setSalvando] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({ title: edicao ? 'Editar post' : 'Novo post' });
  }, [navigation, edicao]);

  // No modo edição, carrega os dados atuais do post no formulário
  useEffect(() => {
    if (!edicao) return;

    const carregar = async () => {
      try {
        const { data } = await postService.porId(id);
        setForm({
          titulo: data.data.titulo,
          conteudo: data.data.conteudo,
          autor: data.data.autor
        });
      } catch (error) {
        setErroGeral(extrairMensagemDeErro(error, 'Não foi possível carregar o post.'));
      } finally {
        setCarregando(false);
      }
    };

    carregar();
  }, [edicao, id]);

  const alterar = (campo) => (valor) => {
    setForm((atual) => ({ ...atual, [campo]: valor }));
    setErros((atual) => ({ ...atual, [campo]: undefined }));
  };

  const validar = () => {
    const novos = {};
    if (!form.titulo.trim()) novos.titulo = 'Informe o título';
    else if (form.titulo.trim().length > 150) novos.titulo = 'Máximo de 150 caracteres';
    if (!form.conteudo.trim()) novos.conteudo = 'Informe o conteúdo';
    if (!form.autor.trim()) novos.autor = 'Informe o autor';

    setErros(novos);
    return Object.keys(novos).length === 0;
  };

  const salvar = async () => {
    setErroGeral('');
    if (!validar()) return;

    const payload = {
      titulo: form.titulo.trim(),
      conteudo: form.conteudo.trim(),
      autor: form.autor.trim()
    };

    setSalvando(true);
    try {
      if (edicao) await postService.atualizar(id, payload);
      else await postService.criar(payload);

      navigation.goBack();
    } catch (error) {
      setErroGeral(extrairMensagemDeErro(error, 'Não foi possível salvar o post.'));
    } finally {
      setSalvando(false);
    }
  };

  if (carregando) return <Loading texto="Carregando post..." />;

  return (
    <KeyboardAvoidingView
      style={styles.tela}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      <ScrollView contentContainerStyle={styles.conteudo} keyboardShouldPersistTaps="handled">
        <Alerta tipo="erro" mensagem={erroGeral} />

        <AppInput
          label="Título"
          value={form.titulo}
          onChangeText={alterar('titulo')}
          placeholder="Ex.: Resumo da aula de React Native"
          maxLength={150}
          erro={erros.titulo}
          ajuda={`${form.titulo.length}/150 caracteres`}
        />

        <AppInput
          label="Autor"
          value={form.autor}
          onChangeText={alterar('autor')}
          placeholder="Nome de quem assina o post"
          erro={erros.autor}
        />

        <AppInput
          label="Conteúdo"
          value={form.conteudo}
          onChangeText={alterar('conteudo')}
          placeholder="Escreva aqui o conteúdo completo do post..."
          multiline
          erro={erros.conteudo}
        />

        <View style={styles.acoes}>
          <AppButton
            titulo="Cancelar"
            variante="secondary"
            onPress={() => navigation.goBack()}
            style={styles.acaoFlex}
          />
          <AppButton
            titulo={edicao ? 'Salvar alterações' : 'Publicar post'}
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
