// src/utils/scoring.ts
import { ImprovableCard } from "../types/cardTypes";
import {
  PermanentBonus,
  calculatePermanentBonusEffect,
} from "../types/PermanentBonus";
import {
  HAND_RANKINGS,
  BONUS_HAND_MULTIPLIERS,
  CARD_VALUE_POINTS,
} from "../constants/gameRules";

// Interface pour le résultat de l'évaluation de la main
export interface HandEvaluation {
  rank: string;
  isValid: boolean;
}

// Fonction pour évaluer une main de poker
export function evaluateHand(hand: ImprovableCard[]): HandEvaluation {
  // Tri des cartes par valeur
  const sortedHand = [...hand].sort(
    (a, b) => CARD_VALUE_POINTS[a.value] - CARD_VALUE_POINTS[b.value]
  );

  // Vérification des combinaisons de poker
  const handCombination = detectHandCombination(sortedHand);

  return {
    rank: handCombination,
    isValid: handCombination !== "Haute carte",
  };
}

// Fonction de détection des combinaisons de poker
function detectHandCombination(hand: ImprovableCard[]): string {
  // Compter les valeurs
  const valueCounts = new Map<string, number>();
  hand.forEach((card) => {
    valueCounts.set(card.value, (valueCounts.get(card.value) || 0) + 1);
  });

  // Vérification des combinaisons
  const counts = Array.from(valueCounts.values());

  // Quinte Flush
  if (isQuinteFlush(hand)) return "Quinte flush";

  // Carré
  if (counts.includes(4)) return "Carré";

  // Full
  if (counts.includes(3) && counts.includes(2)) return "Full";

  // Couleur (toutes les cartes de même couleur)
  if (hand.every((card) => card.suit === hand[0].suit)) return "Couleur";

  // Suite
  if (isStraight(hand)) return "Suite";

  // Brelan
  if (counts.includes(3)) return "Brelan";

  // Double Paire
  if (counts.filter((count) => count === 2).length === 2) return "Double paire";

  // Paire
  if (counts.includes(2)) return "Paire";

  // Haute carte
  return "Haute carte";
}

// Fonction pour vérifier une suite
function isStraight(hand: ImprovableCard[]): boolean {
  const values = hand.map((card) => CARD_VALUE_POINTS[card.value]);
  const sortedValues = values.sort((a, b) => a - b);

  for (let i = 1; i < sortedValues.length; i++) {
    if (sortedValues[i] !== sortedValues[i - 1] + 1) {
      return false;
    }
  }

  return true;
}

// Fonction pour vérifier une quinte flush
function isQuinteFlush(hand: ImprovableCard[]): boolean {
  return isStraight(hand) && hand.every((card) => card.suit === hand[0].suit);
}

// Calcul des points avec intégration des bonus permanents
export function calculatePoints(
  hand: ImprovableCard[],
  _bonusCards: any[], // Conservé pour compatibilité, mais non utilisé
  handRank: string,
  permanentBonuses?: PermanentBonus[]
) {
  // Points de base selon le rang de la main
  const basePoints = HAND_RANKINGS[handRank] || 0;

  // Calcul des points d'amélioration des cartes
  const improvedPoints = hand.reduce(
    (total, card) => total + card.improved * card.improvementBonus,
    0
  );

  // Calcul des points de valeur des cartes
  const cardValuePoints = hand.reduce(
    (total, card) => total + CARD_VALUE_POINTS[card.value],
    0
  );

  // Multiplicateur de points de la main
  const handMultiplier = BONUS_HAND_MULTIPLIERS[handRank] || 1;

  // Calcul des bonus permanents
  let permanentBonusPoints = 0;
  let permanentBonusMultiplier = 1;

  if (permanentBonuses) {
    permanentBonuses.forEach((bonus) => {
      const bonusEffect = calculatePermanentBonusEffect(bonus);

      switch (bonus.effect.type) {
        case "pointMultiplier":
          permanentBonusMultiplier *= bonusEffect;
          break;
        case "extraPoints":
          permanentBonusPoints += bonusEffect;
          break;
      }
    });
  }

  // Calcul final des points
  const totalBasePoints =
    (basePoints + cardValuePoints + improvedPoints + permanentBonusPoints) *
    handMultiplier *
    permanentBonusMultiplier;

  return {
    basePoints: Math.floor(basePoints),
    improvedPoints: Math.floor(improvedPoints),
    bonusCardPoints: 0, // Remplacé par le système de bonus permanent
    cardValuePoints: Math.floor(cardValuePoints),
    permanentBonusPoints: Math.floor(permanentBonusPoints),
    totalPoints: Math.floor(totalBasePoints),
  };
}
