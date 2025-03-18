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
  description: string; // Description détaillée pour l'UI
}

// Interface pour le résultat du calcul de l'état du jeu
export interface GameStateCalculationResult {
  hpChange: number;
  pointPenalty: number;
  pointBonus: number;
  message: string;
  hpPercentage: number;
}

// Fonction pour mapper les valeurs des cartes à des nombres pour comparaison
export const getCardValue = (value: string): number => {
  return CARD_VALUE_POINTS[value] || 0;
};

/**
 * Évalue une main de poker flexible (1 à 5 cartes) et retourne son rang
 * @param hand La main de poker à évaluer
 * @returns HandEvaluation avec le rang et la validité de la main
 */
export function evaluateHand(hand: ImprovableCard[]): HandEvaluation {
  if (!hand || hand.length === 0 || hand.length > 5) {
    return {
      rank: "Main invalide",
      isValid: false,
      description: "Une main doit contenir entre 1 et 5 cartes.",
    };
  }

  // Si moins de 5 cartes, utiliser un système adapté
  if (hand.length < 5) {
    return evaluatePartialHand(hand);
  }

  // Pour 5 cartes, utiliser l'évaluation de poker standard
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
    description: `Carte haute: ${getCardValueDescription(
      getHighCard(sortedHand).value
    )} de ${getHighCard(sortedHand).suit}`,
  };
}

/**
 * Évalue une main partielle (1-4 cartes)
 */
function evaluatePartialHand(hand: ImprovableCard[]): HandEvaluation {
  const numCards = hand.length;

  // Tri des cartes par valeur
  const sortedHand = [...hand].sort(
    (a, b) => getCardValue(a.value) - getCardValue(b.value)
  );

  // Pour 1 carte: uniquement la valeur de la carte
  if (numCards === 1) {
    const cardValue = getCardValue(hand[0].value);
    const valueDescription = getCardValueDescription(hand[0].value);

    return {
      rank: "Carte Simple",
      isValid: true,
      description: `${valueDescription} de ${hand[0].suit}`,
    };
  }

  // Pour 2 cartes: paire ou deux cartes différentes
  if (numCards === 2) {
    if (hand[0].value === hand[1].value) {
      return {
        rank: "Mini-Paire",
        isValid: true,
        description: `Paire de ${getCardValueDescription(hand[0].value)}`,
      };
    } else {
      const highCard = getHighCard(sortedHand);
      return {
        rank: "Deux Cartes",
        isValid: true,
        description: `Carte haute: ${getCardValueDescription(
          highCard.value
        )} de ${highCard.suit}`,
      };
    }
  }

  // Pour 3 cartes: brelan, paire, ou trois cartes différentes
  if (numCards === 3) {
    const valueCounts = getValueCounts(hand);

    if (hasNOfAKindFromMap(valueCounts, 3)) {
      return {
        rank: "Trio",
        isValid: true,
        description: `Trois ${getCardValueDescription(
          getGroupValue(valueCounts, 3)
        )}`,
      };
    } else if (hasNOfAKindFromMap(valueCounts, 2)) {
      return {
        rank: "Paire Plus",
        isValid: true,
        description: `Paire de ${getCardValueDescription(
          getGroupValue(valueCounts, 2)
        )}`,
      };
    } else if (isFlush(hand)) {
      return {
        rank: "Mini-Couleur",
        isValid: true,
        description: `Trois cartes de même couleur (${hand[0].suit})`,
      };
    } else if (isStraightPartial(hand)) {
      return {
        rank: "Mini-Suite",
        isValid: true,
        description: "Trois cartes qui se suivent",
      };
    } else {
      const highCard = getHighCard(sortedHand);
      return {
        rank: "Trois Cartes",
        isValid: true,
        description: `Carte haute: ${getCardValueDescription(
          highCard.value
        )} de ${highCard.suit}`,
      };
    }
  }

  // Pour 4 cartes: carré, brelan, deux paires, paire, couleur, suite ou quatre cartes différentes
  if (numCards === 4) {
    const valueCounts = getValueCounts(hand);

    if (hasNOfAKindFromMap(valueCounts, 4)) {
      return {
        rank: "Carré Partiel",
        isValid: true,
        description: `Quatre ${getCardValueDescription(
          getGroupValue(valueCounts, 4)
        )}`,
      };
    } else if (hasNOfAKindFromMap(valueCounts, 3)) {
      return {
        rank: "Brelan Plus",
        isValid: true,
        description: `Trois ${getCardValueDescription(
          getGroupValue(valueCounts, 3)
        )} et une carte`,
      };
    } else if (isTwoPairFromMap(valueCounts)) {
      return {
        rank: "Deux Paires",
        isValid: true,
        description: "Deux paires différentes",
      };
    } else if (hasNOfAKindFromMap(valueCounts, 2)) {
      return {
        rank: "Paire Forte",
        isValid: true,
        description: `Paire de ${getCardValueDescription(
          getGroupValue(valueCounts, 2)
        )} et deux cartes`,
      };
    } else if (isFlush(hand)) {
      return {
        rank: "Pré-Couleur",
        isValid: true,
        description: `Quatre cartes de même couleur (${hand[0].suit})`,
      };
    } else if (isStraightPartial(hand)) {
      return {
        rank: "Pré-Suite",
        isValid: true,
        description: "Quatre cartes qui se suivent",
      };
    } else {
      const highCard = getHighCard(sortedHand);
      return {
        rank: "Quatre Cartes",
        isValid: true,
        description: `Carte haute: ${getCardValueDescription(
          highCard.value
        )} de ${highCard.suit}`,
      };
    }
  }

  // Ne devrait jamais arriver si le code est correct
  return {
    rank: "Main Invalide",
    isValid: false,
    description: "Format de main non reconnu",
  };
}

