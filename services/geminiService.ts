import { GoogleGenAI, Content, Part } from "@google/genai";
import { SYSTEM_PROMPT } from "../constants";
import { Message } from "../types";

// Initialize the API client
// Note: We are using a factory pattern for the call to ensure we capture the latest env var or logic
const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API Key not found in process.env.API_KEY");
    // In a real app we might throw, but here we'll handle gracefully in the UI
  }
  return new GoogleGenAI({ apiKey: apiKey || '' });
};

export const sendMessageToMaestro = async (
  currentMessage: string,
  history: Message[]
): Promise<string> => {
  try {
    const ai = getAiClient();
    
    // Convert app history to Gemini Content format
    // We filter out the very last user message because we send it as the prompt
    // But actually, for chat mode, we can send the whole history + new message if using generateContent
    // or use chats.create. Let's use models.generateContent for simplicity with system instruction integration.
    
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
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.7, // Balance between creativity and factual accuracy
        maxOutputTokens: 2000,
      },
    });

    return response.text || "Lo siento, tuve un problema pensando en esa respuesta. ¿Podrías intentar de nuevo?";
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Lo siento, ha ocurrido un error de conexión. Por favor verifica tu llave API o intenta más tarde.";
  }
};