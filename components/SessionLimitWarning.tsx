import React from 'react';
import { AlertTriangle, Calendar, X } from 'lucide-react';
import { sessionLimitService } from '../services/sessionLimitService';

interface SessionLimitWarningProps {
  onClose: () => void;
  onConfigure?: () => void;
}

const SessionLimitWarning: React.FC<SessionLimitWarningProps> = ({ onClose, onConfigure }) => {
  const config = sessionLimitService.getConfig();
  const { allowed, remaining, resetDate } = sessionLimitService.canStartSession();

  const formatResetDate = (date: Date | null) => {
    if (!date) return '';
    const now = new Date();
    const daysUntilReset = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilReset <= 0) return 'Hoy';
    if (daysUntilReset === 1) return 'Mañana';
    if (daysUntilReset <= 7) return `En ${daysUntilReset} días`;
    
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  };

  if (allowed) {
    return (
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start">
            <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-1">Sesiones Disponibles</h4>
              <p className="text-sm text-blue-700 dark:text-blue-400">
                Te quedan <strong>{remaining}</strong> de <strong>{config.maxSessions}</strong> sesiones en los próximos {config.periodDays} días.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-blue-400 dark:text-blue-500 hover:text-blue-600 dark:hover:text-blue-300 transition-colors"
            aria-label="Cerrar"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-4">
      <div className="flex items-start justify-between">
        <div className="flex items-start">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-amber-900 dark:text-amber-300 mb-1">Límite de Sesiones Alcanzado</h4>
            <p className="text-sm text-amber-700 dark:text-amber-400 mb-2">
              Has usado todas tus <strong>{config.maxSessions}</strong> sesiones para este período de {config.periodDays} días.
            </p>
            {resetDate && (
              <p className="text-xs text-amber-600 dark:text-amber-400">
                El límite se reseteará: <strong>{formatResetDate(resetDate)}</strong>
              </p>
            )}
            {onConfigure && (
              <button
                onClick={onConfigure}
                className="mt-2 text-xs text-amber-700 dark:text-amber-400 hover:text-amber-900 dark:hover:text-amber-200 underline"
              >
                Cambiar configuración
              </button>
            )}
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-amber-400 dark:text-amber-500 hover:text-amber-600 dark:hover:text-amber-300 transition-colors"
          aria-label="Cerrar"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

export default SessionLimitWarning;

