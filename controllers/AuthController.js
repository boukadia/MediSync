const jwt = require('jsonwebtoken');
const User = require('../models/User');

const tokenBlacklist = new Set();

exports.tokenBlacklist = tokenBlacklist;

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '60s' }); 
};

exports.register = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const user=await User.create({ email, password, role });
    const token = generateToken(user._id); 
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
    console.log(`Token blacklisted: ${token.slice(0, 10)}...`);
    
    res.status(200).json({ 
      message: "User logged out successfully",
      success: true 
    });
  } catch (error) {
    res.status(500).json({ error: "Error logging out user: " + error.message });
  }
}