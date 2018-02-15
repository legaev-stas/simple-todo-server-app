module.exports = (sequelize, DataTypes) => {
    return sequelize.define('task', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true
        },
        category: DataTypes.UUID,
        title: DataTypes.STRING,
        description: DataTypes.STRING,
        completed: DataTypes.BOOLEAN,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    });
};