/**
 * Calcule les changements de santé et de points en fonction de la main jouée
 * et introduit un système de risque/récompense plus ludique
 */
export function calculateHealthChange(
  handRank: string,
  numCardsPlayed: number
): GameStateCalculationResult {
  // Système de base pour les changements de PV basé sur le rang
  const baseHealthChanges = {
    // Mains à 1 carte
    "Carte Simple": { hpChange: -15, pointBonus: 0 },

    // Mains à 2 cartes
    "Mini-Paire": { hpChange: -10, pointBonus: 5 },
    "Deux Cartes": { hpChange: -12, pointBonus: 0 },

    // Mains à 3 cartes
    Trio: { hpChange: -5, pointBonus: 10 },
    "Paire Plus": { hpChange: -8, pointBonus: 5 },
    "Mini-Couleur": { hpChange: -7, pointBonus: 8 },
    "Mini-Suite": { hpChange: -7, pointBonus: 8 },
    "Trois Cartes": { hpChange: -10, pointBonus: 0 },

    // Mains à 4 cartes
    "Carré Partiel": { hpChange: 0, pointBonus: 15 },
    "Brelan Plus": { hpChange: -3, pointBonus: 12 },
    "Deux Paires": { hpChange: -5, pointBonus: 10 },
    "Paire Forte": { hpChange: -7, pointBonus: 8 },
    "Pré-Couleur": { hpChange: -2, pointBonus: 12 },
    "Pré-Suite": { hpChange: -2, pointBonus: 12 },
    "Quatre Cartes": { hpChange: -8, pointBonus: 5 },

    // Mains standard à 5 cartes
    "Haute carte": { hpChange: -20, pointBonus: 0 },
    Paire: { hpChange: -10, pointBonus: 5 },
    "Double paire": { hpChange: -5, pointBonus: 10 },
    Brelan: { hpChange: 0, pointBonus: 15 },
    Suite: { hpChange: 5, pointBonus: 20 },
    Couleur: { hpChange: 10, pointBonus: 25 },
    Full: { hpChange: 15, pointBonus: 30 },
    Carré: { hpChange: 20, pointBonus: 40 },
    "Quinte flush": { hpChange: 25, pointBonus: 50 },
  };

  // Obtenir les changements de base ou utiliser une valeur par défaut
  const base = baseHealthChanges[handRank] || { hpChange: -15, pointBonus: 0 };

  // Facteur basé sur le nombre de cartes jouées
  // Jouer plus de cartes = plus de risque mais aussi plus de récompense
  const cardFactor = numCardsPlayed / 5;

  // Ajuster les changements de PV en fonction du nombre de cartes
  // Moins de cartes = plus de pertes de PV proportionnellement
  let adjustedHPChange = base.hpChange;

  // Si c'est une perte de PV, elle est plus importante avec peu de cartes
  if (base.hpChange < 0) {
    adjustedHPChange = Math.floor(base.hpChange * (1.2 - cardFactor * 0.4));
  }
  // Si c'est un gain de PV, il est plus important avec plus de cartes
  else if (base.hpChange > 0) {
    adjustedHPChange = Math.floor(base.hpChange * cardFactor);
  }

  // Calculer la pénalité de points pour les mauvaises mains
  let pointPenalty = 0;
  if (handRank === "Haute carte" || handRank === "Carte Simple") {
    pointPenalty = 0.05; // 5% de pénalité
  }

  // Créer un message descriptif
  let message = "";

  if (adjustedHPChange < -15) {
    message = `Main faible ! ${adjustedHPChange} PV et ${
      pointPenalty > 0 ? "pénalité de points" : "pas de bonus"
    }.`;
  } else if (adjustedHPChange < 0) {
    message = `${handRank} : ${adjustedHPChange} PV mais ${
      base.pointBonus > 0
        ? "+" + base.pointBonus + " points bonus"
        : "pas de bonus"
    }.`;
  } else if (adjustedHPChange === 0) {
    message = `${handRank} : Pas de changement de PV. ${
      base.pointBonus > 0 ? "+" + base.pointBonus + " points bonus!" : ""
    }`;
  } else {
    message = `${handRank} ! +${adjustedHPChange} PV et +${base.pointBonus} points bonus!`;
  }

  return {
    hpChange: adjustedHPChange,
    pointPenalty,
    pointBonus: base.pointBonus,
    message,
    hpPercentage: 0, // À calculer dans le composant parent
  };
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
  // Points de base pour les mains flexibles (1-5 cartes)
  const flexibleHandRankings = {
    // Mains à 1 carte
    "Carte Simple": 5,

    // Mains à 2 cartes
    "Mini-Paire": 15,
    "Deux Cartes": 7,

    // Mains à 3 cartes
    Trio: 25,
    "Paire Plus": 18,
    "Mini-Couleur": 20,
    "Mini-Suite": 20,
    "Trois Cartes": 10,

    // Mains à 4 cartes
    "Carré Partiel": 35,
    "Brelan Plus": 30,
    "Deux Paires": 25,
    "Paire Forte": 20,
    "Pré-Couleur": 28,
    "Pré-Suite": 28,
    "Quatre Cartes": 15,

    // Mains standard à 5 cartes (conserver les valeurs existantes)
    "Haute carte": 0,
    Paire: 10,
    "Double paire": 20,
    Brelan: 30,
    Suite: 40,
    Couleur: 50,
    Full: 60,
    Carré: 80,
    "Quinte flush": 100,
  };

  // Multiplicateurs de points pour les mains flexibles
  const flexibleHandMultipliers = {
    // Mains à 1 carte
    "Carte Simple": 1,

    // Mains à 2 cartes
    "Mini-Paire": 1.1,
    "Deux Cartes": 1,

    // Mains à 3 cartes
    Trio: 1.2,
    "Paire Plus": 1.1,
    "Mini-Couleur": 1.15,
    "Mini-Suite": 1.15,
    "Trois Cartes": 1,

    // Mains à 4 cartes
    "Carré Partiel": 1.3,
    "Brelan Plus": 1.25,
    "Deux Paires": 1.2,
    "Paire Forte": 1.15,
    "Pré-Couleur": 1.25,
    "Pré-Suite": 1.25,
    "Quatre Cartes": 1.1,

    // Conserver les multiplicateurs existants pour 5 cartes
    "Haute carte": 1,
    Paire: 1.5,
    "Double paire": 2,
    Brelan: 2.5,
    Suite: 3,
    Couleur: 3.5,
    Full: 4,
    Carré: 4.5,
    "Quinte flush": 5,
  };

  // Points de base selon le rang de la main - maintenant flexible
  const basePoints = flexibleHandRankings[handRank] || 0;

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

  // Multiplicateur de points de la main - maintenant flexible
  const handMultiplier = flexibleHandMultipliers[handRank] || 1;

  // Facteur d'échelle basé sur le nombre de cartes
  // Encourager l'utilisation de 5 cartes, mais permettre des scores compétitifs avec moins
  const cardCountFactor = hand.length / 5;

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

  // Calcul final des points - intègre le facteur de nombre de cartes
  const subtotal =
    basePoints + cardValuePoints + improvedPoints + permanentBonusPoints;

  // Le multiplicateur de main est ajusté par le facteur de compte de cartes
  // mais nous gardons une valeur minimale pour éviter de trop pénaliser les petites mains
  const scaledMultiplier = Math.max(
    handMultiplier * Math.pow(cardCountFactor, 0.7),
    0.7
  );

  const totalPoints = Math.floor(
    subtotal * scaledMultiplier * permanentBonusMultiplier
  );

  return {
    basePoints: Math.floor(basePoints),
    improvedPoints: Math.floor(improvedPoints),
    bonusCardPoints: 0, // Remplacé par le système de bonus permanent
    cardValuePoints: Math.floor(cardValuePoints),
    permanentBonusPoints: Math.floor(permanentBonusPoints),
    totalPoints,
    // Détails additionnels pour l'UI
    handMultiplier: scaledMultiplier, // Maintenant ajusté par le facteur de nombre de cartes
    permanentBonusMultiplier,
    subtotal,
    cardCountFactor, // Nouvelle propriété pour l'UI
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
 * Vérifie si une main contient N cartes de même valeur basé sur un Map de décompte
 */
function hasNOfAKindFromMap(
  valueCounts: Map<string, number>,
  n: number
): boolean {
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
 * Vérifie si une main contient deux paires différentes basé sur un Map de décompte
 */
function isTwoPairFromMap(valueCounts: Map<string, number>): boolean {
  const pairCount = Array.from(valueCounts.values()).filter(
    (count) => count >= 2
  ).length;

  return pairCount >= 2;
}

/**
 * Obtient un décompte des valeurs de cartes
 */
function getValueCounts(hand: ImprovableCard[]): Map<string, number> {
  const valueCounts = new Map<string, number>();

  hand.forEach((card) => {
    const count = valueCounts.get(card.value) || 0;
    valueCounts.set(card.value, count + 1);
  });

  return valueCounts;
}

/**
 * Obtient la valeur qui apparaît N fois dans la main
 */
function getGroupValue(valueCounts: Map<string, number>, n: number): string {
  for (const [value, count] of valueCounts.entries()) {
    if (count >= n) {
      return value;
    }
  }
  return "";
}

/**
 * Obtient une description humaine de la valeur de carte
 */
function getCardValueDescription(value: string): string {
  switch (value) {
    case "A":
      return "As";
    case "K":
      return "Roi";
    case "Q":
      return "Dame";
    case "J":
      return "Valet";
    default:
      return value;
  }
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
 * Vérifie si les cartes forment une suite partielle (pour moins de 5 cartes)
 */
function isStraightPartial(hand: ImprovableCard[]): boolean {
  if (hand.length < 3) return false;

  // Extraire les valeurs numériques des cartes et les trier
  const values = hand
    .map((card) => getCardValue(card.value))
    .sort((a, b) => a - b);

  // Cas spécial pour As : peut être utilisé comme carte haute ou basse
  // Pour 3 cartes: A,2,3 ou Q,K,A
  // Pour 4 cartes: A,2,3,4 ou J,Q,K,A
  if (values.includes(14)) {
    // As présent
    const lowAceValues = [...values.filter((v) => v !== 14), 1].sort(
      (a, b) => a - b
    );

    // Vérifier la suite avec l'As comme carte basse
    let isLowAceStraight = true;
    for (let i = 1; i < lowAceValues.length; i++) {
      if (lowAceValues[i] !== lowAceValues[i - 1] + 1) {
        isLowAceStraight = false;
        break;
      }
    }

    if (isLowAceStraight) return true;
  }

  // Vérifier la suite normale
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
 * Utilitaire pour générer une description humaine de la main
 */
export function getHandDescription(hand: ImprovableCard[]): string {
  const evaluation = evaluateHand(hand);
  return `${evaluation.rank}: ${evaluation.description}`;
}
