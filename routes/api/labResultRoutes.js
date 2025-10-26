const express = require('express');
const router = express.Router();
const { authenticate } = require('../../middlewares/auth');
const { adminOnly, requireRoles } = require('../../middlewares/permissions');
const {
  getLabResults,
  getLabResultById,
  createLabResult,
  updateLabResult,
  deleteLabResult
} = require('../../controllers/labResultController');

router.get('/', authenticate, getLabResults);
router.get('/:id', authenticate, getLabResultById);
router.post('/', authenticate, requireRoles('doctor', 'admin'), createLabResult);
router.put('/:id', authenticate, requireRoles('doctor', 'admin'), updateLabResult);
router.delete('/:id', authenticate, requireRoles('doctor', 'admin'), deleteLabResult);

module.exports = router;