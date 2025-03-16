// src/components/PokerRPG/StartScreen.tsx
import React from "react";
import { Trophy } from "lucide-react";

interface StartScreenProps {
  onStartGame: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStartGame }) => {
  return (
    <div className="text-center bg-black bg-opacity-50 p-8 rounded-lg max-w-md w-full">
      <div className="flex justify-center mb-6">
        <Trophy className="text-yellow-300" size={64} />
      </div>
      <h1 className="text-3xl font-bold text-yellow-300 mb-4">
        Poker Solo RPG
      </h1>
      <p className="text-gray-300 mb-6">
        Un jeu de poker stratégique avec des mécaniques RPG
      </p>
      <button
        onClick={onStartGame}
        className="w-full bg-green-600 text-white py-3 rounded-lg 
                   hover:bg-green-700 transition-colors 
                   text-xl font-bold"
      >
        Démarrer une partie
      </button>
    </div>
  );
};

export default StartScreen;
