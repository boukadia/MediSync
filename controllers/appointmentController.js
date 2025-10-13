const Appointment = require('../models/Appointment')
const User = require('../models/User');

exports.createAppointment = async (req, res) => {
    try {
                const {patientId,doctorId,disponibilite_id,date,typeConsultation,consultationId}=req.body

        
        // Validate required fields
        // if (!typeConsultation) {
        //     return res.status(400).json({ error: "Le type de consultation est requis" });
        // }
        
        // if (!disponibilite_id) {
        //     return res.status(400).json({ error: "La disponibilité est requise" });
        // }
        
        // Create the appointment with all fields
        const newAppointment = await Appointment.create(req.body);
        
        res.status(201).json(newAppointment);
    } catch (error) {
        console.error('Error creating appointment:', error);
        res.status(400).json({ error: error.message || "Une erreur est survenue lors de la création du rendez-vous" });
    }
}