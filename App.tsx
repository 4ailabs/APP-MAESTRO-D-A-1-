import React, { useState } from 'react';
import { Menu, Zap, Mic } from 'lucide-react';
import Sidebar from './components/Sidebar';
import ChatInterface from './components/ChatInterface';
import TopicList from './components/TopicList';
import ExerciseList from './components/ExerciseList';
import LiveVoiceInterface from './components/LiveVoiceInterface';
import { Message, ViewState } from './types';
import { sendMessageToMaestro } from './services/geminiService';

const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState<ViewState>('chat');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (text: string) => {
    // Optimistic UI update
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: text,
      timestamp: Date.now()
    };
    
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const responseText = await sendMessageToMaestro(text, messages);
      
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: Date.now()
      };
      
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error("Error in chat loop", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (text: string) => {
    // If not in chat view, switch to chat view first
    if (currentView !== 'chat') {
      setCurrentView('chat');
    }
    handleSendMessage(text);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'live':
        return <LiveVoiceInterface onClose={() => setCurrentView('chat')} />;
      case 'chat':
        return (
          <ChatInterface 
            messages={messages} 
            onSendMessage={handleSendMessage} 
            isLoading={isLoading}
            onQuickAction={handleQuickAction}
          />
        );
      case 'topics':
        return <TopicList onSelectTopic={(topic) => {
          setCurrentView('chat');
          handleSendMessage(topic);
        }} />;
      case 'exercises':
        return <ExerciseList onSelectExercise={(prompt) => {
          setCurrentView('chat');
          handleSendMessage(prompt);
        }} />;
      case 'saved':
        return <div className="p-8 text-center text-gray-500">Funcionalidad de guardado en desarrollo.</div>;
      case 'about':
        return (
          <div className="p-8 max-w-2xl mx-auto">
             <h2 className="text-2xl font-bold text-[#1e3a5f] mb-4">Sobre Maestro Día 1</h2>
             <p className="mb-4">Esta aplicación está diseñada para ayudarte a integrar y profundizar el conocimiento del primer día del seminario.</p>
             <p className="mb-4">Usa el chat para hacer preguntas libres o el menú para navegar temas específicos.</p>
             <p className="text-sm text-gray-500 mt-8">Desarrollado para estudiantes de Inteligencia Energética.</p>
          </div>
        );
      default:
        return <ChatInterface messages={messages} onSendMessage={handleSendMessage} isLoading={isLoading} onQuickAction={handleQuickAction} />;
    }
  };

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Sidebar */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        currentView={currentView}
        onChangeView={(view) => {
          setCurrentView(view);
          setIsSidebarOpen(false); // Close on mobile selection
        }}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col w-full h-full relative">
        {/* Header - Hide in Live mode to give full screen experience */}
        {currentView !== 'live' && (
          <header className="h-16 bg-[#1e3a5f] text-white flex items-center justify-between px-4 shadow-md shrink-0 z-20">
            <div className="flex items-center">
              <button 
                onClick={() => setIsSidebarOpen(true)} 
                className="p-2 mr-2 rounded hover:bg-[#2c4c74] focus:outline-none md:hidden"
              >
                <Menu size={24} />
              </button>
              <div>
                <h1 className="font-bold text-lg flex items-center">
                  <span className="text-xl mr-2">🎓</span> Maestro Día 1
                </h1>
                <p className="text-[10px] text-[#d4a853] uppercase tracking-wider hidden sm:block">Inteligencia Energética</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
               <button 
                onClick={() => setCurrentView('live')}
                className="flex items-center bg-[#d4a853] text-[#1e3a5f] px-3 py-1.5 rounded-full text-sm font-bold shadow-sm hover:bg-yellow-400 transition-colors animate-pulse-slow"
               >
                 <Mic size={16} className="mr-1" /> En Vivo
               </button>
            </div>
          </header>
        )}

        {/* Content Area */}
        <main className="flex-1 overflow-hidden relative">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;