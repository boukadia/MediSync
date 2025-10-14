const mongoose = require('mongoose');
const Schema=mongoose.Schema

const appointmentSchema=new mongoose.Schema({
    patientId:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
    doctorId:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
    creneau: { type: Schema.Types.ObjectId, ref: 'Creneau', required: true },
    date:{type:Date,required:false},
    typeConsultation:{type:String,enum:['online','offline'],required:true},
    status:{type:String,enum:['pending','confirmed','cancelled'],default:'pending'},
    consultationId:{type:mongoose.Schema.Types.ObjectId,ref:'Consultation',required:false}

})
module.exports=mongoose.model('Appointment',appointmentSchema)