const { Model, DataTypes } = require('sequelize');

class Click extends Model {}

module.exports = (sequelize) => {
  Click.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      offerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'offers',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      ip: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
    },
    {
      sequelize,
      modelName: 'Click',
      tableName: 'clicks',
    },
  );

  return Click;
};
