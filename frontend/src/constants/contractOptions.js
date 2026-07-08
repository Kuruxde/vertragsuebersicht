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
  { value: 'MONTHLY', label: 'Monatlich' , realValue: 1},
  { value: 'QUARTERLY', label: 'Quartalsweise', realValue: 3},
  { value: 'YEARLY', label: 'Jährlich', realValue: 12 },
  { value: 'ONE_TIME', label: 'Einmalig', realValue: 0 },
  { value: 'HALF_YEARLY', label: 'Halbjährig', realValue: 6},
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

export function getIntervalRealValue(value) {
  return PAYMENT_INTERVAL_OPTIONS.find((x) => x.value === value)?.realValue || 0;
}