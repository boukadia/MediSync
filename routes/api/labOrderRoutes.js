const express = require('express');
const router = express.Router();
const { authenticate } = require('../../middlewares/auth');
const { adminOnly, requireRoles,checkDoctorLabOrder,verifyLabOwnership,checkDoctorConsultation } = require('../../middlewares/permissions');
const {
  getLabOrders,
  getLabOrderById,
  createLabOrder,
  updateLabOrder,
  deleteLabOrder,
  markAsCompleted
} = require('../../controllers/labOrderController');

router.get('/', authenticate, requireRoles('doctor', 'admin',"laboratoire"), getLabOrders);
router.get('/:id', authenticate, getLabOrderById);
router.post('/', authenticate, requireRoles('doctor'),checkDoctorConsultation, createLabOrder);
router.put('/:id', authenticate, requireRoles('doctor', 'admin'), verifyLabOwnership,updateLabOrder);
router.delete('/:id', authenticate, requireRoles('doctor', 'admin'), checkDoctorLabOrder,deleteLabOrder);
router.put('/:id/status', requireRoles('laboratoire'),verifyLabOwnership,markAsCompleted)

module.exports = router;