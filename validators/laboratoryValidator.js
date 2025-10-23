const Joi = require('joi');

const createLaboratorySchema = Joi.object({
  nom: Joi.string().required(),
  adresse: Joi.string().required(),
  telephone: Joi.string().required(),
  email: Joi.string().email().required(),
  responsable: Joi.string().required(),
  openHours: Joi.string().required(),
  status: Joi.string().valid('actif', 'inactif').default('actif')
});

const updateLaboratorySchema = Joi.object({
  nom: Joi.string(),
  adresse: Joi.string(),
  telephone: Joi.string(),
  email: Joi.string().email(),
  responsable: Joi.string(),
  openHours: Joi.string(),
  status: Joi.string().valid('actif', 'inactif')
});

const validateCreateLaboratory = (req, res, next) => {
  const { error } = createLaboratorySchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

const validateUpdateLaboratory = (req, res, next) => {
  const { error } = updateLaboratorySchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

module.exports = {
  validateCreateLaboratory,
  validateUpdateLaboratory
};