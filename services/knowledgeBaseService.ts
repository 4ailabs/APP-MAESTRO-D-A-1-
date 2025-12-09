// Servicio para cargar y gestionar las bases de conocimiento de cada día

export type DayNumber = 1 | 2 | 3;

export interface DayConfig {
  number: DayNumber;
  name: string;
  title: string;
  description: string;
  colors: {
    primary: string;      // Color principal
    secondary: string;    // Color secundario
    gradient: string;     // Gradiente de fondo
    badge: string;        // Color del badge
    badgeText: string;    // Color del texto del badge
  };
}

export const DAY_CONFIGS: Record<DayNumber, DayConfig> = {
  1: {
    number: 1,
    name: 'Día 1',
    title: 'ESTABILIZACIÓN',
    description: 'Neurobiología y Regulación',
    colors: {
      primary: '#3b82f6',      // Azul
      secondary: '#60a5fa',
      gradient: 'from-blue-500 to-cyan-500',
      badge: 'bg-blue-500',
      badgeText: 'text-white'
    }
  },
  2: {
    number: 2,
    name: 'Día 2',
    title: 'TRANSFORMACIÓN',
    description: 'Trabajo Profundo de Raíz',
    colors: {
      primary: '#f59e0b',      // Ámbar/Naranja
      secondary: '#fbbf24',
      gradient: 'from-orange-500 to-amber-500',
      badge: 'bg-orange-500',
      badgeText: 'text-white'
    }
  },
  3: {
    number: 3,
    name: 'Día 3',
    title: 'INTEGRACIÓN',
    description: 'Protocolos, Excepciones y Consolidación',
    colors: {
      primary: '#8b5cf6',      // Violeta
      secondary: '#a78bfa',
      gradient: 'from-purple-500 to-violet-500',
      badge: 'bg-purple-500',
      badgeText: 'text-white'
    }
  }
};

// Cache para los prompts cargados
const promptCache: Record<DayNumber, string | null> = {
  1: null,
  2: null,
  3: null
};

// Función para cargar el contenido completo desde los archivos
export const loadKnowledgeBase = async (day: DayNumber): Promise<string> => {
  // Si ya está en cache, retornarlo
  if (promptCache[day]) {
    return promptCache[day]!;
  }

  try {
    // Intentar cargar desde el servidor (en producción)
    const response = await fetch(`/knowledge-base/dia-${day}.md`);
    if (response.ok) {
      const content = await response.text();
      promptCache[day] = content;
      return content;
    }
  } catch (error) {
    console.warn(`No se pudo cargar knowledge-base/dia-${day}.md desde el servidor`);
  }

  // Si falla el fetch, usar prompt básico como fallback
  console.warn(`No se pudo cargar knowledge-base/dia-${day}.md, usando prompt básico`);
  return getBasicPrompt(day);
};

// Prompt básico como fallback
const getBasicPrompt = (day: DayNumber): string => {
  const config = DAY_CONFIGS[day];
  return `Eres el "Maestro ${config.name}", un experto educador especializado en el contenido del ${config.name} del Seminario Internacional de Inteligencia Energética creado por el Dr. Miguel Ojeda Ríos.

El ${config.name} es el día de **${config.title}** — ${config.description}.

Por favor, utiliza tu conocimiento completo del ${config.name} para guiar al participante de manera clara, estructurada y compasiva.`;
};

// Obtener el system prompt para un día específico
// Para Día 1, retorna string vacío (se usa SYSTEM_PROMPT_DAY1 de constants.ts)
// Para Día 2 y 3, carga el archivo completo
export const getSystemPromptForDay = async (day: DayNumber): Promise<string> => {
  if (day === 1) {
    // Día 1 se maneja en constants.ts
    return '';
  }
  return await loadKnowledgeBase(day);
};

