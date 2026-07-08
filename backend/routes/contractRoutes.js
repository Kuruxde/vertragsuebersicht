const express = require('express');
const router = express.Router();
const contractController = require('../controllers/contractController');
const documentController = require('../controllers/documentController');

// Dashboard-Statistiken (vor /:id definieren, damit "stats" nicht als ID interpretiert wird)
router.get('/stats/dashboard', contractController.getDashboardStats);

// CRUD für Verträge
router.get('/', contractController.getAllContracts);
router.get('/:id', contractController.getContractById);
router.post('/', contractController.createContract);
router.put('/:id', contractController.updateContract);
router.delete('/:id', contractController.deleteContract);

// Verschachtelte Routen für Dokumente eines Vertrags (1:n)
router.get('/:contractId/documents', documentController.getDocumentsByContract);
router.post('/:contractId/documents', documentController.createDocument);
// Für aktiven PDF-Upload später: router.post('/:contractId/documents', upload.single('file'), documentController.createDocument);

module.exports = router;
