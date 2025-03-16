// src/types/cardTypes.ts
import { Rarity } from "../constants/gameRules";

// Types de base pour les cartes
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

// Interface de base pour toutes les cartes
export interface BaseCard {
  id: string;
  suit: Suit;
  value: CardValue;
}

// Carte améliorable
export interface ImprovableCard extends BaseCard {
  improved: number;
  maxImprovement: number;
  improvementBonus: number;
}

// Carte bonus
export interface BonusCard extends BaseCard {
  points: number;
  rarity: Rarity;
}

// Type utilitaire pour permettre une utilisation flexible
export type Card = BaseCard | ImprovableCard | BonusCard;

// Fonctions de type guard
export function isBaseCard(card: Card): card is BaseCard {
  return "suit" in card && "value" in card;
}

export function isImprovableCard(card: Card): card is ImprovableCard {
  return (
    isBaseCard(card) &&
    "improved" in card &&
    "maxImprovement" in card &&
    "improvementBonus" in card
  );
}

export function isBonusCard(card: Card): card is BonusCard {
  return isBaseCard(card) && "points" in card && "rarity" in card;
}
