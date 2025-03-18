// src/components/PokerRPG/ShopUpgradeArea.tsx
import React, { memo } from "react";
import { ShoppingBag, Hammer } from "lucide-react";
import Shop from "../Shop";
import ImproveCards from "../ImproveCards";
import { BonusCard, ImprovableCard } from "../../types/cardTypes";
import { useGameContext } from "../../context/GameContext";

interface ShopUpgradeAreaProps {
  shopCards: BonusCard[];
  availableCards: ImprovableCard[];
  playerPoints: number;
  onBuyCard: (index: number) => void;
  onImproveCard: (card: ImprovableCard) => void;
}

const ShopUpgradeArea: React.FC<ShopUpgradeAreaProps> = ({
  shopCards,
  availableCards,
  playerPoints,
  onBuyCard,
  onImproveCard,
}) => {
  // Get activeBonusCards from game context
  const { activeBonusCards = [] } = useGameContext();

  // Déterminer si le joueur est en fin de partie (magasin disponible)
  const isEndGame = true; // Dans le contexte actuel, si ce composant est affiché, c'est que le jeu le permet

  return (
    <div className="bg-black bg-opacity-70 rounded-lg p-4 mb-4">
      <h2 className="text-xl font-bold text-yellow-300 mb-3 flex items-center">
        <ShoppingBag className="mr-2" size={20} />
        Boutique de fin de partie
      </h2>

      <div className="bg-yellow-900 bg-opacity-30 p-3 rounded-lg mb-4">
        <p className="text-sm text-yellow-200">
          Félicitations! Vous avez terminé cette partie. Utilisez vos points
          pour acheter des bonus et améliorer vos cartes pour la prochaine
          partie.
        </p>
      </div>

      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
        <div className="w-full md:w-1/2">
          <div className="bg-gray-800 bg-opacity-50 rounded-lg p-3">
            <h3 className="font-bold text-blue-300 mb-2 flex items-center">
              <ShoppingBag className="mr-2" size={16} />
              Cartes Bonus
            </h3>
            <Shop
              shopCards={shopCards}
              onBuyCard={onBuyCard}
              playerPoints={playerPoints}
              activeBonusCards={activeBonusCards}
            />
          </div>
        </div>

        <div className="w-full md:w-1/2">
          <div className="bg-gray-800 bg-opacity-50 rounded-lg p-3">
            <h3 className="font-bold text-green-300 mb-2 flex items-center">
              <Hammer className="mr-2" size={16} />
              Améliorer les Cartes
            </h3>
            <ImproveCards
              availableCards={availableCards}
              onImproveCard={onImproveCard}
              playerPoints={playerPoints}
            />
          </div>
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-400 text-center">
        Vos améliorations seront conservées pour la prochaine partie. Dépensez
        judicieusement!
      </div>
    </div>
  );
};

export default memo(ShopUpgradeArea);
