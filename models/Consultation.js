const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const consultationSchema=new mongoose.Schema({
     rendezvous: { type: Schema.Types.ObjectId, ref: 'RendezVous', required: true }, // foreign key
  medecin: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  patient: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  dossierMedical: { type: Schema.Types.ObjectId, ref: 'DossierMedical', required: true },
  diagnostic: String,
  traitement: String,
  notes: String,
  dateConsultation: { type: Date, default: Date.now }
})