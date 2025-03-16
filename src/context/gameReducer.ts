// src/context/gameReducer.ts
import { GameState, ImprovableCard, BonusCard } from "../types/cardTypes";
import { PermanentBonus } from "../types/PermanentBonus";
import { GAME_RULES } from "../constants/gameRules";
import { PERMANENT_BONUS_TEMPLATES } from "../types/PermanentBonus";

// Définir les types d'actions
export type GameAction =
  | { type: "INITIALIZE_GAME" }
  | {
      type: "START_GAME";
      payload: { newHand: ImprovableCard[]; remainingDeck: ImprovableCard[] };
    }
  | { type: "SELECT_CARD"; payload: { card: ImprovableCard } }
  | {
      type: "PLAY_HAND";
      payload: {
        pointsData: {
          basePoints: number;
          improvedPoints: number;
          bonusCardPoints: number;
          cardValuePoints: number;
          totalPoints: number;
        };
        rank: string;
        newHand: ImprovableCard[];
        newHP: number;
        newShopCards: BonusCard[];
      };
    }
  | {
      type: "REDRAW";
      payload: {
        newHand: ImprovableCard[];
        remainingDeck: ImprovableCard[];
        newRound: number;
      };
    }
  | {
      type: "DISCARD_CARDS";
      payload: { newHand: ImprovableCard[]; currentDeck: ImprovableCard[] };
    }
  | { type: "BUY_DISCARD" }
  | { type: "UPGRADE_BONUS"; payload: { bonusId: string; upgradeCost: number } }
  | { type: "BUY_SHOP_CARD"; payload: { card: BonusCard; index: number } }
  | { type: "TOGGLE_BONUS_CARD"; payload: { index: number } }
  | { type: "SET_MESSAGE"; payload: { message: string } }
  | { type: "GAME_OVER"; payload: { newBestScore: number } };

// État initial
export const initialGameState: GameState = {
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
  message: "Bienvenue au Poker Solo RPG",
  totalGames: 0,
  bestScore: 0,
  shopCards: [],
  showShopAndUpgrades: false,
  discardRemaining: GAME_RULES.MAX_DISCARDS,
};

