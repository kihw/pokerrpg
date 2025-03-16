// src/types/Card.ts
export interface Card {
  id: string;
  suit: string;
  value: string;
  improved: number;
  maxImprovement: number;
  improvementBonus: number;
}

export interface BonusCard {
  name: string;
  rarity: "Commune" | "Rare" | "Épique" | "Légendaire";
  effect: string;
  points: number;
  family: string;
  cost: number;
}

export type GameStatus = "idle" | "selecting" | "playing" | "gameOver";

export interface GameState {
  deck: Card[];
  playerHand: Card[];
  selectedCards: Card[];
  playedHand: Card[];
  playerHP: number;
  playerPoints: number;
  round: number;
  gameStatus: GameStatus;
  bonusCards: BonusCard[];
  activeBonusCards: BonusCard[];
}
