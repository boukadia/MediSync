const LabResult = require('../models/LabResult');

exports.getLabResults = async (req, res) => {
  try {
    const labResults = await LabResult.find()
     
    res.json(labResults);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getLabResultById = async (req, res) => {
  try {
    const labResult = await LabResult.findById(req.params.id)
      
    if (!labResult) {
      return res.status(404).json({ error: 'Lab result not found' });
    }
    res.json(labResult);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createLabResult = async (req, res) => {
  try {
    const labResult = await LabResult.create(req.body);
    res.status(201).json(labResult);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateLabResult = async (req, res) => {
  try {
    const labResult = await LabResult.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!labResult) {
      return res.status(404).json({ error: 'Lab result not found' });
    }
    res.json(labResult);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteLabResult = async (req, res) => {
  try {
    const labResult = await LabResult.findByIdAndDelete(req.params.id);
    if (!labResult) {
      return res.status(404).json({ error: 'Lab result not found' });
    }
    res.json({ message: 'Lab result deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};