const express = require('express');
const { stats } = require('../controllers/statsController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate);

router.get('/', stats);

module.exports = router;
