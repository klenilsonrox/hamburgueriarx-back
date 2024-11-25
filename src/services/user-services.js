import {db} from "../database/conndb.js";
import bcrypt from 'bcryptjs'
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import generatePassword from "../utils/generatePassword.js";


export const createUserService = async(data)=>{

const {email,password,name,whatsapp,cep,rua,numero,bairro,cidade,complemento,referencia} = data

const hashPassword =await generatePassword(password)

data = {
    email,
    password : hashPassword,
    name,
    whatsapp,
    cep,
    rua,
    numero,
    bairro,
    cidade,
    complemento,
    referencia
}

    try {
        const user =await db.user.create({
            data :data
        })

        return user
    } catch (error) {
        throw new Error("erro ao criar usuário",error.message)
    }
}

export const findUserByIdService = async(id)=>{
    try {
        const user =await db.user.findUnique({
            where :{
                id : id
            }
        })
        return user
    } catch (error) {
        throw new Error("erro ao encontrar usuário",error.message)
    }
}

export const findAllUsersService = async()=>{
    try {
        const users =await db.user.findMany()
        return users
    } catch (error) {
        throw new Error("erro ao encontrar usuários",error.message)
    }
}

export const updateUserService = async(id,data)=>{
    try {
        const user =await db.user.update({
            where :{
                id : id
            },
            data :data
        })
        return user
    } catch (error) {
        throw new Error("erro ao atualizar usuário",error.message)
    }
}


export const deleteUserService = async(id)=>{
    try {
        const user =await db.user.delete({
            where :{
                id : id
            }
        })
        return user
    } catch (error) {
        throw new Error("erro ao deletar usuário",error.message)
    }
}

export const getUserByEmailService = async(email)=>{
    try {
        const user =await db.user.findUnique({
            where :{
                email : email
            }
        })
        return user
    } catch (error) {
        throw new Error("erro ao encontrar usuário",error.message)
    }
}


export const getUserInfosService = async(id)=>{
    try {

        const user =await db.user.findUnique({
            where :{
                id : id
            },
            
        })


        return user
    } catch (error) {
        throw new Error("erro ao encontrar informações do usuário",error.message)
    }
}



export const loginUserService = async(email, password) => {
    try {
        const user = await db.user.findFirst({
            where: { email: email },
        });

        if (!user) {
            throw new Error('Email ou senha incorretos.');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error('Email ou senha incorretos.');
        }

        return user;
    } catch (error) {
        throw error; 
    }
}



export const sendPasswordResetEmailService = async (email) => {

    const user = await db.user.findUnique({
      where: { email },
    });
  
    if (!user) {
      throw new Error('Usuário não encontrado.');
    }
  
    // Gera um token de recuperação e define uma expiração
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); 
  

    await db.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });
  
    // Configurações do Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_PASS, 
      },
    });
  
 
    const resetUrl = `https://hamburgueriarx.vercel.app/auth/resetar-senha?token=${resetToken}&user=${email}`;
  
 
    const mailOptions = {
      from: process.env.GMAIL_EMAIL, 
      to: user.email, 
      subject: 'Recuperação de Senha',
      text: `Clique no seguinte link para redefinir sua senha: ${resetUrl}`,
      html: `<p>Clique no seguinte link para redefinir sua senha: <a href="${resetUrl}">Redefinir Senha</a></p>`,
    };
  

    await transporter.sendMail(mailOptions);
    return 'E-mail de recuperação de senha enviado com sucesso.';
  };


  export const updatePasswordService = async (userId, newPassword) => {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
  

    await db.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
        resetToken: null, 
        resetTokenExpiry: null, 
      },
    });
  
    return 'Senha alterada com sucesso.';
  };