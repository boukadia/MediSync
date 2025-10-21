const express = require('express');
const { authenticate, authorize } = require('../../middlewares/auth');
const { register, login,getUsers,logOut,toggleUserStatus,deleteUser,updateProfile } = require('../../controllers/AuthController');
const { adminOnly } = require('../../middlewares/permissions');
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *         - role
 *       properties:
 *         _id:
 *           type: string
 *           description: ID auto-généré de l'utilisateur
 *         name:
 *           type: string
 *           description: Nom complet de l'utilisateur
 *         email:
 *           type: string
 *           format: email
 *           description: Email de l'utilisateur
 *         password:
 *           type: string
 *           format: password
 *           description: Mot de passe de l'utilisateur (haché en base de données)
 *         role:
 *           type: string
 *           description: Rôle de l'utilisateur
 *           enum: [patient, doctor, admin]
 *         specialite:
 *           type: string
 *           description: Spécialité du médecin (uniquement pour les médecins)
 *       example:
 *         name: "John Doe"
 *         email: "john@example.com"
 *         password: "password123"
 *         role: "patient"
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Inscription d'un nouvel utilisateur
 *     description: Enregistre un nouvel utilisateur dans le système
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *               role:
 *                 type: string
 *                 enum: [patient, doctor, admin]
 *               specialite:
 *                 type: string
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                 token:
 *                   type: string
 *       400:
 *         description: Données invalides ou email déjà utilisé
 */
router.post('/register', register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Connexion utilisateur
 *     description: Authentifie un utilisateur et retourne un token JWT
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Connexion réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                 token:
 *                   type: string
 *       400:
 *        description: Authentification échouée
 */
router.post('/login', login);

/**
 * @swagger
 * /auth/logout:
 *   get:
 *     summary: Déconnexion
 *     description: Déconnecte l'utilisateur actuel
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Déconnexion réussie
 */
router.get('/logout', logOut);

/**
 * @swagger
 * /auth/getUsers:
 *   get:
 *     summary: Liste des utilisateurs
 *     description: Retourne la liste des utilisateurs (accessible uniquement par les administrateurs authentifiés)
 *     security:
 *       - bearerAuth: []
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Liste des utilisateurs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès non autorisé
 */
router.get('/getUsers', 
  authenticate, 
  adminOnly,
  getUsers
);

router.put('/status/:id',authenticate,adminOnly,toggleUserStatus);
router.put('/profile',authenticate,updateProfile)
router.delete('/profile/delete/:id',authenticate,adminOnly,deleteUser);
module.exports = router;  