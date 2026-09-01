import { useState, useRef } from 'react';
import {
  Upload,
  ScanLine,
  Loader2,
  Camera,
  X,
  CheckCircle2,
  AlertCircle,
  Info,
} from 'lucide-react';

interface DiagnosisResult {
  status: 'healthy' | 'warning' | 'attention';
  condition: string;
  description: string;
  recommendations: string[];
  confidence: number;
}

const MOCK_DIAGNOSES: DiagnosisResult[] = [
  {
    status: 'healthy',
    condition: 'Healthy plant',
    description:
      'Your plant shows vibrant coloration and well-formed leaves. No signs of disease or pests detected.',
    recommendations: [
      'Continue your current watering schedule',
      'Wipe leaves occasionally to remove dust',
      'Rotate the pot weekly for even growth',
    ],
    confidence: 92,
  },
  {
    status: 'warning',
    condition: 'Possible overwatering',
    description:
      'Some leaves show yellowing and slight drooping, which can indicate excess water or poor drainage.',
    recommendations: [
      'Allow the top 2 inches of soil to dry before watering again',
      'Check that the pot has adequate drainage holes',
      'Remove any yellowing leaves to prevent rot',
    ],
    confidence: 78,
  },
  {
    status: 'attention',
    condition: 'Underwatering detected',
    description:
      'Leaves appear dry and curled at the edges, a common sign the plant needs more frequent watering.',
    recommendations: [
      'Water thoroughly until moisture drains from the bottom',
      'Increase watering frequency slightly',
      'Consider misting the leaves if humidity is low',
    ],
    confidence: 85,
  },
  {
    status: 'warning',
    condition: 'Possible nutrient deficiency',
    description:
      'Pale or discolored leaves may indicate the plant needs fertilizer or more light exposure.',
    recommendations: [
      'Apply a balanced liquid fertilizer at half strength',
      'Move the plant to a spot with brighter indirect light',
      'Monitor new growth for signs of improvement',
    ],
    confidence: 71,
  },
];

const statusStyles = {
  healthy: {
    icon: CheckCircle2,
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-700',
    accent: 'text-emerald-600',
  },
  warning: {
    icon: AlertCircle,
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-700',
    accent: 'text-amber-600',
  },
  attention: {
    icon: Info,
    bg: 'bg-sky-50',
    border: 'border-sky-200',
    text: 'text-sky-700',
    accent: 'text-sky-600',
  },
};

export function PhotoDiagnosis() {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (JPG, PNG, etc.).');
      return;
    }

    setError(null);
    setResult(null);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  }

  function handleRemovePhoto() {
    setPreviewUrl(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  async function handleAnalyze() {
    if (!previewUrl) return;
    setAnalyzing(true);
    setResult(null);

    await new Promise((resolve) => setTimeout(resolve, 2200));

    const randomIndex = Math.floor(Math.random() * MOCK_DIAGNOSES.length);
    setResult(MOCK_DIAGNOSES[randomIndex]);
    setAnalyzing(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-sky-50 border border-sky-100 px-4 py-3 text-sm text-sky-700">
        <span className="font-medium">Simulated diagnosis:</span> Upload a photo of your plant to
        receive an AI-generated health assessment. This is a demo and produces sample results — not
        a real medical analysis.
      </div>

      {!previewUrl ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 py-14 text-center transition hover:border-emerald-300 hover:bg-emerald-50/30"
        >
          <div className="mb-4 rounded-full bg-white p-4 shadow-sm">
            <Camera className="h-8 w-8 text-emerald-600" />
          </div>
          <p className="font-medium text-slate-600">Upload a plant photo</p>
          <p className="mt-1 text-sm text-slate-400">Click to choose an image from your device</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
            <img src={previewUrl} alt="Plant upload" className="h-64 w-full object-cover" />
            <button
              onClick={handleRemovePhoto}
              className="absolute right-3 top-3 rounded-full bg-white/90 p-1.5 text-slate-600 shadow-sm transition hover:bg-white hover:text-rose-500"
            >
              <X className="h-4 w-4" />
            </button>
            {analyzing && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-white">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span className="font-medium">Analyzing image...</span>
                </div>
                <div className="mt-4 h-1 w-48 overflow-hidden rounded-full bg-white/20">
                  <div className="h-full w-1/3 animate-pulse rounded-full bg-emerald-400" />
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleAnalyze}
              disabled={analyzing}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {analyzing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ScanLine className="h-4 w-4" />
              )}
              {analyzing ? 'Analyzing...' : 'Diagnose plant'}
            </button>
            <button
              onClick={handleRemovePhoto}
              disabled={analyzing}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-60"
            >
              <Upload className="h-4 w-4" />
              New photo
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>
      )}

      {result && (
        <DiagnosisCard result={result} onDismiss={() => setResult(null)} />
      )}
    </div>
  );
}

function DiagnosisCard({
  result,
  onDismiss,
}: {
  result: DiagnosisResult;
  onDismiss: () => void;
}) {
  const style = statusStyles[result.status];
  const Icon = style.icon;

  return (
    <div className={`rounded-2xl border ${style.border} ${style.bg} p-5`}>
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={`rounded-xl bg-white p-2.5 shadow-sm`}>
            <Icon className={`h-5 w-5 ${style.accent}`} />
          </div>
          <div>
            <h3 className={`font-semibold ${style.text}`}>{result.condition}</h3>
            <p className="text-xs text-slate-400">
              Confidence: {result.confidence}%
            </p>
          </div>
        </div>
        <button
          onClick={onDismiss}
          className="rounded-lg p-1 text-slate-300 transition hover:bg-white/50 hover:text-slate-500"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <p className="mb-4 text-sm leading-relaxed text-slate-600">{result.description}</p>

      <div className="rounded-xl bg-white/70 p-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Recommendations
        </p>
        <ul className="space-y-2">
          {result.recommendations.map((rec, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
              <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-emerald-500" />
              {rec}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
