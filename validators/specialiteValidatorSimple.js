const { body, param, validationResult } = require('express-validator');

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

const validateCreateSpecialite = [
  body('name')
    .notEmpty()
    .withMessage('Le nom est requis')
    .isLength({ min: 2, max: 100 })
    .withMessage('Le nom doit contenir entre 2 et 100 caractères')
    .trim(),
  
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('La description ne peut pas dépasser 500 caractères')
    .trim(),
  
  handleValidationErrors
];

const validateUpdateSpecialite = [
  param('id')
    .isMongoId()
    .withMessage('ID invalide'),
  
  body('name')
    .optional()
    .notEmpty()
    .withMessage('Le nom ne peut pas être vide')
    .isLength({ min: 2, max: 100 })
    .withMessage('Le nom doit contenir entre 2 et 100 caractères')
    .trim(),
  
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('La description ne peut pas dépasser 500 caractères')
    .trim(),
  
  handleValidationErrors
];

const validateGetSpecialite = [
  param('id')
    .isMongoId()
    .withMessage('ID invalide'),
  
  handleValidationErrors
];

module.exports = {
  validateCreateSpecialite,
  validateUpdateSpecialite,
  validateGetSpecialite
};