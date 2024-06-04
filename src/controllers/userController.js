const { Op } = require('sequelize');
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
module.exports = {
    createUser,
    sendEmailController,
    getFilteredUserController
}