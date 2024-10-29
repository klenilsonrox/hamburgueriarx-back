import jwt from 'jsonwebtoken';

export const generateToken = (user) => {
    const token = jwt.sign({ id: user.id, isAdmin: user.isAdmin,name: user.name,rua:user.rua,numero:user.numero,bairro:user.bairro,cidade:user.cidade,email:user.email,whatsapp:user.whatsapp,cep:user.cep,complemento:user.complemento,referencia:user.referencia   }, process.env.SECRET_KEY, {
        expiresIn: '3d', // O token expirará em 1 hora
      });
      return token
}