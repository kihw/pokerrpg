import { GameState, ImprovableCard, BonusCard } from "../types/cardTypes";
import { GAME_RULES } from "../constants/gameRules";
import { PERMANENT_BONUS_TEMPLATES } from "../types/PermanentBonus";
import { createDeck } from "../utils/deck";

export type GameAction =
  | {
      type: "INITIALIZE_GAME";
      payload: {
        deck: ImprovableCard[];
        shopCards: BonusCard[];
      };
    }
  | {
      type: "START_GAME";
      payload: {
        newHand: ImprovableCard[];
        remainingDeck: ImprovableCard[];
      };
    }
  | {
      type: "SELECT_CARD";
      payload: { card: ImprovableCard };
    }
  | {
      type: "PLAY_HAND";
      payload: {
        pointsData: {
          totalPoints: number;
          pointMultiplier: number;
          penaltyAmount: number;
          betBonus?: number;
        };
        rank: string;
        newHP: number;
        newShopCards: BonusCard[];
        message: string;
        resetBet?: boolean;
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
      payload: {
        newHand: ImprovableCard[];
        currentDeck: ImprovableCard[];
      };
    }
  | {
      type: "BUY_SHOP_CARD";
      payload: {
        card: BonusCard;
        index: number;
      };
    }
  | {
      type: "IMPROVE_CARD";
      payload: {
        card: ImprovableCard;
        cost: number;
      };
    }
  | {
      type: "TOGGLE_BONUS_CARD";
      payload: { index: number };
    }
  | {
      type: "PLACE_BET";
      payload: {
        amount: number;
        betType: "safe" | "risky" | "all-in";
      };
    }
  | { type: "SET_MESSAGE"; payload: { message: string } }
  | { type: "SHOW_SHOP"; payload: {} }
  | {
      type: "GAME_OVER";
      payload: { newBestScore: number };
    }
  | {
      type: "UPGRADE_PERMANENT_BONUS";
      payload: { bonusId: string };
    };

export const initialGameState: GameState = {
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
  bonusCards: [],
  activeBonusCards: [],
  currentStreak: 0,
  streakMultiplier: 1,
  lastPointsEarned: 0,
  lastHPChange: 0,
  currentBet: {
    amount: 0,
    type: "none",
    multiplier: 0,
  },
  improvableCards: [],
};

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "INITIALIZE_GAME":
      return {
        ...initialGameState,
        deck: action.payload.deck,
        shopCards: action.payload.shopCards,
        message:
          'Nouvelle partie prête. Cliquez sur "Démarrer une partie" pour commencer.',
        // Conserver les bonus permanents entre les parties
        permanentBonuses: state.permanentBonuses,
        // Conserver le nombre total de parties et le meilleur score
        totalGames: state.totalGames,
        bestScore: state.bestScore,
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
          "Partie démarrée! Sélectionnez entre 1 et 5 cartes pour former votre main de poker.",
        totalGames: state.totalGames + 1,
        discardRemaining: GAME_RULES.MAX_DISCARDS,
        currentStreak: 0,
        streakMultiplier: 1,
        lastPointsEarned: 0,
        lastHPChange: 0,
        currentBet: {
          amount: 0,
          type: "none",
          multiplier: 0,
        },
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
          "Vous ne pouvez sélectionner que 5 cartes maximum. Désélectionnez-en une d'abord.",
      };

    case "PLAY_HAND":
      // Déterminer si la main est "bonne" (pas de perte de PV)
      const isGoodHand = action.payload.newHP >= state.playerHP;

      // Calculer la nouvelle streak
      const newStreak = isGoodHand ? state.currentStreak + 1 : 0;

      // Calculer le multiplicateur de streak (max 3x)
      const streakMultiplier =
        newStreak >= 3 ? Math.min(1 + newStreak * 0.1, 3) : 1;

      // Appliquer le multiplicateur de streak aux points si la streak est active
      const streakPoints =
        newStreak >= 3
          ? Math.floor(
              action.payload.pointsData.totalPoints * (streakMultiplier - 1)
            )
          : 0;

      // Message de streak
      let streakMessage = "";
      if (newStreak >= 3) {
        streakMessage = ` 🔥 Série de ${newStreak}: bonus ×${streakMultiplier.toFixed(
          1
        )}!`;
      }

      // Vérifier si le deck est vide
      const isDeckEmpty = state.deck.length === 0;

      // Réinitialiser le pari si demandé
      const newBet = action.payload.resetBet
        ? { amount: 0, type: "none", multiplier: 0 }
        : state.currentBet;

      // Calculer le changement de PV
      const hpChange = action.payload.newHP - state.playerHP;

      // Calculer les points gagnés
      const pointsEarned =
        action.payload.pointsData.totalPoints -
        action.payload.pointsData.penaltyAmount +
        streakPoints +
        (action.payload.pointsData.betBonus || 0);

      return {
        ...state,
        playerHand: state.playerHand.filter(
          (card) => !state.selectedCards.some((c) => c.id === card.id)
        ),
        playedHand: state.selectedCards,
        selectedCards: [],
        playerHP: action.payload.newHP,
        playerPoints: Math.max(0, state.playerPoints + pointsEarned),
        gameStatus: "playing",
        message: action.payload.message + streakMessage,
        shopCards: action.payload.newShopCards,
        // La boutique n'est disponible que si le deck est vide
        showShopAndUpgrades: isDeckEmpty,
        currentStreak: newStreak,
        streakMultiplier,
        lastPointsEarned: pointsEarned,
        lastHPChange: hpChange,
        currentBet: newBet,
      };

    // Fonction mise à jour pour gameReducer.ts - Fonction REDRAW

    case "REDRAW":
      // Incrémenter le tour
      const newRound = action.payload.newRound;

      // Vérifier si la partie est terminée
      if (newRound > GAME_RULES.MAX_ROUNDS) {
        // Mettre à jour les statistiques de fin de partie
        dispatch({
          type: "GAME_OVER",
          payload: {
            newBestScore: Math.max(
              state.playerPoints,
              initialGameState.bestScore
            ),
          },
        });
        return {
          ...state,
          gameStatus: "gameOver",
        };
      }

      // Garder les cartes non utilisées de la main précédente
      const unusedCards = state.playerHand.filter(
        (card) =>
          !state.playedHand.some((playedCard) => playedCard.id === card.id)
      );

      // Déterminer combien de cartes piocher
      const numCardsToDraw = Math.min(
        GAME_RULES.INITIAL_HAND_SIZE - unusedCards.length,
        action.payload.remainingDeck.length
      );

      // Piocher seulement le nombre nécessaire de nouvelles cartes
      const newCards = action.payload.remainingDeck.slice(0, numCardsToDraw);
      const remainingDeck = action.payload.remainingDeck.slice(numCardsToDraw);

      // Combiner les cartes non utilisées avec les nouvelles cartes piochées
      const newHand = [...unusedCards, ...newCards];

      return {
        ...state,
        deck: remainingDeck,
        playerHand: newHand,
        selectedCards: [],
        playedHand: [],
        gameStatus: "selecting",
        round: newRound,
        message: `Tour ${newRound}/${GAME_RULES.MAX_ROUNDS}. Vous avez gardé ${unusedCards.length} carte(s).`,
        showShopAndUpgrades: false,
        lastPointsEarned: 0,
        lastHPChange: 0,
      };

    case "DISCARD_CARDS":
      return {
        ...state,
        deck: action.payload.currentDeck,
        playerHand: action.payload.newHand,
        selectedCards: [],
        message: "Cartes défaussées avec succès.",
        discardRemaining: state.discardRemaining - 1,
      };

    case "BUY_SHOP_CARD":
      return {
        ...state,
        bonusCards: [...state.bonusCards, action.payload.card],
        playerPoints: state.playerPoints - action.payload.card.cost,
        shopCards: state.shopCards.filter(
          (_, index) => index !== action.payload.index
        ),
        message: `Vous avez acheté : ${action.payload.card.name}`,
      };

    case "IMPROVE_CARD":
      // Améliorer la carte dans la main du joueur
      const improvedHand = state.playerHand.map((card) =>
        card.id === action.payload.card.id
          ? { ...card, improved: card.improved + 1 }
          : card
      );

      // Améliorer également la carte dans le deck si elle y est
      const improvedDeck = state.deck.map((card) =>
        card.id === action.payload.card.id
          ? { ...card, improved: card.improved + 1 }
          : card
      );

      // Améliorer la carte dans la liste des cartes améliorables
      const improvedImprovableCards = state.improvableCards.map((card) =>
        card.id === action.payload.card.id
          ? { ...card, improved: card.improved + 1 }
          : card
      );

      return {
        ...state,
        playerHand: improvedHand,
        deck: improvedDeck,
        improvableCards: improvedImprovableCards,
        playerPoints: state.playerPoints - action.payload.cost,
        message: `Carte améliorée au niveau ${
          action.payload.card.improved + 1
        }`,
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
          message: `Carte ${selectedCard.name} désactivée.`,
        };
      }

      // Si moins de 5 cartes bonus actives, ajouter la carte
      if (state.activeBonusCards.length < GAME_RULES.BONUS_CARD_SLOT_LIMIT) {
        return {
          ...state,
          activeBonusCards: [...state.activeBonusCards, selectedCard],
          message: `Carte ${selectedCard.name} activée.`,
        };
      }

      // Maximum de cartes actives atteint
      return {
        ...state,
        message: "Vous ne pouvez pas équiper plus de 5 cartes bonus à la fois.",
      };

    case "PLACE_BET":
      const multiplier =
        action.payload.betType === "safe"
          ? 1.5
          : action.payload.betType === "risky"
          ? 2.5
          : 4;

      return {
        ...state,
        currentBet: {
          amount: action.payload.amount,
          type: action.payload.betType,
          multiplier,
        },
        playerHP: state.playerHP - action.payload.amount, // Prélever les PV immédiatement
        message: `Vous avez parié ${action.payload.amount} PV avec un multiplicateur ×${multiplier}!`,
      };

    case "SET_MESSAGE":
      return {
        ...state,
        message: action.payload.message,
      };

    case "SHOW_SHOP":
      return {
        ...state,
        showShopAndUpgrades: true,
      };

    case "GAME_OVER":
      return {
        ...state,
        gameStatus: "gameOver",
        message: "Partie terminée. Félicitations !",
        bestScore: action.payload.newBestScore,
      };

    case "UPGRADE_PERMANENT_BONUS":
      return {
        ...state,
        permanentBonuses: state.permanentBonuses.map((bonus) =>
          bonus.id === action.payload.bonusId
            ? { ...bonus, currentLevel: bonus.currentLevel + 1 }
            : bonus
        ),
        message: `Bonus permanent amélioré !`,
      };

    default:
      return state;
  }
}
