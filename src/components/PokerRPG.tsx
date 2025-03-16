// src/components/PokerRPG.tsx
import React, { useEffect } from "react";
import { Trophy, Heart, Award, Settings, Star, RefreshCw } from "lucide-react";

// Hooks
import { useGameContext } from "../context/GameContext";

// Components
import Card from "./Card";
import Shop from "./Shop";
import ImproveCards from "./ImproveCards";
import PermanentBonusManager from "./PermanentBonusManager";

// Constants
import { GAME_RULES } from "../constants/gameRules";

const PokerRPG: React.FC = () => {
  const {
    gameStatus,
    playerHP,
    playerPoints,
    round,
    message,
    playerHand,
    selectedCards,
    playedHand,
    showShopAndUpgrades,
    startGame,
    initializeGame,
    selectCard,
    playHand,
    redraw,
    discardCards,
    discardRemaining,
  } = useGameContext();

  // Ensure game is initialized on component mount
  useEffect(() => {
    initializeGame();
  }, []);

  // Render start screen when game is idle
  if (gameStatus === "idle") {
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
          onClick={startGame}
          className="w-full bg-green-600 text-white py-3 rounded-lg 
                     hover:bg-green-700 transition-colors 
                     text-xl font-bold"
        >
          Démarrer une partie
        </button>
      </div>
    );
  }

  // Game over screen
  if (gameStatus === "gameOver") {
    return (
      <div className="text-center bg-black bg-opacity-50 p-8 rounded-lg max-w-md w-full">
        <div className="flex justify-center mb-6">
          <Trophy className="text-red-300" size={64} />
        </div>
        <h1 className="text-3xl font-bold text-red-300 mb-4">
          Partie Terminée
        </h1>
        <div className="mb-6">
          <p className="text-gray-300">Points totaux : {playerPoints}</p>
        </div>
        <button
          onClick={initializeGame}
          className="w-full bg-purple-600 text-white py-3 rounded-lg 
                     hover:bg-purple-700 transition-colors 
                     text-xl font-bold"
        >
          Nouvelle partie
        </button>
      </div>
    );
  }

  // Main game rendering
  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      {/* Game Header */}
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

      {/* Message Area */}
      <div className="bg-black bg-opacity-50 rounded-lg p-4 mb-4 flex items-center">
        <Star className="text-yellow-400 mr-2" size={24} />
        <span className="text-white">{message}</span>
      </div>

      {/* Main Game Area */}
      <div className="flex space-x-4">
        {/* Left Column - Game Content */}
        <div className="w-2/3 space-y-4">
          {/* Card Selection/Playing Area */}
          {(gameStatus === "selecting" || gameStatus === "playing") && (
            <div className="bg-black bg-opacity-50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-yellow-300">
                  {gameStatus === "selecting"
                    ? "Sélectionnez 5 cartes"
                    : "Main jouée"}
                </h2>
                {gameStatus === "selecting" && (
                  <div className="flex items-center">
                    <RefreshCw className="mr-2 text-yellow-300" size={16} />
                    <span className="text-sm text-gray-300">
                      Défausses restantes : {discardRemaining}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap justify-center">
                {gameStatus === "selecting"
                  ? playerHand.map((card) => (
                      <Card
                        key={card.id}
                        card={card}
                        isSelected={selectedCards.some((c) => c.id === card.id)}
                        onClick={() => selectCard(card)}
                      />
                    ))
                  : playedHand.map((card) => (
                      <Card key={card.id} card={card} isPlayable={false} />
                    ))}
              </div>

              {/* Action Buttons */}
              <div className="mt-4 flex justify-center space-x-4">
                {gameStatus === "selecting" && (
                  <div>
                    <button
                      onClick={playHand}
                      disabled={selectedCards.length !== 5}
                      className={`
                        px-6 py-2 rounded-lg text-white font-bold
                        ${
                          selectedCards.length === 5
                            ? "bg-green-600 hover:bg-green-700"
                            : "bg-gray-500 cursor-not-allowed"
                        }
                      `}
                    >
                      Jouer la main ({selectedCards.length}/5)
                    </button>

                    {discardRemaining > 0 && selectedCards.length > 0 && (
                      <button
                        onClick={() => discardCards(selectedCards)}
                        className="ml-4 px-6 py-2 bg-yellow-600 hover:bg-yellow-700 
                          rounded-lg text-white font-bold"
                      >
                        Défausser ({selectedCards.length} carte(s)) - Défausses
                        restantes : {discardRemaining}
                      </button>
                    )}
                  </div>
                )}
                {gameStatus === "playing" && (
                  <button
                    onClick={redraw}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 
                      rounded-lg text-white font-bold"
                  >
                    Nouvelle main
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Shop and Upgrades (shown conditionally) */}
          {showShopAndUpgrades && (
            <div className="flex space-x-4">
              <div className="w-1/2">
                <Shop />
              </div>
              <div className="w-1/2">
                <ImproveCards />
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Bonus Cards and Permanent Bonuses */}
        <div className="w-1/3 space-y-4">
          <PermanentBonusManager />

          {/* Game Statistics */}
          <div className="bg-black bg-opacity-50 rounded-lg p-4">
            <h2 className="text-xl font-bold text-yellow-300 mb-4">
              Statistiques
            </h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Points totaux :</span>
                <span className="font-bold">{playerPoints}</span>
              </div>
              <div className="flex justify-between">
                <span>Tours restants :</span>
                <span className="font-bold">
                  {GAME_RULES.MAX_ROUNDS - round + 1}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PokerRPG;
