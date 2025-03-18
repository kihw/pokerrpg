// src/components/Shop.tsx
import React, { memo, useCallback } from "react";
import { BonusCard } from "../types/cardTypes";
import {
  Heart,
  Diamond,
  Club,
  Spade,
  ShoppingCart,
  AlertCircle,
} from "lucide-react";

interface ShopProps {
  shopCards: BonusCard[];
  onBuyCard: (index: number) => void;
  playerPoints: number;
  activeBonusCards?: BonusCard[]; // Optional prop
}

const Shop: React.FC<ShopProps> = ({
  shopCards,
  onBuyCard,
  playerPoints,
  activeBonusCards = [], // Default to empty array
}) => {
  // Memoized function to get rarity styles
  const getRarityStyles = useCallback((rarity: BonusCard["rarity"]) => {
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
  }, []);

  // Fonction pour obtenir l'icône correspondant à la couleur de la carte
  const getSuitIcon = useCallback((suit: string) => {
    switch (suit) {
      case "♥":
        return <Heart className="text-red-500" size={16} />;
      case "♦":
        return <Diamond className="text-red-500" size={16} />;
      case "♣":
        return <Club className="text-black" size={16} />;
      case "♠":
        return <Spade className="text-black" size={16} />;
      default:
        return null;
    }
  }, []);

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center mb-2">
        <div className="bg-yellow-900 bg-opacity-50 px-3 py-1 rounded-full text-sm">
          <span className="font-bold text-yellow-300">
            {activeBonusCards.length}
          </span>
          <span className="text-yellow-200">/5 cartes équipées</span>
        </div>

        <div className="text-sm text-yellow-200 font-bold">
          Points: {playerPoints}
        </div>
      </div>

      {!shopCards || shopCards.length === 0 ? (
        <div className="text-center py-6 bg-gray-800 bg-opacity-40 rounded-lg">
          <AlertCircle className="mx-auto mb-2 text-gray-400" size={24} />
          <p className="text-gray-400">
            La boutique est vide. Revenez pour la prochaine partie.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {shopCards.map((card, index) => {
            const rarityStyles = getRarityStyles(card.rarity);
            const canBuy = playerPoints >= card.cost;

            return (
              <div
                key={index}
                className={`bg-gradient-to-br ${rarityStyles.gradient} 
                  border ${rarityStyles.border} 
                  rounded-lg p-3 flex flex-col justify-between
                  ${
                    canBuy
                      ? "hover:scale-105 transition-transform"
                      : "opacity-70"
                  }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className={`font-bold ${rarityStyles.text} text-lg`}>
                      {card.name}
                    </h3>
                    <div className="flex items-center mt-1">
                      <div className="bg-white rounded-md p-1 mr-2">
                        {card.suit && getSuitIcon(card.suit)}
                      </div>
                      <span className="font-bold text-lg">{card.value}</span>
                      <span className="text-xs bg-black bg-opacity-50 px-2 py-1 rounded-full ml-2">
                        {card.rarity}
                      </span>
                    </div>
                  </div>

                  <div className="text-sm">
                    <span className="text-green-300 font-bold">
                      +{card.points}
                    </span>
                    <span className="text-gray-300"> pts</span>
                  </div>
                </div>

                <p className="text-sm mb-3 italic">{card.effect}</p>

                <div className="flex justify-between items-center">
                  <div className="text-xs">
                    <span className="text-gray-300">Famille: </span>
                    <span className={`font-bold ${rarityStyles.text}`}>
                      {card.family}
                    </span>
                  </div>

                  <button
                    className={`flex items-center px-3 py-1 rounded ${
                      canBuy
                        ? "bg-green-600 hover:bg-green-700 text-white"
                        : "bg-gray-600 cursor-not-allowed text-gray-300"
                    }`}
                    onClick={() => canBuy && onBuyCard(index)}
                    disabled={!canBuy}
                  >
                    <ShoppingCart size={14} className="mr-1" />
                    <span>{card.cost} pts</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="bg-blue-900 bg-opacity-30 p-3 rounded-lg text-sm">
        <h3 className="font-bold text-blue-300 mb-1">Astuce</h3>
        <p className="text-gray-300">
          Formez des combinaisons de poker avec vos cartes bonus pour obtenir
          des multiplicateurs puissants. Une quinte flush dans vos cartes bonus
          pourrait multiplier vos points par 5!
        </p>
      </div>
    </div>
  );
};

// Utiliser memo pour éviter les re-rendus inutiles
export default memo(Shop, (prevProps, nextProps) => {
  // Rerender uniquement si les cartes changent ou si les points du joueur changent assez pour affecter l'achat
  return (
    prevProps.shopCards === nextProps.shopCards &&
    (prevProps.activeBonusCards?.length || 0) ===
      (nextProps.activeBonusCards?.length || 0) &&
    // Vérifier si les changements de points affectent la capacité d'achat
    !shopCardsAvailabilityChanged(
      prevProps.shopCards,
      prevProps.playerPoints,
      nextProps.playerPoints
    )
  );
});

// Helper function to check if points change affects card availability
function shopCardsAvailabilityChanged(
  shopCards: BonusCard[] = [],
  prevPoints: number,
  nextPoints: number
): boolean {
  // Si aucun changement de points, pas besoin de vérifier
  if (prevPoints === nextPoints) return false;

  // Si pas de cartes, pas de changement d'achetabilité
  if (!shopCards || shopCards.length === 0) return false;

  // Vérifier si les changements de points affectent la capacité d'achat
  return shopCards.some(
    (card) =>
      (prevPoints >= card.cost && nextPoints < card.cost) ||
      (prevPoints < card.cost && nextPoints >= card.cost)
  );
}
