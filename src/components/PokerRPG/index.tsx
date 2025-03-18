// src/components/PokerRPG/index.tsx
import React, { useEffect } from "react";
import { useGameContext } from "../../context/GameContext";

// Sous-composants
import StartScreen from "./StartScreen";
import GameOverScreen from "./GameOverScreen";
import GameHeader from "./GameHeader";
import MessageBox from "./MessageBox";
import CardArea from "../CardArea";
import ShopUpgradeArea from "./ShopUpgradeArea";
import PermanentBonusManager from "../PermanentBonusManager";
import GameStats from "./GameStats";
import GameDashboard from "../GameDashboard";
import BettingSystem from "../BettingSystem";

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
    buyShopCard,
    shopCards,
    improvableCards,
    improveCard,
    currentStreak,
    streakMultiplier,
    lastPointsEarned,
    lastHPChange,
    currentBet,
    placeBet,
  } = useGameContext();

  // Ensure game is initialized on component mount
  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  // Render start screen when game is idle
  if (gameStatus === "idle") {
    return <StartScreen onStartGame={startGame} />;
  }

  // Game over screen
  if (gameStatus === "gameOver") {
    return (
      <GameOverScreen
        playerPoints={playerPoints}
        onRestartGame={initializeGame}
      />
    );
  }

  // Main game rendering
  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      {/* Game Header */}
      <GameHeader
        playerHP={playerHP}
        playerPoints={playerPoints}
        round={round}
      />

      {/* Message Area */}
      <MessageBox message={message} />

      {/* Game Dashboard - Nouveau composant */}
      <GameDashboard
        playerHP={playerHP}
        playerPoints={playerPoints}
        currentStreak={currentStreak}
        streakMultiplier={streakMultiplier}
        round={round}
        lastPointsEarned={lastPointsEarned}
        lastHPChange={lastHPChange}
      />

      {/* Système de pari - Nouveau composant */}
      {gameStatus === "selecting" && (
        <BettingSystem
          playerHP={playerHP}
          onBet={placeBet}
          disabled={selectedCards.length === 0}
          currentBet={currentBet}
        />
      )}

      {/* Main Game Area */}
      <div className="flex flex-col lg:flex-row lg:space-x-4 space-y-4 lg:space-y-0">
        {/* Left Column - Game Content */}
        <div className="w-full lg:w-2/3 space-y-4">
          {/* Card Selection/Playing Area */}
          {(gameStatus === "selecting" || gameStatus === "playing") && (
            <CardArea
              gameStatus={gameStatus}
              playerHand={playerHand}
              selectedCards={selectedCards}
              playedHand={playedHand}
              discardRemaining={discardRemaining}
              onSelectCard={selectCard}
              onPlayHand={playHand}
              onDiscardCards={discardCards}
              onRedraw={redraw}
            />
          )}

          {/* Shop and Upgrades (shown conditionally) */}
          {showShopAndUpgrades ? (
            <ShopUpgradeArea
              shopCards={shopCards}
              availableCards={improvableCards}
              playerPoints={playerPoints}
              onBuyCard={buyShopCard}
              onImproveCard={improveCard}
            />
          ) : (
            gameStatus === "playing" && (
              <div className="bg-black bg-opacity-50 rounded-lg p-4 mb-4">
                {playerHand.length === 0 ? (
                  <div>
                    {/* Bouton pour démarrer une nouvelle partie */}
                    <div className="flex justify-center mt-6">
                      <button
                        onClick={handleStartNewGame}
                        className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg text-white font-bold flex items-center"
                      >
                        Nouvelle Partie{" "}
                        <ArrowRight className="ml-2" size={20} />
                      </button>
                    </div>

                    <p className="text-center text-yellow-300 font-bold mb-3">
                      Partie terminée ! Vous pouvez maintenant visiter la
                      boutique.
                    </p>
                    <button
                      onClick={() => {}}
                      className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-2 rounded-lg font-bold"
                    >
                      Visiter la Boutique
                    </button>
                  </div>
                ) : (
                  <p className="text-center text-gray-400">
                    La boutique sera disponible à la fin de la partie.
                  </p>
                )}
              </div>
            )
          )}
        </div>

        {/* Right Column - Bonus Cards and Permanent Bonuses */}
        <div className="w-full lg:w-1/3 space-y-4">
          <PermanentBonusManager />
          <GameStats playerPoints={playerPoints} round={round} />
        </div>
      </div>

      {/* Aide contextuelle */}
      <div className="mt-6 p-4 bg-gray-800 bg-opacity-50 rounded-lg text-sm text-gray-300">
        <h3 className="font-bold text-yellow-300 mb-2">Comment jouer</h3>
        <ul className="list-disc pl-4 space-y-1">
          <li>Sélectionnez entre 1 et 5 cartes pour former une main</li>
          <li>
            Plus la combinaison est forte, plus vous gagnez de points et de PV
          </li>
          <li>
            Enchaînez de bonnes mains pour former une série et obtenir un
            multiplicateur
          </li>
          <li>Pariez vos PV pour augmenter vos gains potentiels</li>
          <li>
            À la fin de la partie, utilisez vos points pour améliorer votre
            personnage
          </li>
        </ul>
      </div>
    </div>
  );
};

export default PokerRPG;
