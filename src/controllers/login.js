const { User } = require('../db');

const login = async (email) => {
    return await User.findOne({
        where: {
        email
        }
      })
}

module.exports = {
    login
}