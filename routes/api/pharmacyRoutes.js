const express = require('express');
const router = express.Router();
const { authenticate } = require('../../middlewares/auth');
const { adminOnly, requireRoles } = require('../../middlewares/permissions');
const {
  getPharmacies,
  getPharmacyById,
  createPharmacy,
  updatePharmacy,
  deletePharmacy
} = require('../../controllers/pharmacyController');

/**
 * @swagger
 * tags:
 *   name: Pharmacies
 *   description: Gestion des pharmacies
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Pharmacy:
 *       type: object
 *       required:
 *         - name
 *         - address
 *         - phone
 *         - horaires
 *       properties:
 *         _id:
 *           type: string
 *           description: ID auto-généré de la pharmacie
 *         name:
 *           type: string
 *           description: Nom de la pharmacie
 *         pharmacistName:
 *           type: string
 *           description: Nom du pharmacien
 *         address:
 *           type: string
 *           description: Adresse de la pharmacie
 *         phone:
 *           type: string
 *           description: Numéro de téléphone
 *         horaires:
 *           type: string
 *           description: Heures d'ouverture
 *       example:
 *         name: "Pharmacie du Centre"
 *         pharmacistName: "Dr. Fatima Alami"
 *         address: "456 Avenue Mohammed V, Rabat"
 *         phone: "0537654321"
 *         horaires: "Lun-Sam 9h-22h, Dim 10h-20h"
 */

/**
 * @swagger
 * /api/pharmacies:
 *   get:
 *     summary: Récupère toutes les pharmacies
 *     tags: [Pharmacies]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des pharmacies récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Pharmacy'
 *       401:
 *         description: Non autorisé
 */
router.get('/', authenticate, getPharmacies);
/**
 * @swagger
 * /api/pharmacies/{id}:
 *   get:
 *     summary: Récupère une pharmacie par ID
 *     tags: [Pharmacies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la pharmacie
 *     responses:
 *       200:
 *         description: Pharmacie récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pharmacy'
 *       404:
 *         description: Pharmacie non trouvée
 *       403:
 *         description: Accès refusé (admin seulement)
 */
router.get('/:id', authenticate,adminOnly, getPharmacyById);

/**
 * @swagger
 * /api/pharmacies:
 *   post:
 *     summary: Crée une nouvelle pharmacie
 *     tags: [Pharmacies]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - address
 *               - phone
 *               - horaires
 *             properties:
 *               name:
 *                 type: string
 *               pharmacistName:
 *                 type: string
 *               address:
 *                 type: string
 *               phone:
 *                 type: string
 *               horaires:
 *                 type: string
 *     responses:
 *       201:
 *         description: Pharmacie créée avec succès
 *       403:
 *         description: Accès refusé (admin seulement)
 */
router.post('/', authenticate, adminOnly, createPharmacy);

/**
 * @swagger
 * /api/pharmacies/{id}:
 *   put:
 *     summary: Met à jour une pharmacie
 *     tags: [Pharmacies]
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
 *               name:
 *                 type: string
 *               pharmacistName:
 *                 type: string
 *               address:
 *                 type: string
 *               phone:
 *                 type: string
 *               horaires:
 *                 type: string
 *     responses:
 *       200:
 *         description: Pharmacie mise à jour avec succès
 *       403:
 *         description: Accès refusé (admin seulement)
 *   delete:
 *     summary: Supprime une pharmacie
 *     tags: [Pharmacies]
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
 *         description: Pharmacie supprimée avec succès
 *       403:
 *         description: Accès refusé (admin seulement)
 */
router.put('/:id', authenticate, adminOnly, updatePharmacy);
router.delete('/:id', authenticate, adminOnly, deletePharmacy);

module.exports = router;