const { Suplement, Category } = require('../db.js');
const { where } = require('sequelize');
const { Op, fn, col } = require('sequelize');
const { cleanInfoSuplements } = require('../utils/index');

const getSuplements = async () => {

    const suplements = await Suplement.findAll({
        include: [
            {
                model: Category,
                attributes: ["id", "name"], // Incluye solo los atributos que necesitas
                through: { attributes: [] }, // No incluye los atributos de la tabla intermedia
            },
        ]
    });
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

const getFilteredSuplementsController = async (params) => {
    const { category, orderBy, orderDirection, name, page=1, pageSize=7} = params;
    let order = [];
    if (orderBy && orderDirection) {
        order = [[orderBy, orderDirection]]
    }

    let where = {};

    if (name) where = { ...where, name: { [Op.iLike]: `%${name}%` } }; // Filtro case-insensitive

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

        // Calcular el offset en función de la página y el tamaño de página
        const offset = (page - 1) * pageSize ;

        const body={
            include,
            where,
            order,
            limit: pageSize,
            offset
        }
        console.log(body ,"BODY");
        // Realizar la consulta con Sequelize
        const { count, rows } = await Suplement.findAndCountAll(body);
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

const updateSuplement = async (id, suplementData, category) => {
    try {
        const suplement = await Suplement.findByPk(id);
        if (!suplement) {
            throw new Error('Suplemento no encontrado');
        }

        // Actualizar los campos del suplemento
        await suplement.update(suplementData);

        // Si hay una categoría, actualizarla también (esto depende de cómo esté definida tu relación de categorías)
        if (category) {
            await suplement.setCategory(category);
        }

        return suplement;
    } catch (error) {
        throw new Error(error.message);
    }
}
module.exports = {
    getSuplements,
    getSuplementByName,
    getSuplementById,
    createSuplement,
    getFilteredSuplementsController,
    getRandomSuplements,
    updateSuplement
}