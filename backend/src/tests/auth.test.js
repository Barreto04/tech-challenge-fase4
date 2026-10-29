const { conectar, desconectar, limpar, criarUsuarioELogar, app, request } = require('./helpers');

beforeAll(conectar);
afterAll(desconectar);
afterEach(limpar);

describe('POST /auth/login', () => {
  it('autentica com credenciais válidas e devolve token', async () => {
    await criarUsuarioELogar();

    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'professor@teste.com', senha: 'postech2026' });

    expect(res.status).toBe(200);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.user.role).toBe('professor');
    expect(res.body.data.user.senha).toBeUndefined();
  });

  it('rejeita senha incorreta', async () => {
    await criarUsuarioELogar();

    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'professor@teste.com', senha: 'senha-errada' });

    expect(res.status).toBe(401);
  });

  it('exige e-mail e senha', async () => {
    const res = await request(app).post('/auth/login').send({});
    expect(res.status).toBe(400);
  });
});

describe('GET /auth/me', () => {
  it('devolve o usuário dono do token', async () => {
    const { token } = await criarUsuarioELogar();

    const res = await request(app).get('/auth/me').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.email).toBe('professor@teste.com');
  });

  it('bloqueia requisição sem token', async () => {
    const res = await request(app).get('/auth/me');
    expect(res.status).toBe(401);
  });

  it('bloqueia token inválido', async () => {
    const res = await request(app).get('/auth/me').set('Authorization', 'Bearer token-falso');
    expect(res.status).toBe(401);
  });
});
