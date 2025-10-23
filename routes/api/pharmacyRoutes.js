const express = require('express');
const router = express.Router();
const { authenticate } = require('../../middlewares/auth');
const { adminOnly, requireRoles } = require('../../middlewares/permissions');
const {
  getPharmacies,
  getPharmacyById,
  createPharmacy,
  updatePharmacy,
  deletePharmacy
} = require('../../controllers/pharmacyController');

router.get('/', authenticate, getPharmacies);
router.get('/:id', authenticate, getPharmacyById);
router.post('/', authenticate, adminOnly, createPharmacy);
router.put('/:id', authenticate, adminOnly, updatePharmacy);
router.delete('/:id', authenticate, adminOnly, deletePharmacy);

module.exports = router;