const express = require('express');
const router = express.Router();
const { authenticate } = require('../../middlewares/auth');
const { adminOnly, requireRoles,checkDoctorConsultation } = require('../../middlewares/permissions');
const {
  getMyPrescriptions,
  getPrescriptionById,
  createPrescription,
  updatePrescription,
  deletePrescription
} = require('../../controllers/prescriptionController');
router.get('/',  authenticate, requireRoles('doctor', 'admin', 'patient'), getMyPrescriptions);
router.get('/:id', authenticate, getPrescriptionById);
router.post('/', authenticate, requireRoles('doctor'),checkDoctorConsultation, createPrescription);
router.put('/:id', authenticate, requireRoles('doctor', 'admin'), updatePrescription);
router.delete('/:id', authenticate, requireRoles('doctor', 'admin'), deletePrescription);

module.exports = router;