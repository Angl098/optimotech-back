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
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('abierto', 'pagado', 'cancelado'),
            defaultValue: 'abierto'
        },
    }
    );
};

