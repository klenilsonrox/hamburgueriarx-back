import { findUserByIdService } from "../services/user-services.js"

export const verifyUserExist = async (req, res, next) => {
    const { id } = req.params
    const user = await findUserByIdService(id)


    if (!user) {
        return res.status(404).json({ error: 'nenhum usuário encontrado', sucess: false })
    }



    next()
}