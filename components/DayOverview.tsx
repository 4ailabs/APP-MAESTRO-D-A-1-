import React from 'react';
import { ArrowRight, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { DayNumber, DAY_CONFIGS } from '../services/knowledgeBaseService';

interface DayOverviewProps {
  selectedDay: DayNumber;
  onStartLearning: () => void;
  onChangeDay?: (day: DayNumber) => void;
}

const DayOverview: React.FC<DayOverviewProps> = ({ selectedDay, onStartLearning, onChangeDay }) => {
  const dayConfig = DAY_CONFIGS[selectedDay];

  const canGoPrevious = selectedDay > 1;
  const canGoNext = selectedDay < 3;

  // Contenido específico por día
  const getOverviewContent = () => {
    switch (selectedDay) {
      case 1:
        return {
          keyConcepts: [
            'Teoría Polivagal - Los 3 estados del sistema nervioso',
            'Ventana de Tolerancia - Tu rango óptimo de activación',
            'Las 4 Palancas del Estado - Fisiología, Enfoque, Lenguaje, Imaginación',
            'Neuroplasticidad - La ciencia del cambio cerebral',
            'Recursos Personales - Anclas de seguridad'
          ],
          techniques: [
            'Respiración 4-7-8',
            'Abrazo de Mariposa',
            'Orientación 5-4-3-2-1',
            'Contacto Tranquilizador'
          ],
          objectives: [
            'Comprender cómo funciona tu sistema nervioso',
            'Identificar cuándo estás fuera de tu ventana de tolerancia',
            'Practicar técnicas de regulación inmediata',
            'Crear tu kit personal de recursos'
          ]
        };
      case 2:
        return {
          keyConcepts: [
            'TRSB - Técnica de Reprocesamiento Somato-Cognitivo Bilateral',
            'PONS - Procesamiento Ocular Neural Somático',
            'Context Engineering - Las 7 Fases del Diagnóstico',
            'Protocolo de 8 Fases para procesamiento de trauma',
            'El Mensaje Somático - Escuchar al cuerpo'
          ],
          techniques: [
            'Abrazo de Mariposa con bilateral',
            'Protocolo del Mensaje Somático',
            'Identificación de la Tríada Cognitiva',
            'Medición de NAE y VCA'
          ],
          objectives: [
            'Entender cómo se guarda el trauma en el cuerpo',
            'Aplicar técnicas de reprocesamiento seguras',
            'Realizar diagnóstico de precisión con 7 fases',
            'Integrar el nivel somático y cognitivo'
          ]
        };
      case 3:
        return {
          keyConcepts: [
            'Los 4 Protocolos de Liberación - Alpha, Beta, Gamma, Delta',
            'Las 7 Excepciones que bloquean el cambio',
            'Miracle Question - Proyección al futuro',
            'LSP Insight System - Construcción metafórica',
            'Rituales de Consolidación para 90 días'
          ],
          techniques: [
            'Protocolo Alpha - Liberación Somática',
            'Protocolo Beta - Liberación Cognitiva',
            'Protocolo Gamma - Liberación Sistémica',
            'Protocolo Delta - Liberación Existencial'
          ],
          objectives: [
            'Integrar todo lo aprendido en los días 1 y 2',
            'Identificar qué protocolo usar en cada caso',
            'Trabajar con las 7 excepciones',
            'Crear tu plan de consolidación de 90 días'
          ]
        };
    }
  };

  const content = getOverviewContent();

  return (
    <div className="h-full overflow-y-auto bg-white dark:bg-[#0f0f0f]">
      <div className="max-w-4xl mx-auto p-4 sm:p-8">
        {/* Header - Claude style: simple and clean */}
        <div className="mb-8">
          {/* Botones de navegación entre días */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-[#e8e8e8]">{dayConfig.name}</h1>
            <div className="flex space-x-2">
              {canGoPrevious && onChangeDay && (
                <button
                  onClick={() => onChangeDay((selectedDay - 1) as DayNumber)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#2a2a2a] transition-colors border border-gray-200 dark:border-[#3a3a3a]"
                  title="Día anterior"
                >
                  <ChevronLeft size={18} className="text-gray-700 dark:text-[#b4b4b4]" />
                </button>
              )}
              {canGoNext && onChangeDay && (
                <button
                  onClick={() => onChangeDay((selectedDay + 1) as DayNumber)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#2a2a2a] transition-colors border border-gray-200 dark:border-[#3a3a3a]"
                  title="Día siguiente"
                >
                  <ChevronRight size={18} className="text-gray-700 dark:text-[#b4b4b4]" />
                </button>
              )}
            </div>
          </div>
          <p className="text-lg text-gray-600 dark:text-[#b4b4b4]">Seminario de Inteligencia Energética</p>
        </div>

        {/* Objetivos de Aprendizaje */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-[#e8e8e8] mb-4">Objetivos de Aprendizaje</h2>
          <ul className="space-y-3">
            {content.objectives.map((objective, index) => (
              <li key={index} className="flex items-start space-x-3">
                <CheckCircle className="text-green-600 dark:text-green-500 flex-shrink-0 mt-0.5" size={20} />
                <span className="text-base text-gray-700 dark:text-[#d4d4d4]">{objective}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Conceptos Clave */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-[#e8e8e8] mb-4">Conceptos Clave</h2>
          <div className="space-y-2">
            {content.keyConcepts.map((concept, index) => (
              <div
                key={index}
                className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-[#1a1a1a] hover:bg-gray-100 dark:hover:bg-[#2a2a2a] transition-colors border border-gray-200 dark:border-[#3a3a3a]"
              >
                <div className="w-6 h-6 bg-[#6366f1] text-white rounded-full flex items-center justify-center flex-shrink-0 text-xs font-semibold">
                  {index + 1}
                </div>
                <span className="text-base text-gray-700 dark:text-[#d4d4d4] leading-relaxed">{concept}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Técnicas y Herramientas */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-[#e8e8e8] mb-4">Técnicas Principales</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {content.techniques.map((technique, index) => (
              <div
                key={index}
                className="p-4 rounded-lg bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#3a3a3a] hover:border-gray-300 dark:hover:border-[#4a4a4a] transition-colors"
              >
                <span className="text-base text-gray-700 dark:text-[#d4d4d4] font-medium">{technique}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA - Empezar a Aprender */}
        <div className="text-center pb-8">
          <button
            onClick={onStartLearning}
            className="bg-[#6366f1] hover:bg-[#4f46e5] text-white px-8 py-3 rounded-lg font-semibold text-base shadow-sm hover:shadow transition-all flex items-center space-x-2 mx-auto"
          >
            <span>Empezar a Aprender</span>
            <ArrowRight size={18} />
          </button>
          <p className="text-gray-500 dark:text-[#737373] text-sm mt-4">
            Inicia una conversación con el Maestro IA
          </p>
        </div>
      </div>
    </div>
  );
};

export default DayOverview;
