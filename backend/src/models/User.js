const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const ROLES = ['professor', 'aluno'];

const userSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: [true, 'O nome é obrigatório'],
      trim: true,
      maxlength: [120, 'O nome deve ter no máximo 120 caracteres']
    },
    email: {
      type: String,
      required: [true, 'O e-mail é obrigatório'],
      trim: true,
      lowercase: true,
      unique: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Informe um e-mail válido']
    },
    senha: {
      type: String,
      required: [true, 'A senha é obrigatória'],
      minlength: [6, 'A senha deve ter no mínimo 6 caracteres'],
      select: false
    },
    role: {
      type: String,
      enum: { values: ROLES, message: 'A role deve ser professor ou aluno' },
      required: [true, 'A role é obrigatória']
    },
    materia: {
      type: String,
      trim: true,
      default: ''
    },
    turma: {
      type: String,
      trim: true,
      default: ''
    }
  },
  { timestamps: true }
);

userSchema.pre('save', async function hashSenha(next) {
  if (!this.isModified('senha')) return next();
  this.senha = await bcrypt.hash(this.senha, 10);
  next();
});

userSchema.methods.compararSenha = function compararSenha(senhaInformada) {
  return bcrypt.compare(senhaInformada, this.senha);
};

userSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret.senha;
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('User', userSchema);
module.exports.ROLES = ROLES;
