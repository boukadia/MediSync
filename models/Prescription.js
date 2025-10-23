const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const schemaPrescription=new mongoose.Schema(
    {
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
                assignedPharmacyId:{type:Schema.Types.ObjectId,ref:'Pharmacy'},
        
            }
        ],
        status:{type:String,enum:['draft','signed',"sent","dispensed"],default:'draft'}
    }
);
module.exports=mongoose.model('Prescription',schemaPrescription)