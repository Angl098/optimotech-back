const { Suplement , Category} = require('../db.js');
const { where } = require('sequelize');
const { Op, fn, col } = require('sequelize');
const {cleanInfoSuplements} = require('../utils/index');

const getSuplements = async () => {
    const suplements = await Suplement.findAll();
    const response = cleanInfoSuplements(suplements);
    return response
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

const createSuplement = async (suplement,category) => {
    const [categoryCreated, created] = await Category.findOrCreate({
        where: where(fn('LOWER', col('name')), Op.eq, category.toLowerCase()),
        defaults: { name: category }
    });

    return await Suplement.create({...suplement, CategoryId: categoryCreated.dataValues.id});
}
const getHousingFilteredHandler = async (params) => {
    const {category,orderBy,orderDirection}=params
    let order = [];
    if (orderBy && orderDirection) order = [[orderBy, orderDirection]];
  
    let where = { availability: true };
  
    if (category) where = { ...where, category };
  
    try {
        
        const suplementsFiltered = await Suplement.findAll({include, where, order });
        return suplementsFiltered;

    } catch (error) {
      throw Error(error.message);
    }
  };
module.exports = { 
    getSuplements,
    getSuplementByName,
    getSuplementById, 
    createSuplement,
    getHousingFilteredHandler
}