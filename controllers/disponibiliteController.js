const Disponibilite=require('../models/Disponibilite')
const User=require('../models/User')
exports.getDisponibilites=async(req,res)=>{
   try {
    
   } catch (error) {
    
   }
}
exports.createDisponibilite=async(req,res)=>{
    try {
        // const user=await User.findOne({_id:req.body.medecin});
        // res.json({user:user})
         const disponibilite=  await Disponibilite.create(req.body);
        res.json({message:'Disponibilite created successfully',disponibilite:disponibilite,
            })
   
    } catch (error) {
        res.status(500).json({message:'Server Error',error:error.message}   
    )}
      }