const express = require('express');
const router = express.Router();
const { authenticate } = require('../../middlewares/auth');
const { 
  doctorOnly, 
  checkDoctorDisponibilite,
  adminOnly 
} = require('../../middlewares/permissions');
const { 
  createDisponibilite, 
  getDisponibilites ,updateDisponibilite,deleteDisponibilite
} = require('../../controllers/disponibiliteController');

router.get('/', getDisponibilites);

router.post('/', authenticate, doctorOnly, createDisponibilite);

router.put('/:id', authenticate, updateDisponibilite
);

router.delete('/:id', authenticate, checkDoctorDisponibilite,deleteDisponibilite);

module.exports = router;