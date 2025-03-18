// src/components/CardArea.tsx
import React, { memo } from "react";
import { RefreshCw } from "lucide-react";
import Card from "./Card";
import { ImprovableCard } from "../types/cardTypes";

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
  return (
    <div className="bg-black bg-opacity-50 rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-yellow-300">
          {gameStatus === "selecting"
            ? "Sélectionnez 1 à 5 cartes"
            : "Main jouée"}
        </h2>
        {gameStatus === "selecting" && (
          <div className="flex items-center">
            <RefreshCw className="mr-2 text-yellow-300" size={16} />
            <span className="text-sm text-gray-300">
              Défausses restantes : {discardRemaining}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-wrap justify-center">
        {gameStatus === "selecting"
          ? playerHand.map((card) => (
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
