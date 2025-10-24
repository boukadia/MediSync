const LabOrder = require('../models/LabOrder');
    const Appointment = require('../models/Appointment');
    const Consultation = require('../models/Consultation');



exports.getLabOrders = async (req, res) => {
  try {
    const labOrders = await LabOrder.find()
      // .populate('ConsultationId')
      // .populate('laboratoireId');
    res.json(labOrders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getLabOrderById = async (req, res) => {
  try {
    const labOrder = await LabOrder.findById(req.params.id)
      // .populate('ConsultationId')
      // .populate('laboratoireId');
    if (!labOrder) {
      return res.status(404).json({ error: 'Lab order not found' });
    }
    res.json(labOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createLabOrder = async (req, res) => {
  try {
    const consultation =await Consultation.findById(req.body.consultationId);
    const appointment = await Appointment.findById(consultation.appointment);
    
    const labOrder = await LabOrder.create({...req.body,doctorId:req.user._id,patientId:appointment.patientId});
    res.status(201).json(labOrder);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateLabOrder = async (req, res) => {
  try {
    const labOrder = await LabOrder.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!labOrder) {
      return res.status(404).json({ error: 'Lab order not found' });
    }
    res.json(labOrder);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteLabOrder = async (req, res) => {
  try {
    const labOrder = await LabOrder.findByIdAndDelete(req.params.id);
    if (!labOrder) {
      return res.status(404).json({ error: 'Lab order not found' });
    }
    res.json({ message: 'Lab order deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};