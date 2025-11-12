const { body, param, validationResult } = require('express-validator');

const checkValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

exports.validateCreateDisponibilite = [
    body('dateHeureDebut')
        .notEmpty()
        .withMessage('Date et heure de début obligatoires')
        .isISO8601()
        .withMessage('Format date-heure invalide (ISO 8601)'),

    body('dateHeureFin')
        .notEmpty()
        .withMessage('Date et heure de fin obligatoires')
        .isISO8601()
        .withMessage('Format date-heure invalide (ISO 8601)')
        .custom((value, { req }) => {
            if (new Date(value) <= new Date(req.body.dateHeureDebut)) {
                throw new Error('La date-heure de fin doit être après la date-heure de début');
            }
            return true;
        }),

    body('medecin')
        .notEmpty()
        .withMessage('ID du médecin obligatoire')
        .isMongoId()
        .withMessage('ID médecin invalide'),

    body('jour')
        .notEmpty()
        .withMessage('Jour obligatoire')
        .isIn(['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'])
        .withMessage('Jour invalide (lundi à samedi seulement)'),

    checkValidationErrors
];

exports.validateUpdateDisponibilite = [
    param('id')
        .isMongoId()
        .withMessage('ID de disponibilité invalide'),

    body('dateHeureDebut')
        .optional()
        .isISO8601()
        .withMessage('Format date-heure invalide (ISO 8601)'),

    body('dateHeureFin')
        .optional()
        .isISO8601()
        .withMessage('Format date-heure invalide (ISO 8601)')
        .custom((value, { req }) => {
            if (req.body.dateHeureDebut && new Date(value) <= new Date(req.body.dateHeureDebut)) {
                throw new Error('La date-heure de fin doit être après la date-heure de début');
            }
            return true;
        }),

    body('medecin')
        .optional()
        .isMongoId()
        .withMessage('ID médecin invalide'),

    body('jour')
        .optional()
        .isIn(['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'])
        .withMessage('Jour invalide (lundi à samedi seulement)'),

    checkValidationErrors
];