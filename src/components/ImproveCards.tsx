// src/components/ImproveCards.tsx
import React, { memo } from "react";
import Card from "./Card";
import { ImprovableCard } from "../types/cardTypes";

interface ImproveCardsProps {
  availableCards: ImprovableCard[];
  onImproveCard: (card: ImprovableCard) => void;
  playerPoints: number;
}

const ImproveCards: React.FC<ImproveCardsProps> = ({
  availableCards,
  onImproveCard,
  playerPoints,
}) => {
  if (!availableCards || availableCards.length === 0) {
    return (
      <div className="bg-black bg-opacity-50 rounded-lg p-2">
        <h2 className="font-bold mb-2 text-yellow-300">Améliorer des cartes</h2>
        <p className="text-center text-gray-400">
          Aucune carte disponible pour amélioration.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-black bg-opacity-50 rounded-lg p-2">
      <h2 className="font-bold mb-2 text-yellow-300">Améliorer des cartes</h2>

      <div className="space-y-2">
        {availableCards.map((card, index) => {
          // Calculer dynamiquement le coût d'amélioration
          const improvementCost = (card.improved + 1) * 20;
          const canImprove =
            card.improved < card.maxImprovement &&
            playerPoints >= improvementCost;

          return (
            <div
              key={index}
              className="bg-gray-800 rounded-lg p-2 flex items-center"
            >
              <Card card={card} isPlayable={false} smallSize={true} />

              <div className="flex-1 ml-2">
                <div className="text-sm mb-1">
                  Niveau: {card.improved}/{card.maxImprovement}
                </div>
                <div className="text-xs text-yellow-200">
                  Bonus: +{card.improvementBonus}/niveau
                </div>

                <button
                  className={`mt-2 px-3 py-1 rounded-lg text-xs font-bold transition-all 
                    ${
                      !canImprove
                        ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                        : "bg-yellow-600 hover:bg-yellow-700 text-white"
                    }`}
                  onClick={() => canImprove && onImproveCard(card)}
                  disabled={!canImprove}
                >
                  {card.improved >= card.maxImprovement
                    ? "MAX"
                    : `Améliorer (${improvementCost})`}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Helper pour vérifier si les points du joueur permettent d'améliorer au moins une carte
function canImproveAnyCard(
  cards: ImprovableCard[] = [],
  points: number
): boolean {
  if (!cards || !Array.isArray(cards)) {
    return false;
  }

  return cards.some(
    (card) =>
      card.improved < card.maxImprovement && points >= (card.improved + 1) * 20
  );
}

export default memo(ImproveCards, (prevProps, nextProps) => {
  // Vérifier si les cartes ont changé
  if (prevProps.availableCards !== nextProps.availableCards) return false;

  // Vérifier si les points du joueur ont changé suffisamment pour affecter l'amélioration
  const prevCanImprove = canImproveAnyCard(
    prevProps.availableCards,
    prevProps.playerPoints
  );
  const nextCanImprove = canImproveAnyCard(
    nextProps.availableCards,
    nextProps.playerPoints
  );

  return prevCanImprove === nextCanImprove;
});
