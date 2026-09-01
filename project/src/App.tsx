import { useState } from 'react';
import { Sprout, LayoutDashboard, PlusCircle, ScanLine, Leaf } from 'lucide-react';
import { AddPlantForm } from '@/components/AddPlantForm';
import { PlantDashboard } from '@/components/PlantDashboard';
import { PhotoDiagnosis } from '@/components/PhotoDiagnosis';

type Tab = 'dashboard' | 'register' | 'diagnose';

const tabs: { id: Tab; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'My Plants', icon: LayoutDashboard },
  { id: 'register', label: 'Register Plant', icon: PlusCircle },
  { id: 'diagnose', label: 'Diagnose', icon: ScanLine },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [refreshKey, setRefreshKey] = useState(0);

  function handlePlantAdded() {
    setRefreshKey((k) => k + 1);
    setActiveTab('dashboard');
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100/50">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-slate-200/70 bg-white/80 backdrop-blur-md">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 p-2 shadow-sm">
                <Leaf className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight text-slate-800">PlantCare AI</h1>
                <p className="-mt-0.5 hidden text-xs text-slate-400 sm:block">
                  Smart plant tracking &amp; diagnosis
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 rounded-full text-slate-400">
              <Sprout className="h-4 w-4 text-emerald-500" />
              <span className="hidden text-xs font-medium sm:inline">MVP Demo</span>
            </div>
          </div>

          {/* Tabs */}
          <nav className="flex gap-1 pb-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                    active
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        {activeTab === 'dashboard' && (
          <div className="animate-fade-in-up">
            <div className="mb-6">
              <h2 className="text-2xl font-bold tracking-tight text-slate-800">Your Plants</h2>
              <p className="mt-1 text-sm text-slate-400">
                Track watering schedules and keep your plants thriving.
              </p>
            </div>
            <PlantDashboard refreshKey={refreshKey} />
          </div>
        )}

        {activeTab === 'register' && (
          <div className="animate-fade-in-up mx-auto max-w-xl">
            <div className="mb-6">
              <h2 className="text-2xl font-bold tracking-tight text-slate-800">Register a Plant</h2>
              <p className="mt-1 text-sm text-slate-400">
                Add a new plant to your collection and get watering reminders.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
              <AddPlantForm onPlantAdded={handlePlantAdded} />
            </div>
          </div>
        )}

        {activeTab === 'diagnose' && (
          <div className="animate-fade-in-up mx-auto max-w-xl">
            <div className="mb-6">
              <h2 className="text-2xl font-bold tracking-tight text-slate-800">
                Photo Diagnosis
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                Upload a photo and get an AI-generated plant health assessment.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
              <PhotoDiagnosis />
            </div>
          </div>
        )}
      </main>

      <footer className="mx-auto max-w-5xl px-6 pb-8 pt-4">
        <p className="text-center text-xs text-slate-300">
          PlantCare AI — MVP demo with simulated diagnosis
        </p>
      </footer>
    </div>
  );
}
