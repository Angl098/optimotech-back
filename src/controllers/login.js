const { User } = require('../db');

const login = async (email) => {
    try {
        const user = await User.findOne({
            where: {
                email
            }
        });

        if (!user) {
            return null;
        }

        return user;
    } catch (error) {
        console.error("Error logging in:", error);
        throw error;
    }
}

module.exports = {
    login
}
