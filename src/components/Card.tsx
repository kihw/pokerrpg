// src/components/Card.tsx - Version optimisée
import React, { useCallback, memo } from "react";
import { ImprovableCard } from "../types/cardTypes";
import { Star } from "lucide-react";

interface CardProps {
  card: ImprovableCard;
  isSelected?: boolean;
  isPlayable?: boolean;
  onClick?: (card: ImprovableCard) => void;
  smallSize?: boolean;
}

const Card: React.FC<CardProps> = ({
  card,
  isSelected = false,
  isPlayable = true,
  onClick,
  smallSize = false,
}) => {
  if (!card) return null;

  // Determine card color based on suit
  const color =
    card.suit === "♥" || card.suit === "♦" ? "text-red-600" : "text-black";

  // Determine border and selection styles
  const borderColor = isSelected
    ? "border-yellow-400 border-4"
    : "border-gray-300 border-2";

  const opacity = isPlayable ? "opacity-100" : "opacity-70";
  const transformEffect = isPlayable
    ? "hover:scale-105 hover:shadow-lg transition-all duration-200"
    : "";

  // Card size and layout classes
  const cardStyle = `
    relative 
    ${smallSize ? "w-16 h-24" : "w-24 h-36"} 
    bg-gradient-to-br from-white to-gray-100 
    rounded-lg ${borderColor} 
    shadow-md flex flex-col justify-between 
    p-2 m-1 
    ${opacity} 
    ${transformEffect}
    ${isPlayable ? "cursor-pointer" : ""}
  `;

  // Use useCallback to memoize click handler
  const handleClick = useCallback(() => {
    if (isPlayable && onClick) {
      onClick(card);
    }
  }, [isPlayable, onClick, card]);

  return (
    <div className={cardStyle} onClick={handleClick}>
      {/* Top-left card value */}
      <div
        className={`text-left font-bold ${color} ${smallSize ? "text-sm" : ""}`}
      >
        {card.value}
      </div>

      {/* Suit in the center */}
      <div
        className={`text-center ${
          smallSize ? "text-2xl" : "text-4xl"
        } ${color}`}
      >
        {card.suit}
      </div>

      {/* Bottom-right card value */}
      <div
        className={`text-right font-bold ${color} ${
          smallSize ? "text-sm" : ""
        }`}
      >
        {card.value}
      </div>

      {/* Improvement progress indicator */}
      {card.improved > 0 && (
        <div
          className="absolute top-0 right-0 left-0 h-1 bg-yellow-400"
          style={{
            width: `${(card.improved / card.maxImprovement) * 100}%`,
          }}
        />
      )}

      {/* Improvement level badge */}
      {card.improved > 0 && (
        <div
          className={`absolute bottom-1 right-1 
            bg-gradient-to-r from-yellow-500 to-yellow-300 
            text-xs rounded-full 
            ${smallSize ? "w-4 h-4 text-xs" : "w-5 h-5"}
            flex items-center justify-center shadow-sm`}
        >
          +{card.improved}
        </div>
      )}

      {/* Max improvement indicator */}
      {card.improved >= card.maxImprovement && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className={`bg-gradient-to-r from-yellow-500 to-yellow-300 
              bg-opacity-90 rounded-full 
              ${smallSize ? "w-6 h-6" : "w-8 h-8"}
              flex items-center justify-center`}
          >
            <Star className="text-yellow-900" size={smallSize ? 12 : 16} />
          </div>
        </div>
      )}
    </div>
  );
};

// Optimiser avec memo pour éviter les re-rendus inutiles
// Utiliser une fonction de comparaison personnalisée pour déterminer si le re-rendu est nécessaire
export default memo(Card, (prevProps, nextProps) => {
  return (
    prevProps.card.id === nextProps.card.id &&
    prevProps.card.improved === nextProps.card.improved &&
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.isPlayable === nextProps.isPlayable
  );
});

// src/components/GameHeader.tsx - Version optimisée
import React, { memo } from "react";
import { Trophy, Heart, Award, Settings } from "lucide-react";
import { GAME_RULES } from "../constants/gameRules";

interface GameHeaderProps {
  playerHP: number;
  playerPoints: number;
  round: number;
}

const GameHeader: React.FC<GameHeaderProps> = ({
  playerHP,
  playerPoints,
  round,
}) => {
  return (
    <header className="bg-gradient-to-r from-green-900 via-green-800 to-green-900 p-2 rounded-lg shadow-lg border border-green-700 flex justify-between items-center">
      <div className="flex items-center">
        <div className="bg-yellow-500 p-1 rounded-lg shadow-inner mr-2">
          <Trophy className="text-yellow-900" size={20} />
        </div>
        <h1 className="text-xl font-bold tracking-wider text-yellow-300">
          POKER SOLO RPG
        </h1>
      </div>

      <div className="flex space-x-2">
        {/* HP Indicator */}
        <div className="flex items-center bg-red-900 bg-opacity-60 p-1 px-2 rounded-lg shadow-inner">
          <Heart className="text-red-500 mr-1" size={16} />
          <div>
            <div className="font-bold text-sm">{playerHP}</div>
            <div className="text-xs">/{GAME_RULES.STARTING_HP} PV</div>
          </div>
        </div>

        {/* Points Indicator */}
        <div className="flex items-center bg-yellow-900 bg-opacity-60 p-1 px-2 rounded-lg shadow-inner">
          <Award className="text-yellow-400 mr-1" size={16} />
          <div>
            <div className="font-bold text-sm">{playerPoints}</div>
            <div className="text-xs">Points</div>
          </div>
        </div>

        {/* Round Indicator */}
        <div className="flex items-center bg-blue-900 bg-opacity-60 p-1 px-2 rounded-lg shadow-inner">
          <Settings className="text-blue-400 mr-1" size={16} />
          <div>
            <div className="font-bold text-sm">
              {round}/{GAME_RULES.MAX_ROUNDS}
            </div>
            <div className="text-xs">Tour</div>
          </div>
        </div>
      </div>
    </header>
  );
};

