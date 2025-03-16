// src/utils/progressionManager.ts
import {
  ProgressionState,
  PlayerLevel,
  GameStatistics,
  Achievement,
} from "../types/ProgressionTypes";

// Constantes pour le système de progression
const BASE_XP_PER_LEVEL = 100;
const XP_GROWTH_FACTOR = 1.5;

/**
 * Calcule l'XP requise pour atteindre un niveau donné
 */
export function calculateXPForLevel(level: number): number {
  return Math.floor(BASE_XP_PER_LEVEL * Math.pow(XP_GROWTH_FACTOR, level - 1));
}

/**
 * Initialise un nouveau profil de progression
 */
export function initializeProgression(): ProgressionState {
  return {
    playerLevel: {
      level: 1,
      currentXP: 0,
      xpToNextLevel: calculateXPForLevel(1),
      totalXPEarned: 0,
    },
    statistics: {
      gamesPlayed: 0,
      gamesWon: 0,
      totalPoints: 0,
      highestScore: 0,
      totalRoundsPlayed: 0,
      totalCardsPlayed: 0,
      handsPlayed: {
        "Haute carte": 0,
        Paire: 0,
        "Double paire": 0,
        Brelan: 0,
        Suite: 0,
        Couleur: 0,
        Full: 0,
        Carré: 0,
        "Quinte flush": 0,
      },
      totalImprovements: 0,
      maxCardLevel: 0,
      pointsSpentOnImprovements: 0,
      bonusCardsAcquired: 0,
      pointsSpentOnBonusCards: 0,
      longestWinStreak: 0,
      currentWinStreak: 0,
      averagePointsPerGame: 0,
    },
    achievements: generateAchievements(),
    unlockables: {
      themes: ["default"],
      backgrounds: ["default"],
      cardBacks: ["default"],
    },
  };
}

/**
 * Génère la liste des achievements disponibles
 */
function generateAchievements(): Achievement[] {
  return [
    // Achievements de base
    {
      id: "first_game",
      name: "Bienvenue au Casino",
      description: "Jouer votre première partie",
      icon: "trophy",
      requirement: 1,
      progress: 0,
      unlocked: false,
      category: "basics",
      reward: { type: "xp", value: 50 },
    },
    {
      id: "tenth_game",
      name: "Joueur Régulier",
      description: "Jouer 10 parties",
      icon: "medal",
      requirement: 10,
      progress: 0,
      unlocked: false,
      category: "basics",
      reward: { type: "xp", value: 100 },
    },
    {
      id: "points_1000",
      name: "Millionnaire",
      description: "Accumuler 1000 points en total",
      icon: "coins",
      requirement: 1000,
      progress: 0,
      unlocked: false,
      category: "basics",
      reward: { type: "xp", value: 150 },
    },

    // Achievements de combinaisons
    {
      id: "first_flush",
      name: "Couleur Parfaite",
      description: "Jouer votre première couleur",
      icon: "spade",
      requirement: 1,
      progress: 0,
      unlocked: false,
      category: "combos",
      reward: { type: "xp", value: 75 },
    },
    {
      id: "first_straight_flush",
      name: "Main Royale",
      description: "Jouer votre première quinte flush",
      icon: "crown",
      requirement: 1,
      progress: 0,
      unlocked: false,
      category: "combos",
      reward: { type: "xp", value: 200 },
    },
    {
      id: "combo_master",
      name: "Maître des Combinaisons",
      description: "Jouer chaque type de combinaison au moins une fois",
      icon: "award",
      requirement: 9,
      progress: 0,
      unlocked: false,
      category: "combos",
      reward: { type: "bonusCard", value: 1 },
    },

    // Achievements d'amélioration de cartes
    {
      id: "first_improvement",
      name: "Amélioration Simple",
      description: "Améliorer une carte pour la première fois",
      icon: "arrow-up",
      requirement: 1,
      progress: 0,
      unlocked: false,
      category: "cards",
      reward: { type: "xp", value: 50 },
    },
    {
      id: "max_card",
      name: "Perfectionniste",
      description: "Améliorer une carte au niveau maximum",
      icon: "star",
      requirement: 1,
      progress: 0,
      unlocked: false,
      category: "cards",
      reward: { type: "xp", value: 150 },
    },

    // Achievements de défi
    {
      id: "high_score_1000",
      name: "Score Impressionnant",
      description: "Atteindre un score de 1000 points en une seule partie",
      icon: "trending-up",
      requirement: 1000,
      progress: 0,
      unlocked: false,
      category: "challenge",
      reward: { type: "xp", value: 250 },
    },
    {
      id: "win_streak_3",
      name: "Sur une Lancée",
      description: "Gagner 3 parties consécutives",
      icon: "zap",
      requirement: 3,
      progress: 0,
      unlocked: false,
      category: "challenge",
      reward: { type: "bonus", value: 500 },
    },

    // Achievements de maîtrise
    {
      id: "reach_level_10",
      name: "Joueur Chevronné",
      description: "Atteindre le niveau 10",
      icon: "user",
      requirement: 10,
      progress: 1,
      unlocked: false,
      category: "mastery",
      reward: { type: "bonusCard", value: 2 },
    },
    {
      id: "play_100_games",
      name: "Maître du Poker Solo",
      description: "Jouer 100 parties",
      icon: "award",
      requirement: 100,
      progress: 0,
      unlocked: false,
      category: "mastery",
      reward: { type: "xp", value: 500 },
    },
  ];
}

