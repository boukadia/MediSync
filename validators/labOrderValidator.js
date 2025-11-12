const { body, param, validationResult } = require('express-validator');

const checkValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// Validation pour les commandes de laboratoire
exports.validateCreateLabOrder = [
    body('patientId')
        .notEmpty()
        .withMessage('ID du patient obligatoire')
        .isMongoId()
        .withMessage('ID patient invalide'),

    body('doctorId')
        .notEmpty()
        .withMessage('ID du médecin obligatoire')
        .isMongoId()
        .withMessage('ID médecin invalide'),

    body('laboratoireId')
        .notEmpty()
        .withMessage('ID du laboratoire obligatoire')
        .isMongoId()
        .withMessage('ID laboratoire invalide'),

    body('tests')
        .isArray()
        .withMessage('La liste des tests doit être un tableau')
        .notEmpty()
        .withMessage('Au moins un test requis'),

    checkValidationErrors
];

// Validation pour les tests de laboratoire
exports.validateCreateLabOrderTest = [
    body('labOrderId')
        .notEmpty()
        .withMessage('ID de la commande obligatoire')
        .isMongoId()
        .withMessage('ID commande invalide'),

    body('testName')
        .notEmpty()
        .withMessage('Nom du test obligatoire'),

    body('status')
        .optional()
        .isIn(['pending', 'in-progress', 'completed'])
        .withMessage('Status invalide'),

    checkValidationErrors
];

// Validation pour la mise à jour des tests
exports.validateUpdateLabOrderTest = [
    param('id')
        .isMongoId()
        .withMessage('ID de test invalide'),

    body('status')
        .optional()
        .isIn(['pending', 'in-progress', 'completed'])
        .withMessage('Status invalide'),

    body('results')
        .optional()
        .isString()
        .withMessage('Les résultats doivent être du texte'),

    checkValidationErrors
];