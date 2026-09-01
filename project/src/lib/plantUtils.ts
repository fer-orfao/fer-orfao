import type { Plant, PlantWithStatus, WateringStatus } from '@/types/plant';

export function daysSince(dateString: string): number {
  const last = new Date(dateString + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  last.setHours(0, 0, 0, 0);
  const diffMs = today.getTime() - last.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

export function getWateringStatus(daysSinceWatered: number, frequency: number): WateringStatus {
  const daysUntil = frequency - daysSinceWatered;
  if (daysUntil < 0) return 'overdue';
  if (daysUntil === 0) return 'due-today';
  if (daysUntil <= 2) return 'upcoming';
  return 'healthy';
}

export function withStatus(plant: Plant): PlantWithStatus {
  const since = daysSince(plant.last_watered);
  const until = plant.watering_frequency_days - since;
  return {
    ...plant,
    days_since_watered: since,
    days_until_watering: until,
    watering_status: getWateringStatus(since, plant.watering_frequency_days),
  };
}

export function formatDisplayDate(dateString: string): string {
  const date = new Date(dateString + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export const statusConfig: Record<
  WateringStatus,
  { label: string; color: string; dot: string; bg: string; text: string }
> = {
  overdue: {
    label: 'Needs water now',
    color: 'text-rose-700',
    dot: 'bg-rose-500',
    bg: 'bg-rose-50 border-rose-200',
    text: 'text-rose-700',
  },
  'due-today': {
    label: 'Water today',
    color: 'text-amber-700',
    dot: 'bg-amber-500',
    bg: 'bg-amber-50 border-amber-200',
    text: 'text-amber-700',
  },
  upcoming: {
    label: 'Watering soon',
    color: 'text-sky-700',
    dot: 'bg-sky-500',
    bg: 'bg-sky-50 border-sky-200',
    text: 'text-sky-700',
  },
  healthy: {
    label: 'Well hydrated',
    color: 'text-emerald-700',
    dot: 'bg-emerald-500',
    bg: 'bg-emerald-50 border-emerald-200',
    text: 'text-emerald-700',
  },
};
