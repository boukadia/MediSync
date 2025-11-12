const { body, param, validationResult } = require('express-validator');

// Middleware pour vérifier les erreurs
const checkValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// Validation pour créer un rendez-vous
exports.validateCreateAppointment = [
    // body('patientId')
    //     .notEmpty()
    //     .withMessage('ID du patient obligatoire')
    //     .isMongoId()
    //     .withMessage('ID patient invalide'),

    body('doctorId')
        .notEmpty()
        .withMessage('ID du médecin obligatoire')
        .isMongoId()
        .withMessage('ID médecin invalide'),

    body('creneau')
        .notEmpty()
        .withMessage('Créneau obligatoire')
        .isMongoId()
        .withMessage('ID créneau invalide'),

    body('date')
        .notEmpty()
        .withMessage('Date obligatoire')
        .isISO8601()
        .withMessage('Format de date invalide'),

    body('typeConsultation')
        .notEmpty()
        .withMessage('Type de consultation obligatoire')
        .isIn(['online', 'offline'])
        .withMessage('Type de consultation invalide (online ou offline)'),

    body('status')
        .optional()
        .isIn(['pending', 'confirmed', 'cancelled'])
        .withMessage('Status invalide (pending, confirmed ou cancelled)'),

    checkValidationErrors
];

// Validation pour modifier un rendez-vous
exports.validateUpdateAppointment = [
    param('id')
        .isMongoId()
        .withMessage('ID de rendez-vous invalide'),

    body('creneau')
        .optional()
        .isMongoId()
        .withMessage('ID créneau invalide'),

    body('date')
        .optional()
        .isISO8601()
        .withMessage('Format de date invalide'),

    body('typeConsultation')
        .optional()
        .isIn(['online', 'offline'])
        .withMessage('Type de consultation invalide (online ou offline)'),

    body('status')
        .optional()
        .isIn(['pending', 'confirmed', 'cancelled'])
        .withMessage('Status invalide (pending, confirmed ou cancelled)'),

    checkValidationErrors
];