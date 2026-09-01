export interface Plant {
  id: string;
  name: string;
  species: string;
  last_watered: string;
  watering_frequency_days: number;
  notes: string | null;
  created_at: string;
}

export interface PlantInput {
  name: string;
  species: string;
  last_watered: string;
  watering_frequency_days: number;
  notes?: string | null;
}

export type WateringStatus = 'overdue' | 'due-today' | 'upcoming' | 'healthy';

export interface PlantWithStatus extends Plant {
  days_since_watered: number;
  days_until_watering: number;
  watering_status: WateringStatus;
}
