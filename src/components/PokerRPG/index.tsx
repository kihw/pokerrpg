// src/components/PokerRPG/index.tsx - Le composant principal refactorisé
import React, { useEffect } from "react";
import { useGameContext } from "../../context/GameContext";

// Sous-composants
import StartScreen from "./StartScreen";
import GameOverScreen from "./GameOverScreen";
import GameHeader from "./GameHeader";
import MessageBox from "./MessageBox";
import CardArea from "./CardArea";
import ShopUpgradeArea from "./ShopUpgradeArea";
import PermanentBonusManager from "../PermanentBonusManager";
import GameStats from "./GameStats";

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

      {/* Main Game Area */}
      <div className="flex space-x-4">
        {/* Left Column - Game Content */}
        <div className="w-2/3 space-y-4">
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
          {showShopAndUpgrades && (
            <ShopUpgradeArea
              shopCards={shopCards}
              availableCards={improvableCards}
              playerPoints={playerPoints}
              onBuyCard={buyShopCard}
              onImproveCard={improveCard}
            />
          )}
        </div>

        {/* Right Column - Bonus Cards and Permanent Bonuses */}
        <div className="w-1/3 space-y-4">
          <PermanentBonusManager />
          <GameStats playerPoints={playerPoints} round={round} />
        </div>
      </div>
    </div>
  );
};

export default PokerRPG;
