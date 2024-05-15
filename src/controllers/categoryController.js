// Importar el modelo User desde la base de datos
const { where } = require('sequelize');
const { Op, fn, col } = require('sequelize');
const { Category } = require('../db');
const createCategory = async (name) => {
    try {
        const [category, created] = await Category.findOrCreate({
            where: { name },
            defaults: { name }
        });
        return { category, created };
    } catch (error) {
        throw new Error('Error creating user: ' + error.message);
    }
}
const getAllCategoryController = async (name) => {
    try {
        if (name) {
            const category = await Category.findOne({
                where: where(fn('LOWER', col('name')), Op.eq, name.toLowerCase())
            });
            return category;
        } else {
            const categories = await Category.findAll();
            return categories;
        }
    } catch (error) {
        throw new Error('Error fetching categories: ' + error.message);
    }
};


// Exportar la función createUser
module.exports = {
    createCategory,
    getAllCategoryController,
};
