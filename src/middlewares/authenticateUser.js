// authMiddleware.js

import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  // Pega o token do cabeçalho de autorização
  const tokenBuscado = req.header('Authorization')


  if (!tokenBuscado) {
    return res.status(401).json({ error: 'Acesso negado. Nenhum token fornecido.' });
  }

  const token = tokenBuscado.replace('Bearer ', '');

  try {
    // Verifica e decodifica o token usando a chave secreta
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded; // Adiciona os dados do usuário ao objeto de requisição
    next(); // Chama o próximo middleware ou rota
  } catch (error) {
    res.status(400).json({ error: 'Token inválido.' });
  }
};

export default authMiddleware;
