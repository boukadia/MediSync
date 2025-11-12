const express = require('express');
const router = express.Router();
const { authenticate } = require('../../middlewares/auth');
const { 
  doctorOnly, 
  checkDoctorDisponibilite,
  adminOnly 
} = require('../../middlewares/permissions');
const { 
  createDisponibilite, 
  getDisponibilites ,updateDisponibilite,deleteDisponibilite
} = require('../../controllers/disponibiliteController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Disponibilite:
 *       type: object
 *       required:
 *         - doctorId
 *         - date
 *         - heureDebut
 *         - heureFin
 *         - dureeCreneaux
 *       properties:
 *         _id:
 *           type: string
 *           description: ID auto-généré de disponibilité
 *         doctorId:
 *           type: string
 *           description: ID du médecin
 *         date:
 *           type: string
 *           format: date
 *           description: Date de disponibilité
 *         heureDebut:
 *           type: string
 *           description: Heure de début (format HH:mm)
 *         heureFin:
 *           type: string
 *           description: Heure de fin (format HH:mm)
 *         dureeCreneaux:
 *           type: number
 *           description: Durée des créneaux en minutes
 *         creneaux:
 *           type: array
 *           items:
 *             type: string
 *           description: Liste des IDs de créneaux générés
 *       example:
 *         doctorId: "60d0fe4f5311236168a109cb"
 *         date: "2023-08-10"
 *         heureDebut: "09:00"
 *         heureFin: "17:00"
 *         dureeCreneaux: 30
 *     Creneau:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: ID auto-généré du créneau
 *         disponibiliteId:
 *           type: string
 *           description: ID de la disponibilité parente
 *         doctorId:
 *           type: string
 *           description: ID du médecin
 *         heureDebut:
 *           type: string
 *           description: Heure de début du créneau (format HH:mm)
 *         heureFin:
 *           type: string
 *           description: Heure de fin du créneau (format HH:mm)
 *         status:
 *           type: string
 *           enum: [available, booked]
 *           description: Statut du créneau
 */

/**
 * @swagger
 * /disponibilites:
 *   get:
 *     summary: Récupère les disponibilités des médecins
 *     security:
 *       - bearerAuth: []
 *     
 *     description: Retourne la liste des disponibilités des médecins (accessible uniquement par l'admin)
 *     tags: [Disponibilites]
 *     responses:
 *       200:
 *         description: Liste des disponibilités
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Disponibilite'
 */
router.get('/', authenticate,adminOnly,getDisponibilites);

/**
 * @swagger
 * /disponibilites:
 *   post:
 *     summary: Crée une nouvelle disponibilité
 *     description: Crée une nouvelle disponibilité pour un médecin (accessible uniquement par les médecins)
 *     tags: [Disponibilites]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - date
 *               - heureDebut
 *               - heureFin
 *               - dureeCreneaux
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *               heureDebut:
 *                 type: string
 *                 example: "09:00"
 *               heureFin:
 *                 type: string
 *                 example: "17:00"
 *               dureeCreneaux:
 *                 type: number
 *                 example: 30
 *     responses:
 *       201:
 *         description: Disponibilité créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Disponibilite'
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès non autorisé
 */
router.post('/', authenticate, doctorOnly, createDisponibilite);

/**
 * @swagger
 * /disponibilites/{id}:
 *   put:
 *     summary: Met à jour une disponibilité
 *     description: Modifie une disponibilité existante (accessible uniquement par le médecin propriétaire)
 *     tags: [Disponibilites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la disponibilité
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *               heureDebut:
 *                 type: string
 *                 example: "09:00"
 *               heureFin:
 *                 type: string
 *                 example: "17:00"
 *               dureeCreneaux:
 *                 type: number
 *                 example: 30
 *     responses:
 *       200:
 *         description: Disponibilité modifiée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Disponibilite'
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès non autorisé
 *       404:
 *         description: Disponibilité non trouvée
 */
router.put('/:id', authenticate,checkDoctorDisponibilite ,updateDisponibilite
);

/**
 * @swagger
 * /disponibilites/{id}:
 *   delete:
 *     summary: Supprime une disponibilité
 *     description: Supprime une disponibilité existante (accessible uniquement par le médecin propriétaire)
 *     tags: [Disponibilites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la disponibilité
 *     responses:
 *       200:
 *         description: Disponibilité supprimée avec succès
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès non autorisé
 *       404:
 *         description: Disponibilité non trouvée
 */
router.delete('/:id', authenticate, checkDoctorDisponibilite,deleteDisponibilite);

module.exports = router;