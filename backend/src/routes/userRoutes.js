const express = require('express');
const { criarControllerDeUsuario } = require('../controllers/userController');
const { autenticar, autorizar } = require('../middlewares/auth');

// Todas as rotas administrativas de usuários exigem um professor autenticado
const criarRotasDeUsuario = (role) => {
  const router = express.Router();
  const controller = criarControllerDeUsuario(role);

  router.use(autenticar, autorizar('professor'));

  router.get('/', controller.listar);
  router.get('/:id', controller.buscarPorId);
  router.post('/', controller.criar);
  router.put('/:id', controller.atualizar);
  router.delete('/:id', controller.excluir);

  return router;
};

module.exports = { criarRotasDeUsuario };
