// src/types/cardTypes.ts

// Basic Card Suits
export type Suit = "♠" | "♥" | "♦" | "♣";

// Card Values
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

// Rarity Types
export type RarityType = "Commune" | "Rare" | "Épique" | "Légendaire";

// Base Card Interface
export interface BaseCard {
  id: string;
  suit: Suit;
  value: CardValue;
}

// Improvable Card Interface
export interface ImprovableCard extends BaseCard {
  improved: number;
  maxImprovement: number;
  improvementBonus: number;
}

// Bonus Card Interface
export interface BonusCard {
  name: string;
  rarity: RarityType;
  effect: string;
  points: number;
  family: string;
  cost: number;
}

// Card Type Utilities
export function isBaseCard(
  card: BaseCard | ImprovableCard | BonusCard
): card is BaseCard {
  return (
    (card as BaseCard).suit !== undefined &&
    (card as BaseCard).value !== undefined
  );
}

export function isImprovableCard(
  card: BaseCard | ImprovableCard | BonusCard
): card is ImprovableCard {
  return (
    (card as ImprovableCard).improved !== undefined &&
    (card as ImprovableCard).maxImprovement !== undefined
  );
}

export function isBonusCard(
  card: BaseCard | ImprovableCard | BonusCard
): card is BonusCard {
  return (
    (card as BonusCard).rarity !== undefined &&
    (card as BonusCard).effect !== undefined
  );
}
