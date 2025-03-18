// src/components/ImproveCards.tsx
import React, { memo } from "react";
import Card from "./Card";
import { ImprovableCard } from "../types/cardTypes";
import { ArrowUpCircle, AlertTriangle } from "lucide-react";
import { GAME_RULES } from "../constants/gameRules";

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
      <div className="bg-black bg-opacity-50 rounded-lg p-4">
        <h2 className="font-bold mb-3 text-yellow-300">Améliorer des cartes</h2>
        <p className="text-center text-gray-400 py-4">
          Aucune carte disponible pour amélioration.
        </p>
      </div>
    );
  }

  // Trier les cartes par potentiel d'amélioration (cartes non max en premier)
  const sortedCards = [...availableCards].sort((a, b) => {
    // Priorité 1: Les cartes non-max avant les cartes max
    if (a.improved < a.maxImprovement && b.improved >= b.maxImprovement)
      return -1;
    if (a.improved >= a.maxImprovement && b.improved < b.maxImprovement)
      return 1;

    // Priorité 2: Les cartes avec un bonus d'amélioration élevé
    return b.improvementBonus - a.improvementBonus;
  });

  return (
    <div className="bg-black bg-opacity-50 rounded-lg p-4">
      <h2 className="font-bold mb-3 text-yellow-300">Améliorer des cartes</h2>

      <div className="space-y-3">
        {sortedCards.map((card, index) => {
          // Calculer dynamiquement le coût d'amélioration
          const improvementCost =
            (card.improved + 1) * GAME_RULES.BASE_IMPROVEMENT_COST;
          const canImprove =
            card.improved < card.maxImprovement &&
            playerPoints >= improvementCost;

          // Calculer le prochain bonus d'amélioration pour l'affichage
          const currentBonus = card.improved * card.improvementBonus;
          const nextBonus = (card.improved + 1) * card.improvementBonus;
          const bonusIncrease = nextBonus - currentBonus;

          return (
            <div
              key={index}
              className={`bg-gray-800 rounded-lg p-3 flex items-center ${
                card.improved >= card.maxImprovement ? "bg-opacity-40" : ""
              }`}
            >
              <Card card={card} isPlayable={false} smallSize={true} />

              <div className="flex-1 ml-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm mb-1">
                    Niveau: {card.improved}/{card.maxImprovement}
                  </div>
                  <div className="text-xs text-yellow-200">
                    Bonus: +{currentBonus} pts
                  </div>
                </div>

                <div className="w-full bg-gray-700 h-1.5 rounded-full mb-2">
                  <div
                    className="bg-gradient-to-r from-green-500 to-yellow-500 h-1.5 rounded-full"
                    style={{
                      width: `${(card.improved / card.maxImprovement) * 100}%`,
                    }}
                  ></div>
                </div>

                <div className="flex justify-between items-center">
                  <button
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all 
                      ${
                        !canImprove
                          ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                          : "bg-yellow-600 hover:bg-yellow-700 text-white"
                      }`}
                    onClick={() => canImprove && onImproveCard(card)}
                    disabled={!canImprove}
                  >
                    {card.improved >= card.maxImprovement ? (
                      <span className="flex items-center">
                        <AlertTriangle size={14} className="mr-1" />
                        MAX
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <ArrowUpCircle size={14} className="mr-1" />
                        Améliorer ({improvementCost})
                      </span>
                    )}
                  </button>

                  {card.improved < card.maxImprovement && (
                    <div className="text-xs text-green-400">
                      +{bonusIncrease} pts/main
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 text-sm text-center text-gray-400">
        Améliorez vos cartes pour obtenir plus de points à chaque fois que vous
        les jouez.
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
      card.improved < card.maxImprovement &&
      points >= (card.improved + 1) * GAME_RULES.BASE_IMPROVEMENT_COST
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
