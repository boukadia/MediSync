const LabOrder = require('../models/LabOrder');
    const Appointment = require('../models/Appointment');
    const Consultation = require('../models/Consultation');



exports.getLabOrders = async (req, res) => {
  try {
    const labOrders = await LabOrder.find()
      
    res.json(labOrders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getLabOrderById = async (req, res) => {
  try {
    const labOrder = await LabOrder.findById(req.params.id)
    
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
    if (!consultation) {
      return res.status(404).json({ error: 'Consultation not found' });
    }
    const appointment = await Appointment.findById(consultation.appointment);
    const doctorId=appointment.doctorId;
    const labOrder = await LabOrder.create({...req.body,doctorId:doctorId,patientId:appointment.patientId});
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

exports.markAsCompleted = async (req, res) => {
  try {
    const labOrder = await LabOrder.findById(req.params.id);
    if (!labOrder) {
      return res.status(404).json({ error: 'Lab order not found' });
    }
    labOrder.status = 'completed';
    await labOrder.save();
    res.json({ message: 'Lab order marked as completed', labOrder });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

  