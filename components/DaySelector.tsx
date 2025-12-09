import React from 'react';
import { ChevronDown } from 'lucide-react';
import { DayNumber, DAY_CONFIGS } from '../services/knowledgeBaseService';

interface DaySelectorProps {
  selectedDay: DayNumber;
  onDayChange: (day: DayNumber) => void;
}

const DaySelector: React.FC<DaySelectorProps> = ({ selectedDay, onDayChange }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const config = DAY_CONFIGS[selectedDay];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-1.5 bg-white dark:bg-[#212121] hover:bg-gray-50 dark:hover:bg-[#2a2a2a] border border-gray-300 dark:border-[#3a3a3a] hover:border-gray-400 dark:hover:border-[#4a4a4a] rounded-lg transition-all text-sm font-medium text-gray-700 dark:text-[#e8e8e8]"
      >
        <span>{config.name}</span>
        <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''} text-gray-700 dark:text-[#b4b4b4]`} />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full right-0 mt-2 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#3a3a3a] rounded-lg shadow-lg z-20 min-w-[140px] overflow-hidden">
            {([1, 2, 3] as DayNumber[]).map((day) => {
              const dayConfig = DAY_CONFIGS[day];
              return (
                <button
                  key={day}
                  onClick={() => {
                    onDayChange(day);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 transition-all text-sm ${
                    selectedDay === day
                      ? 'bg-gray-100 dark:bg-[#2a2a2a] text-gray-900 dark:text-[#e8e8e8] font-medium'
                      : 'text-gray-600 dark:text-[#b4b4b4] hover:bg-gray-50 dark:hover:bg-[#212121]'
                  }`}
                >
                  {dayConfig.name}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default DaySelector;

