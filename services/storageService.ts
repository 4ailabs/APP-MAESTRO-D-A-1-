import { ChatSession, Message } from '../types';

const STORAGE_KEY = 'maestro-conversations';
const CURRENT_SESSION_KEY = 'maestro-current-session';

export const storageService = {
  // Guardar conversación actual
  saveCurrentSession: (messages: Message[]) => {
    try {
      const session: ChatSession = {
        id: 'current',
        title: messages.length > 0 
          ? messages[0].text.substring(0, 50) + (messages[0].text.length > 50 ? '...' : '')
          : 'Nueva Conversación',
        messages,
        lastModified: Date.now()
      };
      localStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify(session));
    } catch (error) {
      console.error('Error saving current session:', error);
    }
  },

  // Cargar conversación actual
  loadCurrentSession: (): Message[] => {
    try {
      const data = localStorage.getItem(CURRENT_SESSION_KEY);
      if (data) {
        const session: ChatSession = JSON.parse(data);
        return session.messages || [];
      }
    } catch (error) {
      console.error('Error loading current session:', error);
    }
    return [];
  },

  // Guardar conversación en la lista
  saveConversation: (messages: Message[], title?: string): string => {
    try {
      const sessions = storageService.getAllConversations();
      const session: ChatSession = {
        id: Date.now().toString(),
        title: title || (messages.length > 0 
          ? messages[0].text.substring(0, 50) + (messages[0].text.length > 50 ? '...' : '')
          : 'Nueva Conversación'),
        messages,
        lastModified: Date.now()
      };
      sessions.unshift(session);
      // Mantener solo las últimas 50 conversaciones
      const limitedSessions = sessions.slice(0, 50);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(limitedSessions));
      return session.id;
    } catch (error) {
      console.error('Error saving conversation:', error);
      return '';
    }
  },

  // Obtener todas las conversaciones guardadas
  getAllConversations: (): ChatSession[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
    return [];
  },

  // Obtener una conversación por ID
  getConversation: (id: string): ChatSession | null => {
    try {
      const sessions = storageService.getAllConversations();
      return sessions.find(s => s.id === id) || null;
    } catch (error) {
      console.error('Error getting conversation:', error);
      return null;
    }
  },

  // Eliminar una conversación
  deleteConversation: (id: string): boolean => {
    try {
      const sessions = storageService.getAllConversations();
      const filtered = sessions.filter(s => s.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      return true;
    } catch (error) {
      console.error('Error deleting conversation:', error);
      return false;
    }
  },

  // Buscar conversaciones
  searchConversations: (query: string): ChatSession[] => {
    try {
      const sessions = storageService.getAllConversations();
      const lowerQuery = query.toLowerCase();
      return sessions.filter(session => 
        session.title.toLowerCase().includes(lowerQuery) ||
        session.messages.some(msg => msg.text.toLowerCase().includes(lowerQuery))
      );
    } catch (error) {
      console.error('Error searching conversations:', error);
      return [];
    }
  },

  // Limpiar todas las conversaciones
  clearAllConversations: (): boolean => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      return true;
    } catch (error) {
      console.error('Error clearing conversations:', error);
      return false;
    }
  }
};

