const LabResult = require('../models/LabResult');
const LabOrderTest = require('../models/LabOrderTest');
const LabOrder = require('../models/LabOrder');

exports.getLabResults = async (req, res) => {
  try {
    const labResults = await LabResult.find()
     
    res.json(labResults);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getMyLabResults = async (req, res) => {
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
    
    const labResults = await LabResult.find(query);
    
    res.json(labResults);
  } catch (error) {
    res.status(500).json({ error: error.message });

  }
}

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
    const labOrderTest=await LabOrderTest.findById(labResult.labOrderTestId);
    labOrderTest.resultValue=labResult.resultValue;
    await labOrderTest.save();
    const labOrder=await LabOrder.findById(labOrderTest.labOrderId);
    labOrder.status='completed';
    await labOrder.save();
    res.status(201).json(labResult);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateLabResult = async (req, res) => {
  try {
    const {resultValue}=req.body
    const labResult = await LabResult.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!labResult) {
      return res.status(404).json({ error: 'Lab result not found' });
    }
    
    if(resultValue){
      const labOrderTest=await LabOrderTest.findById(labResult.labOrderTestId);
      labOrderTest.resultValue=resultValue;
      await labOrderTest.save();
    }
    const labOrder=await LabOrder.findById(labResult.labOrderId);
    labOrder.status='completed';
    await labOrder.save()
    
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
    const labOrderTest=await LabOrderTest.findById(labResult.labOrderTestId);
    labOrderTest.resultValue=null;
    await labOrderTest.save();
    const labOrder=await LabOrder.findById(labOrderTest.labOrderId);
    labOrder.status='en-attent';
    res.json({ message: 'Lab result deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};