const express=require('express');
const router=express.Router();
const {getDossierMedical,createDossierMedical}=require('../../controllers/dossierMedicalController')
// router.get('/',getDossierMedical);
router.post('/create',createDossierMedical);


module.exports=router