// Utiliser memo pour éviter les re-rendus inutiles du composant
export default memo(GameHeader);

// src/components/BonusCards.tsx - Version optimisée
import React, { memo, useCallback } from "react";
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

export default memo(BonusCards);

// src/components/Shop.tsx - Version optimisée
import React, { memo, useCallback } from "react";
import { BonusCard } from "../types/cardTypes";

interface ShopProps {
  shopCards: BonusCard[];
  onBuyCard: (index: number) => void;
  playerPoints: number; // Ajout des points du joueur pour contrôler l'état des boutons
}

const Shop: React.FC<ShopProps> = ({ shopCards, onBuyCard, playerPoints }) => {
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

  return (
    <div className="bg-black bg-opacity-50 rounded-lg p-2">
      <h2 className="font-bold mb-2 text-yellow-300">
        Boutique de cartes bonus
      </h2>

      <div className="grid grid-cols-3 gap-2">
        {shopCards.map((card, index) => {
          const rarityStyles = getRarityStyles(card.rarity);
          const canBuy = playerPoints >= card.cost;

          return (
            <div
              key={index}
              className={`bg-gradient-to-br ${rarityStyles.gradient} 
                border ${rarityStyles.border} 
                rounded-lg p-2 flex flex-col justify-between`}
            >
              <div>
                <div className="flex justify-between items-center mb-1">
                  <h3 className={`font-bold ${rarityStyles.text} text-sm`}>
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
                className={`mt-2 w-full ${
                  canBuy
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-gray-600 opacity-60 cursor-not-allowed"
                } 
                  text-white py-1 rounded text-sm transition-colors`}
                onClick={() => canBuy && onBuyCard(index)}
                disabled={!canBuy}
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

// Utiliser memo avec une fonction de comparaison personnalisée
export default memo(Shop, (prevProps, nextProps) => {
  // Rerender uniquement si les cartes changent ou si les points du joueur changent assez pour affecter l'achat
  return (
    prevProps.shopCards === nextProps.shopCards &&
    // Vérifier si les changements de points affectent la capacité d'achat
    shopCardsAvailabilityUnchanged(
      prevProps.shopCards,
      prevProps.playerPoints,
      nextProps.playerPoints
    )
  );
});

// Helper function to check if points change affects card availability
function shopCardsAvailabilityUnchanged(
  shopCards: BonusCard[],
  prevPoints: number,
  nextPoints: number
): boolean {
  // Si aucun changement de points, pas besoin de vérifier
  if (prevPoints === nextPoints) return true;

  // Vérifier si les changements de points affectent la capacité d'achat
  return !shopCards.some(
    (card) =>
      (prevPoints >= card.cost && nextPoints < card.cost) ||
      (prevPoints < card.cost && nextPoints >= card.cost)
  );
}

// src/components/ImproveCards.tsx - Version optimisée
import React, { memo, useMemo } from "react";
import Card from "./Card";
import { ImprovableCard } from "../types/cardTypes";

interface ImproveCardsProps {
  availableCards: ImprovableCard[];
  onImproveCard: (card: ImprovableCard) => void;
  playerPoints: number; // Ajouter les points du joueur pour déterminer si l'amélioration est possible
}

const ImproveCards: React.FC<ImproveCardsProps> = ({
  availableCards,
  onImproveCard,
  playerPoints,
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
        {availableCards.map((card, index) => {
          // Calculer dynamiquement le coût d'amélioration
          const improvementCost = (card.improved + 1) * 20;
          const canImprove =
            card.improved < card.maxImprovement &&
            playerPoints >= improvementCost;

          return (
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
                      !canImprove
                        ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                        : "bg-yellow-600 hover:bg-yellow-700 text-white"
                    }`}
                  onClick={() => canImprove && onImproveCard(card)}
                  disabled={!canImprove}
                >
                  {card.improved >= card.maxImprovement
                    ? "MAX"
                    : `Améliorer (${improvementCost})`}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

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

// Helper pour vérifier si les points du joueur permettent d'améliorer au moins une carte
function canImproveAnyCard(cards: ImprovableCard[], points: number): boolean {
  return cards.some(
    (card) =>
      card.improved < card.maxImprovement && points >= (card.improved + 1) * 20
  );
}
