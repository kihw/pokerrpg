import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useCallback,
} from "react";
import { gameReducer, initialGameState, GameAction } from "./gameReducer";
import { ImprovableCard, BonusCard } from "../types/cardTypes";
import { GAME_RULES } from "../constants/gameRules";
import {
  evaluateHand,
  calculatePoints,
  calculateHealthChange,
} from "../utils/scoring";
import { createDeck, shuffleDeck } from "../utils/deck";
import { generateShopCards } from "../utils/shopManager";
import {
  PermanentBonus,
  getUpgradeCost,
  canUpgradePermanentBonus,
} from "../types/PermanentBonus";
import { useProgression } from "./ProgressionContext";

interface GameContextType {
  // État du jeu
  gameStatus: string;
  playerHP: number;
  playerPoints: number;
  round: number;
  message: string;
  playerHand: ImprovableCard[];
  selectedCards: ImprovableCard[];
  playedHand: ImprovableCard[];
  showShopAndUpgrades: boolean;
  discardRemaining: number;
  bonusCards: BonusCard[];
  activeBonusCards: BonusCard[];
  shopCards: BonusCard[];
  improvableCards: ImprovableCard[];
  permanentBonuses: PermanentBonus[];
  currentStreak: number;
  streakMultiplier: number;
  lastPointsEarned: number;
  lastHPChange: number;
  currentBet: {
    amount: number;
    type: string;
    multiplier: number;
  };

  // Actions
  initializeGame: () => void;
  startGame: () => void;
  selectCard: (card: ImprovableCard) => void;
  playHand: () => void;
  redraw: () => void;
  discardCards: (cardsToDiscard: ImprovableCard[]) => void;
  buyShopCard: (index: number) => void;
  improveCard: (card: ImprovableCard) => void;
  toggleBonusCard: (index: number) => void;
  placeBet: (amount: number, betType: "safe" | "risky" | "all-in") => void;
  upgradePermanentBonus: (bonusId: string) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(gameReducer, initialGameState);
  const { completeGame = () => {} } = useProgression() ?? {};

  // Initialiser le jeu
  const initializeGame = useCallback(() => {
    const newDeck = createDeck();
    const initialShopCards = generateShopCards();

    // Créer la liste des cartes améliorables à partir du deck
    const improvableCards = newDeck.slice(0, 5); // Prendre juste quelques cartes pour commencer

    dispatch({
      type: "INITIALIZE_GAME",
      payload: {
        deck: newDeck,
        shopCards: initialShopCards,
        improvableCards,
      },
    });
  }, []);

  // Démarrer une partie
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

  // Sélectionner une carte
  const selectCard = useCallback((card: ImprovableCard) => {
    dispatch({
      type: "SELECT_CARD",
      payload: { card },
    });
  }, []);

  // Jouer la main sélectionnée
  const playHand = useCallback(() => {
    // Vérification du nombre de cartes - maintenant 1 à 5 cartes
    if (state.selectedCards.length < 1 || state.selectedCards.length > 5) {
      dispatch({
        type: "SET_MESSAGE",
        payload: { message: "Vous devez sélectionner entre 1 et 5 cartes." },
      });
      return;
    }

    // Évaluer la main
    const { rank, isValid } = evaluateHand(state.selectedCards);

    // Calculer les changements de PV et de points
    const healthChangeResult = calculateHealthChange(
      rank,
      state.selectedCards.length
    );

    // Calculer les points
    const pointsResult = calculatePoints(
      state.selectedCards,
      [],
      rank,
      state.permanentBonuses
    );

    // Calcul du pourcentage de PV
    let newHP = Math.max(
      0,
      Math.min(
        state.playerHP + healthChangeResult.hpChange,
        GAME_RULES.STARTING_HP
      )
    );
    const hpPercentage = (newHP / GAME_RULES.STARTING_HP) * 100;

    // Calcul du multiplicateur de points basé sur les PV
    let pointMultiplier = 1;
    if (hpPercentage < 25) pointMultiplier = 1.5; // Bonus de dernier recours
    else if (hpPercentage < 50) pointMultiplier = 1.2; // Bonus de motivation
    else if (hpPercentage < 75) pointMultiplier = 1; // Normal

    // Traiter le pari si actif
    let betBonus = 0;
    let betMessage = "";

    if (state.currentBet.amount > 0) {
      const isWinningHand = healthChangeResult.hpChange >= 0;

      if (isWinningHand) {
        // Calculer le bonus de points du pari
        const betWinAmount = Math.floor(
          state.currentBet.amount * state.currentBet.multiplier
        );
        betBonus = betWinAmount;
        betMessage = ` 💰 Pari gagné: +${betWinAmount} PV et bonus de points!`;

        // Restaurer les PV avec le multiplicateur
        newHP = Math.min(GAME_RULES.STARTING_HP, newHP + betWinAmount);
      } else {
        betMessage = ` 💸 Pari perdu: ${state.currentBet.amount} PV perdus!`;
        // Les PV ont déjà été déduits lors du placement du pari
      }
    }

    // Calcul final des points avec le bonus de pari
    const finalPoints = Math.floor(
      pointsResult.totalPoints * pointMultiplier + betBonus
    );

    // Pénalité de points pour les mauvaises mains
    const penaltyAmount =
      healthChangeResult.pointPenalty > 0
        ? Math.floor(state.playerPoints * healthChangeResult.pointPenalty)
        : 0;

    // Dispatch de l'action de jeu
    dispatch({
      type: "PLAY_HAND",
      payload: {
        pointsData: {
          ...pointsResult,
          totalPoints: finalPoints,
          pointMultiplier,
          penaltyAmount,
          betBonus,
        },
        rank,
        newHP,
        newShopCards: generateShopCards(state.totalGames),
        message: `${rank}! ${healthChangeResult.message}${betMessage}`,
        resetBet: true, // pour réinitialiser le pari après la main
      },
    });
  }, [
    state.selectedCards,
    state.playerHP,
    state.playerPoints,
    state.totalGames,
    state.permanentBonuses,
    state.currentBet,
  ]);

