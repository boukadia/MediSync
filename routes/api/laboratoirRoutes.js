const express = require('express');
const router = express.Router();
const { authenticate } = require('../../middlewares/auth');
const { adminOnly, requireRoles } = require('../../middlewares/permissions');
const {
  getLaboratories,
  getLaboratoryById,
  createLaboratory,
  updateLaboratory,
  deleteLaboratory
} = require('../../controllers/laboratoirController');

router.get('/', authenticate, getLaboratories);
router.get('/:id', authenticate, getLaboratoryById);
router.post('/', authenticate, adminOnly, createLaboratory);
router.put('/:id', authenticate, adminOnly, updateLaboratory);
router.delete('/:id', authenticate, adminOnly, deleteLaboratory);

module.exports = router;