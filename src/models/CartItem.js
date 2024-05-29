const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {

    sequelize.define('CartItem', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allownull: false,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allownull: false,
        },
        productId: {
            type: DataTypes.INTEGER,
            allownull: false,
        },
        price: {
            type: DataTypes.FLOAT,
            allownull: false,
        },
        amount: {
            type: DataTypes.INTEGER,
            allownull: false,
        },
        }
    );
}