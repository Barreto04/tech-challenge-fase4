import { useCallback, useEffect, useRef, useState } from 'react';
import { extrairMensagemDeErro } from '../api/client';

// Hook compartilhado pelas listagens (posts, professores e alunos).
// Cuida de paginação, busca com debounce, pull-to-refresh e estado de erro.
export default function useListaPaginada({ buscarPagina, limit = 10, debounceMs = 400 }) {
  const [itens, setItens] = useState([]);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);
  const [termo, setTermo] = useState('');
  const [termoAplicado, setTermoAplicado] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [erro, setErro] = useState('');

  const requisicaoAtual = useRef(0);

  // Debounce da busca: só dispara a requisição quando o usuário para de digitar
  useEffect(() => {
    const timer = setTimeout(() => {
      setTermoAplicado(termo.trim());
      setPage(1);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [termo, debounceMs]);

  const carregar = useCallback(
    async ({ silencioso = false } = {}) => {
      const idRequisicao = ++requisicaoAtual.current;

      if (!silencioso) setCarregando(true);
      setErro('');

      try {
        const { data } = await buscarPagina({ page, limit, q: termoAplicado });

        // Ignora respostas de requisições antigas que chegaram fora de ordem
        if (idRequisicao !== requisicaoAtual.current) return;

        setItens(data.data || []);
        setMeta(data.meta || null);
      } catch (error) {
        if (idRequisicao !== requisicaoAtual.current) return;
        setItens([]);
        setMeta(null);
        setErro(extrairMensagemDeErro(error));
      } finally {
        if (idRequisicao === requisicaoAtual.current) {
          setCarregando(false);
          setAtualizando(false);
        }
      }
    },
    [buscarPagina, page, limit, termoAplicado]
  );

  useEffect(() => {
    carregar();
  }, [carregar]);

  const atualizar = useCallback(() => {
    setAtualizando(true);
    return carregar({ silencioso: true });
  }, [carregar]);

  const irPara = useCallback(
    (novaPagina) => {
      if (novaPagina < 1) return;
      if (meta && novaPagina > meta.totalPages) return;
      setPage(novaPagina);
    },
    [meta]
  );

  return {
    itens,
    meta,
    page,
    termo,
    setTermo,
    carregando,
    atualizando,
    erro,
    recarregar: carregar,
    atualizar,
    proximaPagina: () => irPara(page + 1),
    paginaAnterior: () => irPara(page - 1)
  };
}
