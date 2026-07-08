/**
 * Controller für Dokumente. Grundgerüst für die spätere
 * Dokumentenverwaltung / PDF-Upload-Funktion.
 */
const documentService = require('../services/documentService');

// GET /api/contracts/:contractId/documents
async function getDocumentsByContract(req, res, next) {
  try {
    const documents = await documentService.getDocumentsByContract(req.params.contractId);
    res.json(documents);
  } catch (err) {
    next(err);
  }
}

// POST /api/contracts/:contractId/documents
// Erwartet aktuell JSON-Metadaten; sobald der Datei-Upload aktiviert wird,
// liefert die multer-Middleware (siehe middleware/upload.js) req.file.
async function createDocument(req, res, next) {
  try {
    const { contractId } = req.params;
    const { name, fileType } = req.body;

    const filePath = req.file ? req.file.path : req.body.filePath;

    if (!name || !filePath || !fileType) {
      return res.status(400).json({
        message: 'Dokumenten-Name, Pfad und Art sind erforderlich.',
      });
    }

    const document = await documentService.createDocument({
      contractId,
      name,
      filePath,
      fileType,
    });

    res.status(201).json(document);
  } catch (err) {
    next(err);
  }
}

// DELETE /api/documents/:id
async function deleteDocument(req, res, next) {
  try {
    await documentService.deleteDocument(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getDocumentsByContract,
  createDocument,
  deleteDocument,
};
