const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const schemaLabOrderTest=new mongoose.Schema({
    resultValue:{type:Number,default:null},
    nom: String,//nom du test : Glycémie à jeun
    code:String,//glycemie=>GLY,
    unite:String,//(ex: mg/dL, g/L, %)
    prix: Number,
    description: String,
    valeur_normale_min:Number,
    valeur_normale_max:Number,
    normalRange:String,
    status:{type:String,enum:['actif','inactif'],default:'inactif'},
    labOrderId:{type:Schema.Types.ObjectId,ref:"LabOrder",required:true},
},{timestamps:true});

module.exports=mongoose.model('LabOrderTest',schemaLabOrderTest)