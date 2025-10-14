const mongoose=require('mongoose');
const disponibiliteSchema=mongoose.Schema({
    heureDebut:{
        type:Date,
        required:true
    },
    heureFin:{
        type:Date,
        required:true
    },
    date:{
        type:Date,
        required:true
    },
    medecin:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    jour:{
        type:String,
        required:true
    }
   
})
module.exports=mongoose.model('Disponibilite',disponibiliteSchema); 