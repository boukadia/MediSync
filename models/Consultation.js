const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const consultationSchema=new mongoose.Schema({
     appointment: { type: Schema.Types.ObjectId, ref: 'Appointment', required: true }, // foreign key
  medecin: { type: Schema.Types.ObjectId, ref: 'User'},
  diagnostic: String,//tachkhis
  symptomes: String,//al2a3rad
  notes: String,//molahadat
  dateConsultation: { type: Date , default: Date.now }
},{timestamps:true})
module.exports=mongoose.model('consultation',consultationSchema)