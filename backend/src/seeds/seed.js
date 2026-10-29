require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/database');
const User = require('../models/User');
const Post = require('../models/Post');

const professorPadrao = {
  nome: 'Professor Demo',
  email: process.env.SEED_PROFESSOR_EMAIL || 'professor@postech.com',
  senha: process.env.SEED_PROFESSOR_SENHA || 'postech2026',
  role: 'professor',
  materia: 'Desenvolvimento Full Stack'
};

const professores = [
  professorPadrao,
  { nome: 'Ana Ribeiro', email: 'ana.ribeiro@postech.com', senha: 'postech2026', role: 'professor', materia: 'Matemática' },
  { nome: 'Carlos Teixeira', email: 'carlos.teixeira@postech.com', senha: 'postech2026', role: 'professor', materia: 'História' }
];

const alunos = [
  { nome: 'Bruna Lima', email: 'bruna.lima@aluno.postech.com', senha: 'postech2026', role: 'aluno', turma: '3º A' },
  { nome: 'Diego Souza', email: 'diego.souza@aluno.postech.com', senha: 'postech2026', role: 'aluno', turma: '3º A' },
  { nome: 'Fernanda Alves', email: 'fernanda.alves@aluno.postech.com', senha: 'postech2026', role: 'aluno', turma: '2º B' }
];

const postsDemo = (autor) => [
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

const run = async () => {
  await connectDB();

  await User.deleteMany({});
  await Post.deleteMany({});

  // create() dispara o hook de hash de senha; insertMany não dispararia
  const [professorCriado] = await User.create(professores);
  await User.create(alunos);
  await Post.create(postsDemo(professorCriado));

  console.log('Seed concluído.');
  console.log(`Login de professor: ${professorPadrao.email} / ${professorPadrao.senha}`);
  console.log(`Login de aluno:     ${alunos[0].email} / ${alunos[0].senha}`);

  await mongoose.connection.close();
};

run().catch(async (error) => {
  console.error('Erro ao rodar o seed:', error.message);
  await mongoose.connection.close();
  process.exit(1);
});
