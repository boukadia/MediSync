const jwt = require('jsonwebtoken');
const User = require('../models/User');

const tokenBlacklist = new Set();

exports.tokenBlacklist = tokenBlacklist;

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '600s' }); 
};

exports.register = async (req, res) => {
  try {
    const { email, password, role,name } = req.body;
    const user=await User.create({ email, password, role ,name});
    const token = generateToken(user._id); 
    // If the user is a patient, create an empty Dossier Medical
    if(role==="patient"){
      const DossierMedical = require("../models/DossierMedical");
      await DossierMedical.create({ patientId: user._id, historiqueConsultations: [] });
    }

    res.status(201).json({ token, user: { id: user._id, email: user.email, role: user.role } });
  } catch (error) {
    res.status(400).json({ error: error.message});
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = generateToken(user._id);
    res.json({ token, user: { id: user._id, email: user.email, role: user.role } });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
exports.getUsers=async(req,res)=>{
  try{
  const users=await User.find()
  res.json(users);
}
  catch(error){
    res.status(400).json({ error: error.message });
  }
}
exports.logOut=async(req,res)=>{
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(400).json({ error: 'No token provided' });
    }
    
    tokenBlacklist.add(token);
    
    res.status(200).json({ 
      message: "User logged out successfully",
      success: true 
    });
  } catch (error) {
    res.status(500).json({ error: "Error logging out user: " + error.message });
  }
}