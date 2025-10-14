const mongoose=require('mongoose')
const creneauSchema=new mongoose.Schema({
    heure_debut:{String,rquired:true},
    heure_fin:{ type: String, required: true },
    medecin: { type: Schema.Types.ObjectId, ref: 'User' },
    patient: { type: Schema.Types.ObjectId, ref: 'User' }
})
module.exports=mongoose.model('Creneau',creneauSchema)