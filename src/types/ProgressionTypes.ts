// src/types/ProgressionTypes.ts
/**
 * Types pour le système de progression
 */

// Niveau de joueur
export interface PlayerLevel {
  level: number;
  currentXP: number;
  xpToNextLevel: number;
  totalXPEarned: number;
}

// Statistiques de jeu
export interface GameStatistics {
  // Statistiques générales
  gamesPlayed: number;
  gamesWon: number;
  totalPoints: number;
  highestScore: number;
  totalRoundsPlayed: number;
  totalCardsPlayed: number;

  // Statistiques de combinaisons
  handsPlayed: {
    [key: string]: number; // Par type de main
  };

  // Statistiques d'améliorations
  totalImprovements: number;
  maxCardLevel: number;
  pointsSpentOnImprovements: number;

  // Statistiques de cartes bonus
  bonusCardsAcquired: number;
  pointsSpentOnBonusCards: number;

  // Statistiques de partie
  longestWinStreak: number;
  currentWinStreak: number;
  averagePointsPerGame: number;
}

// Succès/Achievements
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: number;
  progress: number;
  unlocked: boolean;
  category: "basics" | "combos" | "cards" | "challenge" | "mastery";
  reward?: {
    type: "xp" | "bonusCard" | "bonus";
    value: number;
  };
}

// État du système de progression
export interface ProgressionState {
  playerLevel: PlayerLevel;
  statistics: GameStatistics;
  achievements: Achievement[];
  unlockables: {
    themes: string[];
    backgrounds: string[];
    cardBacks: string[];
  };
}
