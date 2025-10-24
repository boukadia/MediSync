const mongoose= require('mongoose');
const Consultation = require('./Consultation');
const Schema=mongoose.Schema;
const schemaLabOrder=new mongoose.Schema({
    consultationId:
    {
        type:Schema.Types.ObjectId,
        ref:"Consultation",
        required:true
    },
    laboratoireId:
    {
        type:Schema.Types.ObjectId,
        ref:"Laboratory",
        required:true
    },
    tests: [
    { 
        name: { type: String, required: true }  
    }
  ],
    status:{type:String,enum:['en-attent','completed'],default:'en-attent'},
    notes: String,//matalan tahlil darori kab dawa2
    dateOrder:{type:Date,default:Date.now}
})

module.exports=mongoose.model('LabOrder',schemaLabOrder)