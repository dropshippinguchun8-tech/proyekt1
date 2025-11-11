const { Model, DataTypes } = require('sequelize');

class Offer extends Model {}

module.exports = (sequelize) => {
  Offer.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      payout: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          isDecimal: true,
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      link: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isUrl: true,
        },
      },
      advertiserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
    },
    {
      sequelize,
      modelName: 'Offer',
      tableName: 'offers',
    },
  );

  return Offer;
};
