import React from 'react';
import { EXERCISES } from '../constants';
import { PlayCircle, Zap, Heart, Brain, Anchor } from 'lucide-react';
import { Exercise } from '../types';

interface ExerciseListProps {
  onSelectExercise: (prompt: string) => void;
}

const ExerciseList: React.FC<ExerciseListProps> = ({ onSelectExercise }) => {
  
  const getIcon = (category: string) => {
    switch(category) {
      case 'Regulación': return <Heart className="text-rose-500" />;
      case 'Palancas': return <Zap className="text-amber-500" />;
      case 'Recursos': return <Anchor className="text-blue-500" />;
      default: return <Brain className="text-indigo-500" />;
    }
  };

  const categories = Array.from(new Set(EXERCISES.map(e => e.category)));

  return (
    <div className="max-w-3xl mx-auto p-4 pb-20">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-[#1e3a5f] mb-2">Ejercicios Prácticos</h2>
        <p className="text-gray-600">Herramientas guiadas para regular tu sistema nervioso.</p>
      </div>

      <div className="space-y-8">
        {categories.map((category) => (
          <div key={category}>
            <h3 className="text-lg font-bold text-gray-400 uppercase tracking-wider mb-4 border-b pb-2">
              {category}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {EXERCISES.filter(e => e.category === category).map((exercise) => (
                <button
                  key={exercise.id}
                  onClick={() => onSelectExercise(exercise.prompt)}
                  className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:border-[#d4a853] hover:shadow-md transition-all text-left flex items-start"
                >
                  <div className="p-3 bg-slate-50 rounded-lg mr-4">
                    {getIcon(exercise.category)}
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1e3a5f]">{exercise.title}</h4>
                    <p className="text-sm text-gray-500 mt-1 flex items-center">
                      <PlayCircle size={14} className="mr-1" /> Iniciar ejercicio
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