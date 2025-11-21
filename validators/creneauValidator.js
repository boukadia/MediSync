const { body, param, query, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Erreurs de validation',
      details: errors.array()
    });
  }
  next();
};

const validateCreateCreneau = [
  body('heure_debut')
    .notEmpty()
    .withMessage('L\'heure de début est requise')
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Format d\'heure invalide (HH:MM)'),
  
  body('heure_fin')
    .notEmpty()
    .withMessage('L\'heure de fin est requise')
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Format d\'heure invalide (HH:MM)'),
  
  body('disponibilite')
    .notEmpty()
    .withMessage('La disponibilité est requise')
    .isMongoId()
    .withMessage('ID de disponibilité invalide'),
  
  body('medecin')
    .optional()
    .isMongoId()
    .withMessage('ID médecin invalide'),
  
  body('statut')
    .optional()
    .isIn(['libre', 'reserve'])
    .withMessage('Statut invalide (libre ou reserve)'),
  
  handleValidationErrors
];

const validateUpdateCreneau = [
  param('id')
    .isMongoId()
    .withMessage('ID créneau invalide'),
  
  body('heure_debut')
    .optional()
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Format d\'heure invalide (HH:MM)'),
  
  body('heure_fin')
    .optional()
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Format d\'heure invalide (HH:MM)'),
  
  body('disponibilite')
    .optional()
    .isMongoId()
    .withMessage('ID de disponibilité invalide'),
  
  body('medecin')
    .optional()
    .isMongoId()
    .withMessage('ID médecin invalide'),
  
  body('statut')
    .optional()
    .isIn(['libre', 'reserve'])
    .withMessage('Statut invalide (libre ou reserve)'),
  
  handleValidationErrors
];

const validateGetCreneau = [
  param('id')
    .isMongoId()
    .withMessage('ID créneau invalide'),
  
  handleValidationErrors
];

const validateGetCreneaux = [
  query('statut')
    .optional()
    .isIn(['libre', 'reserve'])
    .withMessage('Statut invalide (libre ou reserve)'),
  
  query('medecin')
    .optional()
    .isMongoId()
    .withMessage('ID médecin invalide'),
  
  handleValidationErrors
];

module.exports = {
  validateCreateCreneau,
  validateUpdateCreneau,
  validateGetCreneau,
  validateGetCreneaux
};