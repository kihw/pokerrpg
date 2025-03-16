// src/utils/bonusHandEvaluator.ts - Nouveau fichier pour évaluer les combinaisons de cartes bonus
import { BonusCard } from "../types/cardTypes";
import { evaluateHand } from "./scoring";

export interface BonusHandResult {
  rank: string;
  multiplier: number;
  description: string;
}

/**
 * Évalue un ensemble de cartes bonus pour déterminer si elles forment une combinaison de poker
 * et renvoie le multiplicateur de bonus correspondant
 */
export function evaluateBonusHand(cards: BonusCard[]): BonusHandResult | null {
  if (cards.length !== 5) {
    return null; // Une main de poker requiert exactement 5 cartes
  }

  // Utiliser la fonction d'évaluation existante
  const { rank, isValid, description } = evaluateHand(cards);

  if (!isValid && rank === "Haute carte") {
    return null; // Pas de bonus pour une haute carte
  }

  // Définir les multiplicateurs de points par type de main
  const bonusMultipliers = {
    "Haute carte": 1,
    Paire: 1.2,
    "Double paire": 1.5,
    Brelan: 2,
    Suite: 2.5,
    Couleur: 3,
    Full: 3.5,
    Carré: 4,
    "Quinte flush": 5,
  };

  return {
    rank,
    multiplier: bonusMultipliers[rank] || 1,
    description,
  };
}

/**
 * Calcule le bonus total de points d'une main de bonus
 */
export function calculateBonusHandPoints(cards: BonusCard[]): number {
  const handResult = evaluateBonusHand(cards);

  if (!handResult) {
    // Si pas de combinaison, additionner simplement les points de chaque carte
    return cards.reduce((total, card) => total + card.points, 0);
  }

  // Calculer les points de base (somme des points des cartes)
  const basePoints = cards.reduce((total, card) => total + card.points, 0);

  // Appliquer le multiplicateur
  return Math.floor(basePoints * handResult.multiplier);
}
