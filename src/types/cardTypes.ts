// src/types/cardTypes.ts

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
export type Rarity = "Commune" | "Rare" | "Épique" | "Légendaire";

// Interface de base pour toutes les cartes
export interface BaseCard {
  id: string;
  suit: Suit;
  value: CardValue;
}

// Carte améliorable (cartes du jeu standard)
export interface ImprovableCard extends BaseCard {
  improved: number;
  maxImprovement: number;
  improvementBonus: number;
}

export interface BonusCard extends BaseCard {
  id: string;
  name: string;
  rarity: Rarity;
  effect: string;
  points: number;
  family: string;
  cost: number;
  suit: Suit;
  value: CardValue;
}

// Type utilitaire pour permettre une utilisation flexible
export type Card = ImprovableCard | BonusCard;

// Fonctions de type guard
export function isImprovableCard(card: Card): card is ImprovableCard {
  return (
    "improved" in card && "maxImprovement" in card && "improvementBonus" in card
  );
}

export function isBonusCard(card: Card): card is BonusCard {
  return "rarity" in card && "effect" in card && "family" in card;
}

// Type pour l'état du jeu
export type GameStatus = "idle" | "selecting" | "playing" | "gameOver";

// Interface pour l'état global du jeu
export interface GameState {
  deck: ImprovableCard[];
  playerHand: ImprovableCard[];
  selectedCards: ImprovableCard[];
  playedHand: ImprovableCard[];
  playerHP: number;
  playerPoints: number;
  round: number;
  gameStatus: GameStatus;
  bonusCards: BonusCard[];
  activeBonusCards: BonusCard[];
  message: string;
  totalGames: number;
  bestScore: number;
  shopCards: BonusCard[];
  showShopAndUpgrades: boolean;
  discardRemaining: number;
}
