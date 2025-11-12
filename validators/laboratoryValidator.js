const { body, param, validationResult } = require('express-validator');

// Middleware pour vérifier les erreurs de validation
const checkValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// Validation pour créer un laboratoire
exports.validateCreateLaboratory = [
    body('nom')
        .notEmpty()
        .withMessage('Le nom du laboratoire est obligatoire'),

    body('adresse')
        .notEmpty()
        .withMessage('L\'adresse est obligatoire'),

    body('telephone')
        .notEmpty()
        .withMessage('Le numéro de téléphone est obligatoire')
        .matches(/^\+?[0-9\s-]{8,}$/)
        .withMessage('Format de téléphone invalide'),

    body('email')
        .notEmpty()
        .withMessage('L\'email est obligatoire')
        .isEmail()
        .withMessage('Format d\'email invalide'),

    body('responsable')
        .notEmpty()
        .withMessage('Le responsable est obligatoire'),

    body('openHours')
        .notEmpty()
        .withMessage('Les heures d\'ouverture sont obligatoires'),

    body('status')
        .optional()
        .isIn(['actif', 'inactif'])
        .withMessage('Status invalide (actif ou inactif seulement)'),

    checkValidationErrors
];

// Validation pour modifier un laboratoire
exports.validateUpdateLaboratory = [
    param('id')
        .isMongoId()
        .withMessage('ID de laboratoire invalide'),

    body('nom')
        .optional()
        .notEmpty()
        .withMessage('Le nom ne peut pas être vide'),

    body('adresse')
        .optional()
        .notEmpty()
        .withMessage('L\'adresse ne peut pas être vide'),

    body('telephone')
        .optional()
        .matches(/^\+?[0-9\s-]{8,}$/)
        .withMessage('Format de téléphone invalide'),

    body('email')
        .optional()
        .isEmail()
        .withMessage('Format d\'email invalide'),

    body('responsable')
        .optional()
        .notEmpty()
        .withMessage('Le responsable ne peut pas être vide'),

    body('openHours')
        .optional()
        .notEmpty()
        .withMessage('Les heures d\'ouverture ne peuvent pas être vides'),

    body('status')
        .optional()
        .isIn(['actif', 'inactif'])
        .withMessage('Status invalide (actif ou inactif seulement)'),

    checkValidationErrors
];