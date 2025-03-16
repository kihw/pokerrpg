// src/utils/shopManager.ts
import { BonusCard, generateBonusCard } from "../types/BonusCard";

export function generateShopCards(shopRotations: number): BonusCard[] {
  const shopItems: BonusCard[] = [];

  // Ajuster la probabilité de cartes rares en fonction des rotations
  const rarityBoost = Math.min(shopRotations * 0.05, 0.3); // Max 30% de boost

  for (let i = 0; i < 3; i++) {
    // Générer une carte bonus unique
    const card = generateBonusCard();

    // Ajuster potentiellement la rareté avec le boost de rotation
    const rarityRoll = Math.random() + rarityBoost;
    if (rarityRoll > 0.95) card.rarity = "Légendaire";
    else if (rarityRoll > 0.85) card.rarity = "Épique";
    else if (rarityRoll > 0.65) card.rarity = "Rare";

    // Calculer le coût en fonction de la rareté
    const costMultipliers = {
      Commune: 100,
      Rare: 250,
      Épique: 500,
      Légendaire: 1000,
    };
    card.points = costMultipliers[card.rarity];

    shopItems.push(card);
  }

  return shopItems;
}

export function calculateShopRotationCost(rotations: number): number {
  const BASE_COST = 50;
  const COST_INCREMENT = 25;
  return BASE_COST + rotations * COST_INCREMENT;
}

/**
 * Génère une carte bonus avec une valeur de carte de poker
 */
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
  const families = ["Stratégie", "Fortune", "Mystique", "Combat", "Destin"];

  const suit = suits[Math.floor(Math.random() * suits.length)];
  const value = values[Math.floor(Math.random() * values.length)];
  const family = families[Math.floor(Math.random() * families.length)];

  // Déterminer la rareté avec une distribution pondérée
  const rarityRoll = Math.random();
  let rarity: Rarity;

  if (rarityRoll < 0.6) rarity = "Commune";
  else if (rarityRoll < 0.85) rarity = "Rare";
  else if (rarityRoll < 0.95) rarity = "Épique";
  else rarity = "Légendaire";

  // Calculer les points en fonction de la valeur de la carte et de sa rareté
  const valuePoints = {
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

  const rarityMultiplier = {
    Commune: 1,
    Rare: 1.5,
    Épique: 2.5,
    Légendaire: 4,
  };

  const basePoints = valuePoints[value];
  const points = Math.floor(basePoints * rarityMultiplier[rarity]);

  // Générer un effet basé sur la rareté
  const effects = [
    "Augmente les points de base des paires.",
    "Ajoute un bonus aux cartes de même couleur.",
    "Multiplie les points des brelans.",
    "Réduit le coût des défausses.",
    "Ajoute un bonus aux améliorations de cartes.",
    "Augmente la chance d'obtenir des cartes de haute valeur.",
    "Donne un bonus de points en fin de partie.",
    "Améliore les points des suites.",
  ];

  const effect = effects[Math.floor(Math.random() * effects.length)];

  // Calculer le coût en fonction de la rareté et des points
  const costMultiplier = {
    Commune: 10,
    Rare: 15,
    Épique: 20,
    Légendaire: 30,
  };

  const cost = points * costMultiplier[rarity];

  // Générer un nom basé sur la famille et la rareté
  const namePrefixes = {
    Commune: ["Simple", "Basique", "Modeste"],
    Rare: ["Précieuse", "Raffinée", "Remarquable"],
    Épique: ["Extraordinaire", "Puissante", "Glorieuse"],
    Légendaire: ["Mythique", "Divine", "Légendaire"],
  };

  const name = `${
    namePrefixes[rarity][Math.floor(Math.random() * 3)]
  } Carte de ${family}`;

  return {
    id: `bonus-${suit}-${value}-${Math.floor(Math.random() * 1000)}`,
    name,
    rarity,
    effect,
    points,
    family,
    cost,
    suit,
    value,
  };
}

/**
 * Génère un ensemble de cartes pour la boutique
 */
export function generateShopCards(count: number = 3): BonusCard[] {
  const cards: BonusCard[] = [];

  for (let i = 0; i < count; i++) {
    cards.push(generateBonusCard());
  }

  return cards;
}
