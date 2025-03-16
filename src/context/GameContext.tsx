// src/context/GameContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { ImprovableCard } from "../types/cardTypes";
import {
  PermanentBonus,
  PERMANENT_BONUS_TEMPLATES,
  calculatePermanentBonusEffect,
  canUpgradePermanentBonus,
  getUpgradeCost,
} from "../types/PermanentBonus";
import { createDeck, shuffleDeck } from "../utils/deck";
import { GAME_RULES } from "../constants/gameRules";
import { evaluateHand, calculatePoints } from "../utils/scoring";
import { generateShopCards } from "../utils/shopManager";

export type GameStatus = "idle" | "selecting" | "playing" | "gameOver";

export interface GameState {
  deck: ImprovableCard[];
  playerHand: ImprovableCard[];
  selectedCards: ImprovableCard[];
  playedHand: ImprovableCard[];
  playerHP: number;
  playerPoints: number;
  round: number;
  gameStatus: GameStatus;
  permanentBonuses: PermanentBonus[];
  message: string;
  totalGames: number;
  bestScore: number;
  shopCards: ImprovableCard[];
  showShopAndUpgrades: boolean;
  discardRemaining: number;
}

interface GameContextType extends GameState {
  initializeGame: () => void;
  startGame: () => void;
  selectCard: (card: ImprovableCard) => void;
  playHand: () => void;
  upgradePermanentBonus: (bonusId: string) => void;
  redraw: () => void;
  discardCards: (cardsToDiscard: ImprovableCard[]) => void;
  buyDiscard: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [gameState, setGameState] = useState<GameState>({
    deck: [],
    playerHand: [],
    selectedCards: [],
    playedHand: [],
    playerHP: GAME_RULES.STARTING_HP,
    playerPoints: 0,
    round: 1,
    gameStatus: "idle",
    permanentBonuses: [...PERMANENT_BONUS_TEMPLATES],
    message: "Bienvenue au Poker Solo RPG",
    totalGames: 0,
    bestScore: 0,
    shopCards: [],
    showShopAndUpgrades: false,
    discardRemaining: GAME_RULES.MAX_DISCARDS,
  });

