// src/types/BonusCard.ts
import { Suit, CardValue, Rarity } from "../constants/gameRules";

export interface BonusCard {
  id: string;
  suit: Suit;
  value: CardValue;
  points: number;
  rarity: Rarity;

  // Ajout des propriétés manquantes pour compatibilité
  improved: number;
  maxImprovement: number;
  improvementBonus: number;
}

export function generateBonusCard(): BonusCard {
  const suits: Suit[] = ["♠", "♥", "♦", "♣"];
  const values: CardValue[] = [
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

  const suit = suits[Math.floor(Math.random() * suits.length)];
  const value = values[Math.floor(Math.random() * values.length)];

  // Point calculation based on card value
  const pointCalculation: Record<CardValue, number> = {
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

  // Rarity determination
  const rarityRoll = Math.random();
  let rarity: Rarity = "Commune";
  if (rarityRoll > 0.9) rarity = "Légendaire";
  else if (rarityRoll > 0.7) rarity = "Épique";
  else if (rarityRoll > 0.4) rarity = "Rare";

  // Adjust points based on rarity
  const rarityMultiplier: Record<Rarity, number> = {
    Commune: 1,
    Rare: 1.5,
    Épique: 2,
    Légendaire: 3,
  };

  const basePoints = pointCalculation[value];
  const points = Math.floor(basePoints * rarityMultiplier[rarity]);

  return {
    id: `${value}-${suit}`,
    suit,
    value,
    points,
    rarity,

    // Ajout des propriétés manquantes avec des valeurs par défaut
    improved: 0,
    maxImprovement: 3,
    improvementBonus: 1,
  };
}
