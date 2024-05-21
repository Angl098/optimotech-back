const { User } = require('../db');

const loginController = async (email) => {
    return await User.findOne({
        where: {
        email:email
        }
      })
}

module.exports = {
    loginController
}