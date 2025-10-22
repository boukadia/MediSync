const mongoose= require('mongoose');
const Schema=mongoose.Schema;
const schemaLabResult=new mongoose.Schema({
    isNormal:{type:Boolean,default:true},
    labOrderTestId:{type:Schema.Types.ObjectId,ref:"LabOrderTest"},
    resultValue: Float16Array,
    commentaire: String,
    date:{type:Date,default:Date.now},
    status:{type:String,enum:['pending','completed','canceled'],default:'pending'},
    fileDocumentId:{type:Schema.Types.ObjectId,ref:"Document"},
})
module.exports=mongoose.model('LabResult',schemaLabResult);