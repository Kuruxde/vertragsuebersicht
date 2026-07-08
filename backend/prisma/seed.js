/**
 * Seed-Skript: befüllt die Datenbank mit Beispiel-Verträgen.
 * Aufruf: npm run prisma:seed
 */
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const contracts = [
  {
    name: 'Internet & Telefon',
    category: 'Telekommunikation',
    provider: 'Deutsche Telekom',
    contractNumber: 'DT-2023-88213',
    startDate: new Date('2023-03-01'),
    durationMonths: 24,
    cancellationDays: 30,
    amount: 49.99,
    paymentTxt: 'MONTHLY',
    paymentValue: 1,
    status: 'ACTIVE',
    info: 'MagentaZuhause L, 250 Mbit/s',
  },
  {
    name: 'Kfz-Versicherung',
    category: 'Versicherung',
    provider: 'Allianz',
    contractNumber: 'ALZ-KFZ-556213',
    startDate: new Date('2024-01-01'),
    durationMonths: 12,
    cancellationDays: 30,
    amount: 620.0,
    paymentTxt: 'YEARLY',
    paymentValue: 12,
    status: 'ACTIVE',
    info: 'Vollkasko, SF-Klasse 12',
  },
  {
    name: 'Fitnessstudio Mitgliedschaft',
    category: 'Sport & Freizeit',
    provider: 'FitX',
    contractNumber: 'FX-99213',
    startDate: new Date('2022-06-15'),
    durationMonths: 12,
    cancellationDays: 14,
    amount: 24.9,
    paymentTxt: 'MONTHLY',
    paymentValue: 1,
    status: 'CANCELLED',
    info: 'Zum 30.06. gekündigt',
  },
  {
    name: 'Bürosoftware Lizenz',
    category: 'Software',
    provider: 'Microsoft',
    contractNumber: 'MS-365-11298',
    startDate: new Date('2024-05-01'),
    durationMonths: 12,
    cancellationDays: 30,
    amount: 10.5,
    paymentTxt: 'MONTHLY',
    paymentValue: 1,
    status: 'ACTIVE',
    info: 'Microsoft 365 Business Standard, 5 Lizenzen',
  },
  {
    name: 'Stromvertrag',
    category: 'Energie',
    provider: 'E.ON',
    contractNumber: 'EON-STR-77341',
    startDate: new Date('2023-01-01'),
    durationMonths: 24,
    cancellationDays: 42,
    amount: 89.0,
    paymentTxt: 'MONTHLY',
    paymentValue: 1,
    status: 'EXPIRED',
    info: 'Läuft aus, Anbieterwechsel geplant',
  },
  {
    name: 'Cloud Hosting',
    category: 'Software',
    provider: 'Hetzner',
    contractNumber: 'HZ-CLOUD-4471',
    startDate: new Date('2024-09-01'),
    durationMonths: null,
    cancellationDays: 1,
    amount: 15.9,
    paymentTxt: 'MONTHLY',
    paymentValue: 1,
    status: 'ACTIVE',
    info: 'Monatlich kündbar, CX22 Server',
  },
];

async function main() {
  console.log('🌱 Seeding Datenbank...');

  await prisma.document.deleteMany();
  await prisma.contract.deleteMany();

  for (const contract of contracts) {
    await prisma.contract.create({ data: contract });
  }

  console.log(`✅ ${contracts.length} Beispiel-Verträge angelegt.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
