/**
 * Service-Layer für Dokumente (1:n-Beziehung zu Verträgen).
 * Aktuell wird nur die Datenbank-Seite abgebildet; der eigentliche
 * Datei-Upload (Multer) ist als Middleware vorbereitet (siehe
 * middleware/upload.js) und kann später einfach an die Routen
 * angehängt werden.
 */
const prisma = require('./prismaClient');

async function getDocumentsByContract(contractId) {
  return prisma.document.findMany({
    where: { contractId },
    orderBy: { createdAt: 'desc' },
  });
}

async function createDocument(data) {
  return prisma.document.create({ data });
}

async function deleteDocument(id) {
  return prisma.document.delete({ where: { id } });
}

module.exports = {
  getDocumentsByContract,
  createDocument,
  deleteDocument,
};
