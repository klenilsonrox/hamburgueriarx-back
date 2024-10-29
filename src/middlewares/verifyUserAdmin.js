// adminMiddleware.js

const adminMiddleware = (req, res, next) => {
    // Verifica se o usuário foi definido pelo middleware de autenticação
    if (!req.user) {
      return res.status(401).json({ error: 'Acesso negado. Usuário não autenticado.' });
    }
  
    // Verifica se o usuário é admin
    if (!req.user.isAdmin) {
      return res.status(403).json({ error: 'Acesso negado. Permissão insuficiente.' });
    }
  
    next(); // Se o usuário é admin, chama o próximo middleware ou rota
  };
  
  export default adminMiddleware;
  