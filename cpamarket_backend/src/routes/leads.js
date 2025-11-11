const express = require('express');
const { getLeads, createLead, updateLead, deleteLead } = require('../controllers/leadController');
const { authenticate, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate);

router.get('/', getLeads);
router.post('/', authorizeRoles('affiliate'), createLead);
router.put('/:id', updateLead);
router.delete('/:id', deleteLead);

module.exports = router;
