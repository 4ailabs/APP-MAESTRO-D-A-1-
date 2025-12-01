import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Mic, Sparkles, BookOpen, Zap } from 'lucide-react';
import { Message } from '../types';
import FormattedText from './FormattedText';

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  onQuickAction: (action: string) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, onSendMessage, isLoading, onQuickAction }) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim() && !isLoading) {
      onSendMessage(inputText);
      setInputText('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  // Welcome Screen if no messages
  if (messages.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center overflow-y-auto">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 max-w-2xl w-full">
          <div className="w-20 h-20 bg-[#1e3a5f] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <span className="text-4xl">🎓</span>
          </div>
          <h1 className="text-3xl font-bold text-[#1e3a5f] mb-4">MAESTRO DÍA 1</h1>
          <p className="text-gray-600 mb-8 text-lg leading-relaxed">
            Soy tu guía para profundizar en todo lo que aprendiste en el Día 1 del seminario.
            Pregúntame sobre la <strong>Teoría Polivagal</strong>, la <strong>Ventana de Tolerancia</strong>, o pídeme un <strong>ejercicio práctico</strong>.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
            <button onClick={() => onQuickAction("Explícame la teoría polivagal")} className="p-4 rounded-xl border border-gray-200 hover:border-[#d4a853] hover:bg-yellow-50 transition-colors">
              <span className="block font-bold text-[#1e3a5f] mb-1">📚 Conceptos</span>
              <span className="text-sm text-gray-500">"Explícame la teoría polivagal"</span>
            </button>
            <button onClick={() => onQuickAction("Guíame en la respiración 4-7-8")} className="p-4 rounded-xl border border-gray-200 hover:border-[#d4a853] hover:bg-yellow-50 transition-colors">
              <span className="block font-bold text-[#1e3a5f] mb-1">🧘‍♂️ Práctica</span>
              <span className="text-sm text-gray-500">"Guíame en la respiración 4-7-8"</span>
            </button>
            <button onClick={() => onQuickAction("¿Qué son las 4 palancas?")} className="p-4 rounded-xl border border-gray-200 hover:border-[#d4a853] hover:bg-yellow-50 transition-colors">
              <span className="block font-bold text-[#1e3a5f] mb-1">🔧 Herramientas</span>
              <span className="text-sm text-gray-500">"¿Qué son las 4 palancas?"</span>
            </button>
            <button onClick={() => onQuickAction("Hazme un quiz sobre neuroplasticidad")} className="p-4 rounded-xl border border-gray-200 hover:border-[#d4a853] hover:bg-yellow-50 transition-colors">
              <span className="block font-bold text-[#1e3a5f] mb-1">❓ Evaluación</span>
              <span className="text-sm text-gray-500">"Hazme un quiz rápido"</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-50 relative">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex max-w-[90%] sm:max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              
              {/* Avatar */}
              <div className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center mx-2 shadow-sm ${
                msg.role === 'user' ? 'bg-[#d4a853]' : 'bg-[#1e3a5f]'
              }`}>
                {msg.role === 'user' ? <User size={20} className="text-white" /> : <span className="text-xl">🎓</span>}
              </div>

              {/* Bubble */}
              <div
                className={`p-4 rounded-2xl shadow-sm text-sm sm:text-base ${
                  msg.role === 'user'
                    ? 'bg-[#1e3a5f] text-white rounded-tr-none'
                    : 'bg-white text-slate-800 border border-gray-200 rounded-tl-none'
                }`}
              >
                <FormattedText text={msg.text} />
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="flex max-w-[80%] flex-row">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#1e3a5f] flex items-center justify-center mx-2">
                <span className="text-xl">🎓</span>
              </div>
              <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-gray-200 flex items-center space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full typing-dot"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full typing-dot"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full typing-dot"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-200 sticky bottom-0 z-10">
        <div className="max-w-3xl mx-auto">
          
          {/* Action Chips */}
          <div className="flex gap-2 mb-3 overflow-x-auto pb-2 scrollbar-hide">
            <button onClick={() => onQuickAction('Hazme un quiz')} className="flex items-center px-3 py-1.5 bg-blue-50 text-[#1e3a5f] text-xs font-semibold rounded-full hover:bg-blue-100 whitespace-nowrap">
              <BookOpen size={14} className="mr-1" /> Quiz
            </button>
            <button onClick={() => onQuickAction('Profundiza más en esto')} className="flex items-center px-3 py-1.5 bg-purple-50 text-purple-700 text-xs font-semibold rounded-full hover:bg-purple-100 whitespace-nowrap">
              <Sparkles size={14} className="mr-1" /> Profundizar
            </button>
            <button onClick={() => onQuickAction('Dame un ejemplo práctico')} className="flex items-center px-3 py-1.5 bg-amber-50 text-amber-700 text-xs font-semibold rounded-full hover:bg-amber-100 whitespace-nowrap">
              <Zap size={14} className="mr-1" /> Ejemplo
            </button>
          </div>

          <div className="relative flex items-end shadow-sm border border-gray-300 rounded-xl bg-gray-50 focus-within:ring-2 focus-within:ring-[#1e3a5f] focus-within:border-transparent focus-within:bg-white transition-all">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Hazme una pregunta sobre el Día 1..."
              className="w-full p-4 pr-12 bg-transparent border-none focus:ring-0 resize-none max-h-32 min-h-[56px]"
              rows={1}
              style={{ minHeight: '56px' }}
            />
            <div className="absolute right-2 bottom-2 flex space-x-1">
              {/* Fake Mic Button for visuals */}
              <button className="p-2 text-gray-400 hover:text-[#1e3a5f] rounded-full transition-colors">
                <Mic size={20} />
              </button>
              <button 
                onClick={handleSubmit} 
                disabled={!inputText.trim() || isLoading}
                className={`p-2 rounded-full transition-all ${
                  inputText.trim() && !isLoading 
                    ? 'bg-[#1e3a5f] text-white hover:bg-[#2c4c74]' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Send size={20} />
              </button>
            </div>
          </div>
          <p className="text-center text-xs text-gray-400 mt-2">
            La IA puede cometer errores. Verifica la información importante.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;