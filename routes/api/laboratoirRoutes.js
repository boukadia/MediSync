const express = require('express');
const router = express.Router();
const { authenticate } = require('../../middlewares/auth');
const { adminOnly, requireRoles } = require('../../middlewares/permissions');
const {
  getLaboratories,
  getLaboratoryById,
  createLaboratory,
  updateLaboratory,
  deleteLaboratory
} = require('../../controllers/laboratoirController');

/**
 * @swagger
 * tags:
 *   name: Laboratoires
 *   description: Gestion des laboratoires
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Laboratory:
 *       type: object
 *       required:
 *         - nom
 *         - adresse
 *         - telephone
 *         - email
 *         - responsable
 *         - openHours
 *       properties:
 *         _id:
 *           type: string
 *           description: ID auto-généré du laboratoire
 *         nom:
 *           type: string
 *           description: Nom du laboratoire
 *         adresse:
 *           type: string
 *           description: Adresse du laboratoire
 *         telephone:
 *           type: string
 *           description: Numéro de téléphone
 *         email:
 *           type: string
 *           format: email
 *           description: Email du laboratoire
 *         responsable:
 *           type: string
 *           description: Nom du responsable
 *         openHours:
 *           type: string
 *           description: Heures d'ouverture
 *         status:
 *           type: string
 *           enum: [actif, inactif]
 *           description: Statut du laboratoire
 *       example:
 *         nom: "Laboratoire Central"
 *         adresse: "123 Rue Principale, Casablanca"
 *         telephone: "0522123456"
 *         email: "contact@labcentral.ma"
 *         responsable: "Dr. Ahmed Benali"
 *         openHours: "Lun-Ven 8h-18h, Sam 8h-12h"
 *         status: "actif"
 */

/**
 * @swagger
 * /api/laboratoires:
 *   get:
 *     summary: Récupère tous les laboratoires
 *     tags: [Laboratoires]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des laboratoires récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Laboratory'
 *       401:
 *         description: Non autorisé
 */
router.get('/', authenticate, getLaboratories);
/**
 * @swagger
 * /api/laboratoires/{id}:
 *   get:
 *     summary: Récupère un laboratoire par ID
 *     tags: [Laboratoires]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du laboratoire
 *     responses:
 *       200:
 *         description: Laboratoire récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Laboratory'
 *       404:
 *         description: Laboratoire non trouvé
 */
router.get('/:id', authenticate, getLaboratoryById);

/**
 * @swagger
 * /api/laboratoires:
 *   post:
 *     summary: Crée un nouveau laboratoire
 *     tags: [Laboratoires]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nom
 *               - adresse
 *               - telephone
 *               - email
 *               - responsable
 *               - openHours
 *             properties:
 *               nom:
 *                 type: string
 *               adresse:
 *                 type: string
 *               telephone:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               responsable:
 *                 type: string
 *               openHours:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [actif, inactif]
 *     responses:
 *       201:
 *         description: Laboratoire créé avec succès
 *       403:
 *         description: Accès refusé (admin seulement)
 */
router.post('/', authenticate, adminOnly, createLaboratory);

/**
 * @swagger
 * /api/laboratoires/{id}:
 *   put:
 *     summary: Met à jour un laboratoire
 *     tags: [Laboratoires]
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
 *               nom:
 *                 type: string
 *               adresse:
 *                 type: string
 *               telephone:
 *                 type: string
 *               email:
 *                 type: string
 *               responsable:
 *                 type: string
 *               openHours:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [actif, inactif]
 *     responses:
 *       200:
 *         description: Laboratoire mis à jour avec succès
 *       403:
 *         description: Accès refusé (admin seulement)
 *   delete:
 *     summary: Supprime un laboratoire
 *     tags: [Laboratoires]
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
 *         description: Laboratoire supprimé avec succès
 *       403:
 *         description: Accès refusé (admin seulement)
 */
router.put('/:id', authenticate, adminOnly, updateLaboratory);
router.delete('/:id', authenticate, adminOnly, deleteLaboratory);

module.exports = router;