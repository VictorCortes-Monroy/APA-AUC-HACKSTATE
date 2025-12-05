import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

/**
 * Analyzes a natural language help request and suggests academic tags/skills.
 * This helps map "I don't understand the area under the curve" to "Calculus", "Integrals".
 */
export const analyzeRequestAndGetTags = async (description: string): Promise<string[]> => {
  if (!apiKey) return ['General'];

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Analyze this student help request: "${description}". 
      Return a JSON array of 1 to 3 short, specific academic tags (e.g., ["Calculus", "Python", "History"]). 
      Do not include markdown code blocks. Just the array string.`,
    });

    const text = response.text || "[]";
    const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Gemini tagging error:", error);
    return ['General'];
  }
};

/**
 * Generates a quick encouraging message or icebreaker for the match.
 */
export const generateIcebreaker = async (topic: string): Promise<string> => {
    if (!apiKey) return "¡Hola! Vi que necesitas ayuda.";

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Generate a short, friendly, informal student-to-student icebreaker message (in Spanish) for someone offering help with "${topic}". Max 15 words.`,
      });
      return response.text?.trim() || "¡Hola! Voy para allá a ayudarte.";
    } catch (error) {
        return "¡Hola! Voy para allá a ayudarte.";
    }
}

/**
 * RAG / RLHF Feature:
 * Takes the chat history and synthesizes a clean Question/Answer pair for the Knowledge Base.
 */
export const generateKnowledgeSnippet = async (chatHistory: {role: string, text: string}[], topic: string) => {
  // Mock fallback for demo if no API key
  if (!apiKey) {
      return {
          question_summary: `¿Cómo resolver dudas sobre ${topic}?`,
          solution_summary: "El estudiante recibió orientación paso a paso revisando los conceptos fundamentales y ejemplos prácticos."
      };
  }

  try {
    const prompt = `
      Actúa como un profesor experto. Tengo un chat entre dos estudiantes sobre el tema "${topic}".
      Analiza la conversación y extrae:
      1. "question_summary": La pregunta específica o duda que tenía el estudiante (máx 20 palabras).
      2. "solution_summary": La solución o explicación clave que se dio (máx 40 palabras).
      
      Chat:
      ${JSON.stringify(chatHistory)}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                question_summary: { type: Type.STRING },
                solution_summary: { type: Type.STRING }
            }
        }
      }
    });
    
    if (response.text) {
        return JSON.parse(response.text);
    }
    return null;

  } catch (error) {
    console.error("Gemini knowledge gen error:", error);
    return null;
  }
};