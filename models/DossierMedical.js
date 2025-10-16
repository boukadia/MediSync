const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const dossierMedicalShema=new mongoose.Schema({
    patientId:{type:Schema.Types.ObjectId,ref:"User",required:true},
    historiqueConsultations:[{type:Schema.Types.ObjectId,ref:'Consultation'}],
    allergies:{type:String},
    groupeSanguin:{type:String}

})
module.exports=mongoose.model('DossierMedical',dossierMedicalShema)
