const express = require('express');
const router = express.Router();
const { authenticate } = require('../../middlewares/auth');
const { adminOnly, requireRoles,verifyLabOrderTestOwnership } = require('../../middlewares/permissions');
const {
  getLabOrderTests,
  getLabOrderTestById,
  createLabOrderTest,
  updateLabOrderTest,
  deleteLabOrderTest,getMyLabOrderTests
} = require('../../controllers/labOrderTestController');

router.get('/', authenticate, adminOnly, getLabOrderTests);
router.get('/:id', authenticate, requireRoles('laboratoire'),verifyLabOrderTestOwnership,getLabOrderTestById);
router.get('/my/tests', authenticate,requireRoles('doctor', 'patient','laboratoire'),getMyLabOrderTests);
router.post('/', authenticate, requireRoles('laboratoire'), createLabOrderTest);
router.put('/:id', authenticate, requireRoles( 'admin','laboratoire'),verifyLabOrderTestOwnership, updateLabOrderTest);
router.delete('/:id', authenticate, requireRoles( 'admin','laboratoire'),verifyLabOrderTestOwnership, deleteLabOrderTest);

module.exports = router;