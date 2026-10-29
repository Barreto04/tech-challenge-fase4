/**
 * Sobe a API com um MongoDB em memória, sem precisar de Docker ou de um Mongo instalado.
 * Os dados somem quando o processo é encerrado — serve para desenvolver e demonstrar.
 *
 * Uso: npm run dev:memory
 */
require('dotenv').config();
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('./app');
const User = require('./models/User');
const Post = require('./models/Post');

const PORT = process.env.PORT_LOCAL || 3001;

const professores = [
  {
    nome: 'Professor Demo',
    email: process.env.SEED_PROFESSOR_EMAIL || 'professor@postech.com',
    senha: process.env.SEED_PROFESSOR_SENHA || 'postech2026',
    role: 'professor',
    materia: 'Desenvolvimento Full Stack'
  },
  { nome: 'Ana Ribeiro', email: 'ana.ribeiro@postech.com', senha: 'postech2026', role: 'professor', materia: 'Matemática' },
  { nome: 'Carlos Teixeira', email: 'carlos.teixeira@postech.com', senha: 'postech2026', role: 'professor', materia: 'História' }
];

const alunos = [
  { nome: 'Bruna Lima', email: 'bruna.lima@aluno.postech.com', senha: 'postech2026', role: 'aluno', turma: '3 ano A' },
  { nome: 'Diego Souza', email: 'diego.souza@aluno.postech.com', senha: 'postech2026', role: 'aluno', turma: '3 ano A' },
  { nome: 'Fernanda Alves', email: 'fernanda.alves@aluno.postech.com', senha: 'postech2026', role: 'aluno', turma: '2 ano B' }
];

const posts = (autor) => [
  {
    titulo: 'Bem-vindo ao Blog da Turma',
    conteudo:
      'Este espaço foi criado para compartilhar conteúdos, resumos e materiais de apoio das aulas. ' +
      'Os professores publicam os posts e os alunos acompanham tudo pelo aplicativo.',
    autor: autor.nome,
    autorId: autor._id
  },
  {
    titulo: 'Como estudar para a prova de Matemática',
    conteudo:
      'Revise as listas de exercícios, refaça as questões erradas e monte um resumo com as fórmulas principais. ' +
      'Estudar um pouco todos os dias rende muito mais do que uma maratona na véspera.',
    autor: 'Ana Ribeiro'
  },
  {
    titulo: 'Entrega do trabalho de História',
    conteudo:
      'O trabalho sobre a Revolução Industrial deve ser entregue até sexta-feira. ' +
      'Capriche nas fontes e lembre-se de citar as referências utilizadas.',
    autor: 'Carlos Teixeira'
  }
];

const iniciar = async () => {
  const mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());

  const [professorPadrao] = await User.create(professores);
  await User.create(alunos);
  await Post.create(posts(professorPadrao));

  const servidor = app.listen(PORT, () => {
    console.log('--------------------------------------------------');
    console.log(`API (MongoDB em memória) em http://localhost:${PORT}`);
    console.log(`Emulador Android acessa em  http://10.0.2.2:${PORT}`);
    console.log(`Professor: ${professores[0].email} / ${professores[0].senha}`);
    console.log(`Aluno:     ${alunos[0].email} / ${alunos[0].senha}`);
    console.log('--------------------------------------------------');
  });

  const encerrar = async () => {
    servidor.close();
    await mongoose.connection.close();
    await mongo.stop();
    process.exit(0);
  };

  process.on('SIGINT', encerrar);
  process.on('SIGTERM', encerrar);
};

iniciar().catch((error) => {
  console.error('Falha ao iniciar a API em memória:', error);
  process.exit(1);
});
