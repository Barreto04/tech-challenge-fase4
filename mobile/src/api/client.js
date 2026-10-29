import axios from 'axios';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const TOKEN_KEY = '@blogpostech:token';
export const USER_KEY = '@blogpostech:user';

// No emulador Android o localhost da máquina é 10.0.2.2.
// EXPO_PUBLIC_API_URL sobrescreve isso (útil para celular físico na rede).
const resolverBaseURL = () => {
  if (process.env.EXPO_PUBLIC_API_URL) return process.env.EXPO_PUBLIC_API_URL;
  if (Platform.OS === 'android') return 'http://10.0.2.2:3001';
  return 'http://localhost:3001';
};

export const API_URL = resolverBaseURL();

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' }
});

// Anexa o token salvo em todas as requisições
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Callback registrado pelo AuthContext para deslogar quando o token expira
let aoExpirarSessao = null;
export const registrarHandlerDeSessaoExpirada = (fn) => {
  aoExpirarSessao = fn;
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && aoExpirarSessao) {
      await aoExpirarSessao();
    }
    return Promise.reject(error);
  }
);

// Normaliza qualquer falha em uma mensagem legível para o usuário
export const extrairMensagemDeErro = (error, padrao = 'Não foi possível concluir a operação.') => {
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.code === 'ECONNABORTED') return 'A API demorou demais para responder. Ela está rodando?';
  if (error?.message === 'Network Error') {
    return `Não foi possível falar com a API em ${API_URL}. Verifique se o backend está no ar.`;
  }
  return error?.message || padrao;
};

export default api;
