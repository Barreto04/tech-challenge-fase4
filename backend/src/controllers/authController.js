const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET } = require('../middlewares/auth');
const { tratarErro } = require('../middlewares/errorHandler');

const gerarToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, JWT_SECRET(), {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });

// POST /auth/login — autentica professor ou aluno
const login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ success: false, message: 'E-mail e senha são obrigatórios' });
    }

    const user = await User.findOne({ email: String(email).toLowerCase().trim() }).select('+senha');

    if (!user || !(await user.compararSenha(senha))) {
      return res.status(401).json({ success: false, message: 'E-mail ou senha inválidos' });
    }

    return res.status(200).json({
      success: true,
      data: { token: gerarToken(user), user: user.toJSON() }
    });
  } catch (error) {
    return tratarErro(error, res);
  }
};

// GET /auth/me — devolve o usuário do token (usado para revalidar sessão no app)
const me = async (req, res) => {
  res.status(200).json({ success: true, data: req.user.toJSON() });
};

module.exports = { login, me, gerarToken };