// Reducer function
export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "INITIALIZE_GAME":
      return {
        ...initialGameState,
        totalGames: state.totalGames,
        bestScore: state.bestScore,
        message:
          'Nouvelle partie prête. Cliquez sur "Démarrer une partie" pour commencer.',
      };

    case "START_GAME":
      return {
        ...state,
        deck: action.payload.remainingDeck,
        playerHand: action.payload.newHand,
        selectedCards: [],
        playedHand: [],
        gameStatus: "selecting",
        round: 1,
        message:
          "Partie démarrée! Sélectionnez 5 cartes pour former votre main de poker.",
        totalGames: state.totalGames + 1,
        discardRemaining: GAME_RULES.MAX_DISCARDS,
      };

    case "SELECT_CARD":
      // Si la carte est déjà sélectionnée, la désélectionner
      if (state.selectedCards.some((c) => c.id === action.payload.card.id)) {
        return {
          ...state,
          selectedCards: state.selectedCards.filter(
            (c) => c.id !== action.payload.card.id
          ),
        };
      }

      // Si moins de 5 cartes sélectionnées, sélectionner la carte
      if (state.selectedCards.length < GAME_RULES.MAX_HAND_SIZE) {
        return {
          ...state,
          selectedCards: [...state.selectedCards, action.payload.card],
        };
      }

      // Trop de cartes sélectionnées
      return {
        ...state,
        message:
          "Vous ne pouvez sélectionner que 5 cartes. Désélectionnez-en une d'abord.",
      };

    case "PLAY_HAND":
      const { pointsData, rank, newHand, newHP, newShopCards } = action.payload;
      return {
        ...state,
        playerHand: newHand,
        playedHand: state.selectedCards,
        selectedCards: [],
        playerHP: newHP,
        playerPoints: state.playerPoints + pointsData.totalPoints,
        gameStatus: "playing",
        message: `${rank}! +${pointsData.totalPoints} points (Base: ${pointsData.basePoints}, Améliorations: ${pointsData.improvedPoints}, Bonus: ${pointsData.bonusCardPoints}, Valeur: ${pointsData.cardValuePoints})`,
        shopCards: newShopCards,
        showShopAndUpgrades: true,
      };

    case "REDRAW":
      return {
        ...state,
        deck: action.payload.remainingDeck,
        playerHand: action.payload.newHand,
        selectedCards: [],
        playedHand: [],
        gameStatus: "selecting",
        round: action.payload.newRound,
        message: "Sélectionnez 5 cartes pour former votre main de poker.",
        showShopAndUpgrades: false,
      };

    case "DISCARD_CARDS":
      return {
        ...state,
        deck: action.payload.currentDeck,
        playerHand: action.payload.newHand,
        selectedCards: [],
        message: `Cartes défaussées avec succès.`,
        discardRemaining: state.discardRemaining - 1,
      };

    case "BUY_DISCARD":
      if (state.playerPoints < GAME_RULES.DISCARD_COST) {
        return {
          ...state,
          message: `Pas assez de points pour acheter une défausse. (${GAME_RULES.DISCARD_COST} points nécessaires)`,
        };
      }
      return {
        ...state,
        playerPoints: state.playerPoints - GAME_RULES.DISCARD_COST,
        discardRemaining: state.discardRemaining + 1,
        message: `Défausse supplémentaire achetée pour ${GAME_RULES.DISCARD_COST} points`,
      };

    case "UPGRADE_BONUS":
      return {
        ...state,
        permanentBonuses: state.permanentBonuses.map((bonus) =>
          bonus.id === action.payload.bonusId
            ? { ...bonus, currentLevel: bonus.currentLevel + 1 }
            : bonus
        ),
        playerPoints: state.playerPoints - action.payload.upgradeCost,
        message: `Bonus amélioré avec succès.`,
      };

    case "BUY_SHOP_CARD":
      // Copier les cartes actuelles de la boutique
      const updatedShopCards = [...state.shopCards];
      // Retirer la carte achetée
      updatedShopCards.splice(action.payload.index, 1);

      return {
        ...state,
        bonusCards: [...state.bonusCards, action.payload.card],
        playerPoints: state.playerPoints - action.payload.card.cost,
        shopCards: updatedShopCards,
        message: `Vous avez acheté: ${action.payload.card.name} (${action.payload.card.rarity})`,
      };

    case "TOGGLE_BONUS_CARD":
      const selectedCard = state.bonusCards[action.payload.index];

      // Si la carte est déjà active, la retirer
      if (state.activeBonusCards.includes(selectedCard)) {
        return {
          ...state,
          activeBonusCards: state.activeBonusCards.filter(
            (card) => card !== selectedCard
          ),
        };
      }

      // Si moins de 5 cartes bonus actives, ajouter la carte
      if (state.activeBonusCards.length < GAME_RULES.BONUS_CARD_SLOT_LIMIT) {
        return {
          ...state,
          activeBonusCards: [...state.activeBonusCards, selectedCard],
        };
      }

      return {
        ...state,
        message: "Vous ne pouvez pas équiper plus de 5 cartes bonus à la fois.",
      };

    case "SET_MESSAGE":
      return {
        ...state,
        message: action.payload.message,
      };

    case "GAME_OVER":
      return {
        ...state,
        gameStatus: "gameOver",
        message: "Partie terminée. Félicitations!",
        bestScore: action.payload.newBestScore,
      };

    default:
      return state;
  }
}

// src/context/GameContext.tsx
import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useCallback,
} from "react";
import { gameReducer, initialGameState, GameAction } from "./gameReducer";
import { GameState, ImprovableCard, BonusCard } from "../types/cardTypes";
import {
  PermanentBonus,
  calculatePermanentBonusEffect,
  canUpgradePermanentBonus,
  getUpgradeCost,
} from "../types/PermanentBonus";
import { createDeck, shuffleDeck } from "../utils/deck";
import { GAME_RULES } from "../constants/gameRules";
import { evaluateHand, calculatePoints } from "../utils/scoring";
import { generateShopCards } from "../utils/shopManager";

interface GameContextType extends GameState {
  // Actions
  initializeGame: () => void;
  startGame: () => void;
  selectCard: (card: ImprovableCard) => void;
  playHand: () => void;
  upgradePermanentBonus: (bonusId: string) => void;
  redraw: () => void;
  discardCards: (cardsToDiscard: ImprovableCard[]) => void;
  buyDiscard: () => void;
  buyShopCard: (index: number) => void;
  toggleBonusCard: (index: number) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(gameReducer, initialGameState);

  // Actions
  const initializeGame = useCallback(() => {
    dispatch({ type: "INITIALIZE_GAME" });
  }, []);

