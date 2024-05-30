const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {

    sequelize.define('orden', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allownull: false,
            autoIncrement: true
        },
        total: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true
        },
        status: {
            type: DataTypes.ENUM('pending', 'completed', 'cancelled'),
            defaultValue: 'abierto'
        },
    }
    );
};

