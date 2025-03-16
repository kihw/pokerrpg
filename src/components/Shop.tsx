// src/components/Shop.tsx
import React from "react";
import { BonusCard } from "../types/Card";
import { RefreshCw } from "lucide-react";

interface ShopProps {
  shopCards: BonusCard[];
  onBuyCard: (index: number) => void;
}

const Shop: React.FC<ShopProps> = ({ shopCards, onBuyCard }) => {
  // Rarity color mapping
  const getRarityStyles = (rarity: BonusCard["rarity"]) => {
    switch (rarity) {
      case "Commune":
        return {
          gradient: "from-gray-700 to-gray-500",
          border: "border-gray-400",
          text: "text-gray-200",
        };
      case "Rare":
        return {
          gradient: "from-blue-700 to-blue-500",
          border: "border-blue-400",
          text: "text-blue-200",
        };
      case "Épique":
        return {
          gradient: "from-purple-700 to-purple-500",
          border: "border-purple-400",
          text: "text-purple-200",
        };
      case "Légendaire":
        return {
          gradient: "from-yellow-600 to-yellow-400",
          border: "border-yellow-300",
          text: "text-yellow-100",
        };
    }
  };

  return (
    <div className="bg-black bg-opacity-50 rounded-lg p-2">
      <h2 className="font-bold mb-2 text-yellow-300">
        Boutique de cartes bonus
      </h2>

      <div className="grid grid-cols-3 gap-2">
        {shopCards.map((card, index) => {
          const rarityStyles = getRarityStyles(card.rarity);

          return (
            <div
              key={index}
              className={`bg-gradient-to-br ${rarityStyles.gradient} 
                border ${rarityStyles.border} 
                rounded-lg p-2 flex flex-col justify-between`}
            >
              <div>
                <div className="flex justify-between items-center mb-1">
                  <h3 className={`font-bold ${rarityStyles.text}`}>
                    {card.name}
                  </h3>
                  <span className="text-xs bg-black bg-opacity-50 px-2 py-1 rounded-full">
                    {card.rarity}
                  </span>
                </div>
                <p className="text-xs mb-1">{card.effect}</p>
                <div className="text-xs">
                  Famille: <span className="font-bold">{card.family}</span>
                </div>
              </div>

              <button
                className="mt-2 w-full bg-green-600 hover:bg-green-700 
                  text-white py-1 rounded text-sm transition-colors"
                onClick={() => onBuyCard(index)}
              >
                Acheter ({card.cost})
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Shop;
