/**
 * Zentrale Definition der Auswahl-Optionen, damit Backend-Enums und
 * Frontend-Anzeige an einer Stelle synchron gehalten werden.
 */
export const STATUS_OPTIONS = [
  { value: 'ACTIVE', label: 'Aktiv', color: 'success' },
  { value: 'CANCELLED', label: 'Gekündigt', color: 'warning' },
  { value: 'EXPIRED', label: 'Abgelaufen', color: 'default' },
];

export const PAYMENT_INTERVAL_OPTIONS = [
  { value: 'MONTHLY', label: 'Monatlich' },
  { value: 'QUARTERLY', label: 'Quartalsweise' },
  { value: 'YEARLY', label: 'Jährlich' },
  { value: 'ONE_TIME', label: 'Einmalig' },
];

export const CATEGORY_OPTIONS = [
  'Telekommunikation',
  'Versicherung',
  'Energie',
  'Software',
  'Miete/Immobilien',
  'Sport & Freizeit',
  'Finanzen',
  'Sonstiges',
];

export function getStatusMeta(value) {
  return STATUS_OPTIONS.find((s) => s.value === value) || STATUS_OPTIONS[0];
}

export function getIntervalLabel(value) {
  return PAYMENT_INTERVAL_OPTIONS.find((i) => i.value === value)?.label || value;
}
