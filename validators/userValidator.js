const { body, param, validationResult } = require('express-validator');

const checkValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// Validation pour l'inscription
exports.validateRegister = [
    body('email')
        .notEmpty()
        .withMessage('L\'email est obligatoire')
        .isEmail()
        .withMessage('Format d\'email invalide'),

    body('name')
        .optional()
        .isString()
        .withMessage('Le nom doit être du texte'),

    body('password')
        .notEmpty()
        .withMessage('Le mot de passe est obligatoire')
        .isLength({ min: 3 })
        .withMessage('Le mot de passe doit contenir au moins 6 caractères'),

    body('role')
        .optional()
        .isIn(['admin', 'doctor', 'patient', 'laboratoire', 'pharmacy','secretary'])
        .withMessage('Rôle invalide'),

    body('status')
        .optional()
        .isIn(['active', 'inactive'])
        .withMessage('Status invalide'),

    checkValidationErrors
];

// Validation pour la connexion
exports.validateLogin = [
    body('email')
        .notEmpty()
        .withMessage('L\'email est obligatoire')
        .isEmail()
        .withMessage('Format d\'email invalide'),

    body('password')
        .notEmpty()
        .withMessage('Le mot de passe est obligatoire'),

    checkValidationErrors
];

// Validation pour la mise à jour du profil
exports.validateUpdateProfile = [
    body('name')
        .optional()
        .isString()
        .withMessage('Le nom doit être du texte'),

    body('email')
        .optional()
        .isEmail()
        .withMessage('Format d\'email invalide'),

    body('password')
        .optional()
        .isLength({ min: 6 })
        .withMessage('Le mot de passe doit contenir au moins 6 caractères'),

    body('status')
        .optional()
        .isIn(['active', 'inactive'])
        .withMessage('Status invalide'),

    body('role')
        .optional()
        .isIn(['admin', 'doctor', 'patient', 'laboratoire', 'pharmacy'])
        .withMessage('Rôle invalide'),

    checkValidationErrors
];