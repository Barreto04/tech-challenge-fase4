import { useCallback } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PostCard from '../../components/PostCard';
import Paginador from '../../components/Paginador';
import SearchBar from '../../components/SearchBar';
import { EmptyState, ErrorState, Loading } from '../../components/Feedback';
import useListaPaginada from '../../hooks/useListaPaginada';
import useRecarregarAoFocar from '../../hooks/useRecarregarAoFocar';
import { postService } from '../../api/services';
import { useAuth } from '../../contexts/AuthContext';
import { colors, radius, shadow, spacing, typography } from '../../theme';

export default function PostListScreen({ navigation }) {
  const { user, autenticado, ehProfessor } = useAuth();

  const buscarPagina = useCallback((params) => postService.listar(params), []);

  const {
    itens,
    meta,
    termo,
    setTermo,
    carregando,
    atualizando,
    erro,
    recarregar,
    atualizar,
    proximaPagina,
    paginaAnterior
  } = useListaPaginada({ buscarPagina });

  useRecarregarAoFocar(recarregar);

  const cabecalho = (
    <View style={styles.cabecalho}>
      <View style={styles.saudacaoLinha}>
        <View style={styles.saudacaoTexto}>
          <Text style={styles.saudacao}>
            {autenticado ? `Olá, ${user.nome.split(' ')[0]}` : 'Bem-vindo(a)'}
          </Text>
          <Text style={styles.subtitulo}>
            {autenticado
              ? ehProfessor
                ? 'Você pode publicar e administrar posts'
                : 'Acompanhe os conteúdos publicados pelos professores'
              : 'Entre para publicar conteúdos'}
          </Text>
        </View>

        {!autenticado ? (
          <Pressable
            style={styles.botaoEntrar}
            onPress={() => navigation.navigate('Login')}
            accessibilityLabel="Entrar"
          >
            <Ionicons name="log-in-outline" size={18} color={colors.primary} />
            <Text style={styles.botaoEntrarTexto}>Entrar</Text>
          </Pressable>
        ) : null}
      </View>

      <SearchBar
        valor={termo}
        onChange={setTermo}
        placeholder="Buscar por título, conteúdo ou autor"
        style={styles.busca}
      />

      {meta ? (
        <Text style={styles.contador}>
          {meta.total} {meta.total === 1 ? 'post encontrado' : 'posts encontrados'}
        </Text>
      ) : null}
    </View>
  );

  if (carregando && !atualizando) {
    return (
      <View style={styles.tela}>
        {cabecalho}
        <Loading texto="Carregando posts..." />
      </View>
    );
  }

  if (erro) {
    return (
      <View style={styles.tela}>
        {cabecalho}
        <ErrorState mensagem={erro} onTentarNovamente={recarregar} />
      </View>
    );
  }

  return (
    <View style={styles.tela}>
      <FlatList
        data={itens}
        keyExtractor={(item) => item._id}
        ListHeaderComponent={cabecalho}
        contentContainerStyle={styles.lista}
        refreshing={atualizando}
        onRefresh={atualizar}
        renderItem={({ item }) => (
          <PostCard post={item} onPress={() => navigation.navigate('PostDetail', { id: item._id })} />
        )}
        ListEmptyComponent={
          <EmptyState
            titulo={termo ? 'Nenhum post para essa busca' : 'Ainda não há posts'}
            descricao={
              termo
                ? 'Tente outras palavras-chave.'
                : 'Assim que um professor publicar, o conteúdo aparece aqui.'
            }
          />
        }
        ListFooterComponent={
          <Paginador meta={meta} onAnterior={paginaAnterior} onProxima={proximaPagina} />
        }
      />

      {ehProfessor ? (
        <Pressable
          style={({ pressed }) => [styles.fab, pressed && styles.fabPressionado]}
          onPress={() => navigation.navigate('PostForm', {})}
          accessibilityLabel="Criar post"
        >
          <Ionicons name="add" size={26} color={colors.textInverse} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: colors.background },
  lista: { padding: spacing.lg, paddingBottom: spacing.xxl * 2, flexGrow: 1 },
  cabecalho: { marginBottom: spacing.lg },
  saudacaoLinha: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md },
  saudacaoTexto: { flex: 1 },
  saudacao: { ...typography.title },
  subtitulo: { ...typography.small, marginTop: 2 },
  botaoEntrar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm
  },
  botaoEntrarTexto: { color: colors.primary, fontWeight: '600', fontSize: 13 },
  busca: { marginTop: spacing.lg },
  contador: { ...typography.small, marginTop: spacing.md },
  fab: {
    position: 'absolute',
    right: spacing.xl,
    bottom: spacing.xl,
    width: 58,
    height: 58,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.card,
    shadowOpacity: 0.25,
    elevation: 6
  },
  fabPressionado: { backgroundColor: colors.primaryDark }
});