  // Piocher une nouvelle main
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
          newBestScore: Math.max(
            state.playerPoints,
            initialGameState.bestScore
          ),
        },
      });
      return;
    }

    // Vérifier si le deck est vide
    if (state.deck.length === 0) {
      dispatch({
        type: "SET_MESSAGE",
        payload: {
          message:
            "Le deck est vide ! Vous avez terminé cette partie. Accédez à la boutique pour améliorer votre personnage avant la prochaine partie.",
        },
      });

      // Activer l'affichage de la boutique
      dispatch({
        type: "SHOW_SHOP",
        payload: {},
      });

      return;
    }

    // Piocher une nouvelle main
    const shuffledDeck = shuffleDeck([...state.deck]);
    const numCardsToDraw = Math.min(
      GAME_RULES.INITIAL_HAND_SIZE,
      shuffledDeck.length
    );
    const newHand = shuffledDeck.slice(0, numCardsToDraw);
    const remainingDeck = shuffledDeck.slice(numCardsToDraw);

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
    state.playedHand.length,
    state.bonusCards.length,
    completeGame,
  ]);

  // Défausser des cartes
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

  // Acheter une carte dans la boutique
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

  // Améliorer une carte
  const improveCard = useCallback(
    (card: ImprovableCard) => {
      // Calculer le coût d'amélioration
      const improvementCost =
        (card.improved + 1) * GAME_RULES.BASE_IMPROVEMENT_COST;

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

  // Activer/désactiver une carte bonus
  const toggleBonusCard = useCallback((index: number) => {
    dispatch({
      type: "TOGGLE_BONUS_CARD",
      payload: { index },
    });
  }, []);

  // Placer un pari
  const placeBet = useCallback(
    (amount: number, betType: "safe" | "risky" | "all-in") => {
      dispatch({
        type: "PLACE_BET",
        payload: { amount, betType },
      });
    },
    []
  );

  // Améliorer un bonus permanent
  const upgradePermanentBonus = useCallback(
    (bonusId: string) => {
      const bonus = state.permanentBonuses.find((b) => b.id === bonusId);

      if (!bonus) {
        dispatch({
          type: "SET_MESSAGE",
          payload: { message: "Bonus introuvable." },
        });
        return;
      }

      const upgradeCost = getUpgradeCost(bonus);

      // Vérifier si le joueur peut améliorer ce bonus
      if (!canUpgradePermanentBonus(bonus, state.playerPoints)) {
        if (bonus.currentLevel >= bonus.maxLevel) {
          dispatch({
            type: "SET_MESSAGE",
            payload: { message: "Ce bonus a déjà atteint son niveau maximum." },
          });
        } else {
          dispatch({
            type: "SET_MESSAGE",
            payload: {
              message: `Pas assez de points pour améliorer ce bonus. (${upgradeCost} points nécessaires)`,
            },
          });
        }
        return;
      }

      // Déduire les points et améliorer le bonus
      dispatch({
        type: "UPGRADE_PERMANENT_BONUS",
        payload: { bonusId },
      });
    },
    [state.permanentBonuses, state.playerPoints]
  );

  // Exposer l'état et les actions
  return (
    <GameContext.Provider
      value={{
        // État
        gameStatus: state.gameStatus,
        playerHP: state.playerHP,
        playerPoints: state.playerPoints,
        round: state.round,
        message: state.message,
        playerHand: state.playerHand,
        selectedCards: state.selectedCards,
        playedHand: state.playedHand,
        showShopAndUpgrades: state.showShopAndUpgrades,
        discardRemaining: state.discardRemaining,
        bonusCards: state.bonusCards,
        activeBonusCards: state.activeBonusCards,
        shopCards: state.shopCards,
        improvableCards: state.improvableCards || state.playerHand, // Fallback sur playerHand si non défini
        permanentBonuses: state.permanentBonuses,
        currentStreak: state.currentStreak,
        streakMultiplier: state.streakMultiplier,
        lastPointsEarned: state.lastPointsEarned,
        lastHPChange: state.lastHPChange,
        currentBet: state.currentBet,

        // Actions
        initializeGame,
        startGame,
        selectCard,
        playHand,
        redraw,
        discardCards,
        buyShopCard,
        improveCard,
        toggleBonusCard,
        placeBet,
        upgradePermanentBonus,
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
