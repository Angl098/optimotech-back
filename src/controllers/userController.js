const { Op } = require('sequelize');
const { User } = require('../db');
const transporter = require('../helper/mailer');
const { hashPassword } = require('../utils/hashedPassword');
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
const getFilteredUserController = async (params) => {
    const { email,  orderBy, orderDirection, page = 1, pageSize = 7 } = params;
    let order = [];
    if (orderBy && orderDirection) {
        order = [[orderBy, orderDirection]]
    }

    let where = {};

    if (email) where = { ...where, email: { [Op.iLike]: `%${email}%` } }; // Filtro case-insensitive

    try {
        let include = [];

        // Calcular el offset en función de la página y el tamaño de página
        const offset = (page - 1) * pageSize;

        const body = {
            include,
            where,
            order,
            limit: pageSize,
            offset
        }

        // Realizar la consulta con Sequelize
        const { count, rows } = await User.findAndCountAll(body);
        // Calcular el número total de páginas
        const totalPages = Math.ceil(count / pageSize);

        // Devolver los suplementos filtrados, el número total de páginas y la página actual
        return {
            totalPages,
            currentPage: page,
            pageSize,
            totalItems: count,
            items: rows
        };

    } catch (error) {
        throw Error(error.message);
    }
};

const changePasswordController = async (email, newPassword) => {
    try {
        // Hashear la nueva contraseña
        const hashedPassword = await hashPassword(newPassword);

        // Buscar y actualizar la contraseña del usuario
        const [updated] = await User.update(
            { password: hashedPassword },
            { where: { email } }
        );

        if (updated) {
            return { message: 'Contraseña actualizada exitosamente' };
        } else {
            throw new Error('Usuario no encontrado');
        }
    } catch (error) {
        throw new Error(error.message);
    }
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
    getFilteredUserController,
    sendEmailController,
    createUser,
    changePasswordController,

    sendEmailController,
    getAllUsers,
    banUser,
    unbanUser
}
