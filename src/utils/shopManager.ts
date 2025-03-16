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
