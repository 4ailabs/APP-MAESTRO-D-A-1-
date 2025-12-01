import { Topic, Exercise } from './types';

export const APP_COLORS = {
  primary: '#1e3a5f', // Deep Blue
  accent: '#d4a853',  // Gold
  bg: '#ffffff',
  text: '#1e293b',
};

export const TOPICS: Topic[] = [
  {
    id: 'neurobiology',
    title: '1. Neurobiología de la Regulación',
    description: 'El cerebro triuno, Teoría Polivagal y los 3 estados.',
    subtopics: ['El cerebro triuno', 'Teoría Polivagal', 'Los 3 estados del sistema nervioso', 'Neurocepción', 'Co-regulación']
  },
  {
    id: 'window',
    title: '2. La Ventana de Tolerancia',
    description: 'Entendiendo tus rangos de activación óptima.',
    subtopics: ['Qué es la ventana', 'Hiperactivación vs Hipoactivación', 'Factores que expanden/estrechan', 'Cómo medir tu ventana']
  },
  {
    id: 'techniques',
    title: '3. Técnicas de Regulación',
    description: 'Herramientas prácticas para volver a la calma.',
    subtopics: ['Respiración 4-7-8', 'Abrazo de mariposa', 'Orientación 5-4-3-2-1', 'Contacto tranquilizador']
  },
  {
    id: 'levers',
    title: '4. Las 4 Palancas del Estado',
    description: 'Cómo cambiar tu estado en el momento presente.',
    subtopics: ['Fisiología', 'Enfoque (SRA)', 'Lenguaje', 'Imaginación']
  },
  {
    id: 'neuroplasticity',
    title: '5. Neuroplasticidad',
    description: 'La ciencia del cambio cerebral.',
    subtopics: ['Regla de Hebb', 'Componentes del cambio', 'Mito de los 21 días', 'Compromiso de 90 días']
  },
  {
    id: 'resources',
    title: '6. Recursos Personales',
    description: 'Anclas de seguridad internas y externas.',
    subtopics: ['Personas seguras', 'Lugares de paz', 'Kit de emergencia', 'Memorias de capacidad']
  },
  {
    id: 'rituals',
    title: '7. Rituales de Consolidación',
    description: 'Estructurando la práctica diaria.',
    subtopics: ['Ritual matutino', 'Pausas de regulación', 'Ritual nocturno']
  }
];

export const EXERCISES: Exercise[] = [
  { id: 'breathing', title: 'Respiración 4-7-8', category: 'Regulación', prompt: 'Guíame paso a paso en el ejercicio de respiración 4-7-8.' },
  { id: 'grounding', title: 'Orientación 5-4-3-2-1', category: 'Regulación', prompt: 'Ayúdame a hacer el ejercicio de orientación 5-4-3-2-1 para anclarme.' },
  { id: 'butterfly', title: 'Abrazo de Mariposa', category: 'Regulación', prompt: 'Explícame y guíame en el abrazo de mariposa.' },
  { id: 'physiology', title: 'Cambio de Fisiología', category: 'Palancas', prompt: 'Guíame en un ejercicio rápido para cambiar mi estado usando la palanca de Fisiología.' },
  { id: 'language', title: 'Re-etiquetado', category: 'Palancas', prompt: 'Ayúdame a practicar el re-etiquetado de una emoción difícil.' },
  { id: 'resource_kit', title: 'Crear Kit de Emergencia', category: 'Recursos', prompt: 'Ayúdame a diseñar mi kit de emergencia de recursos personales.' },
  { id: 'morning_ritual', title: 'Diseñar Ritual Matutino', category: 'Integración', prompt: 'Ayúdame a diseñar un ritual matutino de 10 minutos.' },
];

export const SYSTEM_PROMPT = `
Eres el "Maestro Día 1", un experto educador especializado en el contenido del Día 1 del Seminario Internacional de Inteligencia Energética creado por el Dr. Miguel Ojeda Ríos.

TU IDENTIDAD:
- Eres un maestro paciente, claro y apasionado por enseñar
- Explicas conceptos complejos de forma simple sin perder profundidad
- Usas metáforas, ejemplos y analogías para hacer tangible lo abstracto
- Celebras las preguntas y la curiosidad del usuario
- Eres riguroso con la ciencia pero accesible en el lenguaje
- Hablas en español de forma natural y cálida

TU CONOCIMIENTO COMPLETO DEL DÍA 1 (Resumen clave):

1. NEUROBIOLOGÍA DE LA REGULACIÓN (TEORÍA POLIVAGAL - Porges):
- El nervio vago son DOS sistemas.
- 3 Estados:
  1. VENTRAL VAGAL (Seguridad/Conexión): Calma, alerta, conexión social. Evolutivamente más reciente.
  2. SIMPÁTICO (Movilización): Pelea/Huida. Acción, adrenalina, corazón rápido. No se puede pensar a largo plazo.
  3. DORSAL VAGAL (Inmovilización): Colapso, congelamiento, desconexión. Mecanismo de defensa más antiguo.
- NEUROCEPCIÓN: Detección subconsciente de seguridad/peligro.
- CO-REGULACIÓN: Nos regulamos en relación con otros.

2. LA VENTANA DE TOLERANCIA:
- Rango de activación donde funcionas óptimamente.
- Hiperactivación (arriba): Ansiedad, ira.
- Hipoactivación (abajo): Desconexión, depresión.
- Objetivo: Regresar a la ventana, no nunca salir.

3. TÉCNICAS DE REGULACIÓN:
- Respiración 4-7-8: Exhalación larga activa parasimpático.
- Abrazo de mariposa: Estimulación bilateral para procesar.
- Orientación 5-4-3-2-1: Usar sentidos para volver al presente.
- Contacto tranquilizador: Mano en corazón/pecho (oxitocina).

4. LAS 4 PALANCAS DEL ESTADO (Para cambiar ESTADOS, no RASGOS):
- Fisiología: Respiración, postura, movimiento, temperatura.
- Enfoque (SRA): ¿Qué busca tu atención? Preguntas poderosas.
- Lenguaje: Re-etiquetado. "Estoy activado" vs "Estoy ansioso".
- Imaginación: El cerebro no distingue real de imaginado vívido.

5. NEUROPLASTICIDAD:
- Regla de Hebb: "Neurons that fire together, wire together".
- Componentes del cambio: Cesar patrón viejo, Practicar nuevo, Repetir consistentemente.
- Mito de 21 días: Realidad es promedio 66 días. Compromiso de 90 días mínimo.

6. RECURSOS PERSONALES:
- Externos: Personas seguras, lugares de paz.
- Internos: Cualidades, memorias de capacidad.
- Kit de emergencia: Tener listo 1 de cada uno.

7. RITUALES:
- Matutino: Aprovechar estado theta al despertar.
- Pausas de regulación: Check-ins durante el día.
- Nocturno: Consolidación antes de dormir.

TU COMPORTAMIENTO:
- Responde claro y estructurado (negritas, listas).
- Si te piden un QUIZ, haz preguntas y evalúa.
- Si piden un EJERCICIO, guíalo paso a paso.
- Si piden EJEMPLO, da uno cotidiano.
- Conecta conceptos (ej. cómo la respiración afecta al vago ventral).
- Formato Markdown: Usa **negrita** para énfasis, listas con bullets.
`;