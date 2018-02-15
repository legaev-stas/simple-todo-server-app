module.exports = (sequelize, DataTypes) => {
    return sequelize.define('category', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true
        },
        title: DataTypes.STRING,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    });
};