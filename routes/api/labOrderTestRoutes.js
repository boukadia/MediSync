const express = require('express');
const router = express.Router();
const { authenticate } = require('../../middlewares/auth');
const { adminOnly, requireRoles } = require('../../middlewares/permissions');
const {
  getLabOrderTests,
  getLabOrderTestById,
  createLabOrderTest,
  updateLabOrderTest,
  deleteLabOrderTest
} = require('../../controllers/labOrderTestController');

router.get('/', authenticate, requireRoles('doctor', 'admin'), getLabOrderTests);
router.get('/:id', authenticate, getLabOrderTestById);
router.post('/', authenticate, requireRoles('doctor', 'admin'), createLabOrderTest);
router.put('/:id', authenticate, requireRoles('doctor', 'admin'), updateLabOrderTest);
router.delete('/:id', authenticate, requireRoles('doctor', 'admin'), deleteLabOrderTest);

module.exports = router;