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
exports.getConsultations = async (req, res) => {};

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
