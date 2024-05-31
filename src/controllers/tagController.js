// Importar el modelo User desde la base de datos
const { where } = require('sequelize');
const { Op, fn, col } = require('sequelize');
const { Tag } = require('../db');
const createTag = async (tag) => {
    try {
        
        const [tagCreated, created] = await Tag.findOrCreate({
        where: where(fn('LOWER', col('name')), Op.eq, tag.toLowerCase()),
        defaults: { name: tag }
    });

        return tagCreated;
    } catch (error) {
        console.error('Error creating tag:', error);
        throw new Error('Error creating tag: ' + error.message);
    }
};
const getAllTagsController = async (name) => {
    try {
        if (name) {
            const tags = await Tag.findOne({
                where: where(fn('LOWER', col('name')), Op.eq, name.toLowerCase())
            });
            return tags;
        } else {
            const tags = await Tag.findAll();
            return tags;
        }
    } catch (error) {
        throw new Error('Error fetching tags: ' + error.message);
    }
};
const updateTag = async (id, newName) => {
    try {
        const tag = await Tag.findByPk(id);
        if (!tag) {
            throw new Error('tag not found');
        }

        tag.name = newName;
        await tag.save();

        return tag;
    } catch (error) {
        throw new Error('Error updating tag: ' + error.message);
    }
};

// Exportar la función createUser
module.exports = {
    updateTag,
    getAllTagsController,
    createTag
};
