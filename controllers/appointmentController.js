const Appointment = require("../models/Appointment");
const User = require("../models/User");
const Creneau = require("../models/Creneau");
const Consultation = require("../models/Consultation");
const Disponibilite = require("../models/Disponibilite");
// Get all appointments
exports.getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('patientId', 'name')
      .populate('doctorId', 'name')
      .populate('creneau', 'heur_bebut');
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get appointment by ID
// exports.getAppointmentById = async (req, res) => {
//   try {
//     const appointment = await Appointment.findById(req.params.id)
//       .populate('patientId', 'email')
//       .populate('doctorId', 'email')
//       .populate('creneau');
    
//     if (!appointment) {
//       return res.status(404).json({ error: 'Appointment not found' });
//     }
    
//     res.json(appointment);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// Get appointment for editing - 
// exports.getAppointmentForEdit = async (req, res) => {
//   try {
//     const appointment = await Appointment.findById(req.params.id)
//       .populate('patientId', 'email')
//       .populate('doctorId', 'email')
//       .populate('creneau');
    
//     if (!appointment) {
//       return res.status(404).json({ error: 'Rendez-vous introuvable' });
//     }
    
//     // Vérifier les permissions
//     if (appointment.patientId.toString() !== req.user._id.toString() && 
//         appointment.doctorId.toString() !== req.user._id.toString() &&
//         req.user.role !== 'admin') {
//       return res.status(403).json({ error: 'Accès refusé' });
//     }
    
//     // Récupérer l'ID du créneau avant de le libérer
//     const creneauId = appointment.creneau;
    
//      await Creneau.findOneAndUpdate(
//         { _id: req.body.creneau },
//         { $set: { statut: "libre" } },
//         { new: true, runValidators: true }
//       );
   
    
//     // Ajouter une note dans la réponse que le créneau a été libéré temporairement
//     const response = {
//       appointment: appointment,
//       message: 'Créneau temporairement libéré pour permettre la modification',
//       originalCreneauId: creneauId
//     };
    
//     res.json(response);
//   } catch (error) {
//     console.error('Erreur lors de la récupération du rendez-vous pour modification:', error);
//     res.status(500).json({ error: error.message });
//   }
// };

// Get user's appointments
exports.getMyAppointments = async (req, res) => {
  try {
    let query = {};
    
    if (req.user.role === 'patient') {
      query.patientId = req.user._id;
    } else if (req.user.role === 'doctor') {
      query.doctorId = req.user._id;
    }
    
    const appointments = await Appointment.find(query)
      .populate('patientId', 'email')
      .populate('doctorId', 'email')
      .populate('creneau');
    
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createAppointment = async (req, res) => {
  try {
    if(!req.body.patientId &&req.user.role==='patient'){
      req.body.patientId=req.user._id;
    }
   

    const { patientId, doctorId, date, creneau, typeConsultation } = req.body;
    //check role du medecin
    const medecin = await User.findById(doctorId);
    // const user=req.user; 
    
    if (!medecin && medecin.role !== "doctor") {
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

    if (disponibilite.medecin != doctorId) {
      return res
        .status(400)
        .json({ error: "Le créneau ne correspond pas au médecin sélectionné" });
    } 
    else {
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
        creneau, //had l creneau rah howa CreneauId
        date,
        typeConsultation, 
      });
      await Creneau.findOneAndUpdate(
        { _id: req.body.creneau },
        { $set: { statut: "reserve" } },
        { new: true, runValidators: true }
      );

      //create consultation linked to the appointment

      // await Consultation.create({
      //   rendezvous: newAppointment.id,
      //   doctor: doctorId,
      //   patient: patientId,
      // });

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

// Update appointment
exports.updateAppointment = async (req, res) => {
  try {
    const { typeConsultation, date,creneau } = req.body;
    
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    
    // // Only allow updates by patient or doctor involved
    // if (appointment.patientId.toString() !== req.user._id.toString() && 
    //     appointment.doctorId.toString() !== req.user._id.toString() &&
    //     req.user.role !== 'admin') {
    //   return res.status(403).json({ error: 'Access denied' });
    // }
    
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('patientId', 'email').populate('doctorId', 'email');

   if (creneau) {
      if (  creneau.status!='libre') {
      return res.status(400).json({ error: 'Le créneau est déjà réservé' });
    }
    const creneauId = appointment.creneau;
    
    await Creneau.findOneAndUpdate(
        { _id: req.body.creneau },
        { $set: { statut: "reserve" } },
        { new: true, runValidators: true }
      );

    }
    
    // if (creneau) {
    //    const creneauId = appointment.creneau;
    
    // await Creneau.findOneAndUpdate(
    //     { _id: req.body.creneau },
    //     { $set: { statut: "reserve" } },
    //     { new: true, runValidators: true }
    //   );
    // }
    
    res.json(updatedAppointment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Cancel appointment
exports.cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    
    // Only allow cancellation by patient or doctor involved
    if (appointment.patientId.toString() !== req.user._id.toString() && 
        appointment.doctorId.toString() !== req.user._id.toString() &&
        req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    // Free the creneau
    await Creneau.findByIdAndUpdate(
      appointment.creneau,
      { statut: 'libre' }
    );
    
    await Appointment.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Appointment cancelled successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete appointment (admin only)
exports.deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    
    // Free the creneau
    await Creneau.findByIdAndUpdate(
      appointment.creneau,
      { statut: 'libre' }
    );
    
    await Appointment.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
