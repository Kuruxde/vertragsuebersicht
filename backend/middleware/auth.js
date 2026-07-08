/**
 * Platzhalter-Middleware für zukünftige Authentifizierung (JWT/OAuth).
 * Aktuell inaktiv (Pass-Through), damit die App ohne Login funktioniert.
 *
 * Aktivierung später z.B. so:
 *   const jwt = require('jsonwebtoken');
 *   const token = req.headers.authorization?.split(' ')[1];
 *   if (!token) return res.status(401).json({ message: 'Nicht autorisiert' });
 *   try {
 *     req.user = jwt.verify(token, process.env.JWT_SECRET);
 *     next();
 *   } catch {
 *     return res.status(401).json({ message: 'Ungültiges Token' });
 *   }
 */
function requireAuth(req, res, next) {
  // TODO: Implementierung nach Einführung von JWT/OAuth
  next();
}

module.exports = { requireAuth };
