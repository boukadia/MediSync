const express = require('express');
const router = express.Router();
const { authenticate } = require('../../middlewares/auth');
const { 
  adminOnly, 
  requireRoles,
  checkOwnership 
} = require('../../middlewares/permissions');
const User = require('../../models/User');

/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Récupère le profil de l'utilisateur connecté
 *     description: Retourne les informations de profil de l'utilisateur actuellement authentifié
 *     security:
 *       - bearerAuth: []
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Informations de profil
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Non authentifié
 */
router.get('/profile', authenticate, async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /users/profile:
 *   put:
 *     summary: Met à jour le profil de l'utilisateur connecté
 *     description: Modifie les informations de profil de l'utilisateur actuellement authentifié (email et rôle ne peuvent pas être modifiés)
 *     security:
 *       - bearerAuth: []
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               specialite:
 *                 type: string
 *                 description: Uniquement pour les médecins
 *     responses:
 *       200:
 *         description: Profil mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Non authentifié
 */
router.put('/profile', authenticate, async (req, res) => {
  try {
    const { email, ...updateData } = req.body;
    delete updateData.password; // منع تغيير كلمة المرور من هنا
    delete updateData.role; // منع تغيير الدور
    
    const user = await User.findByIdAndUpdate(
      req.user._id, 
      updateData, 
      { new: true }
    ).select('-password');
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Récupère tous les utilisateurs
 *     description: Retourne la liste de tous les utilisateurs (accessible uniquement par les administrateurs)
 *     security:
 *       - bearerAuth: []
 *     tags: [Users]
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
router.get('/', authenticate, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Récupère un utilisateur par ID
 *     description: Retourne les informations d'un utilisateur spécifique (accessible uniquement par l'administrateur ou l'utilisateur lui-même)
 *     security:
 *       - bearerAuth: []
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de l'utilisateur
 *     responses:
 *       200:
 *         description: Informations de l'utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès non autorisé
 *       404:
 *         description: Utilisateur non trouvé
 */
router.get('/:id', authenticate, async (req, res) => {
  try {
    // التحقق من الصلاحية
    if (req.params.id !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Met à jour un utilisateur
 *     description: Modifie les informations d'un utilisateur spécifique (accessible uniquement par les administrateurs)
 *     security:
 *       - bearerAuth: []
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de l'utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               role:
 *                 type: string
 *                 enum: [patient, doctor, admin]
 *               specialite:
 *                 type: string
 *     responses:
 *       200:
 *         description: Utilisateur mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès non autorisé
 *       404:
 *         description: Utilisateur non trouvé
 */
router.put('/:id', authenticate, adminOnly, async (req, res) => {
  try {
    const { password, ...updateData } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.id, 
      updateData, 
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Supprime un utilisateur
 *     description: Supprime un utilisateur spécifique (accessible uniquement par les administrateurs)
 *     security:
 *       - bearerAuth: []
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de l'utilisateur
 *     responses:
 *       200:
 *         description: Utilisateur supprimé avec succès
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès non autorisé
 *       404:
 *         description: Utilisateur non trouvé
 */
router.delete('/:id', authenticate, adminOnly, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /users/doctors/list:
 *   get:
 *     summary: Récupère la liste des médecins
 *     description: Retourne la liste de tous les utilisateurs avec le rôle 'doctor'
 *     security:
 *       - bearerAuth: []
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Liste des médecins
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Non authentifié
 */
router.get('/doctors/list', authenticate, async (req, res) => {
  try {
    const doctors = await User.find({ role: 'doctor' }).select('-password');
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;