// Normaliza ?page e ?limit e monta o bloco de metadados da resposta paginada
const lerParametros = (query, limitePadrao = 10) => {
  const page = Math.max(parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(query.limit, 10) || limitePadrao, 1), 100);
  return { page, limit, skip: (page - 1) * limit };
};

const montarMeta = ({ page, limit, total }) => ({
  page,
  limit,
  total,
  totalPages: Math.max(Math.ceil(total / limit), 1),
  hasNextPage: page * limit < total,
  hasPrevPage: page > 1
});

module.exports = { lerParametros, montarMeta };
