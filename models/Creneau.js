const mongoose=require('mongoose')
const Schema=mongoose.Schema
const Disponibilite = require('./Disponibilite')
const creneauSchema=new mongoose.Schema({
    heure_debut:{type:String,rquired:true},
    heure_fin:{ type: String, required: true },
    // medecin: { type: Schema.Types.ObjectId, ref: 'User' },
    // patient: { type: Schema.Types.ObjectId, ref: 'User' },
    disponibilite:{type:Schema.Types.ObjectId,ref:'Disponibilite',required:true},
    statut:{type:String,enum:['libre','reserve'],default:'libre'}
})
module.exports=mongoose.model('Creneau',creneauSchema)