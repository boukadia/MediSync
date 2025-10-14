
const express=require('express');
const router=express.Router();
const{getDisponibilites,createDisponibilite}=require('../../controllers/disponibiliteController')
router.get('/',getDisponibilites);
router.post('/createDisponibilite', createDisponibilite);
module.exports=router;