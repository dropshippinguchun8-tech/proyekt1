const { Lead, Offer, User } = require('../models');
const ApiError = require('../utils/apiError');

const VALID_STATUSES = ['pending', 'approved', 'rejected'];

const getLeads = async (req, res, next) => {
  try {
    let query;

    if (req.user.role === 'affiliate') {
      query = {
        where: { userId: req.user.id },
        include: [
          {
            model: Offer,
            as: 'offer',
            attributes: ['id', 'title', 'payout', 'advertiserId'],
          },
        ],
        order: [['createdAt', 'DESC']],
      };
    } else {
      query = {
        include: [
          {
            model: Offer,
            as: 'offer',
            where: { advertiserId: req.user.id },
            attributes: ['id', 'title', 'payout', 'advertiserId'],
          },
          {
            model: User,
            as: 'affiliate',
            attributes: ['id', 'username', 'email'],
          },
        ],
        order: [['createdAt', 'DESC']],
      };
    }

    const leads = await Lead.findAll(query);
    return res.json(leads);
  } catch (error) {
    return next(error);
  }
};

const createLead = async (req, res, next) => {
  try {
    if (req.user.role !== 'affiliate') {
      return next(ApiError.forbidden('Only affiliates can create leads'));
    }

    const { offerId, status = 'pending', revenue = 0 } = req.body;

    if (!offerId) {
      return next(ApiError.badRequest('offerId is required'));
    }

    if (!VALID_STATUSES.includes(status)) {
      return next(ApiError.badRequest('Invalid status value'));
    }

    const offer = await Offer.findByPk(offerId);

    if (!offer) {
      return next(ApiError.notFound('Offer not found'));
    }

    const lead = await Lead.create({
      offerId,
      userId: req.user.id,
      status,
      revenue: Number(revenue) || 0,
    });

    return res.status(201).json(lead);
  } catch (error) {
    return next(error);
  }
};

const updateLead = async (req, res, next) => {
  try {
    const lead = await Lead.findByPk(req.params.id, {
      include: [
        {
          model: Offer,
          as: 'offer',
        },
      ],
    });

    if (!lead) {
      return next(ApiError.notFound('Lead not found'));
    }

    if (req.user.role === 'affiliate' && lead.userId !== req.user.id) {
      return next(ApiError.forbidden('You can only update your own leads'));
    }

    if (req.user.role === 'advertiser' && lead.offer.advertiserId !== req.user.id) {
      return next(ApiError.forbidden('You can only update leads for your offers'));
    }

    const updatableFields = ['status', 'revenue'];
    const payload = {};

    updatableFields.forEach((field) => {
      if (typeof req.body[field] !== 'undefined') {
        payload[field] = field === 'revenue' ? Number(req.body[field]) || 0 : req.body[field];
      }
    });

    if (payload.status && !VALID_STATUSES.includes(payload.status)) {
      return next(ApiError.badRequest('Invalid status value'));
    }

    await lead.update(payload);
    return res.json(lead);
  } catch (error) {
    return next(error);
  }
};

const deleteLead = async (req, res, next) => {
  try {
    const lead = await Lead.findByPk(req.params.id, {
      include: [
        {
          model: Offer,
          as: 'offer',
        },
      ],
    });

    if (!lead) {
      return next(ApiError.notFound('Lead not found'));
    }

    if (req.user.role === 'affiliate' && lead.userId !== req.user.id) {
      return next(ApiError.forbidden('You can only delete your own leads'));
    }

    if (req.user.role === 'advertiser' && lead.offer.advertiserId !== req.user.id) {
      return next(ApiError.forbidden('You can only delete leads for your offers'));
    }

    await lead.destroy();
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getLeads,
  createLead,
  updateLead,
  deleteLead,
};
