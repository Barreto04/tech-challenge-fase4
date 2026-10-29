const User = require('../models/User');
const { tratarErro } = require('../middlewares/errorHandler');
const { lerParametros, montarMeta } = require('../utils/paginacao');

// Gera o CRUD completo para uma role (professor ou aluno).
// As duas entidades usam a mesma collection, separadas pelo campo role.
const criarControllerDeUsuario = (role) => {
  const naoEncontrado = (res) =>
    res.status(404).json({ success: false, message: `${role === 'professor' ? 'Professor' : 'Aluno'} não encontrado` });

  // GET /professores | /alunos — listagem paginada, com busca opcional por ?q=
  const listar = async (req, res) => {
    try {
      const { page, limit, skip } = lerParametros(req.query);
      const filtro = { role };

      if (req.query.q) {
        const regex = { $regex: req.query.q, $options: 'i' };
        filtro.$or = [{ nome: regex }, { email: regex }];
      }

      const [registros, total] = await Promise.all([
        User.find(filtro).sort({ nome: 1 }).skip(skip).limit(limit),
        User.countDocuments(filtro)
      ]);

      return res.status(200).json({
        success: true,
        count: registros.length,
        meta: montarMeta({ page, limit, total }),
        data: registros
      });
    } catch (error) {
      return tratarErro(error, res);
    }
  };

  // GET /professores/:id | /alunos/:id
  const buscarPorId = async (req, res) => {
    try {
      const registro = await User.findOne({ _id: req.params.id, role });
      if (!registro) return naoEncontrado(res);
      return res.status(200).json({ success: true, data: registro });
    } catch (error) {
      return tratarErro(error, res);
    }
  };

  // POST /professores | /alunos
  const criar = async (req, res) => {
    try {
      const { nome, email, senha, materia, turma } = req.body;
      const registro = await User.create({ nome, email, senha, role, materia, turma });
      return res.status(201).json({ success: true, data: registro });
    } catch (error) {
      return tratarErro(error, res);
    }
  };

  // PUT /professores/:id | /alunos/:id — a senha só é alterada quando enviada
  const atualizar = async (req, res) => {
    try {
      const registro = await User.findOne({ _id: req.params.id, role }).select('+senha');
      if (!registro) return naoEncontrado(res);

      const { nome, email, senha, materia, turma } = req.body;

      if (nome !== undefined) registro.nome = nome;
      if (email !== undefined) registro.email = email;
      if (materia !== undefined) registro.materia = materia;
      if (turma !== undefined) registro.turma = turma;
      if (senha) registro.senha = senha;

      await registro.save();
      return res.status(200).json({ success: true, data: registro.toJSON() });
    } catch (error) {
      return tratarErro(error, res);
    }
  };

  // DELETE /professores/:id | /alunos/:id
  const excluir = async (req, res) => {
    try {
      if (req.user && String(req.user._id) === String(req.params.id)) {
        return res.status(400).json({ success: false, message: 'Não é possível excluir o próprio usuário logado' });
      }

      const registro = await User.findOneAndDelete({ _id: req.params.id, role });
      if (!registro) return naoEncontrado(res);

      return res.status(200).json({ success: true, message: 'Registro excluído com sucesso' });
    } catch (error) {
      return tratarErro(error, res);
    }
  };

  return { listar, buscarPorId, criar, atualizar, excluir };
};

module.exports = { criarControllerDeUsuario };
