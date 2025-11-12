const { body, param, validationResult } = require('express-validator');

const checkValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

exports.validateCreatePharmacy = [
    body('name')
        .notEmpty()
        .withMessage('Nom de la pharmacie obligatoire'),

    body('pharmacistName')
        .optional()
        .isString()
        .withMessage('Nom du pharmacien doit être du texte'),

    body('address')
        .notEmpty()
        .withMessage('Adresse obligatoire'),

    body('phone')
        .notEmpty()
        .withMessage('Numéro de téléphone obligatoire')
        .matches(/^\+?[0-9\s-]{8,}$/)
        .withMessage('Format de téléphone invalide'),

    body('horaires')
        .notEmpty()
        .withMessage('Heures d\'ouverture obligatoires'),

    checkValidationErrors
];

exports.validateUpdatePharmacy = [
    param('id')
        .isMongoId()
        .withMessage('ID de pharmacie invalide'),

    body('name')
        .optional()
        .notEmpty()
        .withMessage('Nom ne peut pas être vide'),

    body('pharmacistName')
        .optional()
        .isString()
        .withMessage('Nom du pharmacien doit être du texte'),

    body('address')
        .optional()
        .notEmpty()
        .withMessage('Adresse ne peut pas être vide'),

    body('phone')
        .optional()
        .matches(/^\+?[0-9\s-]{8,}$/)
        .withMessage('Format de téléphone invalide'),

    body('horaires')
        .optional()
        .notEmpty()
        .withMessage('Heures d\'ouverture ne peuvent pas être vides'),

    checkValidationErrors
];