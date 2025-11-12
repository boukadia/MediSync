const express = require('express');
const router = express.Router();
const { authenticate } = require('../../middlewares/auth');
const { adminOnly, requireRoles,checkDoctorConsultation } = require('../../middlewares/permissions');
const { validateCreatePrescription, validateUpdatePrescription } = require('../../validators/prescriptionValidator');
const {
  getMyPrescriptions,
  getPrescriptionById,
  createPrescription,
  updatePrescription,
  deletePrescription,
  markAsDispensed
} = require('../../controllers/prescriptionController');

/**
 * @swagger
 * tags:
 *   name: Prescriptions
 *   description: Gestion des prescriptions médicales
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Medication:
 *       type: object
 *       required:
 *         - name
 *         - dosage
 *         - instructions
 *         - duration
 *       properties:
 *         name:
 *           type: string
 *           description: Nom du médicament
 *         dosage:
 *           type: string
 *           description: Dosage prescrit
 *         instructions:
 *           type: string
 *           description: Instructions de prise
 *         duration:
 *           type: string
 *           description: Durée du traitement
 *         pharmacyId:
 *           type: string
 *           description: ID de la pharmacie assignée
 *         status:
 *           type: string
 *           enum: [prescribed, dispensed]
 *           description: Statut du médicament
 *     Prescription:
 *       type: object
 *       required:
 *         - patientId
 *         - doctorId
 *         - ConsultationId
 *         - medications
 *       properties:
 *         _id:
 *           type: string
 *           description: ID auto-généré de la prescription
 *         patientId:
 *           type: string
 *           description: ID du patient
 *         doctorId:
 *           type: string
 *           description: ID du médecin
 *         ConsultationId:
 *           type: string
 *           description: ID de la consultation
 *         notes:
 *           type: string
 *           description: Notes du médecin
 *         medications:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Medication'
 *         status:
 *           type: string
 *           enum: [draft, signed]
 *           description: Statut de la prescription
 *       example:
 *         patientId: "507f1f77bcf86cd799439011"
 *         doctorId: "507f1f77bcf86cd799439012"
 *         ConsultationId: "507f1f77bcf86cd799439013"
 *         notes: "À prendre après les repas"
 *         medications:
 *           - name: "Paracétamol"
 *             dosage: "500mg"
 *             instructions: "2 comprimés toutes les 8h"
 *             duration: "7 jours"
 *         status: "signed"
 */

/**
 * @swagger
 * /api/prescriptions:
 *   get:
 *     summary: Récupère les prescriptions de l'utilisateur connecté
 *     tags: [Prescriptions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des prescriptions récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Prescription'
 *       401:
 *         description: Non autorisé
 */
router.get('/',  authenticate, requireRoles('doctor', 'admin', 'patient'), getMyPrescriptions);
/**
 * @swagger
 * /api/prescriptions/{id}:
 *   get:
 *     summary: Récupère une prescription par ID
 *     tags: [Prescriptions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la prescription
 *     responses:
 *       200:
 *         description: Prescription récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Prescription'
 *       404:
 *         description: Prescription non trouvée
 */
router.get('/:id', authenticate,requireRoles('doctor', 'admin'), getPrescriptionById);

/**
 * @swagger
 * /api/prescriptions:
 *   post:
 *     summary: Crée une nouvelle prescription
 *     tags: [Prescriptions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Prescription'
 *     responses:
 *       201:
 *         description: Prescription créée avec succès
 *       400:
 *         description: Données invalides
 *       403:
 *         description: Accès refusé (médecins seulement)
 */
router.post('/', authenticate, requireRoles('doctor'), validateCreatePrescription, checkDoctorConsultation, createPrescription);

/**
 * @swagger
 * /api/prescriptions/{id}:
 *   put:
 *     summary: Met à jour une prescription
 *     tags: [Prescriptions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               notes:
 *                 type: string
 *               medications:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Medication'
 *               status:
 *                 type: string
 *                 enum: [draft, signed]
 *     responses:
 *       200:
 *         description: Prescription mise à jour avec succès
 *       403:
 *         description: Accès refusé (médecins seulement)
 *   delete:
 *     summary: Supprime une prescription
 *     tags: [Prescriptions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Prescription supprimée avec succès
 *       403:
 *         description: Accès refusé (médecins seulement)
 */
router.put('/:id', authenticate, requireRoles('doctor'), validateUpdatePrescription, checkDoctorConsultation, updatePrescription);
router.delete('/:id', authenticate, requireRoles('doctor'),checkDoctorConsultation, deletePrescription);

/**
 * @swagger
 * /api/prescriptions/{id}/medications:
 *   put:
 *     summary: Marque les médicaments comme dispensés
 *     tags: [Prescriptions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la prescription
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               medicationIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: IDs des médicaments dispensés
 *     responses:
 *       200:
 *         description: Médicaments marqués comme dispensés
 *       403:
 *         description: Accès refusé (pharmacies seulement)
 */
router.put('/:id/medications', authenticate,requireRoles('pharmacy'),markAsDispensed);

module.exports = router;