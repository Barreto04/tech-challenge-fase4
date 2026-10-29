import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../api/services';
import { TOKEN_KEY, USER_KEY, extrairMensagemDeErro, registrarHandlerDeSessaoExpirada } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [carregando, setCarregando] = useState(true);

  const limparSessao = useCallback(async () => {
    await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
    setUser(null);
  }, []);

  // Um 401 em qualquer requisição derruba a sessão local
  useEffect(() => {
    registrarHandlerDeSessaoExpirada(limparSessao);
  }, [limparSessao]);

  // Restaura a sessão salva e revalida o token contra a API
  useEffect(() => {
    const restaurar = async () => {
      try {
        const [token, userSalvo] = await AsyncStorage.multiGet([TOKEN_KEY, USER_KEY]);
        if (!token[1] || !userSalvo[1]) return;

        setUser(JSON.parse(userSalvo[1]));

        const { data } = await authService.me();
        setUser(data.data);
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(data.data));
      } catch (error) {
        await limparSessao();
      } finally {
        setCarregando(false);
      }
    };

    restaurar();
  }, [limparSessao]);

  const login = useCallback(async (email, senha) => {
    try {
      const { data } = await authService.login({ email, senha });
      const { token, user: usuario } = data.data;

      await AsyncStorage.multiSet([
        [TOKEN_KEY, token],
        [USER_KEY, JSON.stringify(usuario)]
      ]);
      setUser(usuario);

      return { ok: true, user: usuario };
    } catch (error) {
      return { ok: false, mensagem: extrairMensagemDeErro(error, 'Falha ao entrar.') };
    }
  }, []);

  const logout = useCallback(() => limparSessao(), [limparSessao]);

  const valor = useMemo(
    () => ({
      user,
      carregando,
      login,
      logout,
      autenticado: !!user,
      ehProfessor: user?.role === 'professor',
      ehAluno: user?.role === 'aluno'
    }),
    [user, carregando, login, logout]
  );

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const contexto = useContext(AuthContext);
  if (!contexto) throw new Error('useAuth precisa estar dentro de um AuthProvider');
  return contexto;
}