  const initializeGame = useCallback(() => {
    const newDeck = createDeck();
    const initialShopCards = generateShopCards(0);

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
      permanentBonuses: [...PERMANENT_BONUS_TEMPLATES],
      message:
        'Nouvelle partie prête. Cliquez sur "Démarrer une partie" pour commencer.',
      shopCards: initialShopCards,
      showShopAndUpgrades: false,
      discardRemaining: GAME_RULES.MAX_DISCARDS,
    }));
  }, []);

  const startGame = useCallback(() => {
    const shuffledDeck = shuffleDeck([...gameState.deck]) as ImprovableCard[];
    const newHand = shuffledDeck.slice(0, GAME_RULES.INITIAL_HAND_SIZE);
    const remainingDeck = shuffledDeck.slice(GAME_RULES.INITIAL_HAND_SIZE);

    setGameState((prev) => ({
      ...prev,
      deck: remainingDeck,
      playerHand: newHand,
      selectedCards: [],
      playedHand: [],
      gameStatus: "selecting",
      round: 1,
      message:
        "Partie démarrée! Sélectionnez 5 cartes pour former votre main de poker.",
      totalGames: prev.totalGames + 1,
      discardRemaining: GAME_RULES.MAX_DISCARDS,
    }));
  }, [gameState.deck]);

  const selectCard = useCallback((card: ImprovableCard) => {
    setGameState((prev) => {
      // Si la carte est déjà sélectionnée, la désélectionner
      if (prev.selectedCards.some((c) => c.id === card.id)) {
        return {
          ...prev,
          selectedCards: prev.selectedCards.filter((c) => c.id !== card.id),
        };
      }

      // Si moins de 5 cartes sélectionnées, sélectionner la carte
      if (prev.selectedCards.length < GAME_RULES.MAX_HAND_SIZE) {
        return {
          ...prev,
          selectedCards: [...prev.selectedCards, card],
        };
      }

      // Trop de cartes sélectionnées
      return {
        ...prev,
        message:
          "Vous ne pouvez sélectionner que 5 cartes. Désélectionnez-en une d'abord.",
      };
    });
  }, []);

  const upgradePermanentBonus = useCallback((bonusId: string) => {
    setGameState((prev) => {
      const bonusToUpgrade = prev.permanentBonuses.find(
        (bonus) => bonus.id === bonusId
      );

      if (!bonusToUpgrade) {
        return {
          ...prev,
          message: "Bonus introuvable.",
        };
      }

      // Vérifier si le bonus peut être amélioré
      if (!canUpgradePermanentBonus(bonusToUpgrade, prev.playerPoints)) {
        return {
          ...prev,
          message: "Impossible d'améliorer ce bonus pour le moment.",
        };
      }

      // Calculer le coût de mise à niveau
      const upgradeCost = getUpgradeCost(bonusToUpgrade);

      // Mettre à jour les bonus et les points
      return {
        ...prev,
        permanentBonuses: prev.permanentBonuses.map((bonus) =>
          bonus.id === bonusId
            ? { ...bonus, currentLevel: bonus.currentLevel + 1 }
            : bonus
        ),
        playerPoints: prev.playerPoints - upgradeCost,
        message: `Bonus "${bonusToUpgrade.name}" amélioré au niveau ${
          bonusToUpgrade.currentLevel + 1
        }`,
      };
    });
  }, []);

  const playHand = useCallback(() => {
    if (gameState.selectedCards.length !== GAME_RULES.MAX_HAND_SIZE) {
      setGameState((prev) => ({
        ...prev,
        message: "Vous devez sélectionner exactement 5 cartes.",
      }));
      return;
    }

    // Évaluer la main
    const { rank } = evaluateHand(gameState.selectedCards);

    // Calculer les points avec les bonus permanents
    const { basePoints, improvedPoints, bonusCardPoints, cardValuePoints } =
      calculatePoints(
        gameState.selectedCards as ImprovableCard[],
        [],
        rank,
        gameState.permanentBonuses
      );

    const totalPoints =
      basePoints + improvedPoints + bonusCardPoints + cardValuePoints;

    setGameState((prev) => {
      // Continuation du fichier GameContext.tsx

      // Retirer les cartes jouées de la main
      const newHand = prev.playerHand.filter(
        (card) => !prev.selectedCards.some((c) => c.id === card.id)
      );

      // Mettre à jour les points et les PV
      let newHP = prev.playerHP;
      let newPoints = prev.playerPoints;

      if (basePoints > 0) {
        newPoints += totalPoints;
      } else {
        // Dommages si aucune main valide
        newHP = Math.max(0, prev.playerHP - GAME_RULES.DAMAGE_ON_NO_HAND);
      }

      // Générer de nouvelles cartes de boutique
      const newShopCards = generateShopCards(prev.totalGames);

      return {
        ...prev,
        playerHand: newHand,
        playedHand: prev.selectedCards as ImprovableCard[],
        selectedCards: [],
        playerHP: newHP,
        playerPoints: newPoints,
        gameStatus: "playing",
        message:
          `${rank}! +${totalPoints} points ` +
          `(Base: ${basePoints}, Améliorations: ${improvedPoints}, ` +
          `Bonus: ${bonusCardPoints}, Valeur: ${cardValuePoints})`,
        showShopAndUpgrades: true,
        shopCards: newShopCards,
      };
    });
  }, [gameState.selectedCards, gameState.permanentBonuses]);

  const redraw = useCallback(() => {
    // Incrémenter le tour
    const newRound = gameState.round + 1;

    // Vérifier si la partie est terminée
    if (newRound > GAME_RULES.MAX_ROUNDS) {
      // Mettre à jour le meilleur score
      const newBestScore = Math.max(
        gameState.playerPoints,
        gameState.bestScore
      );

      setGameState((prev) => ({
        ...prev,
        gameStatus: "gameOver",
        message: "Vous avez atteint le nombre maximum de tours.",
        bestScore: newBestScore,
      }));
      return;
    }

    // Piocher une nouvelle main
    const shuffledDeck = shuffleDeck([...gameState.deck]) as ImprovableCard[];
    const newHand = shuffledDeck.slice(0, GAME_RULES.INITIAL_HAND_SIZE);
    const remainingDeck = shuffledDeck.slice(GAME_RULES.INITIAL_HAND_SIZE);

    setGameState((prev) => ({
      ...prev,
      deck: remainingDeck,
      playerHand: newHand,
      selectedCards: [],
      playedHand: [],
      gameStatus: "selecting",
      round: newRound,
      message: "Sélectionnez 5 cartes pour former votre main de poker.",
      showShopAndUpgrades: false,
    }));
  }, [gameState.deck, gameState.round]);

  const discardCards = useCallback(
    (cardsToDiscard: ImprovableCard[]) => {
      // Vérifier le nombre de défausses restantes
      if (gameState.discardRemaining <= 0) {
        setGameState((prev) => ({
          ...prev,
          message: "Vous n'avez plus de défausses disponibles.",
        }));
        return;
      }

      setGameState((prev) => {
        const currentDeck = [...prev.deck];
        const currentHand = [...prev.playerHand];

        // Retirer les cartes à défausser
        const newHand = currentHand.filter(
          (card) =>
            !cardsToDiscard.some((discardCard) => discardCard.id === card.id)
        );

        // Piocher de nouvelles cartes
        const drawnCards: ImprovableCard[] = [];
        for (let i = 0; i < cardsToDiscard.length; i++) {
          if (currentDeck.length > 0) {
            const drawnCard = currentDeck.pop()!;
            newHand.push(drawnCard);
            drawnCards.push(drawnCard);
          }
        }

        return {
          ...prev,
          deck: currentDeck,
          playerHand: newHand,
          selectedCards: [], // Réinitialiser les cartes sélectionnées
          message: `${cardsToDiscard.length} carte(s) défaussée(s)`,
          discardRemaining: prev.discardRemaining - 1,
        };
      });
    },
    [gameState.discardRemaining]
  );

  const buyDiscard = useCallback(() => {
    setGameState((prev) => {
      // Vérifier si le joueur a assez de points
      if (prev.playerPoints < GAME_RULES.DISCARD_COST) {
        return {
          ...prev,
          message: `Pas assez de points pour acheter une défausse. (${GAME_RULES.DISCARD_COST} points nécessaires)`,
        };
      }

      // Réduire les points et augmenter les défausses
      return {
        ...prev,
        playerPoints: prev.playerPoints - GAME_RULES.DISCARD_COST,
        discardRemaining: prev.discardRemaining + 1,
        message: `Défausse supplémentaire achetée pour ${GAME_RULES.DISCARD_COST} points`,
      };
    });
  }, []);

  const value: GameContextType = {
    ...gameState,
    initializeGame,
    startGame,
    selectCard,
    playHand,
    upgradePermanentBonus,
    redraw,
    discardCards,
    buyDiscard,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

// Hook personnalisé pour utiliser le contexte de jeu
export const useGameContext = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGameContext must be used within a GameProvider");
  }
  return context;
};

export default GameContext;
