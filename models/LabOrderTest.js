const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const schemaLabOrderTest=new mongoose.Schema({
    resulValue:Number,
    nom: String,//nom du test : Glycémie à jeun
    code:String,//glycemie=>GLY,
    unite:String,//(ex: mg/dL, g/L, %)
    prix: Float,
    description: String,
    valeur_normale_min:Float,
    valeur_normale_max:Float,
    normalRange:String,
    status:{type:String,enum:['actif','inactif'],default:'inactif'},
    labOrderId:{type:Schema.types.ObjectId,ref:"LabOrder",required:true},
});

module.exports=mongoose.model('LabOrderTest',schemaLabOrderTest)