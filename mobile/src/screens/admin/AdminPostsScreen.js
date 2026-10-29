import { useCallback, useState } from 'react';
import { Alert, FlatList, StyleSheet, View } from 'react-native';
import AppButton from '../../components/AppButton';
import PostCard from '../../components/PostCard';
import Paginador from '../../components/Paginador';
import SearchBar from '../../components/SearchBar';
import { EmptyState, ErrorState, Loading } from '../../components/Feedback';
import useListaPaginada from '../../hooks/useListaPaginada';
import useRecarregarAoFocar from '../../hooks/useRecarregarAoFocar';
import { postService } from '../../api/services';
import { extrairMensagemDeErro } from '../../api/client';
import { colors, spacing } from '../../theme';

export default function AdminPostsScreen({ navigation }) {
  const buscarPagina = useCallback((params) => postService.listar(params), []);
  const [excluindoId, setExcluindoId] = useState(null);

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

  const confirmarExclusao = (post) => {
    Alert.alert('Excluir post', `Tem certeza que deseja excluir "${post.titulo}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: () => excluir(post._id) }
    ]);
  };

  const excluir = async (id) => {
    setExcluindoId(id);
    try {
      await postService.excluir(id);
      await recarregar({ silencioso: true });
    } catch (error) {
      Alert.alert('Erro', extrairMensagemDeErro(error, 'Não foi possível excluir o post.'));
    } finally {
      setExcluindoId(null);
    }
  };

  const cabecalho = (
    <View style={styles.cabecalho}>
      <AppButton
        titulo="Nova postagem"
        icone="add"
        onPress={() => navigation.navigate('PostForm', {})}
      />
      <SearchBar
        valor={termo}
        onChange={setTermo}
        placeholder="Filtrar postagens"
        style={styles.busca}
      />
    </View>
  );

  if (carregando && !atualizando) {
    return (
      <View style={styles.tela}>
        {cabecalho}
        <Loading texto="Carregando postagens..." />
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
          <PostCard
            post={item}
            onPress={() => navigation.navigate('PostDetail', { id: item._id })}
            acoes={
              <>
                <AppButton
                  titulo="Editar"
                  icone="create-outline"
                  variante="secondary"
                  compacto
                  onPress={() => navigation.navigate('PostForm', { id: item._id })}
                />
                <AppButton
                  titulo="Excluir"
                  icone="trash-outline"
                  variante="danger"
                  compacto
                  carregando={excluindoId === item._id}
                  onPress={() => confirmarExclusao(item)}
                />
              </>
            }
          />
        )}
        ListEmptyComponent={
          <EmptyState
            titulo={termo ? 'Nenhuma postagem encontrada' : 'Nenhuma postagem cadastrada'}
            descricao={termo ? 'Tente outro filtro.' : 'Use o botão acima para criar a primeira.'}
          />
        }
        ListFooterComponent={
          <Paginador meta={meta} onAnterior={paginaAnterior} onProxima={proximaPagina} />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: colors.background },
  lista: { padding: spacing.lg, flexGrow: 1 },
  cabecalho: { marginBottom: spacing.lg },
  busca: { marginTop: spacing.md }
});
