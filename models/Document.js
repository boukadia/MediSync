


    const mongoose= require('mongoose');
    const Schema=mongoose.Schema;
    const schemaDocument=new mongoose.Schema({
        filename:String,
        filepath:String,
        filetype:String,
        filesize:Number,
        labResultId:{type:Schema.Types.ObjectId,ref:"LabResult"},
        uploadedAt:{type:Date,default:Date.now},
    })
    module.exports=mongoose.model('Document',schemaDocument);
