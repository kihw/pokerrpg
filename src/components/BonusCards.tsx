// src/components/BonusCards.tsx
import React from "react";
import { Star } from "lucide-react";
import { BonusCard } from "../types/cardTypes";

interface BonusCardsProps {
  bonusCards: BonusCard[];
  activeBonusCards: BonusCard[];
  onToggleCard: (index: number) => void;
}

const BonusCards: React.FC<BonusCardsProps> = ({
  bonusCards,
  activeBonusCards,
  onToggleCard,
}) => {
  // Rarity color mapping
  const getRarityColor = (rarity: BonusCard["rarity"]) => {
    switch (rarity) {
      case "Commune":
        return "bg-gray-500";
      case "Rare":
        return "bg-blue-600";
      case "Épique":
        return "bg-purple-600";
      case "Légendaire":
        return "bg-yellow-600";
    }
  };

  if (bonusCards.length === 0) {
    return (
      <div className="bg-black bg-opacity-50 rounded-lg p-2">
        <h2 className="font-bold mb-2 text-yellow-300">Cartes bonus</h2>
        <p className="text-center text-gray-400">
          Aucune carte bonus. Achetez-en dans la boutique.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-black bg-opacity-50 rounded-lg p-2">
      <h2 className="font-bold mb-2 text-yellow-300">
        Cartes bonus ({activeBonusCards.length}/5 équipées)
      </h2>

      <div className="space-y-2">
        {bonusCards.map((card, index) => {
          const isActive = activeBonusCards.includes(card);
          const rarityColor = getRarityColor(card.rarity);

          return (
            <div
              key={index}
              className={`
                ${rarityColor} 
                p-2 rounded-lg 
                ${isActive ? "ring-2 ring-white" : ""}
                cursor-pointer hover:opacity-90 
                flex justify-between items-center
              `}
              onClick={() => onToggleCard(index)}
            >
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-bold text-sm">{card.name}</h3>
                  <span className="text-xs bg-black bg-opacity-40 px-2 py-1 rounded-full">
                    {card.rarity}
                  </span>
                </div>
                <p className="text-xs mt-1">{card.effect}</p>
                <div className="text-xs mt-1">Famille: {card.family}</div>
              </div>

              {isActive && (
                <div className="bg-white bg-opacity-20 p-1 rounded-full">
                  <Star className="text-yellow-300" size={16} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BonusCards;
