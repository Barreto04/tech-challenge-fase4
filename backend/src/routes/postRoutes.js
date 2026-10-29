const express = require('express');
const router = express.Router();
const {
  getAllPosts,
  searchPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost
} = require('../controllers/postController');
const { autenticar, autorizar } = require('../middlewares/auth');

// Leitura é pública (alunos e visitantes)
router.get('/search', searchPosts);
router.get('/', getAllPosts);
router.get('/:id', getPostById);

// Escrita é restrita a professores autenticados
router.post('/', autenticar, autorizar('professor'), createPost);
router.put('/:id', autenticar, autorizar('professor'), updatePost);
router.delete('/:id', autenticar, autorizar('professor'), deletePost);

module.exports = router;
