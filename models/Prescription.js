const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const schemaPrescription=new mongoose.Schema(
    {
        patientId:
        {
            type:Schema.Types.ObjectId,
            ref:'User',
            required:true
        },
        doctorId:
        {
            type:Schema.Types.ObjectId,
            ref:'User',
            required:true
        },
        ConsultationId:
        {   
            type:Schema.Types.ObjectId,
            ref:'Consultation',
            required:true
        },
        notes: { type: String },
       
        medications:[
            {
                name:{type:String,required:true},
                dosage:{type:String,required:true},
                instructions:{type:String,required:true},//ta3limat ba3d l2akl
                duration:{type:String,required:true} ,
                pharmacyId:{type:Schema.Types.ObjectId,ref:'Pharmacy',default:null}||null,   
                status:{type:String,enum:['prescribed','dispensed'],default:'prescribed'}
            }
        ],
        status:{type:String,enum:['draft','signed'],default:'draft'}
    },{timestamps:true}
);
module.exports=mongoose.model('Prescription',schemaPrescription)