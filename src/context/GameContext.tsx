import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useCallback,
} from "react";
import { gameReducer, initialGameState, GameAction } from "./gameReducer";
import { ImprovableCard, BonusCard, GameState } from "../types/cardTypes";
import { GAME_RULES } from "../constants/gameRules";
import { evaluateHand, calculatePoints } from "../utils/scoring";
import { createDeck, shuffleDeck } from "../utils/deck";
import { generateShopCards } from "../utils/shopManager";
import { useProgression } from "./ProgressionContext";

interface GameStateCalculationResult {
  hpChange: number;
  pointPenalty: number;
  message: string;
  hpPercentage: number;
}

function calculateHealthChange(handRank: string): GameStateCalculationResult {
  const healthChanges = {
    "Haute carte": {
      hpChange: -GAME_RULES.DAMAGE_ON_NO_HAND,
      pointPenalty: 0.1,
      message: "Main faible ! Perdez des PV et des points.",
      hpPercentage: 0,
    },
    Paire: {
      hpChange: -10,
      pointPenalty: 0,
      message: "Paire modeste. Légère perte de PV.",
      hpPercentage: 0,
    },
    "Double paire": {
      hpChange: -5,
      pointPenalty: 0,
      message: "Double paire. Perte minime de PV.",
      hpPercentage: 0,
    },
    Brelan: {
      hpChange: 0,
      pointPenalty: 0,
      message: "Brelan. Aucun changement de PV.",
      hpPercentage: 0,
    },
    Suite: {
      hpChange: 5,
      pointPenalty: 0,
      message: "Suite ! Petit gain de PV.",
      hpPercentage: 0,
    },
    Couleur: {
      hpChange: 10,
      pointPenalty: 0,
      message: "Couleur ! Bon gain de PV.",
      hpPercentage: 0,
    },
    Full: {
      hpChange: 15,
      pointPenalty: 0,
      message: "Full ! Gain significatif de PV.",
      hpPercentage: 0,
    },
    Carré: {
      hpChange: 20,
      pointPenalty: 0,
      message: "Carré ! Grand gain de PV.",
      hpPercentage: 0,
    },
    "Quinte flush": {
      hpChange: 25,
      pointPenalty: 0,
      message: "QUINTE FLUSH ! Gain maximal de PV !",
      hpPercentage: 0,
    },
  };

  return (
    healthChanges[handRank] || {
      hpChange: -GAME_RULES.DAMAGE_ON_NO_HAND,
      pointPenalty: 0.1,
      message: "Main invalide. Perdez des PV.",
      hpPercentage: 0,
    }
  );
}

interface GameContextType extends GameState {
  initializeGame: () => void;
  startGame: () => void;
  selectCard: (card: ImprovableCard) => void;
  playHand: () => void;
  redraw: () => void;
  discardCards: (cardsToDiscard: ImprovableCard[]) => void;
  buyShopCard: (index: number) => void;
  improveCard: (card: ImprovableCard) => void;
  toggleBonusCard: (index: number) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(gameReducer, initialGameState);
  const { completeGame = () => {} } = useProgression() ?? {};

  const redraw = useCallback(() => {
    // Incrémenter le tour
    const newRound = state.round + 1;

    // Vérifier si la partie est terminée
    if (newRound > GAME_RULES.MAX_ROUNDS) {
      // Mettre à jour les statistiques de fin de partie
      completeGame({
        points: state.playerPoints,
        isWin: state.playerPoints > 0,
        roundsPlayed: state.round,
        cardsPlayed: state.playedHand.length,
        handsPlayed: {}, // À implémenter
        improvements: 0, // À implémenter
        maxCardLevel: 0, // À implémenter
        pointsSpentOnImprovements: 0,
        bonusCardsAcquired: state.bonusCards.length,
        pointsSpentOnBonusCards: 0,
      });

      dispatch({
        type: "GAME_OVER",
        payload: {
          newBestScore: Math.max(state.playerPoints, state.bestScore),
        },
      });
      return;
    }

    // Piocher une nouvelle main
    const shuffledDeck = shuffleDeck([...state.deck]);
    const newHand = shuffledDeck.slice(0, GAME_RULES.INITIAL_HAND_SIZE);
    const remainingDeck = shuffledDeck.slice(GAME_RULES.INITIAL_HAND_SIZE);

    dispatch({
      type: "REDRAW",
      payload: {
        newHand,
        remainingDeck,
        newRound,
      },
    });
  }, [
    state.round,
    state.deck,
    state.playerPoints,
    state.bestScore,
    completeGame,
  ]);

  const initializeGame = useCallback(() => {
    const newDeck = createDeck();
    const initialShopCards = generateShopCards();

    dispatch({
      type: "INITIALIZE_GAME",
      payload: {
        deck: newDeck,
        shopCards: initialShopCards,
      },
    });
  }, []);

  const startGame = useCallback(() => {
    const shuffledDeck = shuffleDeck([...state.deck]);
    const newHand = shuffledDeck.slice(0, GAME_RULES.INITIAL_HAND_SIZE);
    const remainingDeck = shuffledDeck.slice(GAME_RULES.INITIAL_HAND_SIZE);

    dispatch({
      type: "START_GAME",
      payload: {
        newHand,
        remainingDeck,
      },
    });
  }, [state.deck]);

