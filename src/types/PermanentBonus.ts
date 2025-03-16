// src/types/PermanentBonus.ts
import { Card } from "./cardTypes";
import { Rarity } from "../constants/gameRules";

export type BonusEffectType =
  | "pointMultiplier"
  | "extraPoints"
  | "specialAbility";

export type BonusCategory =
  | "HandCombination"
  | "CardValue"
  | "Rarity"
  | "Improvement";

export interface PermanentBonus {
  id: string;
  category: BonusCategory;
  name: string;
  description: string;
  effect: {
    type: BonusEffectType;
    baseValue: number;
    incrementPerLevel: number;
  };
  currentLevel: number;
  maxLevel: number;
}

export interface HandCombinationBonus extends PermanentBonus {
  targetCombination: string; // "Paire", "Brelan", etc.
}

export interface RarityBonus extends PermanentBonus {
  targetRarity: Rarity;
}

export const PERMANENT_BONUS_TEMPLATES: PermanentBonus[] = [
  {
    id: "pair-master",
    category: "HandCombination",
    name: "Maître des Paires",
    description: "Augmente les points des mains avec paires",
    effect: {
      type: "pointMultiplier",
      baseValue: 1.1,
      incrementPerLevel: 0.1,
    },
    currentLevel: 0,
    maxLevel: 5,
  },
  {
    id: "collector",
    category: "Rarity",
    name: "Collectionneur",
    description: "Bonus pour les cartes de haute rareté",
    effect: {
      type: "extraPoints",
      baseValue: 10,
      incrementPerLevel: 5,
    },
    currentLevel: 0,
    maxLevel: 3,
  },
];

export function calculatePermanentBonusEffect(
  bonus: PermanentBonus,
  context?: {
    hand?: Card[];
    rarity?: Rarity;
  }
): number {
  const currentLevel = bonus.currentLevel;

  switch (bonus.effect.type) {
    case "pointMultiplier":
      return (
        bonus.effect.baseValue + currentLevel * bonus.effect.incrementPerLevel
      );
    case "extraPoints":
      return (
        bonus.effect.baseValue + currentLevel * bonus.effect.incrementPerLevel
      );
    default:
      return 0;
  }
}

export function canUpgradePermanentBonus(
  bonus: PermanentBonus,
  availablePoints: number
): boolean {
  // Base upgrade cost increases with level
  const upgradeCost = (bonus.currentLevel + 1) * 50;
  return availablePoints >= upgradeCost && bonus.currentLevel < bonus.maxLevel;
}

export function getUpgradeCost(bonus: PermanentBonus): number {
  return (bonus.currentLevel + 1) * 50;
}
