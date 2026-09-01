import { useEffect, useState, useCallback } from 'react';
import {
  Sprout,
  Droplets,
  Trash2,
  Loader2,
  RefreshCw,
  CalendarClock,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Plant, PlantWithStatus } from '@/types/plant';
import { withStatus, formatDisplayDate, statusConfig } from '@/lib/plantUtils';

interface PlantDashboardProps {
  refreshKey: number;
}

export function PlantDashboard({ refreshKey }: PlantDashboardProps) {
  const [plants, setPlants] = useState<PlantWithStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [watering, setWatering] = useState<string | null>(null);

  const fetchPlants = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: fetchError } = await supabase
      .from('plants')
      .select('*')
      .order('created_at', { ascending: false });

    if (fetchError) {
      setError('Could not load your plants. Please try again.');
      setLoading(false);
      return;
    }

    const withStatusData = (data as Plant[]).map(withStatus);
    setPlants(withStatusData);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPlants();
  }, [fetchPlants, refreshKey]);

  async function handleWaterNow(plant: PlantWithStatus) {
    setWatering(plant.id);
    const today = new Date().toISOString().split('T')[0];
    const { error: updateError } = await supabase
      .from('plants')
      .update({ last_watered: today })
      .eq('id', plant.id);

    setWatering(null);
    if (updateError) {
      setError('Could not update watering date. Please try again.');
      return;
    }
    fetchPlants();
  }

  async function handleDelete(plant: PlantWithStatus) {
    const { error: deleteError } = await supabase.from('plants').delete().eq('id', plant.id);
    if (deleteError) {
      setError('Could not remove this plant. Please try again.');
      return;
    }
    fetchPlants();
  }

  const needsAttention = plants.filter(
    (p) => p.watering_status === 'overdue' || p.watering_status === 'due-today'
  ).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-400">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
        {error}
        <button onClick={fetchPlants} className="ml-2 underline">
          Retry
        </button>
      </div>
    );
  }

  if (plants.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 py-16 text-center">
        <div className="mb-4 rounded-full bg-emerald-50 p-4">
          <Sprout className="h-8 w-8 text-emerald-600" />
        </div>
        <h3 className="text-lg font-semibold text-slate-700">No plants yet</h3>
        <p className="mt-1 max-w-xs text-sm text-slate-400">
          Register your first plant using the form and it will appear here with watering reminders.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Stats bar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="rounded-xl border border-slate-100 bg-white px-4 py-2.5 shadow-sm">
          <span className="text-2xl font-bold text-slate-800">{plants.length}</span>
          <span className="ml-1.5 text-sm text-slate-400">
            {plants.length === 1 ? 'plant' : 'plants'}
          </span>
        </div>
        {needsAttention > 0 && (
          <div className="rounded-xl border border-rose-100 bg-rose-50 px-4 py-2.5">
            <span className="text-2xl font-bold text-rose-600">{needsAttention}</span>
            <span className="ml-1.5 text-sm text-rose-500">need water</span>
          </div>
        )}
        <button
          onClick={fetchPlants}
          className="ml-auto flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-slate-400 transition hover:bg-slate-50 hover:text-slate-600"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh
        </button>
      </div>

      {/* Plant cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {plants.map((plant) => {
          const cfg = statusConfig[plant.watering_status];
          return (
            <div
              key={plant.id}
              className="group flex flex-col rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <div className="mb-3 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-emerald-50 p-2.5">
                    <Sprout className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">{plant.name}</h3>
                    <p className="text-xs italic text-slate-400">{plant.species}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(plant)}
                  className="rounded-lg p-1.5 text-slate-300 opacity-0 transition hover:bg-rose-50 hover:text-rose-500 group-hover:opacity-100"
                  title="Remove plant"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className={`mb-4 flex items-center gap-2 rounded-lg border px-3 py-2 ${cfg.bg}`}>
                <span className={`h-2 w-2 rounded-full ${cfg.dot}`} />
                <span className={`text-xs font-medium ${cfg.text}`}>{cfg.label}</span>
              </div>

              <div className="mb-4 space-y-2 text-xs text-slate-500">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <CalendarClock className="h-3.5 w-3.5 text-slate-400" />
                    Last watered
                  </span>
                  <span className="font-medium text-slate-600">
                    {formatDisplayDate(plant.last_watered)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Droplets className="h-3.5 w-3.5 text-slate-400" />
                    Watered {plant.days_since_watered} {plant.days_since_watered === 1 ? 'day' : 'days'} ago
                  </span>
                  <span className="font-medium text-slate-600">
                    Every {plant.watering_frequency_days}d
                  </span>
                </div>
                {plant.notes && (
                  <p className="mt-2 line-clamp-2 rounded-lg bg-slate-50 px-3 py-2 text-slate-500">
                    {plant.notes}
                  </p>
                )}
              </div>

              <button
                onClick={() => handleWaterNow(plant)}
                disabled={watering === plant.id}
                className="mt-auto flex items-center justify-center gap-2 rounded-xl bg-sky-50 px-4 py-2.5 text-sm font-medium text-sky-700 transition hover:bg-sky-100 disabled:opacity-60"
              >
                {watering === plant.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Droplets className="h-4 w-4" />
                )}
                Mark as watered today
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
