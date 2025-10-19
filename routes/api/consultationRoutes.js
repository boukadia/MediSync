const express = require('express');
const router = express.Router();
const { authenticate } = require('../../middlewares/auth');
const { adminOnly, doctorOnly, requireRoles } = require('../../middlewares/permissions');
const {
  getConsultations,
  getConsultationById,
  getMyConsultations,
  createConsultation,
  updateConsultation,
  deleteConsultation,
  getConsultationsByPatient,
  getConsultationsByDoctor,
  formCreateConsultation
} = require('../../controllers/consultationController');

// Get form data for creating consultation
router.get('/form', authenticate, doctorOnly, formCreateConsultation);

// Get all consultations (admin only)
router.get('/', authenticate, adminOnly, getConsultations);

// Get my consultations (patient or doctor)
router.get('/my', authenticate, requireRoles('patient', 'doctor'), getMyConsultations);

// Get consultations by patient ID (doctor/admin only)
router.get('/patient/:patientId', authenticate, requireRoles('doctor', 'admin'), getConsultationsByPatient);

// Get consultations by doctor ID (admin only)
router.get('/doctor/:doctorId', authenticate, adminOnly, getConsultationsByDoctor);

// Get consultation by ID
router.get('/:id', authenticate, getConsultationById);

// Create consultation (doctors only)
router.post('/', authenticate, doctorOnly, createConsultation);

// Update consultation (doctor who created it or admin)
router.put('/:id', authenticate, updateConsultation);

// Delete consultation (doctor who created it or admin)
router.delete('/:id', authenticate, deleteConsultation);

module.exports = router;