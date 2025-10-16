const Appointment = require("../models/Appointment");
const User = require("../models/User");
const Creneau = require("../models/Creneau");
const Consultation = require("../models/Consultation");
const Disponibilite = require("../models/Disponibilite");
exports.formCreateAppointment = async (req, res) => {
  const doctors = await User.find({ role: "doctor" });

  // const patients = await User.find({ role: "patient" });
};

exports.createAppointment = async (req, res) => {
  try {
    const { patientId, doctorId, date, creneau, typeConsultation } = req.body;
    //check role du medecin
    const user = await User.findById(doctorId);
    if (!user && user.role !== "doctor") {
      return res
        .status(400)
        .json({ error: "Le médecin sélectionné est invalide" });
    }
    const creneaux = await Creneau.findOne({
      _id: creneau,
    });
    const disponibilite = await Disponibilite.findOne({
      _id: creneaux.disponibilite,
    });
    // const medecin=await User.findOne({_id:doctorId})
    // console.log({dis:disponibilite.medecin,med:doctorId});

    if (disponibilite.medecin != doctorId) {
      return res
        .status(400)
        .json({ error: "Le créneau ne correspond pas au médecin sélectionné" });
    } else {
      if (creneaux.statut === "reserve") {
        return res.status(400).json({ error: "Le créneau est déjà réservé" });
      }

      // Validate required fields
      if (!typeConsultation) {
        return res
          .status(400)
          .json({ error: "Le type de consultation est requis" });
      }
      if (!patientId || !doctorId || !creneau) {
        return res
          .status(400)
          .json({ error: "patientId, doctorId et creneau sont requis" });
      }

      // Create the appointment with all fields

      const newAppointment = await Appointment.create({
        patientId,
        doctorId,
        creneau,
        date,
        typeConsultation, //had l creneau rah howa CreneauId
      });
      await Creneau.findOneAndUpdate(
        { _id: req.body.creneau },
        { $set: { statut: "reserve" } },
        { new: true, runValidators: true }
      );

      await Consultation.create({
        rendezvous: newAppointment.id,
        doctor: doctorId,
        patient: patientId,
      });

      res.status(201).json(newAppointment);
    }
  } catch (error) {
    console.error("Error creating appointment:", error);
    res.status(400).json({
      error:
        error.message ||
        "Une erreur est survenue lors de la création du rendez-vous",
    });
  }
};
