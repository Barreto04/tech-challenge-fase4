const express = require('express');
const cors = require('cors');

const postRoutes = require('./routes/postRoutes');
const authRoutes = require('./routes/authRoutes');
const { criarRotasDeUsuario } = require('./routes/userRoutes');
const { notFound } = require('./middlewares/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'Blog Dinâmico API - POSTECH Fase 04',
    version: '2.0.0',
    endpoints: ['/auth', '/posts', '/professores', '/alunos']
  });
});

app.get('/health', (req, res) => {
  res.json({ success: true, status: 'ok', uptime: process.uptime() });
});

app.use('/auth', authRoutes);
app.use('/posts', postRoutes);
app.use('/professores', criarRotasDeUsuario('professor'));
app.use('/alunos', criarRotasDeUsuario('aluno'));

app.use(notFound);

module.exports = app;
