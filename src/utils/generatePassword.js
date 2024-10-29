import bcrypt from 'bcryptjs'


const generatePassword = async (password) => {

    const salt = await bcrypt.genSalt(10)

    return await bcrypt.hash(password, salt)

}

export default generatePassword