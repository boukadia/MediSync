const Joi = require('joi');

const updateUserSchema = Joi.object({
  email: Joi.string().email(),
  name: Joi.string(),
  status: Joi.string().valid('active', 'inactive'),
  role: Joi.string().valid('admin', 'doctor', 'patient')
});

const updateProfileSchema = Joi.object({
  email: Joi.string().email(),
  name: Joi.string()
});

const validateUpdateUser = (req, res, next) => {
  const { error } = updateUserSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

const validateUpdateProfile = (req, res, next) => {
  const { error } = updateProfileSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

module.exports = {
  validateUpdateUser,
  validateUpdateProfile
};