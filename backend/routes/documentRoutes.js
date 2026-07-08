const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');

router.delete('/:id', documentController.deleteDocument);

module.exports = router;
