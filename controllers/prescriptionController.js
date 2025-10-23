const Prescription = require('../models/Prescription');

exports.getPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find();
    res.status(200).json(prescriptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createPrescription = async (req, res) => {
  try {
    const { consultationId, medications, notes } = req.body;

    if (!consultationId) {
      return res.status(400).json({ message: 'Consultation ID is required' });
    }
    
    if (!medications || medications.length === 0) {
      return res.status(400).json({ message: 'At least one medication is required' });
    }

    const prescription = await Prescription.create({
      ConsultationId: consultationId,
      medications,
      notes
    });

    res.status(201).json({ message: 'Prescription created successfully', prescription });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateMedicationPharmacy = async (req, res) => {
  try {
    const { prescriptionId, medicationId, pharmacyId, status } = req.body;

    const prescription = await Prescription.findById(prescriptionId);
    if (!prescription) return res.status(404).json({ message: 'Prescription ' });

    const medication = prescription.medications.id(medicationId);
    if (!medication) return res.status(404).json({ message: 'Medication ' });

    if (pharmacyId) medication.pharmacy = pharmacyId;
    if (status) medication.status = status;

    await prescription.save();
    res.status(200).json({ message: 'Medication ', medication });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPrescriptionById = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id)
      .populate('consultationId', 'patient doctor')
      .populate('medications.pharmacy', 'name address phone');

    if (!prescription) return res.status(404).json({ message: 'Prescription ' });

    res.status(200).json(prescription);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updatePrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!prescription) return res.status(404).json({ message: 'Prescription ' });

    res.status(200).json({ message: 'Prescription ', prescription });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deletePrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findByIdAndDelete(req.params.id);
    if (!prescription) return res.status(404).json({ message: 'Prescription ' });

    res.status(200).json({ message: 'Prescription ' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
