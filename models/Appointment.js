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
  creneau: { type: Schema.Types.ObjectId, ref: "Creneau", required: true },
  date: { type: Date, required: true },
  typeConsultation: {
    type: String,
    enum: ["online", "offline"],
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled"],
    default: "confirmed",
  },
},{timestamps:true});
module.exports = mongoose.model("Appointment", appointmentSchema);
