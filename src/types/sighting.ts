
export type Sighting = {
  id: string;
  snakeId?: string;
  snakeName: string;
  district?: string;
  location: string;
  date: string;
  /** Local observation time in 24-hour HH:mm format. */
  observedTime?: string;
  /** ISO timestamp when this record was first saved. */
  savedAt?: string;
  notes: string;
  photoUri?: string;
};
