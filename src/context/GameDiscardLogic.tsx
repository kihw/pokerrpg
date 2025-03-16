// src/context/GameDiscardLogic.tsx
import React, { useState, useCallback } from "react";
import { ImprovableCard, BonusCard } from "../types/cardTypes";
import { GAME_RULES } from "../constants/gameRules";
import { createDeck, shuffleDeck } from "../utils/deck";
import {
  evaluateHand,
  calculateBonusHandPoints,
  checkBonusCardHand,
} from "../utils/scoring";

// Logique de défausse étendue
export function useDiscardLogic(
  initialState: GameState,
  setGameState: React.Dispatch<React.SetStateAction<GameState>>
) {
  const [discardRemaining, setDiscardRemaining] = useState(
    GAME_RULES.MAX_DISCARDS
  );

  // Fonction pour acheter une défausse supplémentaire
  const buyDiscard = useCallback(() => {
    setGameState((prev) => {
      // Vérifier si le joueur a assez de points
      if (prev.playerPoints < GAME_RULES.DISCARD_COST) {
        return {
          ...prev,
          message: `Pas assez de points pour acheter une défausse. (${GAME_RULES.DISCARD_COST} points nécessaires)`,
        };
      }

      // Réduire les points et augmenter les défausses
      return {
        ...prev,
        playerPoints: prev.playerPoints - GAME_RULES.DISCARD_COST,
        message: `Défausse supplémentaire achetée pour ${GAME_RULES.DISCARD_COST} points`,
      };
    });

    // Augmenter les défausses restantes
    setDiscardRemaining((prev) => prev + 1);
  }, [setGameState]);

  // Fonction de défausse des cartes
  const discardCards = useCallback(
    (cardsToDiscard: ImprovableCard[]) => {
      // Vérifier s'il reste des défausses
      if (discardRemaining <= 0) {
        setGameState((prev) => ({
          ...prev,
          message: "Vous n'avez plus de défausses disponibles.",
        }));
        return;
      }

      setGameState((prev) => {
        // Créer une copie du deck et de la main
        const currentDeck = [...prev.deck];
        const currentHand = [...prev.playerHand];

        // Retirer les cartes à défausser
        const newHand = currentHand.filter(
          (card) =>
            !cardsToDiscard.some((discardCard) => discardCard.id === card.id)
        );

        // Piocher de nouvelles cartes
        const drawnCards: ImprovableCard[] = [];
        for (let i = 0; i < cardsToDiscard.length; i++) {
          if (currentDeck.length > 0) {
            const drawnCard = currentDeck.pop()!;
            newHand.push(drawnCard);
            drawnCards.push(drawnCard);
          }
        }

        return {
          ...prev,
          deck: currentDeck,
          playerHand: newHand,
          message: `${cardsToDiscard.length} carte(s) défaussée(s)`,
          discardRemaining: discardRemaining - 1,
        };
      });
    },
    [discardRemaining, setGameState]
  );

  return {
    discardRemaining,
    buyDiscard,
    discardCards,
  };
}

// Vérification de la main bonus
export function checkBonusCardHand(bonusCards: BonusCard[]): number {
  // Logique de vérification de la main bonus
  const sortedCards = [...bonusCards].sort((a, b) => {
    const valueOrder = [
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
    return valueOrder.indexOf(a.value) - valueOrder.indexOf(b.value);
  });

  // Vérification des combinaisons de poker
  const handRanking = evaluateHand(sortedCards);

  // Calculer les points bonus
  const bonusPoints = calculateBonusHandPoints(handRanking.rank, sortedCards);

  return bonusPoints;
}
