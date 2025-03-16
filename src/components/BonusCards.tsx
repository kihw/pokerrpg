// src/components/BonusCards.tsx
import React, { memo, useCallback, useMemo } from "react";
import { BonusCard } from "../types/cardTypes";
import { Star, Heart, Diamond, Club, Spade, Award } from "lucide-react";
import { evaluateHand } from "../utils/scoring";

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
  // Rarity color mapping - memoized outside des cycles de render
  const getRarityColor = useCallback((rarity: BonusCard["rarity"]) => {
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
  }, []);

  // Fonction pour obtenir l'icône correspondant à la couleur de la carte
  const getSuitIcon = useCallback((suit: string) => {
    switch (suit) {
      case "♥":
        return <Heart className="text-red-500" size={16} />;
      case "♦":
        return <Diamond className="text-red-500" size={16} />;
      case "♣":
        return <Club className="text-white" size={16} />;
      case "♠":
        return <Spade className="text-white" size={16} />;
      default:
        return null;
    }
  }, []);

  // Calcul du bonus de combinaison si les cartes actives forment une main de poker
  const pokerCombinationBonus = useMemo(() => {
    if (activeBonusCards.length === 5) {
      const { rank, isValid } = evaluateHand(activeBonusCards);

      if (isValid) {
        const bonusMultipliers = {
          "Haute carte": 1,
          Paire: 1.2,
          "Double paire": 1.5,
          Brelan: 2,
          Suite: 2.5,
          Couleur: 3,
          Full: 3.5,
          Carré: 4,
          "Quinte flush": 5,
        };

        return {
          rank,
          multiplier: bonusMultipliers[rank] || 1,
        };
      }
    }

    return null;
  }, [activeBonusCards]);

  if (bonusCards.length === 0) {
    return (
      <div className="bg-black bg-opacity-50 rounded-lg p-4">
        <h2 className="font-bold mb-3 text-yellow-300">Cartes bonus</h2>
        <p className="text-center text-gray-400 py-4">
          Aucune carte bonus. Achetez-en dans la boutique.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-black bg-opacity-50 rounded-lg p-4">
      <h2 className="font-bold mb-3 text-yellow-300">
        Cartes bonus ({activeBonusCards.length}/5 équipées)
      </h2>

      {pokerCombinationBonus && (
        <div className="mb-4 bg-green-900 bg-opacity-40 p-3 rounded-lg flex items-center">
          <Award className="text-yellow-400 mr-2" size={20} />
          <div>
            <div className="text-green-300 font-bold">
              Combinaison: {pokerCombinationBonus.rank}
            </div>
            <div className="text-sm text-green-200">
              Multiplicateur de points: x
              {pokerCombinationBonus.multiplier.toFixed(1)}
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {bonusCards.map((card, index) => {
          const isActive = activeBonusCards.includes(card);
          const rarityColor = getRarityColor(card.rarity);

          return (
            <div
              key={index}
              className={`
                ${rarityColor} 
                p-3 rounded-lg 
                ${isActive ? "ring-2 ring-white" : ""}
                cursor-pointer hover:opacity-90 
                flex justify-between items-center
              `}
              onClick={() => onToggleCard(index)}
            >
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <div className="bg-white bg-opacity-90 rounded p-1">
                    {card.suit && getSuitIcon(card.suit)}
                  </div>
                  <div className="font-bold text-lg">{card.value}</div>
                  <span className="text-xs bg-black bg-opacity-40 px-2 py-1 rounded-full">
                    {card.rarity}
                  </span>
                </div>

                <h3 className="font-bold text-sm mb-1">{card.name}</h3>
                <p className="text-xs">{card.effect}</p>

                <div className="flex justify-between mt-2">
                  <div className="text-xs">Famille: {card.family}</div>
                  <div className="text-xs font-bold">+{card.points} points</div>
                </div>
              </div>

              {isActive && (
                <div className="bg-white bg-opacity-20 p-1 rounded-full ml-2">
                  <Star className="text-yellow-300" size={20} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {activeBonusCards.length === 0 && (
        <div className="mt-4 text-sm text-gray-400 text-center">
          Sélectionnez jusqu'à 5 cartes pour les équiper et obtenir leurs bonus.
        </div>
      )}

      {activeBonusCards.length > 0 && activeBonusCards.length < 5 && (
        <div className="mt-4 text-sm text-blue-300 text-center">
          Équipez {5 - activeBonusCards.length} carte
          {activeBonusCards.length < 4 ? "s" : ""} de plus pour former une
          combinaison de poker!
        </div>
      )}
    </div>
  );
};

export default memo(BonusCards);
