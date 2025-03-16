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
