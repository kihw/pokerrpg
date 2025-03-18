// src/components/CardArea.tsx
import React, { memo, useState, useEffect } from "react";
import { RefreshCw, ArrowUpDown, FilterX } from "lucide-react";
import Card from "./Card";
import { ImprovableCard } from "../types/cardTypes";
import { CARD_VALUE_POINTS } from "../constants/gameRules";

interface CardAreaProps {
  gameStatus: "selecting" | "playing";
  playerHand: ImprovableCard[];
  selectedCards: ImprovableCard[];
  playedHand: ImprovableCard[];
  discardRemaining: number;
  onSelectCard: (card: ImprovableCard) => void;
  onPlayHand: () => void;
  onDiscardCards: (cards: ImprovableCard[]) => void;
  onRedraw: () => void;
}

const CardArea: React.FC<CardAreaProps> = ({
  gameStatus,
  playerHand,
  selectedCards,
  playedHand,
  discardRemaining,
  onSelectCard,
  onPlayHand,
  onDiscardCards,
  onRedraw,
}) => {
  const [sortMethod, setSortMethod] = useState<"none" | "value" | "suit">(
    "none"
  );
  const [sortedHand, setSortedHand] = useState<ImprovableCard[]>(playerHand);

  // Effectuer le tri lorsque playerHand ou sortMethod change
  useEffect(() => {
    setSortedHand(sortCards(playerHand, sortMethod));
  }, [playerHand, sortMethod]);

  // Fonction pour trier les cartes
  const sortCards = (
    cards: ImprovableCard[],
    method: string
  ): ImprovableCard[] => {
    if (method === "none" || !cards || cards.length === 0) return [...cards];

    const sortedCards = [...cards];

    if (method === "value") {
      return sortedCards.sort((a, b) => {
        const valueOrderA = CARD_VALUE_POINTS[a.value] || 0;
        const valueOrderB = CARD_VALUE_POINTS[b.value] || 0;
        return valueOrderA - valueOrderB;
      });
    }

    if (method === "suit") {
      return sortedCards.sort((a, b) => {
        const suitOrder = { "♣": 1, "♦": 2, "♥": 3, "♠": 4 };
        const suitDiff = (suitOrder[a.suit] || 0) - (suitOrder[b.suit] || 0);
        if (suitDiff !== 0) return suitDiff;

        // Si même couleur, trier par valeur
        const valueOrderA = CARD_VALUE_POINTS[a.value] || 0;
        const valueOrderB = CARD_VALUE_POINTS[b.value] || 0;
        return valueOrderA - valueOrderB;
      });
    }

    return sortedCards;
  };

  return (
    <div className="bg-black bg-opacity-50 rounded-lg p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
        <h2 className="text-xl font-bold text-yellow-300">
          {gameStatus === "selecting"
            ? "Sélectionnez 1 à 5 cartes"
            : "Main jouée"}
        </h2>

        {gameStatus === "selecting" && (
          <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
            {/* Options de tri - Rendu plus visible */}
            <div className="flex items-center bg-gray-800 bg-opacity-70 p-2 rounded-lg border border-gray-600">
              <ArrowUpDown className="mr-2 text-gray-400" size={18} />
              <select
                className="bg-gray-700 text-white text-sm rounded-lg px-3 py-1 border border-gray-700 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                value={sortMethod}
                onChange={(e) =>
                  setSortMethod(e.target.value as "none" | "value" | "suit")
                }
              >
                <option value="none">Pas de tri</option>
                <option value="value">Trier par valeur</option>
                <option value="suit">Trier par couleur</option>
              </select>
            </div>

            {/* Compteur de défausses */}
            <div className="flex items-center">
              <RefreshCw className="mr-2 text-yellow-300" size={16} />
              <span className="text-sm text-gray-300">
                Défausses restantes : {discardRemaining}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Information sur le tri actif */}
      {gameStatus === "selecting" && sortMethod !== "none" && (
        <div className="bg-yellow-900 bg-opacity-30 mb-3 p-2 rounded-lg text-sm flex items-center">
          <span className="text-yellow-200">
            Tri actif: {sortMethod === "value" ? "Par valeur" : "Par couleur"}
          </span>
          <button
            className="ml-auto text-xs bg-yellow-800 hover:bg-yellow-700 px-2 py-1 rounded flex items-center"
            onClick={() => setSortMethod("none")}
          >
            <FilterX size={12} className="mr-1" /> Annuler
          </button>
        </div>
      )}

      <div className="flex flex-wrap justify-center">
        {gameStatus === "selecting"
          ? sortedHand.map((card) => (
              <Card
                key={card.id}
                card={card}
                isSelected={selectedCards.some((c) => c.id === card.id)}
                onClick={onSelectCard}
              />
            ))
          : playedHand.map((card) => (
              <Card key={card.id} card={card} isPlayable={false} />
            ))}
      </div>

      {/* Action Buttons */}
      <div className="mt-4 flex justify-center space-x-4">
        {gameStatus === "selecting" && (
          <div>
            <button
              onClick={onPlayHand}
              disabled={selectedCards.length < 1}
              className={`
                px-6 py-2 rounded-lg text-white font-bold
                ${
                  selectedCards.length >= 1
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-gray-500 cursor-not-allowed"
                }
              `}
            >
              Jouer la main ({selectedCards.length}/5)
            </button>

            {discardRemaining > 0 && selectedCards.length > 0 && (
              <button
                onClick={() => onDiscardCards(selectedCards)}
                className="ml-4 px-6 py-2 bg-yellow-600 hover:bg-yellow-700 
                  rounded-lg text-white font-bold"
              >
                Défausser ({selectedCards.length} carte(s))
              </button>
            )}
          </div>
        )}
        {gameStatus === "playing" && (
          <button
            onClick={onRedraw}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 
              rounded-lg text-white font-bold"
          >
            Nouvelle main
          </button>
        )}
      </div>

      {/* Explication des mains flexibles */}
      {gameStatus === "selecting" && (
        <div className="mt-4 text-sm text-blue-300 bg-blue-900 bg-opacity-20 p-2 rounded-lg">
          <p>
            💡 <strong>Astuce:</strong> Vous pouvez jouer de 1 à 5 cartes. Jouer
            plus de cartes augmente les chances de former de meilleures
            combinaisons et d'obtenir plus de points.
          </p>
        </div>
      )}
    </div>
  );
};

export default memo(CardArea);
