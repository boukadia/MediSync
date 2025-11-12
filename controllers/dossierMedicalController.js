const User = require("../models/User");
const DossierMedical = require("../models/DossierMedical");
exports.getMyDossierMedical = async (req, res) => {
  try {
    const user = req.user;
    const dossier = await DossierMedical.findOne({ patientId: user._id });
    if (!dossier) {
      return res.status(404).json({ error: "Dossier médical non trouvé" });
    }
    res.json(dossier);
    } catch (error) {
    res.status(500).json({ error: error.message });

    }
};

exports.getDossierMedicals=async (req,res) => {
  try {
    const dossier=await DossierMedical.find();
    return res.json(dossier);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Create a new Dossier Medical
exports.createDossierMedical = async (req, res) => {
  try {
    const { patientId, allergies, groupeSanguin } = req.body;
    // Check if patient exists
    const patient = await User.findById(patientId);
    if (!patient || patient.role !== "patient") {
      return res.status(400).json({ error: "Patient invalide" });
    }
    // Check if Dossier Medical already exists for the patient
    const existingDossier = await DossierMedical.findOne({ patientId });
    if (existingDossier) {
      return res
        .status(400)
        .json({ error: "Le dossier médical existe déjà pour ce patient" });
    }
    // Create the Dossier Medical
    const newDossier = await DossierMedical.create({
      patientId,
      allergies,
      groupeSanguin,
      historiqueConsultations: []
    });
    res.status(201).json(newDossier);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
exports.updateDossierMedical = async (req, res) => {
  try {      
    const { id } = req.params;
    const { allergies, groupeSanguin, newConsultationId } = req.body;
    const dossier = await DossierMedical.findById(id);
    if (!dossier) {
      return res.status(404).json({ error: "Dossier médical non trouvé" });
    }
    // Update fields if provided
    if (allergies) dossier.allergies = allergies;
    if (groupeSanguin) dossier.groupeSanguin = groupeSanguin;
    // Add new consultation to historiqueConsultations if provided
   
    await dossier.save();
    res.json(dossier);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
exports.deleteDossierMedical = async (req, res) => {
  try {
    const { id } = req.params;
    const dossier = await DossierMedical.findByIdAndDelete(id);
    if (!dossier) {
      return res.status(404).json({ error: "Dossier médical non trouvé" });
    }
    res.json({ message: "Dossier médical supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
