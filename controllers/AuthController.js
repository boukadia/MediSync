const jwt = require('jsonwebtoken');
const User = require('../models/User');

const tokenBlacklist = new Set();

exports.tokenBlacklist = tokenBlacklist;

const generateToken = (user) => {
  
  return jwt.sign({  userId: user.userId,
        email: user.email,
        role: user.role, }, process.env.JWT_SECRET, { expiresIn: '6000s' }); 
};

exports.register = async (req, res) => {
  try {
    const { email, password,name ,role} = req.body;
    console.log(req.body);
    
    // const user=await User.create({ email, password ,name,role});
    const user=await User.create(req.body);
    const token = generateToken(user._id); 
    if (user.role!=="patient") {
      user.status="inactive";
      await user.save();
      
    }
    // If the user is a patient, create an empty Dossier Medical
    if(user.role==="patient"){
      const DossierMedical = require("../models/DossierMedical");
      
      await DossierMedical.create({ patientId: user._id, historiqueConsultations: [] });
    }

    res.status(201).json({ token, user: { id: user._id, email: user.email, role: user.role,status:user.status } ,DossierMedical:{ patientId: user._id, historiqueConsultations: [] }});
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
    const token = generateToken(user);
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

exports.toggleUserStatus = async (req, res) => {
  try {
    const userId = req.params.id;
    
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    
    // Mettre à jour le statut
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { status: newStatus },
      { new: true }
    ).select('-password');
    
    const message = newStatus === 'active' ? 'User activated successfully' : 'User deactivated successfully';
    
    res.json({ message, user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    res.json(req.user); 
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = req.user;

    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = password;

    await user.save();

    res.json({ message: 'User profile updated successfully'
      ,user:{
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      }
    })
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user =await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  }
  catch (error) {
    res.status(500).json({ error: error.message });
  }
};
