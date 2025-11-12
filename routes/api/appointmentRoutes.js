const express = require('express');
const router = express.Router();
const { authenticate } = require('../../middlewares/auth');
const { adminOnly, requireRoles,checkPatient } = require('../../middlewares/permissions');
const { validateCreateAppointment, validateUpdateAppointment } = require('../../validators/appointmentValidator');
const {
  getAppointments,
  getAppointmentById,
  getMyAppointments,
  createAppointment,
  updateAppointment,
  cancelAppointment,
  deleteAppointment
} = require('../../controllers/appointmentController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Appointment:
 *       type: object
 *       required:
 *         - patientId
 *         - doctorId
 *         - creneauId
 *         - date
 *       properties:
 *         _id:
 *           type: string
 *           description: ID auto-généré de rendez-vous
 *         patientId:
 *           type: string
 *           description: ID du patient
 *         doctorId:
 *           type: string
 *           description: ID du médecin
 *         creneauId:
 *           type: string
 *           description: ID du créneau horaire
 *         date:
 *           type: string
 *           format: date
 *           description: Date du rendez-vous
 *         status:
 *           type: string
 *           description: Statut du rendez-vous
 *           enum: [pending, confirmed, cancelled, completed]
 *         motif:
 *           type: string
 *           description: Motif du rendez-vous
 *       example:
 *         patientId: "60d0fe4f5311236168a109ca"
 *         doctorId: "60d0fe4f5311236168a109cb"
 *         creneauId: "60d0fe4f5311236168a109cc"
 *         date: "2023-08-10"
 *         status: "pending"
 *         motif: "Consultation de routine"
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /appointments:
 *   get:
 *     summary: Récupère tous les rendez-vous
 *     description: Retourne la liste complète des rendez-vous (accessible uniquement par les administrateurs)
 *     security:
 *       - bearerAuth: []
 *     tags: [Appointments]
 *     responses:
 *       200:
 *         description: Liste des rendez-vous
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Appointment'
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès non autorisé
 */
router.get('/', authenticate, adminOnly, getAppointments);

/**
 * @swagger
 * /appointments/my:
 *   get:
 *     summary: Récupère mes rendez-vous
 *     description: Retourne les rendez-vous de l'utilisateur connecté (patient ou médecin)
 *     security:
 *       - bearerAuth: []
 *     tags: [Appointments]
 *     responses:
 *       200:
 *         description: Liste des rendez-vous personnels
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Appointment'
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès non autorisé
 */
router.get('/my', authenticate, requireRoles('patient', 'doctor'), getMyAppointments);

// Get appointment by ID
// router.get('/:id', authenticate, getAppointmentById);

/**
 * @swagger
 * /appointments:
 *   post:
 *     summary: Crée un nouveau rendez-vous
 *     description: Crée un nouveau rendez-vous (accessible uniquement par les patients)
 *     security:
 *       - bearerAuth: []
 *     tags: [Appointments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - doctorId
 *               - creneauId
 *               - date
 *               - motif
 *             properties:
 *               doctorId:
 *                 type: string
 *               creneauId:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               motif:
 *                 type: string
 *     responses:
 *       201:
 *         description: Rendez-vous créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès non autorisé
 */
router.post('/', authenticate, requireRoles('patient','secretaire'), validateCreateAppointment, createAppointment);

/**
 * @swagger
 * /appointments/{id}:
 *   put:
 *     summary: Modifie un rendez-vous
 *     description: Modifie un rendez-vous existant
 *     security:
 *       - bearerAuth: []
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du rendez-vous
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               creneauId:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               motif:
 *                 type: string
 *     responses:
 *       200:
 *         description: Rendez-vous modifié avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès non autorisé
 *       404:
 *         description: Rendez-vous non trouvé
 */
router.put('/:id', authenticate, validateUpdateAppointment,requireRoles('patient','secretaire','admin'), checkPatient, updateAppointment);

// Cancel appointment (patient or doctor)
router.put('/:id/cancel', authenticate, checkPatient, cancelAppointment);

/**
 * @swagger
 * /appointments/{id}:
 *   delete:
 *     summary: Supprime un rendez-vous
 *     description: Supprime un rendez-vous existant (accessible uniquement par le patient concerné)
 *     security:
 *       - bearerAuth: []
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du rendez-vous
 *     responses:
 *       200:
 *         description: Rendez-vous supprimé avec succès
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès non autorisé
 *       404:
 *         description: Rendez-vous non trouvé
 */
router.delete('/:id', authenticate, checkPatient, deleteAppointment);

module.exports = router;