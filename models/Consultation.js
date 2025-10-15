const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const consultationSchema=new mongoose.Schema({
     rendezvous: { type: Schema.Types.ObjectId, ref: 'RendezVous', required: true }, // foreign key
  medecin: { type: Schema.Types.ObjectId, ref: 'User'},
  patient: { type: Schema.Types.ObjectId, ref: 'User' },
  dossierMedical: { type: Schema.Types.ObjectId, ref: 'DossierMedical'},
  diagnostic: String,
  traitement: String,
  notes: String,
  dateConsultation: { type: Date, default: Date.now }
})
module.exports=mongoose.model('consultation',consultationSchema)