/**
 * Ajoute de l'XP au joueur et effectue les montées de niveau si nécessaire
 */
export function addExperience(
  progression: ProgressionState,
  xpAmount: number
): ProgressionState {
  let playerLevel = { ...progression.playerLevel };
  playerLevel.currentXP += xpAmount;
  playerLevel.totalXPEarned += xpAmount;

  // Vérifier les montées de niveau
  while (playerLevel.currentXP >= playerLevel.xpToNextLevel) {
    playerLevel.currentXP -= playerLevel.xpToNextLevel;
    playerLevel.level += 1;
    playerLevel.xpToNextLevel = calculateXPForLevel(playerLevel.level);
  }

  return {
    ...progression,
    playerLevel,
  };
}

/**
 * Met à jour les statistiques après une partie
 */
export function updateStatisticsAfterGame(
  progression: ProgressionState,
  gameData: {
    points: number;
    isWin: boolean;
    roundsPlayed: number;
    cardsPlayed: number;
    handsPlayed: { [key: string]: number };
    improvements: number;
    maxCardLevel: number;
    pointsSpentOnImprovements: number;
    bonusCardsAcquired: number;
    pointsSpentOnBonusCards: number;
  }
): ProgressionState {
  const stats = { ...progression.statistics };

  // Mettre à jour les statistiques générales
  stats.gamesPlayed += 1;
  stats.totalPoints += gameData.points;
  stats.highestScore = Math.max(stats.highestScore, gameData.points);
  stats.totalRoundsPlayed += gameData.roundsPlayed;
  stats.totalCardsPlayed += gameData.cardsPlayed;

  // Mettre à jour les statistiques de victoire/défaite
  if (gameData.isWin) {
    stats.gamesWon += 1;
    stats.currentWinStreak += 1;
    stats.longestWinStreak = Math.max(
      stats.longestWinStreak,
      stats.currentWinStreak
    );
  } else {
    stats.currentWinStreak = 0;
  }

  // Mettre à jour les statistiques de mains
  Object.keys(gameData.handsPlayed).forEach((handType) => {
    if (stats.handsPlayed[handType] !== undefined) {
      stats.handsPlayed[handType] += gameData.handsPlayed[handType];
    } else {
      stats.handsPlayed[handType] = gameData.handsPlayed[handType];
    }
  });

  // Mettre à jour les statistiques d'amélioration
  stats.totalImprovements += gameData.improvements;
  stats.maxCardLevel = Math.max(stats.maxCardLevel, gameData.maxCardLevel);
  stats.pointsSpentOnImprovements += gameData.pointsSpentOnImprovements;

  // Mettre à jour les statistiques de cartes bonus
  stats.bonusCardsAcquired += gameData.bonusCardsAcquired;
  stats.pointsSpentOnBonusCards += gameData.pointsSpentOnBonusCards;

  // Calculer la moyenne de points par partie
  stats.averagePointsPerGame = stats.totalPoints / stats.gamesPlayed;

  return {
    ...progression,
    statistics: stats,
  };
}

