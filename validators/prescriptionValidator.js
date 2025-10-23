const Joi = require('joi');

const medicationSchema = Joi.object({
  name: Joi.string().required(),
  dosage: Joi.string().required(),
  duration: Joi.string().required()
});

const createPrescriptionSchema = Joi.object({
  ConsultationId: Joi.string().required(),
  assignedPharmacyId: Joi.string(),
  medications: Joi.array().items(medicationSchema).min(1).required(),
  status: Joi.string().valid('draft', 'signed', 'sent', 'dispensed').default('draft')
});

const updatePrescriptionSchema = Joi.object({
  ConsultationId: Joi.string(),
  assignedPharmacyId: Joi.string(),
  medications: Joi.array().items(medicationSchema).min(1),
  status: Joi.string().valid('draft', 'signed', 'sent', 'dispensed')
});

const validateCreatePrescription = (req, res, next) => {
  const { error } = createPrescriptionSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

const validateUpdatePrescription = (req, res, next) => {
  const { error } = updatePrescriptionSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

module.exports = {
  validateCreatePrescription,
  validateUpdatePrescription
};