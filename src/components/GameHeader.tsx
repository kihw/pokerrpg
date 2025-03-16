// src/components/GameHeader.tsx
import React from "react";
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

export default GameHeader;
