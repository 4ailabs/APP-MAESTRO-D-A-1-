
import React from 'react';
import { PlayCircle, Zap, Heart, Brain, Anchor, Activity } from 'lucide-react';
import { Exercise } from '../types';

interface ExerciseListProps {
  onSelectExercise: (prompt: string) => void;
  exercises: Exercise[];
}

const ExerciseList: React.FC<ExerciseListProps> = ({ onSelectExercise, exercises }) => {
  
  const getIcon = (category: string) => {
    switch(category) {
      case 'Regulación': return <Heart className="text-rose-500" />;
      case 'Palancas': return <Zap className="text-amber-500" />;
      case 'Recursos': return <Anchor className="text-blue-500" />;
      case 'TRSB': return <Activity className="text-purple-500" />;
      case 'PONS': return <Brain className="text-indigo-500" />;
      case 'Context': return <Zap className="text-orange-500" />;
      case 'Miracle': return <Heart className="text-pink-500" />;
      default: return <Brain className="text-indigo-500" />;
    }
  };

  const categories = Array.from(new Set(exercises.map(e => e.category)));

  return (
    <div className="max-w-3xl mx-auto p-4 pb-20 bg-white dark:bg-[#0f0f0f] min-h-screen">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-[#e8e8e8] mb-2">Ejercicios Prácticos</h2>
        <p className="text-gray-600 dark:text-[#b4b4b4]">Herramientas guiadas para la práctica personal.</p>
      </div>

      <div className="space-y-8">
        {categories.map((category) => (
          <div key={category}>
            <h3 className="text-lg font-bold text-gray-400 dark:text-[#737373] uppercase tracking-wider mb-4 border-b border-gray-200 dark:border-[#2a2a2a] pb-2">
              {category}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {exercises.filter(e => e.category === category).map((exercise) => (
                <button
                  key={exercise.id}
                  onClick={() => onSelectExercise(exercise.prompt)}
                  className="bg-white dark:bg-[#1a1a1a] p-4 rounded-xl shadow-sm border border-gray-200 dark:border-[#3a3a3a] hover:border-[#6366f1] dark:hover:border-[#6366f1] hover:shadow-md transition-all text-left flex items-start"
                >
                  <div className="p-3 bg-slate-50 dark:bg-[#2a2a2a] rounded-lg mr-4">
                    {getIcon(exercise.category)}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-[#e8e8e8]">{exercise.title}</h4>
                    <p className="text-sm text-gray-500 dark:text-[#737373] mt-1 flex items-center">
                      <PlayCircle size={14} className="mr-1" /> Iniciar práctica
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExerciseList;
