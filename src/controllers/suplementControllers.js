const { Suplement, Category } = require('../db.js');
const { where } = require('sequelize');
const { Op, fn, col } = require('sequelize');
const { cleanInfoSuplements } = require('../utils/index');

const getSuplements = async () => {

    const suplements = await Suplement.findAll({include : [
        {
            model: Category,
            attributes: ["id", "name"], // Incluye solo los atributos que necesitas
            through: { attributes: [] }, // No incluye los atributos de la tabla intermedia
        },
    ]});
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

const createSuplement = async (suplement, category) => {
    const [categoryCreated, created] = await Category.findOrCreate({
        where: where(fn('LOWER', col('name')), Op.eq, category.toLowerCase()),
        defaults: { name: category }
    });

    const suplementCreated = await Suplement.create(suplement);

    await suplementCreated.addCategory(categoryCreated);

    return suplementCreated;
}
const includeAll = (categoryId) => {
    if (categoryId) {
        return include = [
            {
                model: Category,
                where: { id: categoryId },
                attributes: ["id", "name"], // Incluye solo los atributos que necesitas
                through: { attributes: [] }, // No incluye los atributos de la tabla intermedia
            },
        ]
    }
    else {
        return include = [
            {
                model: Category,
                attributes: ["id", "name"], // Incluye solo los atributos que necesitas
                through: { attributes: [] }, // No incluye los atributos de la tabla intermedia
            },
        ]

    }

}

const getFilteredSuplementsController = async (query) => {
    const { category, orderBy, orderDirection } = query
    let order = [];
    if (orderBy && orderDirection) {
        order = [[orderBy, orderDirection]]
    }

    let where = {};

    // if (category) where = { ...where, category };

    try {
        // let include= includeAll(category)
        let include = [];

        if (category) {
            include.push({
                model: Category,
                through: { attributes: [] }, // Esto excluye los atributos de la tabla intermedia
                where: { id: category }
            });
        }


        console.log("Query parameters:", { include, where, order });
        const suplementsFiltered = await Suplement.findAll({ include, where, order });

        return suplementsFiltered;

    } catch (error) {
        throw Error(error.message);
    }
};
const getRandomSuplements = async () => {
    try {
        const suplements = await Suplement.findAll({
            include: [
                {
                    model: Category,
                    attributes: ["id", "name"],
                    through: { attributes: [] },
                },
            ],
            order: [
                [fn('RANDOM')],
            ],
            limit: 3,
        });
        return suplements;
    } catch (error) {
        throw new Error(error.message);
    }
};
module.exports = {
    getSuplements,
    getSuplementByName,
    getSuplementById,
    createSuplement,
    getFilteredSuplementsController,
    getRandomSuplements
}