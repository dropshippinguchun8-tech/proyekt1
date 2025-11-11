const sequelize = require('../config/database');

const User = require('./User')(sequelize);
const Offer = require('./Offer')(sequelize);
const Lead = require('./Lead')(sequelize);
const Click = require('./Click')(sequelize);

User.hasMany(Offer, { foreignKey: 'advertiserId', as: 'offers' });
Offer.belongsTo(User, { foreignKey: 'advertiserId', as: 'advertiser' });

User.hasMany(Lead, { foreignKey: 'userId', as: 'leads' });
Lead.belongsTo(User, { foreignKey: 'userId', as: 'affiliate' });

Offer.hasMany(Lead, { foreignKey: 'offerId', as: 'leads' });
Lead.belongsTo(Offer, { foreignKey: 'offerId', as: 'offer' });

User.hasMany(Click, { foreignKey: 'userId', as: 'clicks' });
Click.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Offer.hasMany(Click, { foreignKey: 'offerId', as: 'clicks' });
Click.belongsTo(Offer, { foreignKey: 'offerId', as: 'offer' });

module.exports = {
  sequelize,
  User,
  Offer,
  Lead,
  Click,
};
