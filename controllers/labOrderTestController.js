const LabOrderTest = require('../models/LabOrderTest');

exports.getLabOrderTests = async (req, res) => {
  try {
    const labOrderTests = await LabOrderTest.find()
    res.json(labOrderTests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getLabOrderTestById = async (req, res) => {
  try {
    const labOrderTest = await LabOrderTest.findById(req.params.id)
    if (!labOrderTest) {
      return res.status(404).json({ error: 'Lab order test not found' });
    }
    res.json(labOrderTest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getMyLabOrderTests = async (req, res) => {
  try {
    let query = {};
    
    if (req.user.role === 'doctor') {
      query.doctorId = req.user._id;
    } else if (req.user.role === 'laboratoire') {
      query.laboratoireId = req.user._id;
    }
    else if (req.user.role === 'patient') {
      query.patientId = req.user._id;
    }
    
    const labOrderTests = await LabOrderTest.find(query);
    
    res.json(labOrderTests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.createLabOrderTest = async (req, res) => {
  try {
    const userId = req.user._id;
    const labOrderTest = await LabOrderTest.create({...req.body,laboratoireId:userId});
    res.status(201).json(labOrderTest);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateLabOrderTest = async (req, res) => {
  try {
    const labOrderTest = await LabOrderTest.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!labOrderTest) {
      return res.status(404).json({ error: 'Lab order test not found' });
    }
    res.json(labOrderTest);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteLabOrderTest = async (req, res) => {
  try {
    const labOrderTest = await LabOrderTest.findByIdAndDelete(req.params.id);
    if (!labOrderTest) {
      return res.status(404).json({ error: 'Lab order test not found' });
    }
    res.json({ message: 'Lab order test deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};