// src/components/Shop.tsx
import React, { memo, useCallback } from "react";
import { BonusCard } from "../types/cardTypes";
import { Heart, Diamond, Club, Spade } from "lucide-react";

interface ShopProps {
  shopCards: BonusCard[];
  onBuyCard: (index: number) => void;
  playerPoints: number;
  activeBonusCards?: BonusCard[]; // Make this prop optional
}

const Shop: React.FC<ShopProps> = ({
  shopCards,
  onBuyCard,
  playerPoints,
  activeBonusCards = [], // Provide a default empty array
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
    <div className="bg-black bg-opacity-50 rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-yellow-300 text-lg">
          Boutique de cartes bonus
        </h2>

        <div className="bg-yellow-900 bg-opacity-50 px-3 py-1 rounded-full text-sm">
          <span className="font-bold text-yellow-300">
            {activeBonusCards.length}
          </span>
          <span className="text-yellow-200">/5 cartes équipées</span>
        </div>
      </div>

      <div className="mb-3 text-sm text-gray-300">
        Collectionnez des cartes bonus et formez des combinaisons de poker pour
        obtenir des bonus spéciaux!
      </div>

      {!shopCards || shopCards.length === 0 ? (
        <p className="text-center text-gray-400 py-4">
          La boutique est vide. Revenez plus tard.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
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
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className={`font-bold ${rarityStyles.text}`}>
                      {card.name}
                    </h3>
                    <span className="text-xs bg-black bg-opacity-50 px-2 py-1 rounded-full">
                      {card.rarity}
                    </span>
                  </div>

                  <div className="flex items-center mb-2">
                    <div className="bg-white rounded-md p-1 mr-2">
                      {card.suit && getSuitIcon(card.suit)}
                    </div>
                    <span className="font-bold text-lg">{card.value}</span>
                  </div>

                  <p className="text-sm mb-2">{card.effect}</p>

                  <div className="text-xs mb-3">
                    <span className="text-gray-300">Famille: </span>
                    <span className={`font-bold ${rarityStyles.text}`}>
                      {card.family}
                    </span>
                  </div>
                </div>

                <div className="mt-auto">
                  <div className="text-xs mb-1 text-gray-300">
                    Bonus de points: +{card.points}
                  </div>

                  <button
                    className={`w-full ${
                      canBuy
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-gray-600 cursor-not-allowed"
                    } 
                      text-white py-2 rounded font-bold transition-colors`}
                    onClick={() => canBuy && onBuyCard(index)}
                    disabled={!canBuy}
                  >
                    Acheter ({card.cost})
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-4 bg-blue-900 bg-opacity-30 p-3 rounded-lg text-sm">
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
