export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  lastModified: number;
}

export type ViewState = 'chat' | 'topics' | 'exercises' | 'saved' | 'settings' | 'about' | 'live';

export interface Topic {
  id: string;
  title: string;
  description: string;
  subtopics: string[];
}

export interface Exercise {
  id: string;
  title: string;
  category: 'Regulación' | 'Palancas' | 'Recursos' | 'Integración';
  prompt: string;
}