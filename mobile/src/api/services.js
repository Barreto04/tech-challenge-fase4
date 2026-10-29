import api from './client';

export const authService = {
  login: (credenciais) => api.post('/auth/login', credenciais),
  me: () => api.get('/auth/me')
};

export const postService = {
  listar: (params) => api.get('/posts', { params }),
  buscar: (q, params) => api.get('/posts/search', { params: { q, ...params } }),
  porId: (id) => api.get(`/posts/${id}`),
  criar: (dados) => api.post('/posts', dados),
  atualizar: (id, dados) => api.put(`/posts/${id}`, dados),
  excluir: (id) => api.delete(`/posts/${id}`)
};

// Professores e alunos usam o mesmo contrato REST, só muda o recurso.
const criarUserService = (recurso) => ({
  listar: (params) => api.get(`/${recurso}`, { params }),
  porId: (id) => api.get(`/${recurso}/${id}`),
  criar: (dados) => api.post(`/${recurso}`, dados),
  atualizar: (id, dados) => api.put(`/${recurso}/${id}`, dados),
  excluir: (id) => api.delete(`/${recurso}/${id}`)
});

export const professorService = criarUserService('professores');
export const alunoService = criarUserService('alunos');

// Usado pelas telas genéricas de listagem/formulário de usuários
export const servicePorRole = (role) => (role === 'professor' ? professorService : alunoService);
