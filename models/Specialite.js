const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const specialiteSchema = new mongoose.Schema({
 name: { type: String, required: true },
 description: { type: String },
 
}, {
  timestamps: true
});



module.exports = mongoose.model('Specialite', specialiteSchema);
