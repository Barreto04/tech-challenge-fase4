import { useCallback, useLayoutEffect } from 'react';
import { Alert, FlatList, StyleSheet, View } from 'react-native';
import AppButton from '../../components/AppButton';
import Paginador from '../../components/Paginador';
import SearchBar from '../../components/SearchBar';
import UserRow from '../../components/UserRow';
import { EmptyState, ErrorState, Loading } from '../../components/Feedback';
import useListaPaginada from '../../hooks/useListaPaginada';
import useRecarregarAoFocar from '../../hooks/useRecarregarAoFocar';
import { servicePorRole } from '../../api/services';
import { extrairMensagemDeErro } from '../../api/client';
import { colors, spacing } from '../../theme';

// Mesma tela atende professores e alunos; o papel vem por parâmetro de rota.
const textos = {
  professor: {
    titulo: 'Professores',
    novo: 'Novo professor',
    filtro: 'Filtrar professores',
    vazio: 'Nenhum professor cadastrado',
    rotaForm: 'ProfessorForm'
  },
  aluno: {
    titulo: 'Alunos',
    novo: 'Novo aluno',
    filtro: 'Filtrar alunos',
    vazio: 'Nenhum aluno cadastrado',
    rotaForm: 'AlunoForm'
  }
};

export default function UserListScreen({ route, navigation }) {
  const role = route.params?.role || 'professor';
  const copy = textos[role];
  const service = servicePorRole(role);

  const buscarPagina = useCallback((params) => service.listar(params), [service]);

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

  useLayoutEffect(() => {
    navigation.setOptions({ title: copy.titulo });
  }, [navigation, copy.titulo]);

  const confirmarExclusao = (usuario) => {
    Alert.alert('Excluir cadastro', `Deseja excluir ${usuario.nome}?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: () => excluir(usuario._id) }
    ]);
  };

  const excluir = async (id) => {
    try {
      await service.excluir(id);
      await recarregar({ silencioso: true });
    } catch (error) {
      Alert.alert('Erro', extrairMensagemDeErro(error, 'Não foi possível excluir o cadastro.'));
    }
  };

  const cabecalho = (
    <View style={styles.cabecalho}>
      <AppButton
        titulo={copy.novo}
        icone="person-add-outline"
        onPress={() => navigation.navigate(copy.rotaForm, { role })}
      />
      <SearchBar valor={termo} onChange={setTermo} placeholder={copy.filtro} style={styles.busca} />
    </View>
  );

  if (carregando && !atualizando) {
    return (
      <View style={styles.tela}>
        {cabecalho}
        <Loading texto="Carregando cadastros..." />
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
          <UserRow
            usuario={item}
            onEditar={() => navigation.navigate(copy.rotaForm, { role, id: item._id })}
            onExcluir={() => confirmarExclusao(item)}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            icone="people-outline"
            titulo={termo ? 'Nenhum resultado para essa busca' : copy.vazio}
            descricao={termo ? 'Tente outro nome ou e-mail.' : 'Use o botão acima para cadastrar.'}
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
