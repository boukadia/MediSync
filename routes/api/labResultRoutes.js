const express = require('express');
const router = express.Router();
const { authenticate } = require('../../middlewares/auth');
const { adminOnly, requireRoles,verifyLabResultOwnership } = require('../../middlewares/permissions');
const {
  getLabResults,
  getLabResultById,
  createLabResult,
  updateLabResult,
  deleteLabResult,
  getMyLabResults
} = require('../../controllers/labResultController');

router.get('/', authenticate, getLabResults, adminOnly);
router.get('/:id', authenticate,requireRoles('laboratoire'),getLabResultById);
router.get('/my/results', authenticate,requireRoles('laboratoire', 'patient','doctor'), getMyLabResults);
router.post('/', authenticate, requireRoles('laboratoire', 'admin'), createLabResult);
router.put('/:id', authenticate, requireRoles('laboratoire', 'admin'),verifyLabResultOwnership, updateLabResult);
router.delete('/:id', authenticate, requireRoles('laboratoire', 'admin'),verifyLabResultOwnership, deleteLabResult);

module.exports = router;