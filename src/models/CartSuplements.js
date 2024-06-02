const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {

    sequelize.define('CartSuplements', {
        quantity: {
            type: DataTypes.INTEGER, 
            allowNull: false
        }
    }
    );
};

