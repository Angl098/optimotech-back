const { User } = require('../db');
const transporter = require('../helper/mailer');

const createUser = async (name, sex, email, password, cellphone, address) => {
    return await User.create({name, sex, email, password, cellphone, address});
}

const sendEmailController = async (email, name, type) => {
    let mailInfo= {from: process.env.EMAIL,
        to: email}
    if (type === 'welcome'){
        mailInfo.subject = 'Optimotech - Cuenta Creada'
        mailInfo.html = `<h1>¡Hola ${name}, tu cuenta ha sido creada exitosamente!</h1>` 
    } else if (type === 'buy'){
        mailInfo.subject= 'Optimotech - Compra exitosa'
        mailInfo.html = `<h1>¡Hola ${name}, tu compra ha sido  exitosa!</h1>`
    }
    return await transporter.sendMail(mailInfo)
}

const getAllUsers = async () => {
    return await User.findAll({
        attributes: { exclude: ['password'] },
        paranoid: false // Include soft-deleted users
    });
};
const banUser = async (id) => {
    const user = await User.findByPk(id);
    if (!user) {
        throw new Error('Usuario no encontrado');
    }

    user.banned = true; // Actualizar la columna banned a true
    await user.save();
    return user;
}

const unbanUser = async (id) => {
    const user = await User.findByPk(id, { paranoid: false }); // Incluir usuarios eliminados lógicamente
    if (!user) {
        throw new Error('Usuario no encontrado');
    }

    user.banned = false; // Actualizar la columna banned a false
    await user.save();
    return user;
};
module.exports = {
    createUser,
    sendEmailController,
    getAllUsers,
    banUser,
    unbanUser
}