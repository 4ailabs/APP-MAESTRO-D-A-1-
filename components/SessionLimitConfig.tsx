import React, { useState, useEffect } from 'react';
import { Settings, Save, X, Info } from 'lucide-react';
import { sessionLimitService, SessionLimitConfig as SessionLimitConfigType } from '../services/sessionLimitService';

interface SessionLimitConfigProps {
  onClose: () => void;
  onSave: () => void;
}

const SessionLimitConfig: React.FC<SessionLimitConfigProps> = ({ onClose, onSave }) => {
  const [config, setConfig] = useState<SessionLimitConfigType>(sessionLimitService.getConfig());
  const [stats, setStats] = useState(sessionLimitService.getStats(config.periodDays));

  useEffect(() => {
    setStats(sessionLimitService.getStats(config.periodDays));
  }, [config.periodDays]);

  const handleSave = () => {
    sessionLimitService.saveConfig(config);
    onSave();
    onClose();
  };

  const { remaining, resetDate } = sessionLimitService.canStartSession();

  const formatResetDate = (date: Date | null) => {
    if (!date) return 'N/A';
    return date.toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white dark:bg-[#1a1a1a] rounded-xl shadow-lg p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-[#e8e8e8] flex items-center">
          <Settings size={24} className="mr-2" /> Configuración de Límites
        </h2>
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#2a2a2a] transition-colors"
          aria-label="Cerrar"
        >
          <X size={20} className="text-gray-700 dark:text-[#b4b4b4]" />
        </button>
      </div>

      {/* Configuración Actual */}
      <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <h3 className="font-semibold text-blue-900 dark:text-blue-400 mb-3">Estado Actual</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-blue-600 dark:text-blue-400">Sesiones restantes:</span>
            <span className="ml-2 font-bold text-blue-900 dark:text-blue-300">{remaining} de {config.maxSessions}</span>
          </div>
          <div>
            <span className="text-blue-600 dark:text-blue-400">Período:</span>
            <span className="ml-2 font-bold text-blue-900 dark:text-blue-300">{config.periodDays} días</span>
          </div>
          <div className="col-span-2">
            <span className="text-blue-600 dark:text-blue-400">Próximo reset:</span>
            <span className="ml-2 font-bold text-blue-900 dark:text-blue-300">{formatResetDate(resetDate)}</span>
          </div>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="mb-6 p-4 bg-gray-50 dark:bg-[#212121] rounded-lg border border-gray-200 dark:border-[#3a3a3a]">
        <h3 className="font-semibold text-gray-900 dark:text-[#e8e8e8] mb-3">Estadísticas del Período Actual</h3>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-gray-600 dark:text-[#b4b4b4]">Total sesiones</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-[#e8e8e8]">{stats.totalSessions}</div>
          </div>
          <div>
            <div className="text-gray-600 dark:text-[#b4b4b4]">Tiempo total</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-[#e8e8e8]">{stats.totalDuration} min</div>
          </div>
          <div>
            <div className="text-gray-600 dark:text-[#b4b4b4]">Promedio</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-[#e8e8e8]">{stats.averageDuration} min</div>
          </div>
        </div>
      </div>

      {/* Configuración */}
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-[#e8e8e8] mb-2">
            Máximo de sesiones
          </label>
          <input
            type="number"
            min="1"
            max="20"
            value={config.maxSessions}
            onChange={(e) => setConfig({ ...config, maxSessions: parseInt(e.target.value) || 1 })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-[#3a3a3a] rounded-lg bg-white dark:bg-[#212121] text-gray-900 dark:text-[#e8e8e8] focus:ring-2 focus:ring-[#6366f1] focus:border-transparent"
          />
          <p className="text-xs text-gray-500 dark:text-[#737373] mt-1">
            Número máximo de sesiones permitidas en el período
          </p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-[#e8e8e8] mb-2">
            Período (días)
          </label>
          <select
            value={config.periodDays}
            onChange={(e) => setConfig({ ...config, periodDays: parseInt(e.target.value) })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-[#3a3a3a] rounded-lg bg-white dark:bg-[#212121] text-gray-900 dark:text-[#e8e8e8] focus:ring-2 focus:ring-[#6366f1] focus:border-transparent"
          >
            <option value={7}>7 días (semanal)</option>
            <option value={15}>15 días (quincenal)</option>
            <option value={30}>30 días (mensual)</option>
          </select>
          <p className="text-xs text-gray-500 dark:text-[#737373] mt-1">
            Período de tiempo para el límite de sesiones
          </p>
        </div>

        {/* Estimación de costo */}
        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
          <div className="flex items-start">
            <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 mr-2 flex-shrink-0" />
            <div className="text-sm text-amber-800 dark:text-amber-300">
              <strong>Estimación de costo mensual:</strong>
              <div className="mt-1">
                Con {config.maxSessions} sesiones cada {config.periodDays} días = ~{Math.ceil((30 / config.periodDays) * config.maxSessions)} sesiones/mes
                <br />
                <span className="font-semibold">
                  Costo estimado: ${((30 / config.periodDays) * config.maxSessions * 0.1).toFixed(2)} - ${((30 / config.periodDays) * config.maxSessions * 0.5).toFixed(2)}/mes
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Botones */}
      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 dark:border-[#3a3a3a] rounded-lg hover:bg-gray-50 dark:hover:bg-[#2a2a2a] text-gray-900 dark:text-[#e8e8e8] transition-colors"
        >
          Cancelar
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-[#6366f1] hover:bg-[#4f46e5] text-white rounded-lg transition-colors flex items-center"
        >
          <Save size={18} className="mr-2" /> Guardar
        </button>
      </div>
    </div>
  );
};

export default SessionLimitConfig;