  const selectCard = useCallback((card: ImprovableCard) => {
    dispatch({
      type: "SELECT_CARD",
      payload: { card },
    });
  }, []);

  const playHand = useCallback(() => {
    // Vérification du nombre de cartes
    if (state.selectedCards.length !== GAME_RULES.MAX_HAND_SIZE) {
      dispatch({
        type: "SET_MESSAGE",
        payload: { message: "Vous devez sélectionner exactement 5 cartes." },
      });
      return;
    }

    // Évaluer la main
    const { rank } = evaluateHand(state.selectedCards);

    // Calculer les changements de PV et de points
    const { hpChange, pointPenalty, message } = calculateHealthChange(rank);

    // Calculer les points
    const pointsResult = calculatePoints(
      state.selectedCards as ImprovableCard[],
      [],
      rank
    );

    // Calcul du pourcentage de PV
    const newHP = Math.max(
      0,
      Math.min(state.playerHP + hpChange, GAME_RULES.STARTING_HP)
    );
    const hpPercentage = (newHP / GAME_RULES.STARTING_HP) * 100;

    // Calcul du multiplicateur de points basé sur les PV
    let pointMultiplier = 1;
    if (hpPercentage < 25) pointMultiplier = 1.5;
    else if (hpPercentage < 50) pointMultiplier = 1.2;
    else if (hpPercentage < 75) pointMultiplier = 0.9;

    // Calcul final des points
    const finalPoints = Math.floor(pointsResult.totalPoints * pointMultiplier);

    // Pénalité de points pour les mauvaises mains
    const penaltyAmount =
      rank === "Haute carte" ? Math.floor(state.playerPoints * 0.1) : 0;

    // Dispatch de l'action de jeu
    dispatch({
      type: "PLAY_HAND",
      payload: {
        pointsData: {
          ...pointsResult,
          totalPoints: finalPoints,
          pointMultiplier,
          penaltyAmount,
        },
        rank,
        newHP,
        newShopCards: generateShopCards(state.totalGames),
        message: `${rank}! ${message}`,
      },
    });
  }, [
    state.selectedCards,
    state.playerHP,
    state.playerPoints,
    state.totalGames,
  ]);

  const discardCards = useCallback(
    (cardsToDiscard: ImprovableCard[]) => {
      // Vérifier le nombre de défausses restantes
      if (state.discardRemaining <= 0) {
        dispatch({
          type: "SET_MESSAGE",
          payload: { message: "Vous n'avez plus de défausses disponibles." },
        });
        return;
      }

      const currentDeck = [...state.deck];
      const currentHand = [...state.playerHand];

      // Retirer les cartes à défausser
      const newHand = currentHand.filter(
        (card) =>
          !cardsToDiscard.some((discardCard) => discardCard.id === card.id)
      );

      // Piocher de nouvelles cartes
      for (let i = 0; i < cardsToDiscard.length; i++) {
        if (currentDeck.length > 0) {
          const drawnCard = currentDeck.pop()!;
          newHand.push(drawnCard);
        }
      }

      dispatch({
        type: "DISCARD_CARDS",
        payload: {
          newHand,
          currentDeck,
        },
      });
    },
    [state.discardRemaining, state.deck, state.playerHand]
  );

  const buyShopCard = useCallback(
    (index: number) => {
      const card = state.shopCards[index];

      if (!card) {
        dispatch({
          type: "SET_MESSAGE",
          payload: { message: "Carte introuvable dans la boutique." },
        });
        return;
      }

      // Vérifier si le joueur a assez de points
      if (state.playerPoints < card.cost) {
        dispatch({
          type: "SET_MESSAGE",
          payload: {
            message: `Pas assez de points pour acheter cette carte. (${card.cost} points nécessaires)`,
          },
        });
        return;
      }

      dispatch({
        type: "BUY_SHOP_CARD",
        payload: {
          card,
          index,
        },
      });
    },
    [state.shopCards, state.playerPoints]
  );

  const improveCard = useCallback(
    (card: ImprovableCard) => {
      // Calculer le coût d'amélioration
      const improvementCost = (card.improved + 1) * 20;

      // Vérifier si le joueur a assez de points
      if (state.playerPoints < improvementCost) {
        dispatch({
          type: "SET_MESSAGE",
          payload: {
            message: `Pas assez de points pour améliorer cette carte. (${improvementCost} points nécessaires)`,
          },
        });
        return;
      }

      // Vérifier si l'amélioration maximale est atteinte
      if (card.improved >= card.maxImprovement) {
        dispatch({
          type: "SET_MESSAGE",
          payload: {
            message: `Cette carte a atteint son niveau d'amélioration maximum (${card.maxImprovement}).`,
          },
        });
        return;
      }

      dispatch({
        type: "IMPROVE_CARD",
        payload: {
          card,
          cost: improvementCost,
        },
      });
    },
    [state.playerPoints]
  );

  const toggleBonusCard = useCallback((index: number) => {
    dispatch({
      type: "TOGGLE_BONUS_CARD",
      payload: { index },
    });
  }, []);

  return (
    <GameContext.Provider
      value={{
        ...state,
        initializeGame,
        startGame,
        selectCard,
        playHand,
        redraw,
        discardCards,
        buyShopCard,
        improveCard,
        toggleBonusCard,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGameContext must be used within a GameProvider");
  }
  return context;
};
