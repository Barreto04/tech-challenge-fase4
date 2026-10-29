const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const request = require('supertest');
const app = require('../app');
const User = require('../models/User');

let mongoServer;

const conectar = async () => {
  process.env.JWT_SECRET = 'segredo-de-teste';
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
};

const desconectar = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  if (mongoServer) await mongoServer.stop();
};

const limpar = async () => {
  const collections = mongoose.connection.collections;
  await Promise.all(Object.values(collections).map((c) => c.deleteMany({})));
};

// Cria um usuário e já devolve o token autenticado
const criarUsuarioELogar = async ({
  nome = 'Professor Teste',
  email = 'professor@teste.com',
  senha = 'postech2026',
  role = 'professor'
} = {}) => {
  const user = await User.create({ nome, email, senha, role });
  const res = await request(app).post('/auth/login').send({ email, senha });
  return { user, token: res.body.data.token };
};

module.exports = { conectar, desconectar, limpar, criarUsuarioELogar, app, request };
