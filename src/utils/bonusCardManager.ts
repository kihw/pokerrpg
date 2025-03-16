// src/utils/bonusCardManager.ts
import { BonusCard } from "../types/cardTypes";
import { v4 as uuidv4 } from "uuid"; // Note: vous devrez installer cette dépendance

// Types de bonus possibles
export type BonusEffectType =
  | "pointMultiplier"
  | "flatBonus"
  | "handBonus"
  | "defensiveBonus"
  | "improveBonus";

// Familles de cartes bonus
export type BonusFamily =
  | "Strategie"
  | "Fortune"
  | "Chance"
  | "Habileté"
  | "Aventure";

// Interface pour les effets de bonus
export interface BonusEffect {
  type: BonusEffectType;
  value: number;
  description: string;
  condition?: string; // Condition optionnelle pour l'activation du bonus
}

/**
 * Génère une nouvelle carte bonus avec des attributs aléatoires
 * selon la rareté spécifiée
 */
export function generateBonusCard(
  preferredRarity?: "Commune" | "Rare" | "Épique" | "Légendaire"
): BonusCard {
  // Déterminer la rareté
  const rarity = preferredRarity || determineRandomRarity();

  // Générer un effet de bonus basé sur la rareté
  const effect = generateBonusEffect(rarity);

  // Choisir une famille aléatoire
  const families: BonusFamily[] = [
    "Strategie",
    "Fortune",
    "Chance",
    "Habileté",
    "Aventure",
  ];
  const family = families[Math.floor(Math.random() * families.length)];

  // Générer un nom basé sur l'effet et la famille
  const name = generateCardName(effect.type, family, rarity);

  // Calculer le coût en fonction de la rareté et de la valeur de l'effet
  const cost = calculateCardCost(rarity, effect.value);

  return {
    id: uuidv4(),
    name,
    rarity,
    effect: effect.description,
    points: Math.floor(effect.value * getMultiplierForRarity(rarity)),
    family,
    cost,
  };
}

/**
 * Détermine une rareté aléatoire selon des probabilités prédéfinies
 */
function determineRandomRarity(): "Commune" | "Rare" | "Épique" | "Légendaire" {
  const roll = Math.random();

  if (roll < 0.6) return "Commune";
  if (roll < 0.85) return "Rare";
  if (roll < 0.95) return "Épique";
  return "Légendaire";
}

/**
 * Génère un effet de bonus approprié basé sur la rareté
 */
function generateBonusEffect(rarity: string): BonusEffect {
  // Ajuster les valeurs des effets en fonction de la rareté
  const multiplier = getMultiplierForRarity(rarity);

  // Générer un type d'effet aléatoire
  const effectTypes: BonusEffectType[] = [
    "pointMultiplier",
    "flatBonus",
    "handBonus",
    "defensiveBonus",
    "improveBonus",
  ];

  const type = effectTypes[Math.floor(Math.random() * effectTypes.length)];

  // Générer des valeurs et descriptions d'effet selon le type
  switch (type) {
    case "pointMultiplier":
      const multiplierValue = 1 + 0.1 * multiplier;
      return {
        type,
        value: multiplierValue,
        description: `Multiplie les points gagnés par ${multiplierValue.toFixed(
          1
        )}`,
      };

    case "flatBonus":
      const bonusValue = Math.floor(10 * multiplier);
      return {
        type,
        value: bonusValue,
        description: `+${bonusValue} points à chaque main jouée`,
      };

    case "handBonus":
      const handTypes = ["Paire", "Brelan", "Couleur", "Full", "Suite"];
      const selectedHand =
        handTypes[Math.floor(Math.random() * handTypes.length)];
      const handBonusValue = Math.floor(15 * multiplier);
      return {
        type,
        value: handBonusValue,
        description: `+${handBonusValue} points supplémentaires pour chaque ${selectedHand}`,
        condition: selectedHand,
      };

    case "defensiveBonus":
      const defenseValue = Math.floor(5 * multiplier);
      return {
        type,
        value: defenseValue,
        description: `Réduit les dégâts subis de ${defenseValue} points`,
      };

    case "improveBonus":
      const improveBonusValue = Math.floor(2 * multiplier);
      return {
        type,
        value: improveBonusValue,
        description: `+${improveBonusValue} au bonus d'amélioration de toutes les cartes`,
      };

    default:
      return {
        type: "flatBonus",
        value: 10,
        description: "Bonus standard de 10 points",
      };
  }
}

/**
 * Retourne le multiplicateur approprié pour la rareté donnée
 */
function getMultiplierForRarity(rarity: string): number {
  switch (rarity) {
    case "Commune":
      return 1;
    case "Rare":
      return 2;
    case "Épique":
      return 3.5;
    case "Légendaire":
      return 5;
    default:
      return 1;
  }
}

/**
 * Génère un nom de carte thématique basé sur le type d'effet et la famille
 */
