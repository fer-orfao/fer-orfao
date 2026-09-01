import { useState } from 'react';
import { Sprout, Droplets, Calendar, Loader2, Plus } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { PlantInput } from '@/types/plant';

interface AddPlantFormProps {
  onPlantAdded: () => void;
}

const SPECIES_PRESETS = [
  'Monstera Deliciosa',
  'Snake Plant',
  'Pothos',
  'Fiddle Leaf Fig',
  'ZZ Plant',
  'Aloe Vera',
  'Peace Lily',
  'Spider Plant',
  'Rubber Plant',
  'Philodendron',
];

export function AddPlantForm({ onPlantAdded }: AddPlantFormProps) {
  const today = new Date().toISOString().split('T')[0];

  const [form, setForm] = useState<PlantInput>({
    name: '',
    species: '',
    last_watered: today,
    watering_frequency_days: 7,
    notes: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!form.name.trim() || !form.species.trim()) {
      setError('Please fill in the plant name and species.');
      return;
    }

    setSubmitting(true);

    const payload: PlantInput = {
      name: form.name.trim(),
      species: form.species.trim(),
      last_watered: form.last_watered,
      watering_frequency_days: form.watering_frequency_days,
      notes: form.notes?.trim() || null,
    };

    const { error: insertError } = await supabase.from('plants').insert(payload);

    setSubmitting(false);

    if (insertError) {
      setError('Could not save your plant. Please try again.');
      return;
    }

    setSuccess(true);
    setForm({
      name: '',
      species: '',
      last_watered: today,
      watering_frequency_days: 7,
      notes: '',
    });
    onPlantAdded();
    setTimeout(() => setSuccess(false), 3000);
  }

  function update<K extends keyof PlantInput>(key: K, value: PlantInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-slate-700">
          <Sprout className="h-4 w-4 text-emerald-600" />
          Plant name
        </label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => update('name', e.target.value)}
          placeholder="e.g. My bedroom buddy"
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 shadow-sm transition focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
        />
      </div>

      <div>
        <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-slate-700">
          <Sprout className="h-4 w-4 text-emerald-600" />
          Species
        </label>
        <input
          type="text"
          list="species-list"
          value={form.species}
          onChange={(e) => update('species', e.target.value)}
          placeholder="e.g. Monstera Deliciosa"
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 shadow-sm transition focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
        />
        <datalist id="species-list">
          {SPECIES_PRESETS.map((s) => (
            <option key={s} value={s} />
          ))}
        </datalist>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-slate-700">
            <Calendar className="h-4 w-4 text-sky-600" />
            Last watered
          </label>
          <input
            type="date"
            value={form.last_watered}
            max={today}
            onChange={(e) => update('last_watered', e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 shadow-sm transition focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        <div>
          <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-slate-700">
            <Droplets className="h-4 w-4 text-sky-600" />
            Water every (days)
          </label>
          <input
            type="number"
            min={1}
            max={60}
            value={form.watering_frequency_days}
            onChange={(e) => update('watering_frequency_days', Math.max(1, Number(e.target.value)))}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 shadow-sm transition focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          Notes <span className="text-slate-400">(optional)</span>
        </label>
        <textarea
          value={form.notes ?? ''}
          onChange={(e) => update('notes', e.target.value)}
          rows={3}
          placeholder="Any details about this plant's care, location, or quirks..."
          className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 shadow-sm transition focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
        />
      </div>

      {error && (
        <div className="rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>
      )}

      {success && (
        <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          <Sprout className="h-4 w-4" />
          Plant registered successfully!
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-200 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Plus className="h-4 w-4" />
            Register plant
          </>
        )}
      </button>
    </form>
  );
}
