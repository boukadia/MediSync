const mongoose=require('mongoose');
const disponibiliteSchema=mongoose.Schema({
    dateHeureDebut:{
        type:Date,
        required:true
    },
    dateHeureFin:{
        type:Date,
        required:true
    },
   
    medecin:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    jour:{
         type: String, 
        enum:['lundi','mardi','mercredi','jeudi','vendredi','samedi'],
        required:true
    }
   
})
module.exports=mongoose.model('Disponibilite',disponibiliteSchema); 