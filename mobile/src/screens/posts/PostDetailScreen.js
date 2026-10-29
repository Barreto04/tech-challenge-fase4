import { useCallback, useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppButton from '../../components/AppButton';
import { ErrorState, Loading } from '../../components/Feedback';
import { postService } from '../../api/services';
import { extrairMensagemDeErro } from '../../api/client';
import { useAuth } from '../../contexts/AuthContext';
import { formatarDataHora } from '../../utils/formatadores';
import { colors, radius, shadow, spacing, typography } from '../../theme';

export default function PostDetailScreen({ route, navigation }) {
  const { id } = route.params;
  const { ehProfessor } = useAuth();

  const [post, setPost] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [excluindo, setExcluindo] = useState(false);

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro('');
    try {
      const { data } = await postService.porId(id);
      setPost(data.data);
    } catch (error) {
      setErro(extrairMensagemDeErro(error, 'Não foi possível carregar o post.'));
    } finally {
      setCarregando(false);
    }
  }, [id]);

  useEffect(() => {
    const remover = navigation.addListener('focus', carregar);
    return remover;
  }, [navigation, carregar]);

  const confirmarExclusao = () => {
    Alert.alert('Excluir post', `Tem certeza que deseja excluir "${post.titulo}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: excluir }
    ]);
  };

  const excluir = async () => {
    setExcluindo(true);
    try {
      await postService.excluir(id);
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro', extrairMensagemDeErro(error, 'Não foi possível excluir o post.'));
    } finally {
      setExcluindo(false);
    }
  };

  if (carregando) return <Loading texto="Carregando post..." />;
  if (erro) return <ErrorState mensagem={erro} onTentarNovamente={carregar} />;
  if (!post) return null;

  return (
    <ScrollView style={styles.tela} contentContainerStyle={styles.conteudo}>
      <Text style={styles.titulo}>{post.titulo}</Text>

      <View style={styles.meta}>
        <View style={styles.metaItem}>
          <Ionicons name="person-circle-outline" size={16} color={colors.textMuted} />
          <Text style={styles.metaTexto}>{post.autor}</Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons name="calendar-outline" size={15} color={colors.textMuted} />
          <Text style={styles.metaTexto}>{formatarDataHora(post.createdAt)}</Text>
        </View>
      </View>

      {post.updatedAt && post.updatedAt !== post.createdAt ? (
        <Text style={styles.editado}>Editado em {formatarDataHora(post.updatedAt)}</Text>
      ) : null}

      <View style={styles.cardConteudo}>
        <Text style={styles.texto}>{post.conteudo}</Text>
      </View>

      {ehProfessor ? (
        <View style={styles.acoes}>
          <AppButton
            titulo="Editar post"
            icone="create-outline"
            variante="secondary"
            onPress={() => navigation.navigate('PostForm', { id: post._id })}
            style={styles.acaoFlex}
          />
          <AppButton
            titulo="Excluir"
            icone="trash-outline"
            variante="danger"
            carregando={excluindo}
            onPress={confirmarExclusao}
            style={styles.acaoFlex}
          />
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: colors.background },
  conteudo: { padding: spacing.lg, paddingBottom: spacing.xxl },
  titulo: { ...typography.title, fontSize: 26, lineHeight: 34 },
  meta: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.lg, marginTop: spacing.md },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  metaTexto: { ...typography.small },
  editado: { ...typography.small, fontStyle: 'italic', marginTop: spacing.xs },
  cardConteudo: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginTop: spacing.lg,
    ...shadow.card
  },
  texto: { ...typography.body, fontSize: 16, lineHeight: 26 },
  acoes: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.xl },
  acaoFlex: { flex: 1 }
});
