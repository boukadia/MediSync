const Consultation = require("../models/Consultation");
const Appointment = require("../models/Appointment");
const User = require("../models/User");
const Creneau = require("../models/Creneau");
const Disponibilite = require("../models/Disponibilite");
const DossierMedical = require("../models/DossierMedical");
exports.formCreateConsultation = async (req, res) => {
  const doctors = await User.find({ role: "doctor" });
  const patients = await User.find({ role: "patient" });
  const appointments = await Appointment.find()
    .populate("patientId")
    .populate("doctorId")
    .populate("creneau");
  res.json({ doctors, patients, appointments });
};
// Get all consultations
exports.getConsultations = async (req, res) => {
  try {
    const consultations = await Consultation.find()
      .populate('appointment')
      .populate('medecin', 'email')
      .sort({ dateConsultation: -1 });
    res.json(consultations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get consultation by ID
exports.getConsultationById = async (req, res) => {
  try {
    const consultation = await Consultation.findById(req.params.id)
      .populate('appointment')
      .populate('medecin', 'email');
    
    if (!consultation) {
      return res.status(404).json({ error: 'Consultation not found' });
    }
    
    res.json(consultation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get my consultations
exports.getMyConsultations = async (req, res) => {
  try {
    let consultations;
    
    if (req.user.role === 'doctor') {
      consultations = await Consultation.find({ medecin: req.user._id })
        .populate('appointment')
        .sort({ dateConsultation: -1 });
    } else if (req.user.role === 'patient') {
      const appointments = await Appointment.find({ patientId: req.user._id });
      const appointmentIds = appointments.map(app => app._id);
      
      consultations = await Consultation.find({ appointment: { $in: appointmentIds } })
        .populate('appointment')
        .populate('medecin', 'email')
        .sort({ dateConsultation: -1 });
    }
    
    res.json(consultations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update the creneau status to 'reserve'
exports.createConsultation = async (req, res) => {
  try {
    const {
      allergies,
      groupeSanguin,
      appointment,
      notes,
      diagnostic,
      traitement,
      medecin,
      // patient,
    } = req.body;
    const appointmentObj = await Appointment.findById(appointment)
    const patient = (await Appointment.findById(appointment)).patientId;
    const dateConsultation=appointmentObj.date;
    
    let dossier = await DossierMedical.findOne({ patientId: patient });


    // Validate required fields
    if (!appointment) {
      return res.status(400).json({ error: "L'ID du rendez-vous est requis" });
    }
    //     creneaux.statut = "reserve";
    //     await creneaux.save();
    //   res.status(201).json(newAppointment);
    // Create the consultation
    const newConsultation = await Consultation.create({
      appointment,
      notes,
      diagnostic,
      traitement,
      dateConsultation,
      medecin,
      // patient,
    });
    
    if (!dossier) {
      dossier = await DossierMedical.create({
        patientId: patient,
        allergies: allergies || "",
        groupeSanguin: groupeSanguin || "",
        historiqueConsultations: [{
          consultation: newConsultation._id,
          date: dateConsultation,
          notes: "Consultation ajoutée automatiquement après la création",
        }],
      });
    } else {
      // If dossier exists, push the new consultation to historiqueConsultations
      dossier.historiqueConsultations.push({
        consultation: newConsultation._id,
        date: dateConsultation,
        notes: "Consultation ajoutée automatiquement après la création",
      });
      await dossier.save();
    }

    res.status(201).json(newConsultation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update consultation
exports.updateConsultation = async (req, res) => {
  try {
    const { notes, diagnostic, traitement } = req.body;
    
    const consultation = await Consultation.findById(req.params.id);
    if (!consultation) {
      return res.status(404).json({ error: 'Consultation not found' });
    }
    
    // Only doctor who created consultation can update
    if (consultation.medecin.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    const updatedConsultation = await Consultation.findByIdAndUpdate(
      req.params.id,
      { notes, diagnostic, traitement },
      { new: true }
    ).populate('appointment').populate('medecin', 'email');
    
    res.json(updatedConsultation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete consultation
exports.deleteConsultation = async (req, res) => {
  try {
    const consultation = await Consultation.findById(req.params.id);
    if (!consultation) {
      return res.status(404).json({ error: 'Consultation not found' });
    }
    
    // Only doctor who created consultation or admin can delete
    if (consultation.medecin.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    // Remove from dossier medical
    const appointment = await Appointment.findById(consultation.appointment);
    if (appointment) {
      await DossierMedical.updateOne(
        { patientId: appointment.patientId },
        { $pull: { historiqueConsultations: { consultation: consultation._id } } }
      );
    }
    
    await Consultation.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Consultation deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get consultations by patient ID (doctor/admin only)
exports.getConsultationsByPatient = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patientId: req.params.patientId });
    const appointmentIds = appointments.map(app => app._id);
    
    const consultations = await Consultation.find({ appointment: { $in: appointmentIds } })
      .populate('appointment')
      .populate('medecin', 'email')
      .sort({ dateConsultation: -1 });
    
    res.json(consultations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get consultations by doctor ID (admin only)
exports.getConsultationsByDoctor = async (req, res) => {
  try {
    const consultations = await Consultation.find({ medecin: req.params.doctorId })
      .populate('appointment')
      .sort({ dateConsultation: -1 });
    
    res.json(consultations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
