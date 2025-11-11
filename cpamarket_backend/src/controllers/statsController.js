const { Lead, Click, Offer } = require('../models');

const stats = async (req, res, next) => {
  try {
    let clickWhere = {};
    let leadWhere = {};
    let clickInclude = [];
    let leadInclude = [];

    if (req.user.role === 'affiliate') {
      clickWhere = { userId: req.user.id };
      leadWhere = { userId: req.user.id };
    } else if (req.user.role === 'advertiser') {
      clickInclude = [
        {
          model: Offer,
          as: 'offer',
          where: { advertiserId: req.user.id },
          attributes: [],
        },
      ];

      leadInclude = [
        {
          model: Offer,
          as: 'offer',
          where: { advertiserId: req.user.id },
          attributes: [],
        },
      ];
    }

    const [totalClicks, totalLeads, totalRevenueRaw] = await Promise.all([
      Click.count({
        where: clickWhere,
        include: clickInclude,
        distinct: true,
      }),
      Lead.count({
        where: leadWhere,
        include: leadInclude,
        distinct: true,
      }),
      Lead.sum('revenue', {
        where: leadWhere,
        include: leadInclude,
      }),
    ]);

    const totalRevenue = totalRevenueRaw ? Number(totalRevenueRaw) : 0;

    res.json({
      totalClicks,
      totalLeads,
      totalRevenue,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  stats,
};
