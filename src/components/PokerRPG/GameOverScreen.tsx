// src/components/PokerRPG/GameOverScreen.tsx
import React, { memo } from "react";
import { Trophy } from "lucide-react";

interface GameOverScreenProps {
  playerPoints: number;
  onRestartGame: () => void;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({
  playerPoints,
  onRestartGame,
}) => {
  return (
    <div className="text-center bg-black bg-opacity-50 p-8 rounded-lg max-w-md w-full">
      <div className="flex justify-center mb-6">
        <Trophy className="text-red-300" size={64} />
      </div>
      <h1 className="text-3xl font-bold text-red-300 mb-4">Partie Terminée</h1>
      <div className="mb-6">
        <p className="text-gray-300">Points totaux : {playerPoints}</p>
      </div>
      <button
        onClick={onRestartGame}
        className="w-full bg-purple-600 text-white py-3 rounded-lg 
                   hover:bg-purple-700 transition-colors 
                   text-xl font-bold"
      >
        Nouvelle partie
      </button>
    </div>
  );
};

export default memo(GameOverScreen);
