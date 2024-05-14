const { Suplement } = require('../db.js');
const { Op } = require('sequelize');

const {cleanInfoSuplements} = require('../utils/index');

const getSuplements = async () => {
    const suplements = await Suplement.findAll();
    const response = cleanInfoSuplements(suplements);
    return response
}
const getAllSuplementsController = async () => {
    const suplements = await Suplement.findAll();
    return suplements
}


const getSuplementByName = async (name) => {
    return await Suplement.findAll({
        where: {
            // Utilizamos la expresión regular para buscar coincidencias de cualquier palabra del nombre
            name: {
                [Op.iLike]: `%${name}%`
            }
        }
    });
};


const getSuplementById = async (id) => {
    return await Suplement.findByPk(id);
}

const createSuplement = async (suplement) => {
    return await Suplement.create(suplement);
}

module.exports = { 
    getSuplements,
    getSuplementByName,
    getSuplementById, 
    createSuplement,
    getAllSuplementsController
}