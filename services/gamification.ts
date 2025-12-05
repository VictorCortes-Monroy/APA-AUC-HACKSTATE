/**
 * Calculates the Karma reward based on the interdisciplinarity of the match.
 * 
 * Logic:
 * - Base Reward: 50 Points (Same Faculty)
 * - Bonus Reward: 75 Points (Different Faculty - x1.5 Multiplier)
 */
export const calculateRewards = (askerMajor: string, helperMajor: string) => {
  const BASE_POINTS = 50;
  
  // Normalize strings to compare broad faculties (simple MVP logic)
  // In a real app, this would use a Faculty ID or a mapping table.
  const getFaculty = (major: string) => {
    const m = major.toLowerCase();
    if (m.includes('ingeniería') || m.includes('sistemas') || m.includes('informática')) return 'ingenieria';
    if (m.includes('arte') || m.includes('diseño') || m.includes('música')) return 'artes';
    if (m.includes('derecho') || m.includes('leyes')) return 'derecho';
    if (m.includes('medicina') || m.includes('enfermería')) return 'salud';
    return 'general';
  };

  const askerFaculty = getFaculty(askerMajor);
  const helperFaculty = getFaculty(helperMajor);
  
  const isSameFaculty = askerFaculty === helperFaculty;
  
  if (!isSameFaculty) {
    return {
      points: Math.floor(BASE_POINTS * 1.5), // 75 Puntos
      isBonus: true,
      message: "🚀 ¡Bono Interdisciplinario! Rompiste la burbuja."
    };
  }
  
  return {
    points: BASE_POINTS, // 50 Puntos
    isBonus: false,
    message: "👍 Ayuda completada."
  };
};