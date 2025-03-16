// src/constants/gameRules.ts

// Types de cartes
export type Rarity = "Commune" | "Rare" | "Épique" | "Légendaire";

// Définition des suits et valeurs
export const SUITS: Suit[] = ["♠", "♥", "♦", "♣"];
export const VALUES: CardValue[] = [
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
  "A",
];

// Types de base
export type Suit = "♠" | "♥" | "♦" | "♣";
export type CardValue =
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "J"
  | "Q"
  | "K"
  | "A";

// Règles générales du jeu
export const GAME_RULES = {
  // Paramètres de base
  MAX_ROUNDS: 20,
  STARTING_HP: 100,
  INITIAL_HAND_SIZE: 8,
  MAX_HAND_SIZE: 5,

  // Système de dommages
  DAMAGE_ON_NO_HAND: 25,
  CRITICAL_DAMAGE_THRESHOLD: 50,

  // Système de défausse
  MAX_DISCARDS: 4,
  DISCARD_COST: 50, // Coût en points pour une défausse supplémentaire

  // Système d'amélioration
  MAX_CARD_IMPROVEMENT: 5,
  BASE_IMPROVEMENT_COST: 20,

  // Bonus et multiplicateurs
  BONUS_CARD_SLOT_LIMIT: 5,
};

// Rangs des mains de poker
export const HAND_RANKINGS = {
  "Haute carte": 0,
  Paire: 10,
  "Double paire": 20,
  Brelan: 30,
  Suite: 40,
  Couleur: 50,
  Full: 60,
  Carré: 80,
  "Quinte flush": 100,
};

// Multiplicateurs de points pour les mains bonus
export const BONUS_HAND_MULTIPLIERS = {
  "Haute carte": 1,
  Paire: 1.5,
  "Double paire": 2,
  Brelan: 2.5,
  Suite: 3,
  Couleur: 3.5,
  Full: 4,
  Carré: 4.5,
  "Quinte flush": 5,
};

// Probabilités de rareté des cartes bonus
export const RARITY_PROBABILITIES = {
  Commune: 0.6,
  Rare: 0.25,
  Épique: 0.1,
  Légendaire: 0.05,
};

// Points de valeur des cartes
export const CARD_VALUE_POINTS = {
  "2": 2,
  "3": 3,
  "4": 4,
  "5": 5,
  "6": 6,
  "7": 7,
  "8": 8,
  "9": 9,
  "10": 10,
  J: 11,
  Q: 12,
  K: 13,
  A: 14,
};

// Bonus de rareté
export const RARITY_BONUS_MULTIPLIERS = {
  Commune: 1,
  Rare: 1.5,
  Épique: 2,
  Légendaire: 3,
};

// Configuration des points de vie
export const HP_RULES = {
  HEALING_PER_ROUND: 5,
  MAX_HEALING_PER_GAME: 50,
  CRITICAL_HP_THRESHOLD: 20,
};

// Configuration des points
export const POINT_RULES = {
  BASE_POINT_GAIN: 10,
  BONUS_POINT_MULTIPLIER: 1.5,
  MAX_POINT_GAIN_PER_ROUND: 200,
};

// Configuration des améliorations de cartes
export const IMPROVEMENT_RULES = {
  BASE_IMPROVEMENT_COST: 20,
  MAX_IMPROVEMENT_LEVEL: 5,
  IMPROVEMENT_BONUS_PER_LEVEL: 2,
};

// Bonus spéciaux
export const SPECIAL_BONUSES = {
  FULL_BONUS_CARD_SET: 50,
  PERFECT_HAND_BONUS: 100,
};
