
import React from 'react';
import { Topic } from '../types';
import { ChevronRight } from 'lucide-react';

interface TopicListProps {
  onSelectTopic: (topic: string) => void;
  topics: Topic[];
  dayTitle: string;
}

const TopicList: React.FC<TopicListProps> = ({ onSelectTopic, topics, dayTitle }) => {
  return (
    <div className="max-w-3xl mx-auto p-4 pb-20 bg-white dark:bg-[#0f0f0f] min-h-screen">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-[#e8e8e8] mb-2">{dayTitle}</h2>
        <p className="text-gray-600 dark:text-[#b4b4b4]">Explora los módulos fundamentales del seminario.</p>
      </div>

      <div className="space-y-4">
        {topics.map((topic) => (
          <div
            key={topic.id}
            onClick={() => onSelectTopic(`Quiero aprender sobre: ${topic.title}`)}
            className="bg-white dark:bg-[#1a1a1a] rounded-xl shadow-sm border border-gray-200 dark:border-[#3a3a3a] overflow-hidden hover:shadow-md hover:border-[#6366f1] dark:hover:border-[#6366f1] transition-all cursor-pointer group"
          >
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center">
                  <span className="w-10 h-10 rounded-full bg-blue-50 dark:bg-[#2a2a2a] text-[#6366f1] dark:text-[#6366f1] flex items-center justify-center mr-4 font-bold text-lg group-hover:bg-[#6366f1] group-hover:text-white transition-colors">
                    {topic.title.split('.')[0]}
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-[#e8e8e8] group-hover:text-[#6366f1] dark:group-hover:text-[#6366f1] transition-colors">
                      {topic.title.split('. ')[1] || topic.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-[#737373]">{topic.description}</p>
                  </div>
                </div>
                <ChevronRight className="text-gray-300 dark:text-[#737373] group-hover:text-[#6366f1] dark:group-hover:text-[#6366f1] transition-colors" />
              </div>

              <div className="ml-14 mt-3">
                <div className="flex flex-wrap gap-2">
                  {topic.subtopics.map((sub, idx) => (
                    <span key={idx} className="inline-block px-2 py-1 bg-gray-50 dark:bg-[#2a2a2a] text-xs text-gray-600 dark:text-[#b4b4b4] rounded border border-gray-100 dark:border-[#3a3a3a]">
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
