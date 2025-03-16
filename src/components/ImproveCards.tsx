// src/components/ImproveCards.tsx
import React from "react";
import Card from "./Card";
import { Card as CardType } from "../types/Card";

interface ImproveCardsProps {
  availableCards: CardType[];
  onImproveCard: (card: CardType) => void;
}

const ImproveCards: React.FC<ImproveCardsProps> = ({
  availableCards,
  onImproveCard,
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
        {availableCards.map((card, index) => (
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
                    card.improved >= card.maxImprovement
                      ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                      : "bg-yellow-600 hover:bg-yellow-700 text-white"
                  }`}
                onClick={() => onImproveCard(card)}
                disabled={card.improved >= card.maxImprovement}
              >
                {card.improved >= card.maxImprovement
                  ? "MAX"
                  : `Améliorer (${(card.improved + 1) * 20})`}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImproveCards;
