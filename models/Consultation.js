const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const consultationSchema=new mongoose.Schema({
     appointment: { type: Schema.Types.ObjectId, ref: 'Appointment', required: true }, // foreign key
  medecin: { type: Schema.Types.ObjectId, ref: 'User'},
  // patient: { type: Schema.Types.ObjectId, ref: 'User' },
  dossierMedical: { type: Schema.Types.ObjectId, ref: 'DossierMedical'},
  diagnostic: String,//tachkhis
  symptomes: String,//al2a3rad
  notes: String,//molahadat
  dateConsultation: { type: Date }
})
module.exports=mongoose.model('consultation',consultationSchema)