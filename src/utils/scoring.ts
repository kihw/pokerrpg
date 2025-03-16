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
  description: string; // Ajout d'une description plus détaillée pour l'UI
}

// Fonction pour mapper les valeurs des cartes à des nombres pour comparaison
const getCardValue = (value: string): number => {
  return CARD_VALUE_POINTS[value] || 0;
};

/**
 * Évalue une main de poker et retourne son rang
 * @param hand La main de poker à évaluer
 * @returns HandEvaluation avec le rang et la validité de la main
 */
export function evaluateHand(hand: ImprovableCard[]): HandEvaluation {
  if (!hand || hand.length !== 5) {
    return {
      rank: "Main incomplète",
      isValid: false,
      description: "Une main doit contenir exactement 5 cartes.",
    };
  }

  // Tri des cartes par valeur
  const sortedHand = [...hand].sort(
    (a, b) => getCardValue(a.value) - getCardValue(b.value)
  );

  // Vérification des combinaisons dans l'ordre décroissant de valeur
  if (isQuinteFlush(sortedHand)) {
    return {
      rank: "Quinte flush",
      isValid: true,
      description: "Suite de 5 cartes de même couleur.",
    };
  }

  if (hasNOfAKind(sortedHand, 4)) {
    return {
      rank: "Carré",
      isValid: true,
      description: "Quatre cartes de même valeur.",
    };
  }

  if (isFullHouse(sortedHand)) {
    return {
      rank: "Full",
      isValid: true,
      description: "Un brelan et une paire.",
    };
  }

  if (isFlush(sortedHand)) {
    return {
      rank: "Couleur",
      isValid: true,
      description: "Cinq cartes de même couleur.",
    };
  }

  if (isStraight(sortedHand)) {
    return {
      rank: "Suite",
      isValid: true,
      description: "Cinq cartes qui se suivent.",
    };
  }

  if (hasNOfAKind(sortedHand, 3)) {
    return {
      rank: "Brelan",
      isValid: true,
      description: "Trois cartes de même valeur.",
    };
  }

  if (isTwoPair(sortedHand)) {
    return {
      rank: "Double paire",
      isValid: true,
      description: "Deux paires différentes.",
    };
  }

  if (hasNOfAKind(sortedHand, 2)) {
    return {
      rank: "Paire",
      isValid: true,
      description: "Deux cartes de même valeur.",
    };
  }

  return {
    rank: "Haute carte",
    isValid: false,
    description: `Carte haute: ${getHighCard(sortedHand).value} de ${
      getHighCard(sortedHand).suit
    }`,
  };
}

/**
 * Vérifie si une main contient N cartes de même valeur
 */
function hasNOfAKind(hand: ImprovableCard[], n: number): boolean {
  const valueCounts = new Map<string, number>();

  // Compter les occurrences de chaque valeur
  hand.forEach((card) => {
    const count = valueCounts.get(card.value) || 0;
    valueCounts.set(card.value, count + 1);
  });

  // Vérifier si une valeur apparaît n fois
  return Array.from(valueCounts.values()).some((count) => count >= n);
}

/**
 * Vérifie si une main contient deux paires différentes
 */
function isTwoPair(hand: ImprovableCard[]): boolean {
  const valueCounts = new Map<string, number>();

  // Compter les occurrences de chaque valeur
  hand.forEach((card) => {
    const count = valueCounts.get(card.value) || 0;
    valueCounts.set(card.value, count + 1);
  });

  // Compter le nombre de paires
  const pairCount = Array.from(valueCounts.values()).filter(
    (count) => count >= 2
  ).length;

  return pairCount >= 2;
}

/**
 * Vérifie si une main contient un full house (brelan + paire)
 */
function isFullHouse(hand: ImprovableCard[]): boolean {
  const valueCounts = new Map<string, number>();

  // Compter les occurrences de chaque valeur
  hand.forEach((card) => {
    const count = valueCounts.get(card.value) || 0;
    valueCounts.set(card.value, count + 1);
  });

  const counts = Array.from(valueCounts.values());

  // Un full house contient exactement un brelan et une paire
  return counts.includes(3) && counts.includes(2);
}

/**
 * Vérifie si toutes les cartes sont de la même couleur
 */
function isFlush(hand: ImprovableCard[]): boolean {
  const firstSuit = hand[0].suit;
  return hand.every((card) => card.suit === firstSuit);
}

/**
 * Vérifie si les cartes forment une suite
 */
function isStraight(hand: ImprovableCard[]): boolean {
  // Extraire les valeurs numériques des cartes et les trier
  const values = hand
    .map((card) => getCardValue(card.value))
    .sort((a, b) => a - b);

  // Cas spécial: A,2,3,4,5 (l'as peut être utilisé comme carte basse)
  if (
    values[0] === 2 &&
    values[1] === 3 &&
    values[2] === 4 &&
    values[3] === 5 &&
    values[4] === 14
  ) {
    return true;
  }

  // Vérifier que chaque carte est une unité plus grande que la précédente
  for (let i = 1; i < values.length; i++) {
    if (values[i] !== values[i - 1] + 1) {
      return false;
    }
  }

  return true;
}

/**
 * Vérifie si la main forme une quinte flush (suite de même couleur)
 */
function isQuinteFlush(hand: ImprovableCard[]): boolean {
  return isFlush(hand) && isStraight(hand);
}

/**
 * Trouve la carte la plus haute dans une main
 */
function getHighCard(hand: ImprovableCard[]): ImprovableCard {
  return hand.reduce(
    (highest, card) =>
      getCardValue(card.value) > getCardValue(highest.value) ? card : highest,
    hand[0]
  );
}

/**
 * Calcule les points pour une main donnée en prenant en compte les bonus
 */
export function calculatePoints(
  hand: ImprovableCard[],
  bonusCards: any[] = [], // Conservé pour compatibilité
  handRank: string,
  permanentBonuses: PermanentBonus[] = []
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
    (total, card) => total + getCardValue(card.value),
    0
  );

  // Multiplicateur de points de la main
  const handMultiplier = BONUS_HAND_MULTIPLIERS[handRank] || 1;

  // Appliquer les bonus permanents
  let permanentBonusPoints = 0;
  let permanentBonusMultiplier = 1;

  if (permanentBonuses && permanentBonuses.length > 0) {
    // Filtrer les bonus pertinents pour cette main
    const relevantBonuses = permanentBonuses.filter((bonus) => {
      if (bonus.category === "HandCombination") {
        // Pour les bonus de combinaison spécifiques, vérifier si la main correspond
        return bonus.targetCombination === handRank;
      }
      // Ajouter d'autres catégories de bonus si nécessaire
      return true;
    });

    // Appliquer les effets des bonus
    relevantBonuses.forEach((bonus) => {
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
  const subtotal =
    basePoints + cardValuePoints + improvedPoints + permanentBonusPoints;
  const totalPoints = Math.floor(
    subtotal * handMultiplier * permanentBonusMultiplier
  );

  return {
    basePoints: Math.floor(basePoints),
    improvedPoints: Math.floor(improvedPoints),
    bonusCardPoints: 0, // Remplacé par le système de bonus permanent
    cardValuePoints: Math.floor(cardValuePoints),
    permanentBonusPoints: Math.floor(permanentBonusPoints),
    totalPoints,
    // Détails additionnels pour l'UI
    handMultiplier,
    permanentBonusMultiplier,
    subtotal,
  };
}

/**
 * Utilitaire pour générer une description humaine de la main
 */
export function getHandDescription(hand: ImprovableCard[]): string {
  const evaluation = evaluateHand(hand);
  return `${evaluation.rank}: ${evaluation.description}`;
}
