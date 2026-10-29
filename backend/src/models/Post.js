const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      required: [true, 'O título é obrigatório'],
      trim: true,
      maxlength: [150, 'O título deve ter no máximo 150 caracteres']
    },
    conteudo: {
      type: String,
      required: [true, 'O conteúdo é obrigatório'],
      trim: true
    },
    autor: {
      type: String,
      required: [true, 'O autor é obrigatório'],
      trim: true
    },
    autorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    }
  },
  { timestamps: true }
);

postSchema.index({ titulo: 'text', conteudo: 'text' });

module.exports = mongoose.model('Post', postSchema);
