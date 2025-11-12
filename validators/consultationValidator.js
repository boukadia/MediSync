const { body, param, validationResult } = require('express-validator');

const checkValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

exports.validateCreateConsultation = [
    // Le rendez-vous est obligatoire
    body('appointment')
        .notEmpty()
        .withMessage('ID du rendez-vous obligatoire')
        .isMongoId()
        .withMessage('ID rendez-vous invalide'),

    // Le médecin est optionnel mais doit être un ID valide s'il est fourni
    body('medecin')
        .optional()
        .isMongoId()
        .withMessage('ID médecin invalide'),

   
    // Diagnostic est optionnel
    body('diagnostic')
        .optional()
        .isString()
        .withMessage('Le diagnostic doit être du texte'),

    // Symptômes sont optionnels
    body('symptomes')
        .optional()
        .isString()
        .withMessage('Les symptômes doivent être du texte'),

    // Notes sont optionnelles
    body('notes')
        .optional()
        .isString()
        .withMessage('Les notes doivent être du texte'),

    // Date de consultation est optionnelle mais doit être une date valide si fournie
    body('dateConsultation')
        .optional()
        .isISO8601()
        .withMessage('Format de date invalide'),

    checkValidationErrors
];

exports.validateUpdateConsultation = [
    param('id')
        .isMongoId()
        .withMessage('ID de consultation invalide'),

    body('medecin')
        .optional()
        .isMongoId()
        .withMessage('ID médecin invalide'),

   
    body('diagnostic')
        .optional()
        .isString()
        .withMessage('Le diagnostic doit être du texte'),

    body('symptomes')
        .optional()
        .isString()
        .withMessage('Les symptômes doivent être du texte'),

    body('notes')
        .optional()
        .isString()
        .withMessage('Les notes doivent être du texte'),

    body('dateConsultation')
        .optional()
        .isISO8601()
        .withMessage('Format de date invalide'),

    checkValidationErrors
];