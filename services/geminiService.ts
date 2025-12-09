
import { GoogleGenAI, Content, Part } from "@google/genai";
import { Message } from "../types";

// Initialize the API client
const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API Key not found in process.env.API_KEY");
  }
  return new GoogleGenAI({ apiKey: apiKey || '' });
};

export class GeminiError extends Error {
  constructor(
    message: string,
    public type: 'api_key' | 'rate_limit' | 'network' | 'timeout' | 'unknown'
  ) {
    super(message);
    this.name = 'GeminiError';
  }
}

export const sendMessageToMaestro = async (
  currentMessage: string,
  history: Message[],
  systemInstruction: string
): Promise<string> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new GeminiError(
        'No se encontró la API Key. Por favor verifica tu configuración.',
        'api_key'
      );
    }

    const ai = getAiClient();
    
    const contents: Content[] = history.map((msg) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text } as Part],
    }));

    // Add the current new message
    contents.push({
      role: 'user',
      parts: [{ text: currentMessage } as Part],
    });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", 
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7, 
        maxOutputTokens: 2000,
      },
    });

    return response.text || "Lo siento, tuve un problema pensando en esa respuesta. ¿Podrías intentar de nuevo?";
  } catch (error: any) {
    console.error("Error calling Gemini API:", error);

    // Detectar tipo de error
    if (error instanceof GeminiError) {
      throw error;
    }

    const errorMessage = error?.message || '';
    const errorCode = error?.code || '';
    const statusCode = error?.status || error?.statusCode;

    // Rate limit
    if (statusCode === 429 || errorCode === 'RESOURCE_EXHAUSTED' || errorMessage.includes('rate limit')) {
      throw new GeminiError(
        'Has excedido el límite de solicitudes. Por favor espera un momento e intenta de nuevo.',
        'rate_limit'
      );
    }

    // Network error
    if (errorMessage.includes('network') || errorMessage.includes('fetch') || errorCode === 'NETWORK_ERROR') {
      throw new GeminiError(
        'Error de conexión. Por favor verifica tu conexión a internet e intenta de nuevo.',
        'network'
      );
    }

    // Timeout
    if (errorMessage.includes('timeout') || errorCode === 'DEADLINE_EXCEEDED') {
      throw new GeminiError(
        'La solicitud tardó demasiado. Por favor intenta de nuevo.',
        'timeout'
      );
    }

    // API Key error
    if (statusCode === 401 || statusCode === 403 || errorMessage.includes('API key') || errorMessage.includes('authentication')) {
      throw new GeminiError(
        'API Key inválida o sin permisos. Por favor verifica tu configuración.',
        'api_key'
      );
    }

    // Unknown error
    throw new GeminiError(
      'Ocurrió un error inesperado. Por favor intenta de nuevo más tarde.',
      'unknown'
    );
  }
};
