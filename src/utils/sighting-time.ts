/** Format a local 24-hour observation time without changing its timezone. */
export function displayObservationTime(value?: string): string {
  if (!value || !/^([01]\d|2[0-3]):[0-5]\d$/.test(value)) return 'Not recorded';
  const [hour, minute] = value.split(':').map(Number);
  return `${hour % 12 || 12}:${String(minute).padStart(2, '0')} ${hour < 12 ? 'AM' : 'PM'}`;
}

/** Display the actual time the record was saved in the device timezone. */
export function displaySavedAt(value?: string): string {
  if (!value) return 'Not recorded (older entry)';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Not recorded';
  return date.toLocaleString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
}
