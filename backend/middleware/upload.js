/**
 * Multer-Konfiguration für Datei-Uploads (z.B. PDF-Dokumente zu Verträgen).
 * Aktuell nicht in die Routen eingebunden – Vorbereitung für die geplante
 * Dokumentenverwaltung. Kann durch Import in contractRoutes.js aktiviert
 * werden: upload.single('file') als Middleware vor createDocument.
 */
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = process.env.UPLOAD_DIR || './uploads';

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Nicht unterstützter Dateityp. Erlaubt: PDF, PNG, JPEG.'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});

module.exports = upload;
