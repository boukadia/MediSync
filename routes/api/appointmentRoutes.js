const express = require('express');
const router =express.Router();
const { createAppointment,formCreateAppointment } = require('../../controllers/appointmentController');
router.post('/create',createAppointment);
router.post('/formCreate',formCreateAppointment);
module.exports=router;