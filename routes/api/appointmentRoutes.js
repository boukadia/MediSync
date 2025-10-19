const express = require('express');
const router = express.Router();
const { authenticate } = require('../../middlewares/auth');
const { adminOnly, requireRoles,checkPatient } = require('../../middlewares/permissions');
const {
  getAppointments,
  getAppointmentById,
  getMyAppointments,
  createAppointment,
  updateAppointment,
  cancelAppointment,
  deleteAppointment
} = require('../../controllers/appointmentController');

// Get all appointments (admin only)
router.get('/', authenticate, adminOnly, getAppointments);

// Get my appointments (patient or doctor)
router.get('/my', authenticate, requireRoles('patient', 'doctor'), getMyAppointments);

// Get appointment by ID
// router.get('/:id', authenticate, getAppointmentById);

// Create appointment (patients only)
router.post('/', authenticate, requireRoles('patient'),createAppointment);

// Update appointment
router.put('/:id', authenticate,checkPatient, updateAppointment);

// Cancel appointment (patient or doctor)
// router.patch('/:id/cancel', authenticate, cancelAppointment);

// Delete appointment (admin only)
router.delete('/:id', authenticate, checkPatient, deleteAppointment);

module.exports = router;