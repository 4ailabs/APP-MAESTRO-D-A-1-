
import React, { useState, useEffect } from 'react';
import { Menu, GraduationCap, Moon, Sun } from 'lucide-react';
import Sidebar from './components/Sidebar';
import { useTheme } from './contexts/ThemeContext';
import ChatInterface from './components/ChatInterface';
import TopicList from './components/TopicList';
import ExerciseList from './components/ExerciseList';
import LiveVoiceInterface from './components/LiveVoiceInterface';
import SavedConversations from './components/SavedConversations';
import ToastContainer from './components/ToastContainer';
import DayOverview from './components/DayOverview';
import { Message, ViewState } from './types';
import { sendMessageToMaestro, GeminiError } from './services/geminiService';
import { storageService } from './services/storageService';
import { useToast } from './hooks/useToast';
import {
  TOPICS_DAY1,
  EXERCISES_DAY1,
  TOPICS_DAY2,
  EXERCISES_DAY2,
  TOPICS_DAY3,
  EXERCISES_DAY3,
  SYSTEM_PROMPT_DAY1
} from './constants';
import { DayNumber, getSystemPromptForDay } from './services/knowledgeBaseService';
import DaySelector from './components/DaySelector';

const App: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState<ViewState>('overview');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDay, setSelectedDay] = useState<DayNumber>(1);
  const [systemPrompt, setSystemPrompt] = useState<string>(SYSTEM_PROMPT_DAY1);
  const toast = useToast();

  // Cargar el prompt del día seleccionado
  useEffect(() => {
    const loadPrompt = async () => {
      if (selectedDay === 1) {
        setSystemPrompt(SYSTEM_PROMPT_DAY1);
      } else {
        try {
          const prompt = await getSystemPromptForDay(selectedDay);
          if (prompt) {
            setSystemPrompt(prompt);
          }
        } catch (error) {
          console.error('Error cargando prompt del día:', error);
          toast.error('Error al cargar la base de conocimiento del día seleccionado');
        }
      }
    };
    loadPrompt();
  }, [selectedDay]);

  // Cargar conversación guardada al iniciar
  useEffect(() => {
    const savedMessages = storageService.loadCurrentSession();
    if (savedMessages.length > 0) {
      setMessages(savedMessages);
    }
  }, []);

  // Guardar mensajes automáticamente
  useEffect(() => {
    if (messages.length > 0) {
      storageService.saveCurrentSession(messages);
    }
  }, [messages]);

  const handleSendMessage = async (text: string) => {
    // Validación de entrada
    const trimmedText = text.trim();
    if (!trimmedText) {
      toast.warning('Por favor escribe un mensaje');
      return;
    }

    if (trimmedText.length > 4000) {
      toast.error('El mensaje es demasiado largo. Máximo 4000 caracteres.');
      return;
    }

    // Optimistic UI update
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: trimmedText,
      timestamp: Date.now()
    };
    
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const responseText = await sendMessageToMaestro(trimmedText, messages, systemPrompt);
      
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: Date.now()
      };
      
      setMessages(prev => [...prev, aiMsg]);
    } catch (error: any) {
      console.error("Error in chat loop", error);
      
      // Mostrar mensaje de error específico
      if (error instanceof Error && error.name === 'GeminiError') {
        const geminiError = error as any;
        let errorMessage = error.message;
        let suggestion = '';

        switch (geminiError.type) {
          case 'api_key':
            errorMessage = 'Error de autenticación';
            suggestion = 'Verifica tu API Key en la configuración';
            break;
          case 'rate_limit':
            errorMessage = 'Límite de solicitudes excedido';
            suggestion = 'Espera unos momentos antes de intentar de nuevo';
            break;
          case 'network':
            errorMessage = 'Error de conexión';
            suggestion = 'Verifica tu conexión a internet';
            break;
          case 'timeout':
            errorMessage = 'Tiempo de espera agotado';
            suggestion = 'Intenta de nuevo';
            break;
          default:
            errorMessage = 'Error al procesar tu mensaje';
            suggestion = 'Por favor intenta de nuevo';
        }

        toast.error(`${errorMessage}. ${suggestion}`, 6000);
        
        // Agregar mensaje de error al chat
        const errorMsg: Message = {
          id: Date.now().toString(),
          role: 'model',
          text: `⚠️ ${errorMessage}. ${suggestion}`,
          timestamp: Date.now()
        };
        setMessages(prev => [...prev, errorMsg]);
      } else {
        toast.error('Error inesperado. Por favor intenta de nuevo.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (text: string) => {
    if (currentView !== 'chat') {
      setCurrentView('chat');
    }
    handleSendMessage(text);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'overview':
        return (
          <DayOverview
            selectedDay={selectedDay}
            onStartLearning={() => setCurrentView('chat')}
            onChangeDay={(day) => {
              setSelectedDay(day);
              setMessages([]); // Limpiar mensajes al cambiar de día
            }}
          />
        );
      case 'live':
        return (
          <LiveVoiceInterface
            onClose={() => setCurrentView('chat')}
            selectedDay={selectedDay}
            systemPrompt={systemPrompt}
            onToast={(message, type) => {
              if (type === 'success') toast.success(message);
              else if (type === 'error') toast.error(message);
              else if (type === 'warning') toast.warning(message);
              else toast.info(message);
            }}
          />
        );
      case 'chat':
        return (
          <ChatInterface
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            onQuickAction={handleQuickAction}
            selectedDay={selectedDay}
            onSaveConversation={() => {
              const id = storageService.saveConversation(messages);
              if (id) {
                toast.success('Conversación guardada exitosamente');
              } else {
                toast.error('Error al guardar la conversación');
              }
            }}
            onToast={(message, type) => {
              if (type === 'success') toast.success(message);
              else if (type === 'error') toast.error(message);
              else if (type === 'warning') toast.warning(message);
              else toast.info(message);
            }}
            onRegenerateMessage={async (messageId) => {
              const messageIndex = messages.findIndex(m => m.id === messageId);
              if (messageIndex > 0) {
                const previousUserMessage = messages[messageIndex - 1];
                if (previousUserMessage.role === 'user') {
                  setIsLoading(true);
                  toast.info('Regenerando respuesta...');
                  try {
                    const history = messages.slice(0, messageIndex - 1);
                    const responseText = await sendMessageToMaestro(previousUserMessage.text, history, systemPrompt);
                    const newMessages = [...messages];
                    newMessages[messageIndex] = {
                      ...newMessages[messageIndex],
                      text: responseText,
                      timestamp: Date.now()
                    };
                    setMessages(newMessages);
                    toast.success('Respuesta regenerada');
                  } catch (error: any) {
                    console.error("Error regenerating message:", error);
                    if (error instanceof Error && error.name === 'GeminiError') {
                      const geminiError = error as any;
                      toast.error(`Error al regenerar: ${error.message}`);
                    } else {
                      toast.error('Error al regenerar la respuesta');
                    }
                  } finally {
                    setIsLoading(false);
                  }
                }
              }
            }}
          />
        );
      case 'topics':
        const topics = selectedDay === 1 ? TOPICS_DAY1 : selectedDay === 2 ? TOPICS_DAY2 : TOPICS_DAY3;
        return (
          <TopicList
            topics={topics}
            dayTitle="Contenido del Seminario"
            onSelectTopic={(topic) => {
              setCurrentView('chat');
              handleSendMessage(topic);
            }}
          />
        );
      case 'exercises':
        const exercises = selectedDay === 1 ? EXERCISES_DAY1 : selectedDay === 2 ? EXERCISES_DAY2 : EXERCISES_DAY3;
        return (
          <ExerciseList
            exercises={exercises}
            onSelectExercise={(prompt) => {
              setCurrentView('chat');
              handleSendMessage(prompt);
            }}
          />
        );
      case 'saved':
        return (
          <SavedConversations 
            onLoadConversation={(loadedMessages) => {
              setMessages(loadedMessages);
              setCurrentView('chat');
            }}
            onClose={() => setCurrentView('chat')}
            onToast={(message, type) => {
              if (type === 'success') toast.success(message);
              else if (type === 'error') toast.error(message);
              else if (type === 'warning') toast.warning(message);
              else toast.info(message);
            }}
          />
        );
      case 'about':
        return (
          <div className="p-8 max-w-2xl mx-auto">
             <h2 className="text-2xl font-bold text-[#1e3a5f] mb-4">Sobre Maestro Día 1</h2>
             <p className="mb-4">
               Esta aplicación te ayuda a integrar los fundamentos de la Inteligencia Energética: Neurobiología y Regulación.
             </p>
             <p className="text-sm text-gray-500 mt-8">Desarrollado para estudiantes de Inteligencia Energética.</p>
          </div>
        );
      default:
        return (
          <ChatInterface
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            onQuickAction={handleQuickAction}
            selectedDay={selectedDay}
            onSaveConversation={() => {
              const id = storageService.saveConversation(messages);
              if (id) {
                toast.success('Conversación guardada exitosamente');
              } else {
                toast.error('Error al guardar la conversación');
              }
            }}
            onToast={(message, type) => {
              if (type === 'success') toast.success(message);
              else if (type === 'error') toast.error(message);
              else if (type === 'warning') toast.warning(message);
              else toast.info(message);
            }}
            onRegenerateMessage={async (messageId) => {
              const messageIndex = messages.findIndex(m => m.id === messageId);
              if (messageIndex > 0) {
                const previousUserMessage = messages[messageIndex - 1];
                if (previousUserMessage.role === 'user') {
                  setIsLoading(true);
                  toast.info('Regenerando respuesta...');
                  try {
                    const history = messages.slice(0, messageIndex - 1);
                    const responseText = await sendMessageToMaestro(previousUserMessage.text, history, systemPrompt);
                    const newMessages = [...messages];
                    newMessages[messageIndex] = {
                      ...newMessages[messageIndex],
                      text: responseText,
                      timestamp: Date.now()
                    };
                    setMessages(newMessages);
                    toast.success('Respuesta regenerada');
                  } catch (error: any) {
                    console.error("Error regenerating message:", error);
                    if (error instanceof Error && error.name === 'GeminiError') {
                      const geminiError = error as any;
                      toast.error(`Error al regenerar: ${error.message}`);
                    } else {
                      toast.error('Error al regenerar la respuesta');
                    }
                  } finally {
                    setIsLoading(false);
                  }
                }
              }
            }}
          />
        );
    }
  };

  return (
    <div className="flex h-screen bg-white dark:bg-[#0f0f0f] overflow-hidden transition-colors">
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        currentView={currentView}
        onChangeView={(view) => {
          setCurrentView(view);
          setIsSidebarOpen(false);
        }}
        selectedDay={selectedDay}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col w-full h-full relative">
        {/* Header - Claude style: minimal and clean */}
        {currentView !== 'live' && (
          <header className="h-14 border-b border-gray-200 dark:border-[#2a2a2a] bg-white dark:bg-[#1a1a1a] flex items-center justify-between px-4 shrink-0 z-20 transition-colors">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#2a2a2a] transition-colors md:hidden"
              >
                <Menu size={20} className="text-gray-700 dark:text-gray-300" />
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-[#ea580c] rounded-md flex items-center justify-center">
                  <GraduationCap size={18} className="text-white" />
                </div>
                <div>
                  <h1 className="font-semibold text-base text-gray-900 dark:text-gray-100">
                    Maestro IA
                  </h1>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#2a2a2a] transition-colors"
                title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
              >
                {theme === 'dark' ? (
                  <Sun size={18} className="text-gray-300" />
                ) : (
                  <Moon size={18} className="text-gray-700" />
                )}
              </button>
              <DaySelector
                selectedDay={selectedDay}
                onDayChange={(day) => {
                  setSelectedDay(day);
                  setMessages([]);
                  setCurrentView('overview');
                }}
              />
            </div>
          </header>
        )}

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto relative">
          {renderContent()}
        </main>
      </div>
      
      {/* Toast Container */}
      <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />
    </div>
  );
};

export default App;