/**
 * Vérifie et met à jour les achievements du joueur
 */
export function updateAchievements(
  progression: ProgressionState
): ProgressionState {
  const updatedAchievements = [...progression.achievements];
  const stats = progression.statistics;
  let xpEarned = 0;

  // Parcourir tous les achievements
  updatedAchievements.forEach((achievement) => {
    if (achievement.unlocked) return; // Ignorer les achievements déjà débloqués

    // Mettre à jour la progression selon le type d'achievement
    switch (achievement.id) {
      case "first_game":
        achievement.progress = Math.min(
          stats.gamesPlayed,
          achievement.requirement
        );
        break;
      case "tenth_game":
        achievement.progress = Math.min(
          stats.gamesPlayed,
          achievement.requirement
        );
        break;
      case "points_1000":
        achievement.progress = Math.min(
          stats.totalPoints,
          achievement.requirement
        );
        break;
      case "first_flush":
        achievement.progress = Math.min(
          stats.handsPlayed["Couleur"] || 0,
          achievement.requirement
        );
        break;
      case "first_straight_flush":
        achievement.progress = Math.min(
          stats.handsPlayed["Quinte flush"] || 0,
          achievement.requirement
        );
        break;
      case "combo_master":
        const uniqueCombosPlayed = Object.values(stats.handsPlayed).filter(
          (count) => count > 0
        ).length;
        achievement.progress = Math.min(
          uniqueCombosPlayed,
          achievement.requirement
        );
        break;
      case "first_improvement":
        achievement.progress = Math.min(
          stats.totalImprovements > 0 ? 1 : 0,
          achievement.requirement
        );
        break;
      case "max_card":
        achievement.progress = Math.min(
          stats.maxCardLevel >= 5 ? 1 : 0,
          achievement.requirement
        );
        break;
      case "high_score_1000":
        achievement.progress = Math.min(
          stats.highestScore,
          achievement.requirement
        );
        break;
      case "win_streak_3":
        achievement.progress = Math.min(
          stats.longestWinStreak,
          achievement.requirement
        );
        break;
      case "reach_level_10":
        achievement.progress = Math.min(
          progression.playerLevel.level,
          achievement.requirement
        );
        break;
      case "play_100_games":
        achievement.progress = Math.min(
          stats.gamesPlayed,
          achievement.requirement
        );
        break;
      default:
        // Ne rien faire pour les achievements inconnus
        break;
    }

    // Vérifier si l'achievement est complété
    if (
      achievement.progress >= achievement.requirement &&
      !achievement.unlocked
    ) {
      achievement.unlocked = true;

      // Appliquer les récompenses
      if (achievement.reward) {
        switch (achievement.reward.type) {
          case "xp":
            xpEarned += achievement.reward.value;
            break;
          // Les autres types de récompenses seront gérés par d'autres fonctions
        }
      }
    }
  });

  // Mettre à jour la progression avec les achievements mis à jour
  let result = {
    ...progression,
    achievements: updatedAchievements,
  };

  // Ajouter l'XP gagnée si nécessaire
  if (xpEarned > 0) {
    result = addExperience(result, xpEarned);
  }

  return result;
}

/**
 * Calcule l'XP gagnée pour une partie basée sur les performances
 */
export function calculateGameXP(
  points: number,
  handsPlayed: Record<string, number>,
  roundsPlayed: number,
  isWin: boolean
): number {
  // Base XP pour avoir joué
  let xp = 10;

  // XP basée sur les points (1 XP pour 10 points)
  xp += Math.floor(points / 10);

  // Bonus pour les mains de haut niveau jouées
  const highLevelHandsCount =
    (handsPlayed["Full"] || 0) +
    (handsPlayed["Carré"] || 0) +
    (handsPlayed["Quinte flush"] || 0);

  xp += highLevelHandsCount * 5;

  // Bonus pour avoir terminé une partie complète
  if (roundsPlayed >= 20) {
    xp += 15;
  }

  // Bonus pour avoir gagné
  if (isWin) {
    xp += 25;
  }

  return xp;
}
