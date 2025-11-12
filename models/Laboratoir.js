


    const mongoose= require('mongoose');
    const Schema=mongoose.Schema;
    const schemaLaboratory=new mongoose.Schema({
        nom:String,
        adresse:String,
        telephone:String,
        email:String,
        responsable:String,
        openHours:String,
        status:{type:String,enum:['actif','inactif'],default:'actif'},
        createdAt:{type:Date,default:Date.now},
    },{timestamps:true})
    module.exports=mongoose.model('Laboratory',schemaLaboratory);
