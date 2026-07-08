/**
 * Zentrales Error-Handling für die gesamte API.
 * Wandelt bekannte Prisma-Fehler in sprechende HTTP-Antworten um.
 */
function errorHandler(err, req, res, next) {
  console.error(err);

  // Prisma: Datensatz nicht gefunden
  if (err.code === 'P2025') {
    return res.status(404).json({ message: 'Datensatz nicht gefunden.' });
  }

  // Prisma: Unique-Constraint verletzt
  if (err.code === 'P2002') {
    return res.status(409).json({ message: 'Datensatz existiert bereits.' });
  }

  res.status(err.status || 500).json({
    message: err.message || 'Interner Serverfehler',
  });
}

module.exports = errorHandler;
