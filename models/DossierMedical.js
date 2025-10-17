const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const dossierMedicalShema = new mongoose.Schema({
  patientId: { type: Schema.Types.ObjectId, ref: "User", required: true },
 
  historiqueConsultations: [
    {
      consultation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Consultation", // référence à la consultation
        required: true,
      },
      date: {
        type: Date,
        default: Date.now,
      },
      notes: String, // facultatif, يمكن الطبيب يزيد ملاحظات على الزيارة
    },
  ],
  allergies: { type: String },
  groupeSanguin: { type: String },
});
module.exports = mongoose.model("DossierMedical", dossierMedicalShema);
