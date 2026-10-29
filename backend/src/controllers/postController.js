const Post = require('../models/Post');
const { tratarErro } = require('../middlewares/errorHandler');
const { lerParametros, montarMeta } = require('../utils/paginacao');

// GET /posts — lista paginada (aceita ?q= para buscar junto)
const getAllPosts = async (req, res) => {
  try {
    const { page, limit, skip } = lerParametros(req.query);
    const filtro = {};

    if (req.query.q) {
      const regex = { $regex: req.query.q, $options: 'i' };
      filtro.$or = [{ titulo: regex }, { conteudo: regex }, { autor: regex }];
    }

    const [posts, total] = await Promise.all([
      Post.find(filtro).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Post.countDocuments(filtro)
    ]);

    return res.status(200).json({
      success: true,
      count: posts.length,
      meta: montarMeta({ page, limit, total }),
      data: posts
    });
  } catch (error) {
    return tratarErro(error, res);
  }
};

// GET /posts/search?q= — busca por palavra-chave (mantida da fase 2)
const searchPosts = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ success: false, message: 'Parâmetro de busca "q" é obrigatório' });
    }

    const { page, limit, skip } = lerParametros(req.query);
    const regex = { $regex: q, $options: 'i' };
    const filtro = { $or: [{ titulo: regex }, { conteudo: regex }, { autor: regex }] };

    const [posts, total] = await Promise.all([
      Post.find(filtro).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Post.countDocuments(filtro)
    ]);

    return res.status(200).json({
      success: true,
      count: posts.length,
      meta: montarMeta({ page, limit, total }),
      data: posts
    });
  } catch (error) {
    return tratarErro(error, res);
  }
};

// GET /posts/:id
const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post não encontrado' });
    }
    return res.status(200).json({ success: true, data: post });
  } catch (error) {
    return tratarErro(error, res);
  }
};

// POST /posts — somente professores autenticados
const createPost = async (req, res) => {
  try {
    const { titulo, conteudo } = req.body;
    const autor = req.body.autor || req.user.nome;

    const post = await Post.create({ titulo, conteudo, autor, autorId: req.user._id });
    return res.status(201).json({ success: true, data: post });
  } catch (error) {
    return tratarErro(error, res);
  }
};

// PUT /posts/:id — somente professores autenticados
const updatePost = async (req, res) => {
  try {
    const { titulo, conteudo, autor } = req.body;
    const camposAlterados = {};

    if (titulo !== undefined) camposAlterados.titulo = titulo;
    if (conteudo !== undefined) camposAlterados.conteudo = conteudo;
    if (autor !== undefined) camposAlterados.autor = autor;

    const post = await Post.findByIdAndUpdate(req.params.id, camposAlterados, {
      new: true,
      runValidators: true
    });

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post não encontrado' });
    }
    return res.status(200).json({ success: true, data: post });
  } catch (error) {
    return tratarErro(error, res);
  }
};

// DELETE /posts/:id — somente professores autenticados
const deletePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post não encontrado' });
    }
    return res.status(200).json({ success: true, message: 'Post excluído com sucesso' });
  } catch (error) {
    return tratarErro(error, res);
  }
};

module.exports = { getAllPosts, searchPosts, getPostById, createPost, updatePost, deletePost };
