const User = require('../models/User');

// exports.checkOwnership = (Model, userField = 'userId') => {
//   return async (req, res, next) => {
//     try {
//       const item = await Model.findById(req.params.id);
      
//       if (!item) {
//         return res.status(404).json({ error: 'Item not found' });
//       }
      
//       if (item[userField].toString() !== req.user._id.toString() && req.user.role !== 'admin') {
//         return res.status(403).json({ error: 'Access denied - not owner' });
//       }
      
//       req.item = item;
//       next();
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   };
// };

exports.checkDoctorDisponibilite = async (req, res, next) => {
  try {
    if (req.user.role !== 'doctor') {
      return res.status(403).json({ error: 'Only doctors can perform this action' });
    }
    
    if (req.params.id) {
      const Disponibilite = require('../models/Disponibilite');
      const disponibilite = await Disponibilite.findById(req.params.id);
      
      if (!disponibilite) {
        return res.status(404).json({ error: 'Disponibilite not found' });
      }
      
      if (disponibilite.medecin.toString() !== req.user._id.toString()) {
        return res.status(403).json({ error: 'Access denied - not your disponibilite' });
      }
      
      req.disponibilite = disponibilite;
    }
    
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.checkPatient = async (req, res, next) => {
  try {
    if (req.user.role !== 'patient' && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Only patients can perform this action' });
    }
    
    if (req.params.id) {
      const Appointment = require('../models/Appointment');
      const appointment = await Appointment.findById(req.params.id);
      
      if (!appointment) {
        return res.status(404).json({ error: 'Appointment not found' });
      }


   
      
      if (appointment.patientId.toString() !== req.user._id.toString()&& req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied - not your appointment' });
      }
      
      req.appointment = appointment;
    }
    
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.requireRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: `Access denied. Required roles: ${roles.join(', ')}` 
      });
    }
    next();
  };
};

exports.adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

exports.doctorOnly = (req, res, next) => {
  if (req.user.role !== 'doctor') {
    return res.status(403).json({ error: 'Doctor access required' });
  }
  next();
};

exports.patientOnly = (req, res, next) => {
  if (req.user.role !== 'patient') {
    return res.status(403).json({ error: 'Patient access required' });
  }
  next();
};