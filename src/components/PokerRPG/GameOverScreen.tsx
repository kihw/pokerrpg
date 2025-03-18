// src/components/PokerRPG/GameOverScreen.tsx
import React, { memo } from "react";
import { Trophy, Award, Star, Zap, BarChart2 } from "lucide-react";
import { useGameContext } from "../../context/GameContext";

interface GameOverScreenProps {
  playerPoints: number;
  onRestartGame: () => void;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({
  playerPoints,
  onRestartGame,
}) => {
  // Get additional data from context
  const { round, currentStreak, streakMultiplier } = useGameContext();

  // Determine game result message based on points
  const getResultMessage = () => {
    if (playerPoints >= 1000) return "Partie exceptionnelle !";
    if (playerPoints >= 500) return "Belle performance !";
    if (playerPoints >= 200) return "Bonne partie !";
    if (playerPoints > 0) return "Partie terminée";
    return "Vous avez perdu...";
  };

  // Determine result class based on points
  const getResultClass = () => {
    if (playerPoints >= 1000) return "text-3xl font-bold text-yellow-300";
    if (playerPoints >= 500) return "text-3xl font-bold text-green-300";
    if (playerPoints >= 200) return "text-3xl font-bold text-blue-300";
    if (playerPoints > 0) return "text-3xl font-bold text-gray-300";
    return "text-3xl font-bold text-red-300";
  };

  return (
    <div className="text-center bg-black bg-opacity-80 p-8 rounded-lg max-w-xl w-full mx-auto">
      <div className="flex justify-center mb-6">
        <Trophy
          className={playerPoints > 0 ? "text-yellow-300" : "text-red-300"}
          size={64}
        />
      </div>

      <h1 className={getResultClass()}>{getResultMessage()}</h1>

      <div className="mt-8 grid grid-cols-2 gap-4">
        <div className="bg-gray-800 bg-opacity-70 p-4 rounded-lg">
          <div className="flex items-center justify-center mb-2">
            <Award className="text-yellow-400 mr-2" size={24} />
            <h3 className="text-lg font-bold">Score final</h3>
          </div>
          <div className="text-3xl font-bold text-yellow-200">
            {playerPoints}
          </div>
        </div>

        <div className="bg-gray-800 bg-opacity-70 p-4 rounded-lg">
          <div className="flex items-center justify-center mb-2">
            <BarChart2 className="text-blue-400 mr-2" size={24} />
            <h3 className="text-lg font-bold">Tours joués</h3>
          </div>
          <div className="text-3xl font-bold text-blue-200">{round}</div>
        </div>

        <div className="bg-gray-800 bg-opacity-70 p-4 rounded-lg">
          <div className="flex items-center justify-center mb-2">
            <Star className="text-purple-400 mr-2" size={24} />
            <h3 className="text-lg font-bold">Points par tour</h3>
          </div>
          <div className="text-2xl font-bold text-purple-200">
            {round > 0 ? Math.round(playerPoints / round) : 0}
          </div>
        </div>

        <div className="bg-gray-800 bg-opacity-70 p-4 rounded-lg">
          <div className="flex items-center justify-center mb-2">
            <Zap className="text-orange-400 mr-2" size={24} />
            <h3 className="text-lg font-bold">Meilleure série</h3>
          </div>
          <div className="text-2xl font-bold text-orange-200">
            {currentStreak}{" "}
            {currentStreak >= 3 ? `(×${streakMultiplier.toFixed(1)})` : ""}
          </div>
        </div>
      </div>

      <div className="mt-6 mb-8 p-4 bg-blue-900 bg-opacity-20 rounded-lg text-sm text-blue-300 text-left">
        <p className="mb-2">
          💡 <strong>Conseil pour la prochaine partie:</strong>
        </p>
        <ul className="list-disc pl-4 space-y-1">
          {playerPoints < 200 && (
            <li>
              Essayez de former des combinaisons plus fortes comme les brelans
              et les couleurs.
            </li>
          )}
          {playerPoints < 500 && (
            <li>
              Utilisez le système de pari pour augmenter vos gains quand vous
              avez une bonne main.
            </li>
          )}
          <li>
            Enchaînez plusieurs bonnes mains pour obtenir des multiplicateurs de
            série.
          </li>
          <li>
            Améliorez vos cartes entre les parties pour obtenir plus de points.
          </li>
        </ul>
      </div>

      <button
        onClick={onRestartGame}
        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-lg 
                   hover:from-purple-700 hover:to-blue-700 transition-colors 
                   text-xl font-bold shadow-lg"
      >
        Nouvelle partie
      </button>
    </div>
  );
};

export default memo(GameOverScreen);
