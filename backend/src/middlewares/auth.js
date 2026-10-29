const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = () => process.env.JWT_SECRET || 'postech-dev-secret';

// Exige um token válido no header Authorization: Bearer <token>
const autenticar = async (req, res, next) => {
  try {
    const header = req.headers.authorization || '';
    const [tipo, token] = header.split(' ');

    if (tipo !== 'Bearer' || !token) {
      return res.status(401).json({ success: false, message: 'Token não informado' });
    }

    const payload = jwt.verify(token, JWT_SECRET());
    const user = await User.findById(payload.id);

    if (!user) {
      return res.status(401).json({ success: false, message: 'Usuário do token não existe mais' });
    }

    req.user = user;
    return next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Token inválido ou expirado' });
  }
};

// Restringe a rota a determinadas roles (ex.: apenas professor)
const autorizar = (...roles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Não autenticado' });
  }
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ success: false, message: 'Acesso restrito a: ' + roles.join(', ') });
  }
  return next();
};

module.exports = { autenticar, autorizar, JWT_SECRET };
