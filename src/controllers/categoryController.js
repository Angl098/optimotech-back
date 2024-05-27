// Importar el modelo User desde la base de datos
const { where } = require('sequelize');
const { Op, fn, col } = require('sequelize');
const { Category } = require('../db');
const createCategory = async (category) => {
    try {
        console.log('Creating category with name:', category);
        
        const [categoryCreated, created] = await Category.findOrCreate({
        where: where(fn('LOWER', col('name')), Op.eq, category.toLowerCase()),
        defaults: { name: category }
    });

        return categoryCreated;
    } catch (error) {
        console.error('Error creating category:', error);
        throw new Error('Error creating category: ' + error.message);
    }
};
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
const updateCategory = async (id, newName) => {
    try {
        const category = await Category.findByPk(id);
        if (!category) {
            throw new Error('Category not found');
        }

        category.name = newName;
        await category.save();

        return category;
    } catch (error) {
        throw new Error('Error updating category: ' + error.message);
    }
};

// Exportar la función createUser
module.exports = {
    createCategory,
    getAllCategoryController,
    updateCategory
};
