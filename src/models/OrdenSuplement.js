const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {

    sequelize.define('orden_suplement', {
        cantidad: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
    });
};

