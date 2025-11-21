const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const appointmentSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  consultationReason: { type: String, required: true },
  creneau: { type: Schema.Types.ObjectId, ref: "Creneau", required: true },
  date: { type: String },
  typeConsultation: {
    type: String,
    enum: ["online", "offline"],
    required: true,
  },
  // specialite: { type: String },
  status: {
    type: String,
    enum: [ "pending","confirmed", "cancelled",'completed'],
    default: "pending",
  },
},{timestamps:true});
module.exports = mongoose.model("Appointment", appointmentSchema);
