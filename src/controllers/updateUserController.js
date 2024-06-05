const { User } = require('../db');

const getUser = async (id) => {
    return await User.findByPk(id);
}

module.exports = {
    getUser
}