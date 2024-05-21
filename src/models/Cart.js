const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {

    sequelize.define('Cart', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allownull: false,
            autoIncrement: true
        },
        total: {
            type: DataTypes.DECIMAL(10, 2),
            allownull: false,
        },
        paymentMethod: {
            type: DataTypes.STRING(25),
            allownull: false,
        },
        payment_status: {
            type: DataTypes.STRING(40),
            allownull: false,
        },
        }
    );
}