  const startGame = useCallback(() => {
    const newDeck = createDeck();
    const shuffledDeck = shuffleDeck([...newDeck]) as ImprovableCard[];
    const newHand = shuffledDeck.slice(0, GAME_RULES.INITIAL_HAND_SIZE);
    const remainingDeck = shuffledDeck.slice(GAME_RULES.INITIAL_HAND_SIZE);

    dispatch({
      type: "START_GAME",
      payload: {
        newHand,
        remainingDeck,
      },
    });
  }, []);

  const selectCard = useCallback((card: ImprovableCard) => {
    dispatch({
      type: "SELECT_CARD",
      payload: { card },
    });
  }, []);

  const playHand = useCallback(() => {
    if (state.selectedCards.length !== GAME_RULES.MAX_HAND_SIZE) {
      dispatch({
        type: "SET_MESSAGE",
        payload: { message: "Vous devez sélectionner exactement 5 cartes." },
      });
      return;
    }

    // Évaluer la main
    const { rank } = evaluateHand(state.selectedCards);

    // Calculer les points avec les bonus permanents
    const {
      basePoints,
      improvedPoints,
      bonusCardPoints,
      cardValuePoints,
      totalPoints,
    } = calculatePoints(state.selectedCards, [], rank, state.permanentBonuses);

    // Retirer les cartes jouées de la main
    const newHand = state.playerHand.filter(
      (card) => !state.selectedCards.some((c) => c.id === card.id)
    );

    // Mettre à jour les points et les PV
    let newHP = state.playerHP;

    if (basePoints === 0) {
      // Dommages si aucune main valide
      newHP = Math.max(0, state.playerHP - GAME_RULES.DAMAGE_ON_NO_HAND);
    }

    // Générer de nouvelles cartes de boutique
    const newShopCards = generateShopCards(state.totalGames);

    dispatch({
      type: "PLAY_HAND",
      payload: {
        pointsData: {
          basePoints,
          improvedPoints,
          bonusCardPoints,
          cardValuePoints,
          totalPoints,
        },
        rank,
        newHand,
        newHP,
        newShopCards,
      },
    });
  }, [
    state.selectedCards,
    state.playerHand,
    state.playerHP,
    state.totalGames,
    state.permanentBonuses,
  ]);

  const redraw = useCallback(() => {
    // Incrémenter le tour
    const newRound = state.round + 1;

    // Vérifier si la partie est terminée
    if (newRound > GAME_RULES.MAX_ROUNDS) {
      // Mettre à jour le meilleur score
      const newBestScore = Math.max(state.playerPoints, state.bestScore);

      dispatch({
        type: "GAME_OVER",
        payload: { newBestScore },
      });
      return;
    }

    // Piocher une nouvelle main
    const shuffledDeck = shuffleDeck([...state.deck]) as ImprovableCard[];
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
  }, [state.round, state.deck, state.playerPoints, state.bestScore]);

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

  const buyDiscard = useCallback(() => {
    dispatch({ type: "BUY_DISCARD" });
  }, []);

  const upgradePermanentBonus = useCallback(
    (bonusId: string) => {
      const bonusToUpgrade = state.permanentBonuses.find(
        (bonus) => bonus.id === bonusId
      );

      if (!bonusToUpgrade) {
        dispatch({
          type: "SET_MESSAGE",
          payload: { message: "Bonus introuvable." },
        });
        return;
      }

      // Vérifier si le bonus peut être amélioré
      if (!canUpgradePermanentBonus(bonusToUpgrade, state.playerPoints)) {
        dispatch({
          type: "SET_MESSAGE",
          payload: {
            message: "Impossible d'améliorer ce bonus pour le moment.",
          },
        });
        return;
      }

      // Calculer le coût de mise à niveau
      const upgradeCost = getUpgradeCost(bonusToUpgrade);

      dispatch({
        type: "UPGRADE_BONUS",
        payload: {
          bonusId,
          upgradeCost,
        },
      });
    },
    [state.permanentBonuses, state.playerPoints]
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

  const toggleBonusCard = useCallback((index: number) => {
    dispatch({
      type: "TOGGLE_BONUS_CARD",
      payload: { index },
    });
  }, []);

  const value: GameContextType = {
    ...state,
    initializeGame,
    startGame,
    selectCard,
    playHand,
    upgradePermanentBonus,
    redraw,
    discardCards,
    buyDiscard,
    buyShopCard,
    toggleBonusCard,
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
