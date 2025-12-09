
import React from 'react';
import { BookOpen, MessageSquare, Save, HelpCircle, X, Activity, Mic, FileText, GraduationCap } from 'lucide-react';
import { ViewState } from '../types';
import { DayNumber, DAY_CONFIGS } from '../services/knowledgeBaseService';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  selectedDay: DayNumber;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  currentView,
  onChangeView,
  selectedDay
}) => {
  const dayConfig = DAY_CONFIGS[selectedDay];

  const menuItems: Array<{
    id: ViewState;
    label: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    highlight?: boolean;
    badge?: string;
  }> = [
    { id: 'live' as ViewState, label: 'Modo de Voz (En Vivo)', icon: Mic, highlight: true },
    { id: 'overview' as ViewState, label: 'Resumen del Día', icon: FileText },
    { id: 'topics' as ViewState, label: 'Temas del Seminario', icon: BookOpen },
    { id: 'chat' as ViewState, label: 'Chat con Maestro', icon: MessageSquare },
    { id: 'exercises' as ViewState, label: 'Ejercicios Prácticos', icon: Activity },
    { id: 'saved' as ViewState, label: 'Conversaciones', icon: Save },
    { id: 'about' as ViewState, label: 'Cómo usar', icon: HelpCircle },
  ];

  const handleNavigation = (view: ViewState) => {
    onChangeView(view);
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Panel - Claude style */}
      <div
        className={`fixed top-0 left-0 h-full bg-white dark:bg-[#1a1a1a] w-64 transform transition-transform duration-300 ease-in-out z-30 shadow-lg ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:static md:h-auto md:shrink-0 flex flex-col border-r border-gray-200 dark:border-[#2a2a2a]`}
      >
        <div className="p-4 flex justify-between items-center border-b border-gray-200 dark:border-[#2a2a2a]">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-[#ea580c] rounded-md flex items-center justify-center">
              <GraduationCap size={18} className="text-white" />
            </div>
            <h2 className="font-semibold text-base text-gray-900 dark:text-[#e8e8e8]">Navegación</h2>
          </div>
          <button onClick={onClose} className="md:hidden p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#2a2a2a] transition-colors">
            <X size={20} className="text-gray-700 dark:text-[#e8e8e8]" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-2 px-3">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleNavigation(item.id)}
                  className={`w-full flex items-center px-3 py-2 rounded-lg transition-all group ${
                    currentView === item.id
                      ? 'bg-gray-100 dark:bg-[#2a2a2a] text-gray-900 dark:text-[#e8e8e8]'
                      : 'text-gray-700 dark:text-[#b4b4b4] hover:bg-gray-50 dark:hover:bg-[#2a2a2a]'
                  }`}
                >
                  <item.icon
                    size={18}
                    className={`mr-3 transition-colors ${
                      currentView === item.id
                        ? 'text-gray-900 dark:text-[#e8e8e8]'
                        : 'text-gray-500 dark:text-[#737373] group-hover:text-gray-700 dark:group-hover:text-[#b4b4b4]'
                    }`}
                  />
                  <span className={`text-sm transition-colors flex-1 text-left ${
                    currentView === item.id
                      ? 'font-medium'
                      : 'font-normal'
                  }`}>
                    {item.label}
                  </span>
                  {item.badge && (
                    <span className={`px-2 py-0.5 rounded-md text-xs font-semibold ${
                      parseInt(item.badge.split('/')[0]) === 0
                        ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                        : parseInt(item.badge.split('/')[0]) <= 1
                          ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                          : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-[#2a2a2a]">
          <div className="bg-gray-50 dark:bg-[#212121] rounded-lg p-3 border border-gray-200 dark:border-[#3a3a3a]">
            <p className="text-xs text-gray-500 dark:text-[#737373] mb-1">Día actual</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-[#e8e8e8]">
              {dayConfig.name}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
