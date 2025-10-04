'use client';

import { CheckCircle, Circle, Loader2, X } from 'lucide-react';

export interface PlanningStep {
  id: string;
  type: 'thinking' | 'action' | 'result';
  status: 'pending' | 'running' | 'completed' | 'error';
  title: string;
  details?: string;
  timestamp: Date;
}

interface PlanningProgressProps {
  isOpen: boolean;
  onClose: () => void;
  steps: PlanningStep[];
}

export function PlanningProgress({ isOpen, onClose, steps }: PlanningProgressProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-purple-50 to-pink-50">
          <div>
            <h2 className="text-xl font-bold text-gray-900">🤖 KI-Planung läuft...</h2>
            <p className="text-sm text-gray-600">Verfolge den Planungsprozess Schritt für Schritt</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Steps */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`flex gap-4 p-4 rounded-lg border-2 transition-all ${
                  step.status === 'running'
                    ? 'border-blue-300 bg-blue-50 animate-pulse'
                    : step.status === 'completed'
                    ? 'border-green-200 bg-green-50'
                    : step.status === 'error'
                    ? 'border-red-200 bg-red-50'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                {/* Icon */}
                <div className="flex-shrink-0 mt-1">
                  {step.status === 'running' ? (
                    <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                  ) : step.status === 'completed' ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : step.status === 'error' ? (
                    <X className="w-6 h-6 text-red-600" />
                  ) : (
                    <Circle className="w-6 h-6 text-gray-400" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900">
                      {index + 1}. {step.title}
                    </h3>
                    <span className="text-xs text-gray-500 flex-shrink-0">
                      {step.timestamp.toLocaleTimeString('de-DE', {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </span>
                  </div>

                  {step.details && (
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{step.details}</p>
                  )}

                  {/* Type Badge */}
                  <div className="mt-2">
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                        step.type === 'thinking'
                          ? 'bg-purple-100 text-purple-700'
                          : step.type === 'action'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {step.type === 'thinking' ? '💭 Denken' : step.type === 'action' ? '⚡ Aktion' : '📊 Ergebnis'}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {steps.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-purple-500" />
                <p className="text-lg font-medium">Warte auf KI-Antwort...</p>
                <p className="text-sm mt-2 text-gray-400">⏱️ GPT-5 kann 1-2 Minuten brauchen - bitte warten!</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        {steps.length > 0 && steps[steps.length - 1].status === 'completed' && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-900">✅ Planung abgeschlossen!</p>
                <p className="text-xs text-green-700">{steps.length} Schritte erfolgreich</p>
              </div>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
              >
                Schließen
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

