// Importar el modelo User desde la base de datos
const { where } = require('sequelize');
const { Op, fn, col } = require('sequelize');
const { Provider } = require('../db');
const createProvider = async (provider) => {
    try {
        
        const [providerCreated, created] = await Provider.findOrCreate({
        where: where(fn('LOWER', col('name')), Op.eq, provider.toLowerCase()),
        defaults: { name: provider }
    });

        return providerCreated;
    } catch (error) {
        console.error('Error creating provider:', error);
        throw new Error('Error creating provider: ' + error.message);
    }
};
const getAllProvidersController = async (name) => {
    try {
        if (name) {
            const providers = await Provider.findOne({
                where: where(fn('LOWER', col('name')), Op.eq, name.toLowerCase())
            });
            return providers;
        } else {
            const providers = await Provider.findAll();
            return providers;
        }
    } catch (error) {
        throw new Error('Error fetching providers: ' + error.message);
    }
};
const updateProvider = async (id, newName) => {
    try {
        const provider = await Provider.findByPk(id);
        if (!provider) {
            throw new Error('provider not found');
        }

        provider.name = newName;
        await provider.save();

        return provider;
    } catch (error) {
        throw new Error('Error updating provider: ' + error.message);
    }
};

// Exportar la función createUser
module.exports = {
    updateProvider,
    getAllProvidersController,
    createProvider
};
