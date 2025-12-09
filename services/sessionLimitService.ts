interface SessionUsage {
  date: string; // YYYY-MM-DD
  count: number;
  sessions: Array<{
    timestamp: number;
    duration: number; // en segundos
  }>;
}

const STORAGE_KEY = 'maestro-session-usage';
const DEFAULT_LIMIT = 2;
const DEFAULT_PERIOD_DAYS = 15;

export interface SessionLimitConfig {
  maxSessions: number;
  periodDays: number;
}

export const sessionLimitService = {
  // Obtener configuración (puede venir de settings en el futuro)
  getConfig(): SessionLimitConfig {
    const saved = localStorage.getItem('maestro-session-limit-config');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing session limit config:', e);
      }
    }
    return {
      maxSessions: DEFAULT_LIMIT,
      periodDays: DEFAULT_PERIOD_DAYS
    };
  },

  // Guardar configuración
  saveConfig(config: SessionLimitConfig): void {
    localStorage.setItem('maestro-session-limit-config', JSON.stringify(config));
  },

  // Obtener uso actual
  getUsage(): SessionUsage[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Error loading session usage:', e);
    }
    return [];
  },

  // Guardar uso
  saveUsage(usage: SessionUsage[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(usage));
  },

  // Limpiar uso antiguo (más allá del período)
  cleanOldUsage(periodDays: number): void {
    const usage = this.getUsage();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - periodDays);
    const cutoffDateStr = cutoffDate.toISOString().split('T')[0];

    const cleaned = usage.filter(u => u.date >= cutoffDateStr);
    this.saveUsage(cleaned);
  },

  // Obtener uso en el período actual
  getCurrentPeriodUsage(periodDays: number): SessionUsage[] {
    this.cleanOldUsage(periodDays);
    const usage = this.getUsage();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - periodDays);
    const cutoffDateStr = cutoffDate.toISOString().split('T')[0];

    return usage.filter(u => u.date >= cutoffDateStr);
  },

  // Contar sesiones en el período
  getSessionCount(periodDays: number): number {
    const periodUsage = this.getCurrentPeriodUsage(periodDays);
    return periodUsage.reduce((total, day) => total + day.count, 0);
  },

  // Verificar si puede iniciar una nueva sesión
  canStartSession(): { allowed: boolean; remaining: number; resetDate: Date | null } {
    const config = this.getConfig();
    const currentCount = this.getSessionCount(config.periodDays);
    const remaining = Math.max(0, config.maxSessions - currentCount);
    const allowed = remaining > 0;

    // Calcular fecha de reset (próxima fecha cuando expire la sesión más antigua)
    let resetDate: Date | null = null;
    if (!allowed) {
      const periodUsage = this.getCurrentPeriodUsage(config.periodDays);
      if (periodUsage.length > 0) {
        // Encontrar la sesión más antigua
        const oldestSession = periodUsage
          .flatMap(day => day.sessions.map(s => ({ ...s, date: day.date })))
          .sort((a, b) => a.timestamp - b.timestamp)[0];

        if (oldestSession) {
          const oldestDate = new Date(oldestSession.date);
          resetDate = new Date(oldestDate);
          resetDate.setDate(resetDate.getDate() + config.periodDays);
        }
      }
    }

    return { allowed, remaining, resetDate };
  },

  // Registrar inicio de sesión
  startSession(): boolean {
    const { allowed } = this.canStartSession();
    if (!allowed) {
      return false;
    }

    const today = new Date().toISOString().split('T')[0];
    const usage = this.getUsage();
    
    // Buscar o crear entrada para hoy
    let todayUsage = usage.find(u => u.date === today);
    if (!todayUsage) {
      todayUsage = { date: today, count: 0, sessions: [] };
      usage.push(todayUsage);
    }

    // Agregar sesión
    todayUsage.count++;
    todayUsage.sessions.push({
      timestamp: Date.now(),
      duration: 0 // Se actualizará al terminar
    });

    // Ordenar por fecha
    usage.sort((a, b) => a.date.localeCompare(b.date));
    this.saveUsage(usage);

    return true;
  },

  // Finalizar sesión y registrar duración
  endSession(durationSeconds: number): void {
    const today = new Date().toISOString().split('T')[0];
    const usage = this.getUsage();
    const todayUsage = usage.find(u => u.date === today);

    if (todayUsage && todayUsage.sessions.length > 0) {
      // Actualizar la última sesión
      const lastSession = todayUsage.sessions[todayUsage.sessions.length - 1];
      if (lastSession.duration === 0) {
        lastSession.duration = durationSeconds;
        this.saveUsage(usage);
      }
    }
  },

  // Obtener estadísticas
  getStats(periodDays: number): {
    totalSessions: number;
    totalDuration: number; // en minutos
    averageDuration: number; // en minutos
    sessionsByDay: Array<{ date: string; count: number }>;
  } {
    const periodUsage = this.getCurrentPeriodUsage(periodDays);
    const totalSessions = periodUsage.reduce((sum, day) => sum + day.count, 0);
    const totalDuration = periodUsage.reduce(
      (sum, day) => sum + day.sessions.reduce((s, sess) => s + sess.duration, 0),
      0
    ) / 60; // convertir a minutos
    const averageDuration = totalSessions > 0 ? totalDuration / totalSessions : 0;

    const sessionsByDay = periodUsage.map(day => ({
      date: day.date,
      count: day.count
    }));

    return {
      totalSessions,
      totalDuration: Math.round(totalDuration * 10) / 10,
      averageDuration: Math.round(averageDuration * 10) / 10,
      sessionsByDay
    };
  }
};

