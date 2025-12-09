import React, { useState, useEffect } from 'react';
import { Trash2, Search, X, MessageSquare, Clock, FileText } from 'lucide-react';
import { ChatSession, Message } from '../types';
import { storageService } from '../services/storageService';

interface SavedConversationsProps {
  onLoadConversation: (messages: Message[]) => void;
  onClose: () => void;
  onToast?: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void;
}

const SavedConversations: React.FC<SavedConversationsProps> = ({ onLoadConversation, onClose, onToast }) => {
  const [conversations, setConversations] = useState<ChatSession[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredConversations, setFilteredConversations] = useState<ChatSession[]>([]);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const results = storageService.searchConversations(searchQuery);
      setFilteredConversations(results);
    } else {
      setFilteredConversations(conversations);
    }
  }, [searchQuery, conversations]);

  const loadConversations = () => {
    const all = storageService.getAllConversations();
    setConversations(all);
    setFilteredConversations(all);
  };

  const handleLoad = (session: ChatSession) => {
    onLoadConversation(session.messages);
    if (onToast) {
      onToast('Conversación cargada', 'success');
    }
    onClose();
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('¿Estás seguro de que quieres eliminar esta conversación?')) {
      const deleted = storageService.deleteConversation(id);
      if (deleted) {
        loadConversations();
        if (onToast) {
          onToast('Conversación eliminada', 'success');
        }
      } else {
        if (onToast) {
          onToast('Error al eliminar la conversación', 'error');
        }
      }
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return 'Hoy';
    } else if (days === 1) {
      return 'Ayer';
    } else if (days < 7) {
      return `Hace ${days} días`;
    } else {
      return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
    }
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-[#0f0f0f]">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-[#2a2a2a]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-[#e8e8e8] flex items-center">
            <MessageSquare size={24} className="mr-2" /> Conversaciones Guardadas
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#2a2a2a] transition-colors"
            aria-label="Cerrar"
          >
            <X size={20} className="text-gray-700 dark:text-[#b4b4b4]" />
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-[#737373]" />
          <input
            type="text"
            placeholder="Buscar conversaciones..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-[#3a3a3a] rounded-lg bg-white dark:bg-[#212121] text-gray-900 dark:text-[#e8e8e8] placeholder:text-gray-400 dark:placeholder:text-[#737373] focus:ring-2 focus:ring-[#6366f1] focus:border-transparent"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto p-4">
        {filteredConversations.length === 0 ? (
          <div className="text-center py-12">
            <FileText size={48} className="mx-auto text-gray-300 dark:text-[#737373] mb-4" />
            <p className="text-gray-500 dark:text-[#b4b4b4] text-lg mb-2">
              {searchQuery ? 'No se encontraron conversaciones' : 'No hay conversaciones guardadas'}
            </p>
            <p className="text-gray-400 dark:text-[#737373] text-sm">
              {searchQuery ? 'Intenta con otros términos de búsqueda' : 'Las conversaciones que guardes aparecerán aquí'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredConversations.map((session) => (
              <div
                key={session.id}
                onClick={() => handleLoad(session)}
                className="p-4 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#3a3a3a] rounded-xl hover:border-[#6366f1] dark:hover:border-[#6366f1] hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-[#e8e8e8] mb-1 truncate">
                      {session.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-[#737373] mb-2 line-clamp-2">
                      {session.messages[0]?.text || 'Sin mensajes'}
                    </p>
                    <div className="flex items-center text-xs text-gray-400 dark:text-[#737373] space-x-4">
                      <span className="flex items-center">
                        <MessageSquare size={14} className="mr-1" />
                        {session.messages.length} mensajes
                      </span>
                      <span className="flex items-center">
                        <Clock size={14} className="mr-1" />
                        {formatDate(session.lastModified)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => handleDelete(session.id, e)}
                    className="ml-4 p-2 text-gray-400 dark:text-[#737373] hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                    aria-label="Eliminar conversación"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedConversations;

