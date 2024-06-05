const { User } = require('../db');
const transporter = require('../helper/mailer');

const createUser = async (name, sex, email, password, cellphone, address) => {
    return await User.create({name, sex, email, password, cellphone, address});
}

const sendEmailController = async (email, name) => {
    return await transporter.sendMail({
        from: process.env.EMAIL,
        to: email,
        subject: 'Optimotech - Cuenta Creada',
        html: `<h1>¡Hola ${name}, tu cuenta ha sido creada exitosamente!</h1>`
    })
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