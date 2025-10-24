const Laboratory = require('../models/Laboratoir');

exports.getLaboratories = async (req, res) => {
  try {
    const laboratories = await Laboratory.find();
    res.json(laboratories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getLaboratoryById = async (req, res) => {
  try {
    const laboratory = await Laboratory.findById(req.params.id);
    if (!laboratory) {
      return res.status(404).json({ error: 'Laboratory not found' });
    }
    res.json(laboratory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createLaboratory = async (req, res) => {
  try {
    const laboratory = await Laboratory.create(req.body);
    res.status(201).json(laboratory);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateLaboratory = async (req, res) => {
  try {
    const laboratory = await Laboratory.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!laboratory) {
      return res.status(404).json({ error: 'Laboratory not found' });
    }
    res.json(laboratory);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteLaboratory = async (req, res) => {
  try {
    const laboratory = await Laboratory.findByIdAndDelete(req.params.id);
    if (!laboratory) {
      return res.status(404).json({ error: 'Laboratory not found' });
    }
    res.json({ message: 'Laboratory deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};