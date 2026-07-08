/**
 * Service-Layer: kapselt sämtliche Datenbank-Zugriffe für Verträge.
 * Controller rufen ausschließlich diese Funktionen auf und enthalten
 * selbst keine Prisma-Logik. Das erleichtert Tests und spätere Erweiterungen
 * (z.B. Caching, zusätzliche Business-Logik, Wechsel der ORM-Aufrufe).
 */
const prisma = require('./prismaClient');

/**
 * Liefert alle Verträge, optional gefiltert/sortiert.
 * Vorbereitet für zukünftige Filter (Kategorie, Preis, Laufzeit, Status).
 */
async function getAllContracts(filters = {}) {
  const { status, category, search } = filters;

  const where = {};
  if (status) where.status = status;
  if (category) where.category = category;
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { provider: { contains: search } },
      { contractNumber: { contains: search } },
    ];
  }

  return prisma.contract.findMany({
    where,
    include: { documents: true },
    orderBy: { createdAt: 'desc' },
  });
}

async function getContractById(id) {
  return prisma.contract.findUnique({
    where: { id },
    include: { documents: true },
  });
}

async function createContract(data) {
  return prisma.contract.create({ data });
}

async function updateContract(id, data) {
  return prisma.contract.update({
    where: { id },
    data,
  });
}

async function deleteContract(id) {
  return prisma.contract.delete({ where: { id } });
}

/**
 * Statistiken für das Dashboard:
 * - Summe der monatlichen Kosten aller aktiven Verträge
 *   (Jahres-/Quartalsbeträge werden auf Monatsbasis umgerechnet)
 * - Anzahl aktiver Verträge
 */
async function getDashboardStats() {
  const activeContracts = await prisma.contract.findMany({
    where: { status: 'ACTIVE' },
  });

  const monthlyFactor = {
    MONTHLY: 1,
    QUARTERLY: 1 / 3,
    YEARLY: 1 / 12,
    ONE_TIME: 0,
  };

  const totalMonthlyCost = activeContracts.reduce((sum, c) => {
    const factor = monthlyFactor[c.paymentInterval] ?? 1;
    return sum + c.amount * factor;
  }, 0);

  return {
    totalMonthlyCost: Math.round(totalMonthlyCost * 100) / 100,
    activeContractsCount: activeContracts.length,
  };
}

module.exports = {
  getAllContracts,
  getContractById,
  createContract,
  updateContract,
  deleteContract,
  getDashboardStats,
};
