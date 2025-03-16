// src/components/PokerRPG/ShopUpgradeArea.tsx
import React, { memo } from "react";
import Shop from "../Shop";
import ImproveCards from "../ImproveCards";
import { BonusCard, ImprovableCard } from "../../types/cardTypes";

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
  return (
    <div className="flex space-x-4">
      <div className="w-1/2">
        <Shop
          shopCards={shopCards}
          onBuyCard={onBuyCard}
          playerPoints={playerPoints}
        />
      </div>
      <div className="w-1/2">
        <ImproveCards
          availableCards={availableCards}
          onImproveCard={onImproveCard}
          playerPoints={playerPoints}
        />
      </div>
    </div>
  );
};

export default memo(ShopUpgradeArea);
