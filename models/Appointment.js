const mongoose = require('mongoose');
const appointmentSchema=new mongoose.Schema({
    patientId:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
    doctorId:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
    disponibilite_id:{type:mongoose.Schema.Types.ObjectId,ref:'Disponibilite',required:false},
    date:{type:Date,required:false},
    typeConsultation:{type:String,enum:['online','offline'],required:true},
    status:{type:String,enum:['pending','confirmed','cancelled'],default:'pending'},
    consultationId:{type:mongoose.Schema.Types.ObjectId,ref:'Consultation',required:false}

})
module.exports=mongoose.model('Appointment',appointmentSchema)