export interface SafetyResult {
  safe: boolean;
  reason?: string;
}

/**
 * Checks text against a list of forbidden words to simulate moderation.
 * Used for live demos to show "Content Safety" features.
 */
export const checkContentSafety = (text: string): SafetyResult => {
  // Lista simple para demo de MVP
  // Palabras que detonarán el error en la presentación
  const forbiddenWords = [
      "vendo", "compro", "tonto", "estupido", "estúpido", 
      "cita", "instagram", "sexo", "droga", "fiesta", 
      "idiota", "alcohol", "cerveza", "entradas", "ticket"
  ];
  
  const lowerText = text.toLowerCase();
  
  // Find the specific word that triggered the violation
  const violationWord = forbiddenWords.find(word => lowerText.includes(word));
  
  if (violationWord) {
    return {
      safe: false,
      reason: `⚠️ Ups! Detectamos contenido no académico ("${violationWord}"). ApañaUC es solo para estudios.`
    };
  }
  
  return { safe: true };
};