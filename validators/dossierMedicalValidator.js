const { body, param, validationResult } = require('express-validator');

const checkValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

exports.validateCreateDossier = [
    body('patientId')
        .notEmpty()
        .withMessage('ID du patient obligatoire')
        .isMongoId()
        .withMessage('ID patient invalide'),

    body('allergies')
        .optional()
        .isString()
        .withMessage('Les allergies doivent être du texte'),

    body('groupeSanguin')
        .optional()
        .isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
        .withMessage('Groupe sanguin invalide'),

    checkValidationErrors
];

exports.validateUpdateDossier = [
    param('id')
        .isMongoId()
        .withMessage('ID de dossier invalide'),

    body('addAllergies')
        .optional()
        .isString()
        .withMessage('Les allergies à ajouter doivent être du texte'),

    body('removeAllergies')
        .optional()
        .isString()
        .withMessage('Les allergies à supprimer doivent être du texte'),

    body('groupeSanguin')
        .optional()
        .isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
        .withMessage('Groupe sanguin invalide'),

    checkValidationErrors
];