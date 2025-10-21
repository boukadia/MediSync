const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const schemaPrescription=new mongoose.Schema(
    {
        ConsultationId:
        {   
            type:Schema.types.ObjectId,
            ref:'Consultation',
            required:true
        },
        medications:[
            {
                name:{type:String,required:true},
                dosage:{type:String,required:true},
                duration:{type:String,required:true}    
            }
        ],
        status:{type:String,enum:['draft','signed',"sent","dispensed"],default:'draft'}
    }
);
module.exports=mongoose.model('Prescription',schemaPrescription)