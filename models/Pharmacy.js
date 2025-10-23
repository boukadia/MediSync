const mongoose = require('mongoose');
const Schema=mongoose.Schema;
const schemaPharmacy=new mongoose.Schema(
    {
        name:
        {
            type:String,
            required:true
        },
        pharmacistName :{
            type:String,
        },
        address:
        {
            type:String,
            required:true
        },
        phone:
        {
            type:String,
            required:true
        },
        horaires:
        {
            type:String,
            required:true
        }

    }
);
module.exports=mongoose.model("Pharmacy",schemaPharmacy)