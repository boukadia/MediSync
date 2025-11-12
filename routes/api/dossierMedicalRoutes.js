const express=require('express');
const router=express.Router();  
const {authenticate}=require('../../middlewares/auth');
const {adminOnly,requireRoles}=require('../../middlewares/permissions');
const { validateCreateDossier, validateUpdateDossier } = require('../../validators/dossierMedicalValidator');
const {getDossierMedicals,getMyDossierMedical,createDossierMedical,deleteDossierMedical,updateDossierMedical}=require('../../controllers/dossierMedicalController')

/**
 * @swagger
 * tags:
 *   name: Dossier Medical
 *   description: Gestion des dossiers médicaux
 */

/**
 * @swagger
 * /api/dossierMedicals:
 *   get:
 *     summary: Récupère tous les dossiers médicaux
 *     description: Récupère la liste de tous les dossiers médicaux (admin seulement)
 *     tags: [Dossier Medical]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des dossiers médicaux récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DossierMedical'
 *       401:
 *         description: Non autorisé
 *       403:
 *         description: Accès refusé (admin seulement)
 */
router.get('/',authenticate,adminOnly,getDossierMedicals)

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
 *         allergies:
 *           type: string
 *           
 *           description:  les allergies connues du patient
 *         groupeSanguin:
 *           type: string
 *           description: Groupe sanguin du patient
 *         historiqueConsultations:
 *           type: array
 *           items:
 *             type: string
 *           description: Liste des IDs des consultations du patient
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date de création du dossier
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Date de dernière mise à jour du dossier
 *       example:
 *         _id: "507f1f77bcf86cd799439011"
 *         patientId: "60d0fe4f5311236168a109ca"
 *         allergies: "Pénicilline"
 *         groupeSanguin: "O+"
 *         historiqueConsultations: ["507f191e810c19729de860ea"]
 *         createdAt: "2025-10-27T10:00:00Z"
 *         updatedAt: "2025-10-27T15:30:00Z"
 */

/**
 * @swagger
 * /api/dossierMedicals/MyDossierMedical:
 *   get:
 *     summary: Récupère le dossier médical du patient connecté
 *     description: Permet à un patient de consulter son propre dossier médical
 *     tags: [Dossier Medical]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dossier médical récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DossierMedical'
 *       401:
 *         description: Non autorisé
 *       403:
 *         description: Accès refusé (patients seulement)
 *       404:
 *         description: Dossier médical non trouvé
 */
router.get('/MyDossierMedical',authenticate,requireRoles('patient'),getMyDossierMedical);

/**
 * @swagger
 * /api/dossierMedicals/create:
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
 *                 type: string
 *              
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
router.post('/create',authenticate,requireRoles('patient','admin','medecin','secretaire'),validateCreateDossier,createDossierMedical);

/**
 * @swagger
 * /api/dossierMedicals/{id}:
 *   delete:
 *     summary: Supprime un dossier médical
 *     description: Supprime un dossier médical par son ID (admin seulement)
 *     tags: [Dossier Medical]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du dossier médical
 *     responses:
 *       200:
 *         description: Dossier médical supprimé avec succès
 *       401:
 *         description: Non autorisé
 *       403:
 *         description: Accès refusé (admin seulement)
 *       404:
 *         description: Dossier médical non trouvé
 */
router.delete('/:id',authenticate,adminOnly,deleteDossierMedical );

/**
 * @swagger
 * /api/dossierMedicals/{id}:
 *   put:
 *     summary: Met à jour un dossier médical
 *     description: Met à jour les informations d'un dossier médical, y compris la gestion des allergies
 *     tags: [Dossier Medical]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du dossier médical
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               addAllergies:
 *                 oneOf:
 *                   - type: string
 *                     description: Liste d'allergies séparées par des virgules
 *                     example: "Pénicilline, Arachides"
 *                   - type: array
 *                     items:
 *                       type: string
 *                     description: Liste d'allergies en format tableau
 *                     example: ["Pénicilline", "Arachides"]
 *               removeAllergies:
 *                 oneOf:
 *                   - type: string
 *                     description: Liste d'allergies à supprimer, séparées par des virgules
 *                     example: "Lactose, Gluten"
 *                   - type: array
 *                     items:
 *                       type: string
 *                     description: Liste d'allergies à supprimer en format tableau
 *                     example: ["Lactose", "Gluten"]
 *               groupeSanguin:
 *                 type: string
 *                 description: Groupe sanguin du patient
 *                 example: "O+"
 *               newConsultationId:
 *                 type: string
 *                 description: ID d'une nouvelle consultation à ajouter
 *     responses:
 *       200:
 *         description: Dossier médical mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DossierMedical'
 *       401:
 *         description: Non autorisé
 *       403:
 *         description: Accès refusé
 *       404:
 *         description: Dossier médical non trouvé
 */
router.put('/:id',authenticate,requireRoles('admin','medecin','secretaire'),validateUpdateDossier,updateDossierMedical);


module.exports=router