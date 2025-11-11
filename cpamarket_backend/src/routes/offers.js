const express = require('express');
const {
  getOffers,
  getOfferById,
  createOffer,
  updateOffer,
  deleteOffer,
} = require('../controllers/offerController');
const { authenticate, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate);

router.get('/', getOffers);
router.get('/:id', getOfferById);
router.post('/', authorizeRoles('advertiser'), createOffer);
router.put('/:id', authorizeRoles('advertiser'), updateOffer);
router.delete('/:id', authorizeRoles('advertiser'), deleteOffer);

module.exports = router;
