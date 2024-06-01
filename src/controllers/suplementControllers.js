const { Suplement, Category, Provider, Tag } = require('../db.js');
const { where } = require('sequelize');
const { Op, fn, col } = require('sequelize');
const { cleanInfoSuplements } = require('../utils/index');
const stringToTagsArray = require('../utils/stringToTagsArray.js');

const getSuplements = async () => {

    const suplements = await Suplement.findAll({
        include: [
            // {
            //     model: Category,
            //     as: 'category', // Ensure this matches the alias in your relationship definition
            //     attributes: ['id', 'name'],
            // },
            // {
            //     model: Provider,
            //     as: 'Provider', // Ensure this matches the alias in your relationship definition
            //     attributes: ['id', 'name'],
            // },
            {
                model: Tag,
                as: 'Tags', // Ensure this matches the alias in your relationship definition
                attributes: ['id', 'name'],
                through: { attributes: [] } // Exclude the attributes from the join table
            }
        ]
    });
    // const response = cleanInfoSuplements(suplements);
    return suplements
}


const getSuplementByName = async (name) => {
    return await Suplement.findAll({
        where: {
            // Utilizamos la expresión regular para buscar coincidencias de cualquier palabra del nombre
            name: {
                [Op.iLike]: `%${name}%`
            },
            include: [
                // {
                //     model: Category,
                //     as: 'category', // Ensure this matches the alias in your relationship definition
                //     attributes: ['id', 'name'],
                // },
                // {
                //     model: Provider,
                //     as: 'Provider', // Ensure this matches the alias in your relationship definition
                //     attributes: ['id', 'name'],
                // },
                {
                    model: Tag,
                    as: 'Tags', // Ensure this matches the alias in your relationship definition
                    attributes: ['id', 'name'],
                    through: { attributes: [] } // Exclude the attributes from the join table
                }
            ]


        }
    });
};


const getSuplementById = async (id) => {
    try {
        const suplement = await Suplement.findByPk(id, {
            include: [
                {
                    model: Category,
                    as: 'category', // Ensure this matches the alias in your relationship definition
                    attributes: ['id', 'name'],
                },
                {
                    model: Provider,
                    as: 'Provider', // Ensure this matches the alias in your relationship definition
                    attributes: ['id', 'name'],
                },
                {
                    model: Tag,
                    as: 'Tags', // Ensure this matches the alias in your relationship definition
                    attributes: ['id', 'name'],
                    through: { attributes: [] } // Exclude the attributes from the join table
                }
            ]
        });
        return suplement;
    } catch (error) {
        throw new Error(error.message);
    }
};


// const createSuplement = async (suplement, category) => {
//     const [categoryCreated, created] = await Category.findOrCreate({
//         where: where(fn('LOWER', col('name')), Op.eq, category.toLowerCase()),
//         defaults: { name: category }
//     });

//     const suplementCreated = await Suplement.create(suplement);

//     await suplementCreated.addCategory(categoryCreated);

//     return suplementCreated;
// }
const createSuplement = async (suplement, category, provider, tags) => {

    try {
        // Crear o encontrar el proveedor
        const [providerCreated] = await Provider.findOrCreate({
            where: { name: provider },
            defaults: { name: provider }
        });

        // Crear o encontrar la categoría y obtener su ID
        const [categoryCreated] = await Category.findOrCreate({
            where: where(fn('LOWER', col('name')), Op.eq, category.toLowerCase()),
            defaults: { name: category }
        });

        // Crear el suplemento con la categoría asociada
        const suplementCreated = await Suplement.create({
            ...suplement,
            CategoryId: categoryCreated.id,
            ProviderId: providerCreated.id
        });

        // Crear o encontrar las etiquetas y asociarlas con el suplemento
        const tagsArray = JSON.parse(tags);

        // Crear o encontrar las etiquetas y asociarlas con el suplemento
        for (const tagName of tagsArray) {
            const [tagCreated] = await Tag.findOrCreate({ where: { name: tagName } });
            await suplementCreated.addTag(tagCreated);
        }

        return suplementCreated;
    } catch (error) {
        throw new Error(error.message);
    }
};

const getFilteredSuplementsController = async (params) => {
    const { category, tags, provider, orderBy, orderDirection, name, page = 1, pageSize = 7 } = params;
    let order = [];
    if (orderBy && orderDirection) {
        order = [[orderBy, orderDirection]]
    }

    let where = {};

    if (name) where = { ...where, name: { [Op.iLike]: `%${name}%` } }; // Filtro case-insensitive
    if (category) where = { ...where, CategoryId:category  }; // Filtro case-insensitive

    try {
        let include = [];
        if (provider) {
            include.push({
                model: Provider,
                as:"Provider",
                where: { id: provider }
            });
        }
        if(tags){

            const tagsArray=stringToTagsArray(tags)
            if ( tagsArray.length > 0) {
                include.push({
                    model: Tag,
                    as:"Tags",
                    where: {
                        name: {
                            [Op.in]: tagsArray
                        }
                    }
                });
            }
        }

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

// const updateSuplement = async (id, suplementData, category) => {
//     console.log(id);
//     console.log(suplementData);
//     console.log(category);
//     try {
//         const [categoryCreated, created] = await Category.findOrCreate({
//             where: { name: category },
//             defaults: { name: category }
//         });
//         console.log(created);

//         const suplement = await Suplement.findByPk(id);
//         if (!suplement) {
//             throw new Error('Suplemento no encontrado');
//         }

//         // Actualizar los campos del suplemento
//         await suplement.update(suplementData);

//         // Asignar la categoría
//         await suplement.setCategories([categoryCreated]);

//         return suplement;
//     } catch (error) {
//         console.log("Error aquí");
//         throw new Error(error.message);
//     }
// }
const updateSuplement = async (id, suplementData, tags) => {

    try {
        const suplement = await Suplement.findByPk(id);
        if (!suplement) {
            throw new Error('Suplemento no encontrado');
        }

        // Crear o encontrar el proveedor y obtener su ID
        const [providerCreated] = await Provider.findOrCreate({
            where: { name: suplementData.provider },
            defaults: { name: suplementData.provider }
        });

        // Crear o encontrar la categoría y obtener su ID
        const [categoryCreated] = await Category.findOrCreate({
            where: where(fn('LOWER', col('name')), Op.eq, suplementData.category.toLowerCase()),
            defaults: { name: suplementData.category }
        });

        // Actualizar los campos del suplemento y asociar el proveedor y la categoría
        await suplement.update({
            ...suplementData,
            CategoryId: categoryCreated.id,
            ProviderId: providerCreated.id
        });

        // Crear o encontrar las etiquetas y asociarlas con el suplemento
        const tagsArray = stringToTagsArray(tags);
        console.log(tagsArray, "tagsArray");

        // Crear o encontrar las etiquetas y recogerlas en un array
        const tagInstances = await Promise.all(
            tagsArray.map(async (tagName) => {
                const [tagCreated] = await Tag.findOrCreate({ where: { name: tagName } });
                return tagCreated;
            })
        );

        // Asociar todas las etiquetas con el suplemento
        await suplement.setTags(tagInstances);

        return suplement;
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
    getRandomSuplements,
    updateSuplement
}