const express = require('express');
const router = express.Router();
const creneauController = require('../../controllers/creneauController');
const { authenticate } = require('../../middlewares/auth');
const { doctorOnly, adminOnly } = require('../../middlewares/permissions');
const {
  validateCreateCreneau,
  validateUpdateCreneau,
  validateGetCreneau,
  validateGetCreneaux
} = require('../../validators/creneauValidator');

// Routes publiques pour consulter les créneaux
router.get('/', validateGetCreneaux, creneauController.getAllCreneaux);
router.get('/libres', creneauController.getCreneauxLibres);
router.get('/:id', creneauController.getCreneauByDisponibilite);

// Routes protégées pour les docteurs
router.post('/', 
  authenticate, 
  doctorOnly,
  validateCreateCreneau,
  creneauController.createCreneau
);

router.put('/:id', 
  authenticate, 
  doctorOnly,
  validateUpdateCreneau,
  creneauController.updateCreneau
);

// Routes pour réserver/libérer (authentifiées)
router.patch('/:id/reserver', 
  authenticate,
  validateGetCreneau,
  creneauController.reserverCreneau
);

router.patch('/:id/liberer', 
  authenticate,
  validateGetCreneau,
  creneauController.libererCreneau
);

// Routes admin pour supprimer
router.delete('/:id', 
  authenticate, 
  adminOnly,
  validateGetCreneau,
  creneauController.deleteCreneau
);

module.exports = router;