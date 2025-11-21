const express = require('express');
const router = express.Router();
const specialiteController = require('../../controllers/specialiteController');
const { authenticate } = require('../../middlewares/auth');
const { adminOnly } = require('../../middlewares/permissions');
const {
  validateCreateSpecialite,
  validateUpdateSpecialite,
  validateGetSpecialite
} = require('../../validators/specialiteValidatorSimple');

// Routes publiques pour consulter les spécialités
router.get('/', specialiteController.getAllSpecialites);
router.get('/:id', validateGetSpecialite, specialiteController.getSpecialiteById);

// Routes protégées - Admin seulement pour modifier les spécialités
router.post('/', 
  authenticate, 
  adminOnly,
  validateCreateSpecialite,
  specialiteController.createSpecialite
);

router.put('/:id', 
  authenticate, 
  adminOnly,
  validateUpdateSpecialite,
  specialiteController.updateSpecialite
);

router.delete('/:id', 
  authenticate, 
  adminOnly,
  validateGetSpecialite,
  specialiteController.deleteSpecialite
);

module.exports = router;