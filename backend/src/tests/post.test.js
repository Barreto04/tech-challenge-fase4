const { conectar, desconectar, limpar, criarUsuarioELogar, app, request } = require('./helpers');
const Post = require('../models/Post');

beforeAll(conectar);
afterAll(desconectar);
afterEach(limpar);

const postValido = { titulo: 'Aula de React Native', conteudo: 'Conteúdo sobre componentes e hooks.' };

describe('Leitura pública de posts', () => {
  it('lista posts com metadados de paginação', async () => {
    await Post.create({ ...postValido, autor: 'Professor Teste' });

    const res = await request(app).get('/posts');

    expect(res.status).toBe(200);
    expect(res.body.count).toBe(1);
    expect(res.body.meta.totalPages).toBe(1);
  });

  it('busca posts por palavra-chave', async () => {
    await Post.create({ ...postValido, autor: 'Professor Teste' });
    await Post.create({ titulo: 'Outro assunto', conteudo: 'Nada a ver', autor: 'Professor Teste' });

    const res = await request(app).get('/posts/search?q=react');

    expect(res.status).toBe(200);
    expect(res.body.count).toBe(1);
  });

  it('retorna 400 quando a busca vem sem o parametro q', async () => {
    const res = await request(app).get('/posts/search');
    expect(res.status).toBe(400);
  });

  it('retorna 404 para post inexistente', async () => {
    const res = await request(app).get('/posts/507f1f77bcf86cd799439011');
    expect(res.status).toBe(404);
  });
});

describe('Escrita de posts', () => {
  it('professor autenticado cria post', async () => {
    const { token, user } = await criarUsuarioELogar();

    const res = await request(app)
      .post('/posts')
      .set('Authorization', `Bearer ${token}`)
      .send(postValido);

    expect(res.status).toBe(201);
    expect(res.body.data.autor).toBe(user.nome);
    expect(res.body.data.autorId).toBe(String(user._id));
  });

  it('bloqueia criação sem autenticação', async () => {
    const res = await request(app).post('/posts').send(postValido);
    expect(res.status).toBe(401);
  });

  it('bloqueia criação feita por aluno', async () => {
    const { token } = await criarUsuarioELogar({ email: 'aluno@teste.com', role: 'aluno' });

    const res = await request(app)
      .post('/posts')
      .set('Authorization', `Bearer ${token}`)
      .send(postValido);

    expect(res.status).toBe(403);
  });

  it('valida campos obrigatórios', async () => {
    const { token } = await criarUsuarioELogar();

    const res = await request(app)
      .post('/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({ titulo: 'Apenas o titulo' });

    expect(res.status).toBe(400);
  });

  it('professor edita e exclui post', async () => {
    const { token } = await criarUsuarioELogar();
    const post = await Post.create({ ...postValido, autor: 'Professor Teste' });

    const edicao = await request(app)
      .put(`/posts/${post._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ titulo: 'Titulo editado' });

    expect(edicao.status).toBe(200);
    expect(edicao.body.data.titulo).toBe('Titulo editado');

    const exclusao = await request(app)
      .delete(`/posts/${post._id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(exclusao.status).toBe(200);
    expect(await Post.countDocuments()).toBe(0);
  });
});
