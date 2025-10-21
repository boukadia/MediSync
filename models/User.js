const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name:{type:String},
  password: { type: String, required: true },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  refreshToken: String,
  tokenExpiry: Date,
  role: { type: String, enum: ['admin', 'doctor', 'patient'], default: 'patient' }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function(password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);