// src/components/Card.tsx
import React from "react";
import { Card as CardType } from "../types/Card";
import { Star } from "lucide-react";

interface CardProps {
  card: CardType;
  isSelected?: boolean;
  isPlayable?: boolean;
  onClick?: (card: CardType) => void;
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

  return (
    <div
      className={cardStyle}
      onClick={isPlayable && onClick ? () => onClick(card) : undefined}
    >
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

export default Card;
