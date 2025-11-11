const { Model, DataTypes } = require('sequelize');

class Lead extends Model {}

module.exports = (sequelize) => {
  Lead.init(
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
      status: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected'),
        allowNull: false,
        defaultValue: 'pending',
      },
      revenue: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: 'Lead',
      tableName: 'leads',
    },
  );

  return Lead;
};
