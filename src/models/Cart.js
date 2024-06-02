const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {

    sequelize.define('cart', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        total: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        paymentMethod: {
            type: DataTypes.STRING(25),
            allowNull: false,
        },
        paymentStatus: {
            type: DataTypes.STRING(40),
            allowNull: false,
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'users', // Asegúrate de que esta línea esté correcta
                key: 'id'
            },
        }
    }
    );
};

