const Consultation = require('../models/Consultation');
const User = require('../models/User');
const Appointment = require('../models/Appointment');
const LabOrder = require('../models/LabOrder');
const LabOrderTest = require('../models/LabOrderTest');
const LabResult = require('../models/LabResult');


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
    if (req.user.role !== 'patient' && req.user.role !== 'admin'&& req.user.role !== 'secretaire') {
      return res.status(403).json({ error: 'Only patients or secretaire can perform this action' });
    }
    
    if (req.params.id) {
      const Appointment = require('../models/Appointment');
      const appointment = await Appointment.findById(req.params.id);
      
      if (!appointment) {
        return res.status(404).json({ error: 'Appointment not found' });
      }


   
      
      if (appointment.patientId.toString() !== req.user._id.toString()&& req.user.role !== 'admin'&&req.user.role !== 'secretaire') {
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
exports.checkDoctorConsultation=async(req,res,next)=>{
  const consultationId=req.body.consultationId;
  const consultation =await Consultation.findById(consultationId);
 
  const appointment=await Appointment.findById(consultation.appointment);
  
  const doctorId=appointment.doctorId;
if (doctorId.toString()!==req.user._id.toString() ){
  return res.status(403).json({ error: 'Access denied - not your consultation' });
  
}
next();


}
exports.checkDoctorLabOrder=async(req,res,next)=>{
   const consultationId=req.body.consultationId;
   const consultation =await Consultation.findById(consultationId);

 
  const appointment=await Appointment.findById(consultation.appointment);
   console.log(appointment.doctorId.toString());
   console.log(req.user._id.toString());
   
  
  const doctorId=appointment.doctorId;
if (doctorId.toString()!==req.user._id.toString()){
  return res.status(403).json({ error: 'Access denied - not your lab order' });

}
next();
}
exports.verifyLabOwnership=async(req,res,next)=>{
  // const labOrderId=req.user._id;
  const labOrder=await LabOrder.findById(req.params.id);
  if(labOrder.laboratoireId.toString()!==req.user._id.toString()&& labOrder.doctorId.toString()!==req.user._id.toString(),req.user.role==='admin'){
    return res.status(403).json({ error: 'Access denied - not your lab order' });
  }
  next();
}
exports.verifyLabOrderTestOwnership=async(req, res, next)=>{
  // const labOrderId=req.user._id;
  const labOrderTest=await LabOrderTest.findById(req.params.id);
  const labOrder=await LabOrder.findById(labOrderTest.labOrderId);
  if(labOrder.laboratoireId.toString()!==req.user._id.toString() && labOrder.doctorId.toString()!==req.user._id.toString()&& req.user.role==='admin'){
    return res.status(403).json({ error: 'Access denied - not your lab order' });
  }
  next();
}
exports.verifyLabResultOwnership=async(req, res, next)=>{
  // const labOrderId=req.user._id;
  const labResult=await LabResult.findById(req.params.id);
  const labOrderTest=await LabOrderTest.findById(labResult.labOrderTestId);
  if(labOrderTest.laboratoireId.toString()!==req.user._id.toString()&& req.user.role==='admin'){
    return res.status(403).json({ error: 'Access denied - not your lab test' });
  }
  next();
}
