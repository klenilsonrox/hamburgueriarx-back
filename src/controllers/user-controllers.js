
import { db } from "../database/conndb.js";
import { createUserService, 
    findUserByIdService,
findAllUsersService,
    deleteUserService,
    updateUserService,
    getUserByEmailService,
    getUserInfosService,
    loginUserService,
    sendPasswordResetEmailService,
    updatePasswordService} from "../services/user-services.js";
import { generateToken } from "../utils/generateToken.js";


    export const registerUserController = async (req, res) => {
        const { name, email, password,whatsapp,cep,rua,numero,bairro,cidade,complemento,referencia } = req.body;
       try {

        if(!name || !email || !password || !whatsapp || !cep || !rua || !numero || !bairro || !cidade){
            return res.status(400).json({   
                error: "Preencha todos os campos",
                sucess: false
            })
        }

        const userExist = await getUserByEmailService(email);
        if (userExist) {
            return res.status(400).json({
                error: "Email ja existe",
                sucess: false
            })
        }
       

        const user = await createUserService({ name, email, password,whatsapp,cep,rua,numero,bairro,cidade });

        const token = await generateToken(user);

        const dados = {
            id: user.id,
            name: user.name,
            email: user.email,
            whatsapp: user.whatsapp,
            isAdmin: user.isAdmin,
            cep: user.cep,
            rua: user.rua,
            numero: user.numero,
            bairro: user.bairro,
            cidade: user.cidade,
            complemento: user.complemento,
            referencia: user.referencia,
            token
        }

    
        return res.status(201).json({ dados,sucess: true, });
       } catch (error) {
        return res.status(500).json({ error: error.message, sucess:false });
       }
    };



    export const getUserByIdController = async (req, res) => {
        try {
            const userExist = await findUserByIdService(req.params.id);

            if(!userExist){
                return res.status(404).json({
                    error: "Nenhum usuário encontrado",
                    sucess: false
                })
            }



            res.status(200).json({userExist, sucess: true});
        } catch (error) {
            return res.status(500).json({ error: error.message, sucess:false });
        }
    };

    export const getAllUsersController = async (req,res)=>{
        try {
            const users = await findAllUsersService();
            return res.status(200).json({users, sucess: true});
        } catch (error) {
            return res.status(500).json({ error: error.message, sucess:false });
        }
    }

    export const updateUserController = async (req, res) => {
        const { name,whatsapp,cep,bairro,rua,numero,cidade,complemento,referencia } = req.body;
        const id = req.user.id
        try {


            const user = await updateUserService(id, { name,whatsapp,cep,bairro,rua,numero,cidade,complemento,referencia });

            const dados = {
                id: user.id,
                name: user.name,
                email: user.email,
                whatsapp: user.whatsapp,
                isAdmin: user.isAdmin,
                cep: user.cep,
                rua: user.rua,
                numero: user.numero,
                bairro: user.bairro,
                cidade: user.cidade,
                complemento: user.complemento,
                referencia: user.referencia
            }

            const token = await generateToken(user)

            res.status(200).json({
                dados,
                token,
                sucess: true,
            });
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: error.message, sucess:false });
        }
    };


    export const deleteUserController = async (req, res) => {
        const { id } = req.params;
        try {
            const user = await deleteUserService(id);
            res.status(200).json({
                user,
                sucess: true,
            });
        } catch (error) {
            return res.status(500).json({ error: error.message, sucess:false });
        }
    };

    export const getUserInfosController = async (req, res) => {
      const id = req.user.id
      const userId= req.user.id
        try {
            const user = await getUserInfosService(id);




        const dados = {
            id: user.id,
            name: user.name,
            email: user.email,
            whatsapp: user.whatsapp,
            isAdmin: user.isAdmin,
            cep: user.cep,
            rua: user.rua,
            numero: user.numero,
            bairro: user.bairro,
            cidade: user.cidade,
            complemento: user.complemento,
            referencia: user.referencia
        }


            res.status(200).json(dados);
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: error, sucess:false });
        }
    };



    export const loginUserController = async (req, res) => {
        const { email, password } = req.body;
    
        try {
            const user = await loginUserService(email, password);
            const token = await generateToken(user);
    
            res.status(200).json({ token, success: true });
        } catch (error) {
            console.log(error.message);
    
            // Se for um erro de autenticação, retorna status 400
            if (error.message === 'Email ou senha incorretos.') {
                return res.status(400).json({ error: error.message, success: false });
            }
    
            // Qualquer outro erro retorna status 500
            return res.status(500).json({ error: 'Erro no servidor', success: false });
        }
    };






    export const requestPasswordReset = async (req, res) => {
        const { email } = req.body;
        try {
          const user = await getUserByEmailService(email);
          if (!user) {
            return res.status(404).json({
              error: "Nenhum usuário encontrado",
              sucess: false,
            });
          }
          const result = await sendPasswordResetEmailService(email);
          res.status(200).json({ result, sucess: true });
        } catch (error) {
          return res.status(500).json({ error: error.message, sucess: false });
        }
      };


      export const resetPasswordController = async (req, res) => {
        const { token, newPassword } = req.body;
      
        try { 
          // Verifica se o token está presente
          if (!token || !newPassword) {
            return res.status(400).json({ error: 'Token e nova senha são obrigatórios.', sucess: false });
          }
      
          // Procura o usuário com base no token
          const users = await db.user.findMany({
            where: { resetToken: token },
          });
      
          const user = users.length > 0 ? users[0] : null; // Pega o primeiro usuário encontrado
      
          // Verifica se o usuário existe e se o token não está expirado
          if (!user || (user.resetTokenExpiry && new Date() > user.resetTokenExpiry)) {
            return res.status(400).json({ error: 'Token inválido ou expirado.', sucess: false });
          }
          // Atualiza a senha do usuário
          const result = await updatePasswordService(user.id, newPassword);

          const tokenGerado = await generateToken(user);

          return res.status(200).json({ tokenGerado, sucess: true });
        } catch (error) {
          return res.status(500).json({ error: error.message, sucess: false });
        }
      };