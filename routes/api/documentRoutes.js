const express = require('express');
const router = express.Router();
const { authenticate } = require('../../middlewares/auth');
const { adminOnly, requireRoles } = require('../../middlewares/permissions');
const {
  getDocuments,
  getDocumentById,
  createDocument,
  updateDocument,
  deleteDocument
} = require('../../controllers/documentController');

router.get('/', authenticate, getDocuments);
router.get('/:id', authenticate, getDocumentById);
router.post('/', authenticate, requireRoles('doctor', 'admin'), createDocument);
router.put('/:id', authenticate, requireRoles('doctor', 'admin'), updateDocument);
router.delete('/:id', authenticate, requireRoles('doctor', 'admin'), deleteDocument);

module.exports = router;