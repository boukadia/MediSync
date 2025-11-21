const { body, param, query, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Erreurs de validation',
      errors: errors.array()
    });
  }
  next();
};

const validateCreateSpecialite = [
  body('userId')
    .notEmpty()
    .withMessage('L\'ID utilisateur est requis')
    .isMongoId()
    .withMessage('ID utilisateur invalide'),
  
  body('specialite')
    .notEmpty()
    .withMessage('La spécialité est requise')
    .isIn([
      'Cardiologie', 'Dermatologie', 'Endocrinologie', 'Gastroenterologie',
      'Gynecologie', 'Neurologie', 'Ophtalmoloqie', 'Orthopedia', 'Pediatrie',
      'Psychiatrie', 'Radiologie', 'Urologie', 'Medecine_Generale',
      'Chirurgie_Generale', 'Anesthesie', 'ORL'
    ])
    .withMessage('Spécialité non valide'),
  
  body('numLicence')
    .notEmpty()
    .withMessage('Le numéro de licence est requis')
    .isLength({ min: 3, max: 20 })
    .withMessage('Le numéro de licence doit contenir entre 3 et 20 caractères'),
  
  body('anneExperience')
    .isInt({ min: 0, max: 50 })
    .withMessage('L\'année d\'expérience doit être entre 0 et 50'),
  
  body('tarifConsultation')
    .isFloat({ min: 0 })
    .withMessage('Le tarif de consultation doit être un nombre positif'),
  
  body('dureeConsultation')
    .optional()
    .isInt({ min: 15, max: 120 })
    .withMessage('La durée de consultation doit être entre 15 et 120 minutes'),
  
  body('accepteUrgence')
    .optional()
    .isBoolean()
    .withMessage('accepteUrgence doit être un booléen'),
  
  body('consultationEnLigne')
    .optional()
    .isBoolean()
    .withMessage('consultationEnLigne doit être un booléen'),
  
  body('presentation')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('La présentation ne peut pas dépasser 1000 caractères'),
  
  body('langues')
    .optional()
    .isArray()
    .withMessage('Les langues doivent être un tableau'),
  
  body('langues.*')
    .optional()
    .isIn(['Francais', 'Arabe', 'Anglais', 'Espagnol', 'Allemand'])
    .withMessage('Langue non valide'),
  
  body('diplomes')
    .optional()
    .isArray()
    .withMessage('Les diplômes doivent être un tableau'),
  
  body('diplomes.*.nom')
    .optional()
    .notEmpty()
    .withMessage('Le nom du diplôme est requis'),
  
  body('diplomes.*.institution')
    .optional()
    .notEmpty()
    .withMessage('L\'institution du diplôme est requise'),
  
  body('diplomes.*.anneeObtention')
    .optional()
    .isInt({ min: 1950, max: new Date().getFullYear() })
    .withMessage('Année d\'obtention invalide'),
  
  body('certifications')
    .optional()
    .isArray()
    .withMessage('Les certifications doivent être un tableau'),
  
  body('horaires')
    .optional()
    .isObject()
    .withMessage('Les horaires doivent être un objet'),
  
  handleValidationErrors
];

const validateUpdateSpecialite = [
  param('id')
    .isMongoId()
    .withMessage('ID spécialiste invalide'),
  
  body('specialite')
    .optional()
    .isIn([
      'Cardiologie', 'Dermatologie', 'Endocrinologie', 'Gastroenterologie',
      'Gynecologie', 'Neurologie', 'Ophtalmoloqie', 'Orthopedia', 'Pediatrie',
      'Psychiatrie', 'Radiologie', 'Urologie', 'Medecine_Generale',
      'Chirurgie_Generale', 'Anesthesie', 'ORL'
    ])
    .withMessage('Spécialité non valide'),
  
  body('numLicence')
    .optional()
    .isLength({ min: 3, max: 20 })
    .withMessage('Le numéro de licence doit contenir entre 3 et 20 caractères'),
  
  body('anneExperience')
    .optional()
    .isInt({ min: 0, max: 50 })
    .withMessage('L\'année d\'expérience doit être entre 0 et 50'),
  
  body('tarifConsultation')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Le tarif de consultation doit être un nombre positif'),
  
  body('dureeConsultation')
    .optional()
    .isInt({ min: 15, max: 120 })
    .withMessage('La durée de consultation doit être entre 15 et 120 minutes'),
  
  body('accepteUrgence')
    .optional()
    .isBoolean()
    .withMessage('accepteUrgence doit être un booléen'),
  
  body('consultationEnLigne')
    .optional()
    .isBoolean()
    .withMessage('consultationEnLigne doit être un booléen'),
  
  body('presentation')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('La présentation ne peut pas dépasser 1000 caractères'),
  
  body('langues')
    .optional()
    .isArray()
    .withMessage('Les langues doivent être un tableau'),
  
  body('langues.*')
    .optional()
    .isIn(['Francais', 'Arabe', 'Anglais', 'Espagnol', 'Allemand'])
    .withMessage('Langue non valide'),
  
  body('status')
    .optional()
    .isIn(['actif', 'inactif', 'suspendu'])
    .withMessage('Statut non valide'),
  
  handleValidationErrors
];

const validateGetSpecialite = [
  param('id')
    .isMongoId()
    .withMessage('ID spécialiste invalide'),
  
  handleValidationErrors
];

const validateGetSpecialiteByUserId = [
  param('userId')
    .isMongoId()
    .withMessage('ID utilisateur invalide'),
  
  handleValidationErrors
];

const validateGetAllSpecialites = [
  query('specialite')
    .optional()
    .isIn([
      'Cardiologie', 'Dermatologie', 'Endocrinologie', 'Gastroenterologie',
      'Gynecologie', 'Neurologie', 'Ophtalmoloqie', 'Orthopedia', 'Pediatrie',
      'Psychiatrie', 'Radiologie', 'Urologie', 'Medecine_Generale',
      'Chirurgie_Generale', 'Anesthesie', 'ORL'
    ])
    .withMessage('Spécialité non valide'),
  
  query('rating')
    .optional()
    .isFloat({ min: 0, max: 5 })
    .withMessage('Le rating doit être entre 0 et 5'),
  
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('La page doit être un entier positif'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('La limite doit être entre 1 et 100'),
  
  query('ville')
    .optional()
    .isLength({ min: 2 })
    .withMessage('Le nom de ville doit contenir au moins 2 caractères'),
  
  handleValidationErrors
];

const validateGetAvailability = [
  param('id')
    .isMongoId()
    .withMessage('ID spécialiste invalide'),
  
  query('date')
    .optional()
    .isISO8601()
    .withMessage('Format de date invalide'),
  
  query('semaine')
    .optional()
    .isISO8601()
    .withMessage('Format de date invalide pour la semaine'),
  
  handleValidationErrors
];

module.exports = {
  validateCreateSpecialite,
  validateUpdateSpecialite,
  validateGetSpecialite,
  validateGetSpecialiteByUserId,
  validateGetAllSpecialites,
  validateGetAvailability
};