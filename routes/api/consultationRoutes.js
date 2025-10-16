const express=require('express');
const router=express.Router();
const {getConsultations,createConsultation}=require('../../controllers/consultationController')
router.get('/affichage',getConsultations);
router.post('/create',createConsultation);

module.exports=router;