function generateCardName(
  type: BonusEffectType,
  family: string,
  rarity: string
): string {
  // Préfixes selon la rareté
  const rarityPrefixes = {
    Commune: ["Simple", "Basique", "Ordinaire", "Commune"],
    Rare: ["Précieuse", "Excellente", "Notable", "Distinguée"],
    Épique: ["Extraordinaire", "Magnifique", "Imposante", "Glorieuse"],
    Légendaire: ["Mythique", "Légendaire", "Divine", "Ancestrale"],
  };

  // Suffixes selon le type d'effet
  const effectSuffixes = {
    pointMultiplier: [
      "de Multiplication",
      "d'Amplification",
      "d'Intensification",
    ],
    flatBonus: ["de Bonus", "de Prime", "d'Avantage"],
    handBonus: ["de Maîtrise", "de Technique", "d'Expertise"],
    defensiveBonus: ["de Protection", "de Défense", "de Bouclier"],
    improveBonus: ["d'Amélioration", "d'Évolution", "de Progression"],
  };

  // Composants du nom selon la famille
  const familyNames = {
    Strategie: ["Tactique", "Stratégie", "Plan", "Méthode"],
    Fortune: ["Fortune", "Richesse", "Prospérité", "Abondance"],
    Chance: ["Chance", "Destin", "Hasard", "Opportunité"],
    Habileté: ["Habileté", "Compétence", "Talent", "Maîtrise"],
    Aventure: ["Aventure", "Quête", "Exploration", "Voyage"],
  };

  // Sélectionner des composants aléatoires pour le nom
  const prefix =
    rarityPrefixes[rarity][
      Math.floor(Math.random() * rarityPrefixes[rarity].length)
    ];
  const suffix =
    effectSuffixes[type][
      Math.floor(Math.random() * effectSuffixes[type].length)
    ];
  const familyName =
    familyNames[family][Math.floor(Math.random() * familyNames[family].length)];

  return `${prefix} ${familyName} ${suffix}`;
}

/**
 * Calcule le coût d'une carte en fonction de sa rareté et de la valeur de son effet
 */
function calculateCardCost(rarity: string, effectValue: number): number {
  const baseMultiplier = getMultiplierForRarity(rarity);
  const baseCost = {
    Commune: 100,
    Rare: 250,
    Épique: 500,
    Légendaire: 1000,
  };

  return Math.floor(baseCost[rarity] * (effectValue / 10) * baseMultiplier);
}

/**
 * Applique les effets des cartes bonus à un calcul de points
 */
export function applyBonusCardEffects(
  basePoints: number,
  activeBonusCards: BonusCard[],
  handRank: string
): {
  totalPoints: number;
  bonusBreakdown: { card: string; effect: string; points: number }[];
} {
  let totalPoints = basePoints;
  const bonusBreakdown = [];

  // Parcourir toutes les cartes bonus actives
  for (const card of activeBonusCards) {
    // Extraire le type et la valeur de l'effet à partir de la description
    const { effectType, effectValue, condition } = parseEffectDescription(
      card.effect
    );

    // Vérifier si la condition est remplie (si applicable)
    if (condition && !handRank.includes(condition)) {
      continue; // Passer au prochain bonus si la condition n'est pas remplie
    }

    // Appliquer l'effet selon son type
    let bonusPoints = 0;

    switch (effectType) {
      case "pointMultiplier":
        bonusPoints = Math.floor(basePoints * (effectValue - 1));
        totalPoints += bonusPoints;
        break;

      case "flatBonus":
        bonusPoints = effectValue;
        totalPoints += bonusPoints;
        break;

      case "handBonus":
        if (handRank.includes(condition)) {
          bonusPoints = effectValue;
          totalPoints += bonusPoints;
        }
        break;

      // Autres types d'effets...
    }

    // Ajouter au tableau de ventilation des bonus
    if (bonusPoints > 0) {
      bonusBreakdown.push({
        card: card.name,
        effect: card.effect,
        points: bonusPoints,
      });
    }
  }

  return { totalPoints, bonusBreakdown };
}

/**
 * Parse la description d'un effet pour en extraire les informations
 */
function parseEffectDescription(description: string): {
  effectType: BonusEffectType;
  effectValue: number;
  condition?: string;
} {
  // Analyser la description pour déterminer le type d'effet et sa valeur
  if (description.includes("Multiplie")) {
    const multiplier = parseFloat(description.match(/\d+\.\d+/)[0]);
    return { effectType: "pointMultiplier", effectValue: multiplier };
  }

  if (description.includes("points à chaque main")) {
    const bonus = parseInt(description.match(/\+(\d+)/)[1]);
    return { effectType: "flatBonus", effectValue: bonus };
  }

  if (description.includes("points supplémentaires pour chaque")) {
    const bonus = parseInt(description.match(/\+(\d+)/)[1]);
    const handType = description.match(/chaque\s+(.+)$/)[1];
    return {
      effectType: "handBonus",
      effectValue: bonus,
      condition: handType,
    };
  }

  // Fallback pour les cas non reconnus
  return { effectType: "flatBonus", effectValue: 10 };
}

/**
 * Génère un ensemble de cartes pour la boutique
 */
export function generateShopCards(
  count: number = 3,
  playerLevel: number = 1
): BonusCard[] {
  const cards: BonusCard[] = [];

  // Ajuster les probabilités de rareté en fonction du niveau du joueur
  const playerMultiplier = Math.min(1 + playerLevel * 0.05, 1.5);

  for (let i = 0; i < count; i++) {
    // Déterminer la rareté avec des chances basées sur le niveau du joueur
    const roll = Math.random() * playerMultiplier;
    let rarity: "Commune" | "Rare" | "Épique" | "Légendaire";

    if (roll < 0.6) rarity = "Commune";
    else if (roll < 0.85) rarity = "Rare";
    else if (roll < 0.95) rarity = "Épique";
    else rarity = "Légendaire";

    cards.push(generateBonusCard(rarity));
  }

  return cards;
}
