import React from 'react';
import { TOPICS } from '../constants';
import { ChevronRight, Book } from 'lucide-react';

interface TopicListProps {
  onSelectTopic: (topic: string) => void;
}

const TopicList: React.FC<TopicListProps> = ({ onSelectTopic }) => {
  return (
    <div className="max-w-3xl mx-auto p-4 pb-20">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-[#1e3a5f] mb-2">Contenido del Día 1</h2>
        <p className="text-gray-600">Explora los módulos fundamentales de la Inteligencia Energética.</p>
      </div>

      <div className="space-y-4">
        {TOPICS.map((topic) => (
          <div 
            key={topic.id}
            onClick={() => onSelectTopic(`Quiero aprender sobre: ${topic.title}`)}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
          >
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center">
                  <span className="w-10 h-10 rounded-full bg-blue-50 text-[#1e3a5f] flex items-center justify-center mr-4 font-bold text-lg group-hover:bg-[#1e3a5f] group-hover:text-white transition-colors">
                    {topic.title.split('.')[0]}
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 group-hover:text-[#1e3a5f] transition-colors">
                      {topic.title.split('. ')[1]}
                    </h3>
                    <p className="text-sm text-gray-500">{topic.description}</p>
                  </div>
                </div>
                <ChevronRight className="text-gray-300 group-hover:text-[#d4a853] transition-colors" />
              </div>
              
              <div className="ml-14 mt-3">
                <div className="flex flex-wrap gap-2">
                  {topic.subtopics.map((sub, idx) => (
                    <span key={idx} className="inline-block px-2 py-1 bg-gray-50 text-xs text-gray-600 rounded border border-gray-100">
                      {sub}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopicList;