const mongoose = require('mongoose');
const Schema=mongoose.Schema;
const schemaPharmacy=new mongoose.Schema(
    {
        name:
        {
            type:String,
            require:true
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
            type:String|null,
            require:true
        },
        horaires:
        {
            type:String,
            require:true
        }

    }
);
module.exporst=mongoose.module("Pharmacy",schemaPharmacy)