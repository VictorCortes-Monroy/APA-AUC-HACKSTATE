/**
 * Calculates the Karma reward based on the interdisciplinarity of the match and the base offer.
 * 
 * Logic:
 * - Base Reward: The amount the requester put in escrow (Pre-paid).
 * - Bonus Reward: System adds extra points for different faculties (x1.5 Multiplier on standard rate or fixed bonus).
 */
export const calculateRewards = (askerMajor: string, helperMajor: string, baseOfferValue: number) => {
  
  // Normalize strings to compare broad faculties (simple MVP logic)
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
  
  // System bonus for breaking the bubble (interdisciplinary)
  // Example: If base offer is 50, and it's cross-faculty, add 25 points bonus from the SYSTEM (not the user).
  const interdisciplinaryBonus = !isSameFaculty ? 25 : 0;
  
  const totalPoints = baseOfferValue + interdisciplinaryBonus;

  if (!isSameFaculty) {
    return {
      points: totalPoints, 
      breakdown: { base: baseOfferValue, bonus: interdisciplinaryBonus },
      isBonus: true,
      message: "🚀 ¡Bono Interdisciplinario! (+25 extra del sistema)"
    };
  }
  
  return {
    points: totalPoints,
    breakdown: { base: baseOfferValue, bonus: 0 },
    isBonus: false,
    message: "👍 Recompensa base recibida."
  };
};