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
        };
        rank: string;
        newHP: number;
        newShopCards: BonusCard[];
        message: string;
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
  | { type: "SET_MESSAGE"; payload: { message: string } }
  | {
      type: "GAME_OVER";
      payload: { newBestScore: number };
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
      return {
        ...state,
        playerHand: state.playerHand.filter(
          (card) => !state.selectedCards.some((c) => c.id === card.id)
        ),
        playedHand: state.selectedCards,
        selectedCards: [],
        playerHP: action.payload.newHP,
        playerPoints: Math.max(
          0,
          state.playerPoints +
            action.payload.pointsData.totalPoints -
            action.payload.pointsData.penaltyAmount
        ),
        gameStatus: "playing",
        message: action.payload.message,
        shopCards: action.payload.newShopCards,
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
      return {
        ...state,
        playerHand: state.playerHand.map((card) =>
          card.id === action.payload.card.id
            ? { ...card, improved: card.improved + 1 }
            : card
        ),
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

    case "SET_MESSAGE":
      return {
        ...state,
        message: action.payload.message,
      };

    case "GAME_OVER":
      return {
        ...state,
        gameStatus: "gameOver",
        message: "Partie terminée. Félicitations !",
        bestScore: action.payload.newBestScore,
      };

    default:
      return state;
  }
}
