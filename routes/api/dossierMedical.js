const express=require('express');
const router=express.Router();
const {getDossierMedical,createDossierMedical}=require('../../controllers/dossierMedicalController')

/**
 * @swagger
 * components:
 *   schemas:
 *     DossierMedical:
 *       type: object
 *       required:
 *         - patientId
 *       properties:
 *         _id:
 *           type: string
 *           description: ID auto-généré du dossier médical
 *         patientId:
 *           type: string
 *           description: ID du patient
 *         antecedents:
 *           type: array
 *           items:
 *             type: string
 *           description: Antécédents médicaux du patient
 *         allergies:
 *           type: array
 *           items:
 *             type: string
 *           description: Allergies connues du patient
 *         consultations:
 *           type: array
 *           items:
 *             type: string
 *           description: Liste des IDs de consultations du patient
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date de création du dossier
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Date de dernière mise à jour du dossier
 *       example:
 *         patientId: "60d0fe4f5311236168a109ca"
 *         antecedents: ["Hypertension", "Diabète type 2"]
 *         allergies: ["Pénicilline", "Arachides"]
 *         consultations: []
 */

// router.get('/',getDossierMedical);

/**
 * @swagger
 * /dossierMedical/create:
 *   post:
 *     summary: Crée un nouveau dossier médical
 *     description: Crée un nouveau dossier médical pour un patient
 *     tags: [Dossier Medical]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - patientId
 *             properties:
 *               patientId:
 *                 type: string
 *                 description: ID du patient
 *               antecedents:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Antécédents médicaux du patient
 *               allergies:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Allergies connues du patient
 *     responses:
 *       201:
 *         description: Dossier médical créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DossierMedical'
 *       400:
 *         description: Données invalides ou dossier déjà existant pour ce patient
 */
router.post('/create',createDossierMedical);


module.exports=router