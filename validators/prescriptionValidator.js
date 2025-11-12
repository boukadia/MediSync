const { body, param, validationResult } = require('express-validator');

// Middleware pour vérifier les erreurs de validation
const checkValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// Validation pour créer une prescription
exports.validateCreatePrescription = [
    // Validation du patient
    body('patientId')
        .notEmpty()
        .withMessage('ID du patient obligatoire')
        .isMongoId()
        .withMessage('ID du patient invalide'),

    // Validation du médecin
    body('doctorId')
        .notEmpty()
        .withMessage('ID du médecin obligatoire')
        .isMongoId()
        .withMessage('ID du médecin invalide'),

    // Validation de la consultation
    body('ConsultationId')
        .notEmpty()
        .withMessage('ID de consultation obligatoire')
        .isMongoId()
        .withMessage('ID de consultation invalide'),

    // Validation des notes (optionnelles)
    body('notes')
        .optional()
        .isString()
        .withMessage('Les notes doivent être du texte'),

    // Validation des médicaments
    body('medications')
        .isArray()
        .withMessage('medications doit être un tableau')
        .notEmpty()
        .withMessage('Au moins un médicament requis'),

    // Validation de chaque médicament
    body('medications.*.name')
        .notEmpty()
        .withMessage('Nom du médicament obligatoire'),

    body('medications.*.dosage')
        .notEmpty()
        .withMessage('Dosage obligatoire'),

    body('medications.*.instructions')
        .notEmpty()
        .withMessage('Instructions obligatoires'),

    body('medications.*.duration')
        .notEmpty()
        .withMessage('Durée obligatoire'),

    body('medications.*.pharmacyId')
        .optional()
        .isMongoId()
        .withMessage('ID pharmacie invalide'),

    body('medications.*.status')
        .optional()
        .isIn(['prescribed', 'dispensed'])
        .withMessage('Status médicament invalide'),

    // Validation du status général
    body('status')
        .optional()
        .isIn(['draft', 'signed'])
        .withMessage('Status invalide (draft ou signed)'),

    // Vérifier les erreurs
    checkValidationErrors
];

// Validation pour modifier une prescription
exports.validateUpdatePrescription = [
    // Valider l'ID dans l'URL
    param('id')
        .isMongoId()
        .withMessage('ID de prescription invalide'),

    // Les champs sont optionnels pour la mise à jour
    body('medications')
        .optional()
        .isArray()
        .withMessage('medications doit être un tableau'),

    body('medications.*.name')
        .optional()
        .notEmpty()
        .withMessage('Nom du médicament ne peut pas être vide'),

    body('medications.*.dosage')
        .optional()
        .notEmpty()
        .withMessage('Dosage ne peut pas être vide'),

    body('medications.*.duration')
        .optional()
        .notEmpty()
        .withMessage('Durée ne peut pas être vide'),

    body('status')
        .optional()
        .isIn(['draft', 'signed', 'sent', 'dispensed'])
        .withMessage('Status invalide'),

    // Vérifier les erreurs
    checkValidationErrors
];