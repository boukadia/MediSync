const Consultation  = require("../models/Consultation");
const Appointment = require("../models/Appointment");
const User = require("../models/User");
const Creneau = require("../models/Creneau");
const Disponibilite = require("../models/Disponibilite");
exports.formCreateConsultation = async (req, res) => {
  const doctors = await User.find({ role: "doctor" });
  const patients = await User.find({ role: "patient" });
  const appointments = await Appointment.find()
    .populate("patientId")
    .populate("doctorId")
    .populate("creneau");
  res.json({ doctors, patients, appointments });
};
exports.getConsultations = async (req, res) => {};

// Update the creneau status to 'reserve'
exports.createConsultation = async (req, res) => {
  try {
    const {
      appointment,
      notes,
      diagnostic,
      traitement,
      dateConsultation,
      medecin,
      patient,
    } = req.body;
    console.log(traitement);
    
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

      patient,
    });
    res.status(201).json(newConsultation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
