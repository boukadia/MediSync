const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { tokenBlacklist } = require('../controllers/AuthController');

// exports.authenticate = async (req, res, next) => {
//   try {
//     const token = req.header('Authorization')?.replace('Bearer ', '');
//     if (!token) {
//       return res.status(401).json({ error: 'Access denied' });
//     }
    
//     if (tokenBlacklist.has(token)) {
//       return res.status(401).json({ error: 'logout - please login again' });
//     }
    
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = await User.findById(decoded.userId).select('-password');// 
//     next();
//   } catch (error) {
//     res.status(401).json({ error: 'Invalid token' });
//   }
// };


exports.authenticate = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    console.log("Token reçu :", token); // Log du token reçu

    if (!token) {
      console.log("Aucun token fourni");
      return res.status(401).json({ error: "Access denied. No token provided." });
    }

    if (tokenBlacklist.has(token)) {
      console.log("Token dans la liste noire");
      return res.status(401).json({ error: "Token invalidated. Please log in again." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token décodé :", decoded); // Log du contenu du token
    
    // Vérifier si le token contient userId (nouveaux tokens)
    if (decoded.userId) {
      // Nouveau format de token avec toutes les infos
      req.user = {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role,
        firstName: decoded.firstName,
        lastName: decoded.lastName,
        phone: decoded.phone,
        status: decoded.status,
        name: decoded.name
      };
      console.log("Utilisateur authentifié (nouveau token):", req.user.email, "Role :", req.user.role);
    } else {
      // Ancien format de token - faire la requête DB pour obtenir les infos complètes
      console.log("Ancien token détecté - récupération des infos depuis la DB");
      const userFromDb = await User.findOne({ email: decoded.email }).select("-password");
      if (!userFromDb) {
        console.log("Utilisateur non trouvé pour email :", decoded.email);
        return res.status(404).json({ error: "User not found." });
      }
      req.user = userFromDb;
      console.log("Utilisateur authentifié (ancien token):", req.user.email, "Role :", req.user.role);
    }

    next();
  } catch (error) {
    console.error("Erreur dans authenticate :", error);
    res.status(401).json({ error: "Invalid or expired token." });
  }
};



exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
};