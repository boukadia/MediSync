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

/**
 * @swagger
 * components:
 *   schemas:
 *     Consultation:
 *       type: object
 *       required:
 *         - patientId
 *         - doctorId
 *         - appointmentId
 *         - diagnostic
 *       properties:
 *         _id:
 *           type: string
 *           description: ID auto-généré de la consultation
 *         patientId:
 *           type: string
 *           description: ID du patient
 *         doctorId:
 *           type: string
 *           description: ID du médecin
 *         appointmentId:
 *           type: string
 *           description: ID du rendez-vous associé
 *         date:
 *           type: string
 *           format: date-time
 *           description: Date et heure de la consultation
 *         diagnostic:
 *           type: string
 *           description: Diagnostic établi par le médecin
 *         prescription:
 *           type: string
 *           description: Prescription médicale
 *         notes:
 *           type: string
 *           description: Notes additionnelles
 *       example:
 *         patientId: "60d0fe4f5311236168a109ca"
 *         doctorId: "60d0fe4f5311236168a109cb"
 *         appointmentId: "60d0fe4f5311236168a109cd"
 *         date: "2023-08-10T10:00:00Z"
 *         diagnostic: "Grippe saisonnière"
 *         prescription: "Paracétamol 1000mg, 3x par jour pendant 5 jours"
 *         notes: "Patient à revoir dans une semaine si les symptômes persistent"
 */

/**
 * @swagger
 * /consultations/form:
 *   get:
 *     summary: Récupère les données de formulaire pour créer une consultation
 *     description: Retourne les données nécessaires pour le formulaire de création de consultation (accessible uniquement par les médecins)
 *     security:
 *       - bearerAuth: []
 *     tags: [Consultations]
 *     responses:
 *       200:
 *         description: Données du formulaire de consultation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès non autorisé
 */
router.get('/form', authenticate, doctorOnly, formCreateConsultation);

/**
 * @swagger
 * /consultations:
 *   get:
 *     summary: Récupère toutes les consultations
 *     description: Retourne la liste complète des consultations (accessible uniquement par les administrateurs)
 *     security:
 *       - bearerAuth: []
 *     tags: [Consultations]
 *     responses:
 *       200:
 *         description: Liste des consultations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Consultation'
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès non autorisé
 */
router.get('/', authenticate, adminOnly, getConsultations);

/**
 * @swagger
 * /consultations/my:
 *   get:
 *     summary: Récupère mes consultations
 *     description: Retourne les consultations de l'utilisateur connecté (patient ou médecin)
 *     security:
 *       - bearerAuth: []
 *     tags: [Consultations]
 *     responses:
 *       200:
 *         description: Liste des consultations personnelles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Consultation'
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès non autorisé
 */
router.get('/my', authenticate, requireRoles('patient', 'doctor'), getMyConsultations);

/**
 * @swagger
 * /consultations/patient/{patientId}:
 *   get:
 *     summary: Récupère les consultations d'un patient
 *     description: Retourne les consultations d'un patient spécifique (accessible uniquement par les médecins et administrateurs)
 *     security:
 *       - bearerAuth: []
 *     tags: [Consultations]
 *     parameters:
 *       - in: path
 *         name: patientId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du patient
 *     responses:
 *       200:
 *         description: Liste des consultations du patient
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Consultation'
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès non autorisé
 *       404:
 *         description: Patient non trouvé
 */
router.get('/patient/:patientId', authenticate, requireRoles('doctor', 'admin'), getConsultationsByPatient);

/**
 * @swagger
 * /consultations/doctor/{doctorId}:
 *   get:
 *     summary: Récupère les consultations d'un médecin
 *     description: Retourne les consultations d'un médecin spécifique (accessible uniquement par les administrateurs)
 *     security:
 *       - bearerAuth: []
 *     tags: [Consultations]
 *     parameters:
 *       - in: path
 *         name: doctorId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du médecin
 *     responses:
 *       200:
 *         description: Liste des consultations du médecin
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Consultation'
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès non autorisé
 *       404:
 *         description: Médecin non trouvé
 */
router.get('/doctor/:doctorId', authenticate, adminOnly, getConsultationsByDoctor);

/**
 * @swagger
 * /consultations/{id}:
 *   get:
 *     summary: Récupère une consultation par ID
 *     description: Retourne les détails d'une consultation spécifique
 *     security:
 *       - bearerAuth: []
 *     tags: [Consultations]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la consultation
 *     responses:
 *       200:
 *         description: Détails de la consultation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Consultation'
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Consultation non trouvée
 */
router.get('/:id', authenticate, getConsultationById);

/**
 * @swagger
 * /consultations:
 *   post:
 *     summary: Crée une nouvelle consultation
 *     description: Crée une nouvelle consultation (accessible uniquement par les médecins)
 *     security:
 *       - bearerAuth: []
 *     tags: [Consultations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - patientId
 *               - appointmentId
 *               - diagnostic
 *             properties:
 *               patientId:
 *                 type: string
 *               appointmentId:
 *                 type: string
 *               diagnostic:
 *                 type: string
 *               prescription:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Consultation créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Consultation'
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès non autorisé
 */
router.post('/', authenticate, doctorOnly, createConsultation);

/**
 * @swagger
 * /consultations/{id}:
 *   put:
 *     summary: Met à jour une consultation
 *     description: Modifie une consultation existante (accessible uniquement par le médecin qui l'a créée ou un administrateur)
 *     security:
 *       - bearerAuth: []
 *     tags: [Consultations]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la consultation
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               diagnostic:
 *                 type: string
 *               prescription:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Consultation modifiée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Consultation'
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès non autorisé
 *       404:
 *         description: Consultation non trouvée
 */
router.put('/:id', authenticate,doctorOnly, updateConsultation);

/**
 * @swagger
 * /consultations/{id}:
 *   delete:
 *     summary: Supprime une consultation
 *     description: Supprime une consultation existante (accessible uniquement par le médecin qui l'a créée ou un administrateur)
 *     security:
 *       - bearerAuth: []
 *     tags: [Consultations]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la consultation
 *     responses:
 *       200:
 *         description: Consultation supprimée avec succès
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès non autorisé
 *       404:
 *         description: Consultation non trouvée
 */
router.delete('/:id', authenticate, deleteConsultation);

module.exports = router;