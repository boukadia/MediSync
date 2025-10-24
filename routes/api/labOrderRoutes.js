const express = require('express');
const router = express.Router();
const { authenticate } = require('../../middlewares/auth');
const { adminOnly, requireRoles,checkDoctorLabOrder } = require('../../middlewares/permissions');
const {
  getLabOrders,
  getLabOrderById,
  createLabOrder,
  updateLabOrder,
  deleteLabOrder
} = require('../../controllers/labOrderController');

router.get('/', authenticate, requireRoles('doctor', 'admin'), getLabOrders);
router.get('/:id', authenticate, getLabOrderById);
router.post('/', authenticate, requireRoles('doctor'),checkDoctorLabOrder, createLabOrder);
router.put('/:id', authenticate, requireRoles('doctor', 'admin'), updateLabOrder);
router.delete('/:id', authenticate, requireRoles('doctor', 'admin'), deleteLabOrder);

module.exports = router;