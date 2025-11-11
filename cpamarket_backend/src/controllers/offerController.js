const { Offer, User } = require('../models');
const ApiError = require('../utils/apiError');

const getOffers = async (req, res, next) => {
  try {
    const offers = await Offer.findAll({
      include: [
        {
          model: User,
          as: 'advertiser',
          attributes: ['id', 'username', 'email'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json(offers);
  } catch (error) {
    next(error);
  }
};

const getOfferById = async (req, res, next) => {
  try {
    const offer = await Offer.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'advertiser',
          attributes: ['id', 'username', 'email'],
        },
      ],
    });

    if (!offer) {
      return next(ApiError.notFound('Offer not found'));
    }

    return res.json(offer);
  } catch (error) {
    return next(error);
  }
};

const createOffer = async (req, res, next) => {
  try {
    const { title, payout, description, link } = req.body;

    if (!title || !payout || !description || !link) {
      return next(ApiError.badRequest('All fields (title, payout, description, link) are required'));
    }

    const offer = await Offer.create({
      title,
      payout,
      description,
      link,
      advertiserId: req.user.id,
    });

    return res.status(201).json(offer);
  } catch (error) {
    return next(error);
  }
};

const updateOffer = async (req, res, next) => {
  try {
    const offer = await Offer.findByPk(req.params.id);

    if (!offer) {
      return next(ApiError.notFound('Offer not found'));
    }

    if (offer.advertiserId !== req.user.id) {
      return next(ApiError.forbidden('You can only update your own offers'));
    }

    const { title, payout, description, link } = req.body;
    await offer.update({ title, payout, description, link });

    return res.json(offer);
  } catch (error) {
    return next(error);
  }
};

const deleteOffer = async (req, res, next) => {
  try {
    const offer = await Offer.findByPk(req.params.id);

    if (!offer) {
      return next(ApiError.notFound('Offer not found'));
    }

    if (offer.advertiserId !== req.user.id) {
      return next(ApiError.forbidden('You can only delete your own offers'));
    }

    await offer.destroy();
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getOffers,
  getOfferById,
  createOffer,
  updateOffer,
  deleteOffer,
};
