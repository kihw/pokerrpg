// src/components/PokerRPG/GameStats.tsx
import React, { memo } from "react";
import { GAME_RULES } from "../../constants/gameRules";

interface GameStatsProps {
  playerPoints: number;
  round: number;
}

const GameStats: React.FC<GameStatsProps> = ({ playerPoints, round }) => {
  return (
    <div className="bg-black bg-opacity-50 rounded-lg p-4">
      <h2 className="text-xl font-bold text-yellow-300 mb-4">Statistiques</h2>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Points totaux :</span>
          <span className="font-bold">{playerPoints}</span>
        </div>
        <div className="flex justify-between">
          <span>Tours restants :</span>
          <span className="font-bold">{GAME_RULES.MAX_ROUNDS - round + 1}</span>
        </div>
      </div>
    </div>
  );
};

export default memo(GameStats);
