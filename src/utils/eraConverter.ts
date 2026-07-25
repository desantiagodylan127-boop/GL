export function getEraConversion(eraLevel: number): { gearTier: number, relicLevel: number } {
  if (eraLevel <= 0) return { gearTier: 1, relicLevel: 0 };
  if (eraLevel <= 10) return { gearTier: 1, relicLevel: 0 };
  if (eraLevel <= 25) return { gearTier: 3, relicLevel: 0 };
  if (eraLevel <= 50) return { gearTier: 5, relicLevel: 0 };
  if (eraLevel <= 75) return { gearTier: 7, relicLevel: 0 };
  if (eraLevel <= 100) return { gearTier: 9, relicLevel: 0 };
  // level 101+ covers gear tier 13 implicitly based on requirements
  if (eraLevel <= 125) return { gearTier: 13, relicLevel: 1 };
  if (eraLevel <= 150) return { gearTier: 13, relicLevel: 3 };
  if (eraLevel <= 175) return { gearTier: 13, relicLevel: 5 };
  return { gearTier: 13, relicLevel: 7 };
}

export function getEraLevelUpCost(currentLevel: number): number {
  if (currentLevel >= 200) return 0;
  // Progressively scaling logic as defined
  // Level 1: 10, Level 100: moderate, Level 200: high
  return Math.floor(10 + Math.pow(currentLevel, 1.25));
}
