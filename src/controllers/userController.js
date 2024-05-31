const { User } = require('../db');
const transporter = require('../helper/mailer');

const createUser = async (name, sex, email, password, cellphone, address) => {
    return await User.create({name, sex, email, password, cellphone, address});
}

const sendEmailController = async (email) => {
    return await transporter.sendMail({
        from: process.env.EMAIL,
        to: email,
        subject: 'Optimotech - Cuenta Creada',
        html: `<h1>¡Cuenta creada exitosamente!</h1>`
    })
}

module.exports = {
    createUser,
    sendEmailController
}