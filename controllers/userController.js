const User = require("../models/User");

exports.getAllUsers=async(req,res)=>{
    try {
        const users=await User.find()
        return res.status(200).json(users)
        
        
    } catch (error) {
        
        res.status(500).json({error:error.message})
    }
}
exports.getAllDoctors=async(req,res)=>{
    try {
        const users=await User.find({role:'doctor'}).populate('specialite' ,'name')
        return res.status(200).json(users)

    } catch (error) {

        res.status(500).json({error:error.message})
    }
}