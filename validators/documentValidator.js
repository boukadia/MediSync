const { body, param, validationResult } = require('express-validator');

const checkValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

exports.validateCreateDocument = [
    body('patientId')
        .notEmpty()
        .withMessage('ID du patient obligatoire')
        .isMongoId()
        .withMessage('ID patient invalide'),

    body('type')
        .notEmpty()
        .withMessage('Type de document obligatoire')
        .isIn(['ordonnance', 'analyse', 'radiologie', 'autre'])
        .withMessage('Type de document invalide'),

    body('titre')
        .notEmpty()
        .withMessage('Titre obligatoire'),

    body('description')
        .optional()
        .isString()
        .withMessage('Description doit être du texte'),

    body('fichier')
        .notEmpty()
        .withMessage('Fichier obligatoire'),

    checkValidationErrors
];

exports.validateUpdateDocument = [
    param('id')
        .isMongoId()
        .withMessage('ID de document invalide'),

    body('type')
        .optional()
        .isIn(['ordonnance', 'analyse', 'radiologie', 'autre'])
        .withMessage('Type de document invalide'),

    body('titre')
        .optional()
        .notEmpty()
        .withMessage('Titre ne peut pas être vide'),

    body('description')
        .optional()
        .isString()
        .withMessage('Description doit être du texte'),

    checkValidationErrors
];