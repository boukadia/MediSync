const Appointment = require("../models/Appointment");
const User = require("../models/User");
const Creneau = require("../models/Creneau");
const Consultation = require("../models/Consultation");
exports.formCreateAppointment = async (req, res) => {
  const doctors = await User.find({ role: "doctor" });
  const patients = await User.find({ role: "patient" });
};

exports.createAppointment = async (req, res) => {
  try {
    // const creneaux = await Creneau.find({
    //   disponibilite: req.body.disponibilite,
    //   statut: "libre",
    // });
    // if (creneaux.length === 0) {
    //   return res
    //     .status(400)
    //     .json({ error: "Aucun créneau disponible pour cette disponibilité" });
    // }
    // res.json(creneaux);

    // Validate required fields
    // if (!typeConsultation ) {
    //     return res.status(400).json({ error: "Le type de consultation est requis" });
    // }

    // if (!disponibilite_id) {
    //     return res.status(400).json({ error: "La disponibilité est requise" });
    // }

    // // Create the appointment with all fields
    const { patientId, doctorId, date, creneau, typeConsultation } = req.body;

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

    // res.status(201).json(newAppointment);
  } catch (error) {
    console.error("Error creating appointment:", error);
    res.status(400).json({
      error:
        error.message ||
        "Une erreur est survenue lors de la création du rendez-vous",
    });
  }
};
