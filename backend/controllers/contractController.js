/**
 * Controller für Verträge: nimmt HTTP-Requests entgegen, validiert grob
 * die Eingaben und delegiert die eigentliche Arbeit an den Service-Layer.
 */
const contractService = require('../services/contractService');
 
// Da SQLite keine nativen Enums unterstützt, werden Status und
// Zahlungsintervall als String gespeichert und hier auf Anwendungsebene
// validiert (siehe prisma/schema.prisma für Details).
const VALID_STATUSES = ['ACTIVE', 'CANCELLED', 'EXPIRED'];
const VALID_PAYMENT_INTERVALS = ['MONTHLY', 'QUARTERLY', 'YEARLY', 'ONE_TIME'];
 
// GET /api/contracts
async function getAllContracts(req, res, next) {
  try {
    const { status, category, search } = req.query;
    const contracts = await contractService.getAllContracts({ status, category, search });
    res.json(contracts);
  } catch (err) {
    next(err);
  }
}
 
// GET /api/contracts/:id
async function getContractById(req, res, next) {
  try {
    const contract = await contractService.getContractById(req.params.id);
    if (!contract) {
      return res.status(404).json({ message: 'Vertrag nicht gefunden' });
    }
    res.json(contract);
  } catch (err) {
    next(err);
  }
}
 
// POST /api/contracts
async function createContract(req, res, next) {
  try {
    const payload = normalizeContractPayload(req.body);
 
    if (!payload.name || !payload.category || !payload.provider) {
      return res.status(400).json({
        message: 'Vertragsname, Kategorie und Anbieter sind Pflichtfelder.',
      });
    }
 
    const validationError = validateEnumFields(payload);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }
 
    const contract = await contractService.createContract(payload);
    res.status(201).json(contract);
  } catch (err) {
    next(err);
  }
}
 
// PUT /api/contracts/:id
async function updateContract(req, res, next) {
  try {
    const payload = normalizeContractPayload(req.body);
 
    const validationError = validateEnumFields(payload);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }
 
    const contract = await contractService.updateContract(req.params.id, payload);
    res.json(contract);
  } catch (err) {
    next(err);
  }
}
 
// DELETE /api/contracts/:id
async function deleteContract(req, res, next) {
  try {
    await contractService.deleteContract(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
 
// GET /api/contracts/stats/dashboard
async function getDashboardStats(req, res, next) {
  try {
    const stats = await contractService.getDashboardStats();
    res.json(stats);
  } catch (err) {
    next(err);
  }
}
 
/**
 * Wandelt Frontend-Payload in ein für Prisma passendes Objekt um
 * (Typkonvertierung von Strings aus Formularen in Date/Number).
 */
function normalizeContractPayload(body) {
  const payload = { ...body };
 
  if (payload.startDate) payload.startDate = new Date(payload.startDate);
  if (payload.endDate) payload.endDate = new Date(payload.endDate);
  else delete payload.endDate;
 
  if (payload.durationMonths !== undefined && payload.durationMonths !== '')
    payload.durationMonths = parseInt(payload.durationMonths, 10);
  else delete payload.durationMonths;
 
  if (payload.cancellationDays !== undefined && payload.cancellationDays !== '')
    payload.cancellationDays = parseInt(payload.cancellationDays, 10);
  else delete payload.cancellationDays;
 
  if (payload.amount !== undefined) payload.amount = parseFloat(payload.amount);
 
  // Felder, die nicht direkt in der DB liegen, entfernen (z.B. verschachtelte documents)
  delete payload.documents;
  delete payload.id;
  delete payload.createdAt;
  delete payload.updatedAt;
 
  return payload;
}
 
/**
 * Prüft, dass Status und Zahlungsintervall (als String gespeichert,
 * da SQLite keine nativen Enums unterstützt) nur gültige Werte enthalten.
 * Gibt eine Fehlermeldung zurück oder null, wenn alles gültig ist.
 */
function validateEnumFields(payload) {
  if (payload.status !== undefined && !VALID_STATUSES.includes(payload.status)) {
    return `Ungültiger Status. Erlaubt: ${VALID_STATUSES.join(', ')}`;
  }
  if (
    payload.paymentInterval !== undefined &&
    !VALID_PAYMENT_INTERVALS.includes(payload.paymentInterval)
  ) {
    return `Ungültiges Zahlungsintervall. Erlaubt: ${VALID_PAYMENT_INTERVALS.join(', ')}`;
  }
  return null;
}
 
module.exports = {
  getAllContracts,
  getContractById,
  createContract,
  updateContract,
  deleteContract,
  getDashboardStats,
};