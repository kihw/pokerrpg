// src/hooks/useGameState.ts
import { useState, useCallback } from "react";
import { Card, BonusCard, GameState, GameStatus } from "../types/Card";
import { GAME_RULES, HAND_RANKINGS } from "../constants/gameRules";
import { createDeck, shuffleDeck, sortCards } from "../utils/deck";
import { evaluateHand, calculatePoints } from "../utils/scoring";
import { generateShopCards } from "../utils/shopManager";

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>({
    deck: [],
    playerHand: [],
    selectedCards: [],
    playedHand: [],
    playerHP: GAME_RULES.STARTING_HP,
    playerPoints: 0,
    round: 1,
    gameStatus: "idle",
    bonusCards: [],
    activeBonusCards: [],
  });

  const [sortMethod, setSortMethod] = useState<string>("none");
  const [message, setMessage] = useState<string>("Bienvenue au Poker Solo RPG");
  const [shopCards, setShopCards] = useState<BonusCard[]>([]);
  const [shopRotations, setShopRotations] = useState(0);
  const [showShopAndUpgrades, setShowShopAndUpgrades] = useState(false);
  const [totalGames, setTotalGames] = useState(0);
  const [bestScore, setBestScore] = useState(0);

  // Initialize game
  const initializeGame = useCallback(() => {
    const newDeck = createDeck();
    const initialShopCards = generateShopCards(shopRotations);

    setGameState((prev) => ({
      ...prev,
      deck: newDeck,
      playerHand: [],
      selectedCards: [],
      playedHand: [],
      playerHP: GAME_RULES.STARTING_HP,
      playerPoints: 0,
      round: 1,
      gameStatus: "idle",
      bonusCards: [],
      activeBonusCards: [],
    }));

    setMessage(
      'Nouvelle partie prête. Cliquez sur "Démarrer une partie" pour commencer.'
    );
    setShopCards(initialShopCards);
    setShowShopAndUpgrades(false);
  }, [shopRotations]);

  // Start game
  const startGame = useCallback(() => {
    const shuffledDeck = shuffleDeck([...gameState.deck]);

    // Deal initial hand
    const newHand = shuffledDeck.slice(0, GAME_RULES.INITIAL_DEAL);
    const remainingDeck = shuffledDeck.slice(GAME_RULES.INITIAL_DEAL);

    setGameState((prev) => ({
      ...prev,
      deck: remainingDeck,
      playerHand: sortCards(newHand, sortMethod),
      selectedCards: [],
      playedHand: [],
      gameStatus: "selecting",
      round: 1,
    }));

    setMessage(
      "Partie démarrée! Sélectionnez 5 cartes pour former votre main de poker."
    );
    setTotalGames((prev) => prev + 1);
  }, [gameState.deck, sortMethod]);

  // Select card
  const selectCard = useCallback(
    (card: Card) => {
      if (gameState.gameStatus !== "selecting") return;

      setGameState((prev) => {
        // If card already selected, deselect it
        if (prev.selectedCards.some((c) => c.id === card.id)) {
          return {
            ...prev,
            selectedCards: prev.selectedCards.filter((c) => c.id !== card.id),
          };
        }

        // If less than 5 cards selected, select the card
        if (prev.selectedCards.length < GAME_RULES.MAX_HAND_SIZE) {
          return {
            ...prev,
            selectedCards: [...prev.selectedCards, card],
          };
        }

        // Reached max selection, show message
        setMessage(
          "Vous ne pouvez sélectionner que 5 cartes. Désélectionnez-en une d'abord."
        );
        return prev;
      });
    },
    [gameState.gameStatus]
  );

  // Play hand
  const playHand = useCallback(() => {
    if (gameState.selectedCards.length !== GAME_RULES.MAX_HAND_SIZE) {
      setMessage("Vous devez sélectionner exactement 5 cartes.");
      return;
    }

    // Evaluate hand
    const { rank } = evaluateHand(gameState.selectedCards);

    // Calculate points
    const { basePoints, improvedPoints, bonusCardPoints, cardValuePoints } =
      calculatePoints(
        gameState.selectedCards,
        gameState.activeBonusCards,
        rank
      );

    const totalPoints =
      basePoints + improvedPoints + bonusCardPoints + cardValuePoints;

    // Update game state
    setGameState((prev) => {
      // Remove played cards from hand
      const newHand = prev.playerHand.filter(
        (card) => !prev.selectedCards.some((c) => c.id === card.id)
      );

      // Update points and HP
      let newHP = prev.playerHP;
      let newPoints = prev.playerPoints;

      if (basePoints > 0) {
        newPoints += totalPoints;
      } else {
        // Damage for no hand
        newHP = Math.max(0, prev.playerHP - GAME_RULES.DAMAGE_ON_NO_HAND);
      }

      return {
        ...prev,
        playerHand: newHand,
        playedHand: prev.selectedCards,
        selectedCards: [],
        playerHP: newHP,
        playerPoints: newPoints,
        gameStatus: "playing",
      };
    });

    // Set message with point breakdown
    setMessage(
      `${rank}! +${totalPoints} points ` +
        `(Base: ${basePoints}, Améliorations: ${improvedPoints}, ` +
        `Bonus: ${bonusCardPoints}, Valeur: ${cardValuePoints})`
    );

    // Show shop and upgrades
    setShowShopAndUpgrades(true);

    // Automatically rotate shop
    const newShopCards = generateShopCards(shopRotations + 1);
    setShopCards(newShopCards);
    setShopRotations((prev) => prev + 1);
  }, [
    gameState.selectedCards,
    gameState.playerHand,
    gameState.activeBonusCards,
    shopRotations,
  ]);

  // Improve card
  const improveCard = useCallback(
    (card: Card) => {
      // Check max improvement
      if (card.improved >= card.maxImprovement) {
        setMessage(
          `Cette carte a atteint son niveau d'amélioration maximum (${card.maxImprovement})!`
        );
        return;
      }

      // Calculate improvement cost
      const cost = (card.improved + 1) * 20;

      // Check if enough points
      if (gameState.playerPoints < cost) {
        setMessage(
          `Pas assez de points pour améliorer cette carte. (${cost} points nécessaires)`
        );
        return;
      }

      // Update game state
      setGameState((prev) => ({
        ...prev,
        deck: prev.deck.map((c) =>
          c.id === card.id ? { ...c, improved: c.improved + 1 } : c
        ),
        playerPoints: prev.playerPoints - cost,
      }));

      // Set improvement message
      const actualBonus = (card.improved + 1) * card.improvementBonus;
      setMessage(
        `Carte ${card.value}${card.suit} améliorée au niveau ${
          card.improved + 1
        }/` +
          `${card.maxImprovement} pour ${cost} points. ` +
          `Bonus: +${actualBonus} points par main.`
      );
    },
    [gameState.deck, gameState.playerPoints]
  );

  // Buy shop card
  const buyShopCard = useCallback(
    (index: number) => {
      const card = shopCards[index];

      if (!card) return;

      // Check if enough points
      if (gameState.playerPoints < card.cost) {
        setMessage(
          `Pas assez de points pour acheter cette carte. (${card.cost} points nécessaires)`
        );
        return;
      }

      // Update game state
      setGameState((prev) => ({
        ...prev,
        bonusCards: [...prev.bonusCards, card],
        playerPoints: prev.playerPoints - card.cost,
      }));

      // Remove card from shop
      const newShopCards = [...shopCards];
      newShopCards.splice(index, 1);
      setShopCards(newShopCards);

      // Set message
      setMessage(
        `Vous avez acheté: ${card.name} (${card.rarity}) de la famille ${card.family}`
      );
    },
    [gameState.playerPoints, shopCards]
  );

  // Toggle bonus card
  const toggleBonusCard = useCallback((index: number) => {
    setGameState((prev) => {
      const selectedCard = prev.bonusCards[index];

      // If card is already active, remove it
      if (prev.activeBonusCards.includes(selectedCard)) {
        return {
          ...prev,
          activeBonusCards: prev.activeBonusCards.filter(
            (card) => card !== selectedCard
          ),
        };
      }

      // If less than 5 active cards, add the card
      if (prev.activeBonusCards.length < 5) {
        return {
          ...prev,
          activeBonusCards: [...prev.activeBonusCards, selectedCard],
        };
      }

      // Maximum active cards reached
      setMessage(
        "Vous ne pouvez pas équiper plus de 5 cartes bonus à la fois."
      );
      return prev;
    });
  }, []);

  // Redraw hand
  const redraw = useCallback(() => {
    // Increment round
    const newRound = gameState.round + 1;

    // Check if game is over
    if (newRound > GAME_RULES.MAX_ROUNDS) {
      // End game logic
      setGameState((prev) => ({
        ...prev,
        gameStatus: "gameOver",
      }));
      setMessage("Vous avez atteint le nombre maximum de tours.");

      // Update best score
      if (gameState.playerPoints > bestScore) {
        setBestScore(gameState.playerPoints);
      }
      return;
    }

    // Deal new hand
    const shuffledDeck = shuffleDeck([...gameState.deck]);
    const newHand = shuffledDeck.slice(0, GAME_RULES.INITIAL_DEAL);
    const remainingDeck = shuffledDeck.slice(GAME_RULES.INITIAL_DEAL);

    setGameState((prev) => ({
      ...prev,
      deck: remainingDeck,
      playerHand: sortCards(newHand, sortMethod),
      selectedCards: [],
      playedHand: [],
      gameStatus: "selecting",
      round: newRound,
    }));

    // Reset shop and upgrades visibility
    setShowShopAndUpgrades(false);
  }, [
    gameState.deck,
    gameState.round,
    sortMethod,
    gameState.playerPoints,
    bestScore,
  ]);

  return {
    gameState,
    message,
    sortMethod,
    shopCards,
    shopRotations,
    showShopAndUpgrades,
    totalGames,
    bestScore,
    initializeGame,
    startGame,
    selectCard,
    playHand,
    improveCard,
    buyShopCard,
    toggleBonusCard,
    redraw,
    setSortMethod,
  };
}
