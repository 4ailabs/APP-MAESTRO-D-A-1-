import React from 'react';
import { BookOpen, MessageSquare, Save, HelpCircle, Settings, X, Activity, Mic } from 'lucide-react';
import { ViewState } from '../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, currentView, onChangeView }) => {
  const menuItems = [
    { id: 'live' as ViewState, label: 'Modo de Voz (En Vivo)', icon: Mic, highlight: true },
    { id: 'topics' as ViewState, label: 'Temas del Día 1', icon: BookOpen },
    { id: 'chat' as ViewState, label: 'Chat con Maestro', icon: MessageSquare },
    { id: 'exercises' as ViewState, label: 'Ejercicios Prácticos', icon: Activity },
    { id: 'saved' as ViewState, label: 'Conversaciones', icon: Save },
    { id: 'about' as ViewState, label: 'Cómo usar', icon: HelpCircle },
    // { id: 'settings' as ViewState, label: 'Configuración', icon: Settings },
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

      {/* Sidebar Panel */}
      <div 
        className={`fixed top-0 left-0 h-full bg-[#1e3a5f] text-white w-64 transform transition-transform duration-300 ease-in-out z-30 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:static md:h-auto md:shrink-0 flex flex-col`}
      >
        <div className="p-4 flex justify-between items-center border-b border-[#2c4c74]">
          <h2 className="font-bold text-xl text-[#d4a853]">Menú</h2>
          <button onClick={onClose} className="md:hidden p-1 rounded hover:bg-[#2c4c74]">
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleNavigation(item.id)}
                  className={`w-full flex items-center px-6 py-3 transition-colors ${
                    currentView === item.id 
                      ? 'bg-[#2c4c74] border-l-4 border-[#d4a853]' 
                      : 'hover:bg-[#2c4c74] border-l-4 border-transparent'
                  } ${item.highlight ? 'text-[#d4a853] font-semibold' : ''}`}
                >
                  <item.icon size={20} className={`mr-3 ${currentView === item.id || item.highlight ? 'text-[#d4a853]' : 'text-gray-300'}`} />
                  <span className={currentView === item.id ? 'font-medium text-white' : 'text-gray-200'}>
                    {item.label}
                  </span>
                  {item.highlight && (
                    <span className="ml-auto w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-[#2c4c74] text-xs text-center text-gray-400">
          <p>© Seminario de Inteligencia Energética</p>
          <p className="mt-1">Día 1: Neurobiología</p>
        </div>
      </div>
    </>
  );
};

export default Sidebar;