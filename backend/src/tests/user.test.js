const { conectar, desconectar, limpar, criarUsuarioELogar, app, request } = require('./helpers');
const User = require('../models/User');

beforeAll(conectar);
afterAll(desconectar);
afterEach(limpar);

const novoAluno = { nome: 'Bruna Lima', email: 'bruna@teste.com', senha: 'postech2026', turma: '3A' };

describe('CRUD de alunos e professores', () => {
  it('professor cadastra aluno', async () => {
    const { token } = await criarUsuarioELogar();

    const res = await request(app)
      .post('/alunos')
      .set('Authorization', `Bearer ${token}`)
      .send(novoAluno);

    expect(res.status).toBe(201);
    expect(res.body.data.role).toBe('aluno');
    expect(res.body.data.senha).toBeUndefined();
  });

  it('lista alunos de forma paginada sem misturar com professores', async () => {
    const { token } = await criarUsuarioELogar();
    await request(app).post('/alunos').set('Authorization', `Bearer ${token}`).send(novoAluno);

    const res = await request(app)
      .get('/alunos?page=1&limit=10')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.count).toBe(1);
    expect(res.body.meta.page).toBe(1);
  });

  it('edita aluno mantendo a senha quando ela nao e enviada', async () => {
    const { token } = await criarUsuarioELogar();
    const criado = await request(app)
      .post('/alunos')
      .set('Authorization', `Bearer ${token}`)
      .send(novoAluno);

    const res = await request(app)
      .put(`/alunos/${criado.body.data._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ nome: 'Bruna Lima Silva' });

    expect(res.status).toBe(200);
    expect(res.body.data.nome).toBe('Bruna Lima Silva');

    const login = await request(app)
      .post('/auth/login')
      .send({ email: novoAluno.email, senha: novoAluno.senha });

    expect(login.status).toBe(200);
  });

  it('exclui aluno', async () => {
    const { token } = await criarUsuarioELogar();
    const criado = await request(app)
      .post('/alunos')
      .set('Authorization', `Bearer ${token}`)
      .send(novoAluno);

    const res = await request(app)
      .delete(`/alunos/${criado.body.data._id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(await User.countDocuments({ role: 'aluno' })).toBe(0);
  });

  it('impede e-mail duplicado', async () => {
    const { token } = await criarUsuarioELogar();
    await request(app).post('/alunos').set('Authorization', `Bearer ${token}`).send(novoAluno);

    const res = await request(app)
      .post('/alunos')
      .set('Authorization', `Bearer ${token}`)
      .send(novoAluno);

    expect(res.status).toBe(409);
  });

  it('bloqueia aluno no painel administrativo', async () => {
    const { token } = await criarUsuarioELogar({ email: 'aluno@teste.com', role: 'aluno' });

    const res = await request(app).get('/professores').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(403);
  });

  it('impede o professor logado de excluir a si mesmo', async () => {
    const { token, user } = await criarUsuarioELogar();

    const res = await request(app)
      .delete(`/professores/${user._id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(400);
  });
});
