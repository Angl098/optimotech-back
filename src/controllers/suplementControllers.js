const { Suplement } = require('../db.js');

const createSuplement = async (name, description, price, image) => {
    return await Suplement.create({ name, description, price, image });
}

module.exports = { createSuplement }