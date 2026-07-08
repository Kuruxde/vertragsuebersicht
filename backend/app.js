/**
 * Express-App-Konfiguration (getrennt von server.js, um Tests zu erleichtern).
 */
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const contractRoutes = require('./routes/contractRoutes');
const documentRoutes = require('./routes/documentRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Statisches Ausliefern hochgeladener Dokumente (Vorbereitung für Dokumentenverwaltung)
app.use('/uploads', express.static('uploads'));

// API-Routen
app.use('/api/contracts', contractRoutes);
app.use('/api/documents', documentRoutes);

// Healthcheck
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// 404-Handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route nicht gefunden' });
});

// Zentrales Error-Handling (muss zuletzt registriert werden)
app.use(errorHandler);

module.exports = app;
