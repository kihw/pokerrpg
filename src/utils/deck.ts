// src/utils/deck.ts
import { Card } from "../types/Card";
import { SUITS, VALUES } from "../constants/gameRules";

export function shuffleDeck(deck: Card[]): Card[] {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function createDeck(): Card[] {
  const newDeck: Card[] = [];
  for (const suit of SUITS) {
    for (const value of VALUES) {
      newDeck.push({
        id: `${value}-${suit}`,
        suit,
        value,
        improved: 0,
        maxImprovement: Math.floor(Math.random() * 3) + 3, // 3-5
        improvementBonus: Math.floor(Math.random() * 3) + 1, // 1-3
      });
    }
  }
  return shuffleDeck(newDeck);
}

export function sortCards(cards: Card[], method: string = "none"): Card[] {
  const cardsCopy = [...cards];

  switch (method) {
    case "value":
      return cardsCopy.sort(
        (a, b) => VALUES.indexOf(a.value) - VALUES.indexOf(b.value)
      );
    case "suit":
      return cardsCopy.sort((a, b) => {
        const suitDiff = SUITS.indexOf(a.suit) - SUITS.indexOf(b.suit);
        return suitDiff !== 0
          ? suitDiff
          : VALUES.indexOf(a.value) - VALUES.indexOf(b.value);
      });
    case "color":
      return cardsCopy.sort((a, b) => {
        const aColor = a.suit === "♠" || a.suit === "♣" ? 0 : 1;
        const bColor = b.suit === "♠" || b.suit === "♣" ? 0 : 1;
        const colorDiff = aColor - bColor;
        return colorDiff !== 0
          ? colorDiff
          : VALUES.indexOf(a.value) - VALUES.indexOf(b.value);
      });
    default:
      return cardsCopy;
  }
}
