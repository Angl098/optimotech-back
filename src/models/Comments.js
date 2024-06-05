const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {

    sequelize.define('Comment', {
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        parentId: {
            type: DataTypes.INTEGER,
            allowNull: true,
        }
    }
    );
};

