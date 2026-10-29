// Converte erros do mongoose em respostas HTTP consistentes
const tratarErro = (error, res) => {
  if (error.name === 'ValidationError') {
    const mensagens = Object.values(error.errors).map((e) => e.message);
    return res.status(400).json({ success: false, message: mensagens.join(', ') });
  }
  if (error.name === 'CastError') {
    return res.status(400).json({ success: false, message: 'Identificador inválido' });
  }
  if (error.code === 11000) {
    return res.status(409).json({ success: false, message: 'Já existe um registro com este e-mail' });
  }
  return res.status(500).json({ success: false, message: error.message });
};

const notFound = (req, res) => {
  res.status(404).json({ success: false, message: 'Rota não encontrada' });
};

module.exports = { tratarErro, notFound };
