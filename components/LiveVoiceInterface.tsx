
import React, { useEffect, useState, useRef } from 'react';
import { Mic, PhoneOff, AlertCircle, GraduationCap } from 'lucide-react';
import { useLiveSession } from '../hooks/useLiveSession';
import { DayNumber } from '../services/knowledgeBaseService';

interface LiveVoiceInterfaceProps {
  onClose: () => void;
  onToast?: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void;
  selectedDay: DayNumber;
  systemPrompt: string;
}

const LiveVoiceInterface: React.FC<LiveVoiceInterfaceProps> = ({ onClose, onToast, selectedDay, systemPrompt }) => {
  const { connect, disconnect, isConnected, isError, analyser } = useLiveSession(systemPrompt);
  const [duration, setDuration] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    // Conectar automáticamente al montar
    connect();

    return () => {
      disconnect();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []); // Run once on mount

  useEffect(() => {
    let interval: any;
    if (isConnected) {
      interval = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isConnected]);

  // Analizar nivel de audio
  useEffect(() => {
    if (!isConnected || !analyser) {
      setAudioLevel(0);
      setIsSpeaking(false);
      return;
    }

    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    const threshold = 30; // Umbral para detectar si está hablando

    const updateAudioLevel = () => {
      analyser.getByteFrequencyData(dataArray);
      
      // Calcular nivel promedio
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i];
      }
      const average = sum / dataArray.length;
      const normalizedLevel = Math.min(average / 100, 1); // Normalizar a 0-1
      
      setAudioLevel(normalizedLevel);
      setIsSpeaking(average > threshold);

      animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
    };

    updateAudioLevel();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isConnected, analyser]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col h-full bg-[#0f172a] text-white relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1e3a5f] to-[#0f172a] opacity-50"></div>
      
      {/* Header */}
      <div className="relative z-10 p-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold flex items-center">
            <Mic size={24} className="mr-2" /> Sesión de Voz
          </h2>
          <div className="bg-white/10 px-3 py-1 rounded-full text-sm font-mono">
            {isConnected ? formatTime(duration) : 'Conectando...'}
          </div>
        </div>
      </div>

      {/* Main Visualizer Area */}
      <div className="flex-1 relative z-10 flex flex-col items-center justify-center p-8">
        
        {isError ? (
          <div className="text-center p-8 bg-red-500/10 rounded-2xl border border-red-500/20 max-w-md">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Error de Conexión</h3>
            <p className="text-gray-300 mb-6">No pudimos establecer conexión con el Maestro. Por favor verifica tu micrófono y conexión.</p>
            <button 
              onClick={onClose}
              className="bg-white text-red-900 px-6 py-2 rounded-full font-bold hover:bg-gray-100 transition-colors"
            >
              Volver
            </button>
          </div>
        ) : (
          <div className="relative">
            {/* Pulsing Orb */}
            <div className={`w-48 h-48 rounded-full flex items-center justify-center transition-all duration-500 ${
              isConnected ? 'bg-[#d4a853] shadow-[0_0_50px_rgba(212,168,83,0.4)] animate-pulse' : 'bg-gray-600'
            }`}>
              <div className="flex items-center justify-center">
                {isConnected ? (
                  <GraduationCap size={80} className="text-white" />
                ) : (
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Connection Ripples */}
            {isConnected && (
              <>
                <div className="absolute inset-0 rounded-full border border-[#d4a853]/30 scale-125 animate-ping opacity-20"></div>
                <div className="absolute inset-0 rounded-full border border-[#d4a853]/20 scale-150 animate-ping opacity-10" style={{ animationDelay: '0.5s' }}></div>
              </>
            )}

            <div className="mt-12 text-center space-y-2">
              <h3 className="text-2xl font-bold text-white">
                Maestro IA
              </h3>
              <p className="text-blue-200">
                {isConnected ? (isSpeaking ? 'Escuchando...' : 'Esperando...') : 'Estableciendo conexión segura...'}
              </p>
              
              {/* Audio Level Indicator */}
              {isConnected && (
                <div className="mt-6 flex items-center justify-center space-x-1">
                  {Array.from({ length: 20 }).map((_, i) => {
                    const barHeight = audioLevel * 20;
                    const isActive = i < barHeight;
                    return (
                      <div
                        key={i}
                        className={`w-1.5 rounded-full transition-all duration-75 ${
                          isActive 
                            ? isSpeaking 
                              ? 'bg-[#d4a853] h-8' 
                              : 'bg-blue-400 h-4'
                            : 'bg-gray-600 h-2'
                        }`}
                        style={{
                          height: isActive 
                            ? isSpeaking 
                              ? `${8 + Math.random() * 8}px` 
                              : '16px'
                            : '8px'
                        }}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="relative z-10 p-8 pb-12 flex justify-center">
        <button
          onClick={onClose}
          className="bg-red-500 hover:bg-red-600 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95"
          title="Terminar llamada"
        >
          <PhoneOff size={32} />
        </button>
      </div>
    </div>
  );
};

export default LiveVoiceInterface;
