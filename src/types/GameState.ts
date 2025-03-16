// src/types/GameState.ts
import { ImprovableCard } from "./cardTypes";
import { BonusCard } from "./BonusCard";

export type GameStatus = "idle" | "selecting" | "playing" | "gameOver";

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
}

export interface GameStateActions {
  initializeGame: () => void;
  startGame: () => void;
  selectCard: (card: ImprovableCard) => void;
  playHand: () => void;
  improveCard: (card: ImprovableCard) => void;
  buyShopCard: (index: number) => void;
  toggleBonusCard: (index: number) => void;
  redraw: () => void;
}

export type CompleteGameState = GameState & GameStateActions;
