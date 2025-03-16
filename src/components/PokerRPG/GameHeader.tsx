// src/components/PokerRPG/GameHeader.tsx
import React, { memo } from "react";
import { Trophy, Heart, Award, Settings } from "lucide-react";
import { GAME_RULES } from "../../constants/gameRules";

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
    <header className="bg-black bg-opacity-50 rounded-lg p-4 mb-4 flex justify-between items-center">
      <div className="flex items-center">
        <Trophy className="text-yellow-400 mr-2" size={32} />
        <h1 className="text-2xl font-bold text-yellow-300">Poker Solo RPG</h1>
      </div>

      <div className="flex space-x-4">
        {/* HP Indicator */}
        <div className="flex items-center bg-red-900 bg-opacity-60 p-2 px-3 rounded-lg">
          <Heart className="text-red-500 mr-1" size={16} />
          <div>
            <div className="font-bold">{playerHP}</div>
            <div className="text-xs">/{GAME_RULES.STARTING_HP} PV</div>
          </div>
        </div>

        {/* Points Indicator */}
        <div className="flex items-center bg-yellow-900 bg-opacity-60 p-2 px-3 rounded-lg">
          <Award className="text-yellow-400 mr-1" size={16} />
          <div>
            <div className="font-bold">{playerPoints}</div>
            <div className="text-xs">Points</div>
          </div>
        </div>

        {/* Round Indicator */}
        <div className="flex items-center bg-blue-900 bg-opacity-60 p-2 px-3 rounded-lg">
          <Settings className="text-blue-400 mr-1" size={16} />
          <div>
            <div className="font-bold">{round}</div>
            <div className="text-xs">/{GAME_RULES.MAX_ROUNDS}</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default memo(GameHeader);
