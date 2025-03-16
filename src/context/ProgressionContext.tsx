// src/context/ProgressionContext.tsx
import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useEffect,
} from "react";
import { ProgressionState } from "../types/ProgressionTypes";
import {
  initializeProgression,
  addExperience,
  updateStatisticsAfterGame,
  updateAchievements,
  calculateGameXP,
} from "../utils/progressionManager";

// Actions
type ProgressionAction =
  | { type: "INITIALIZE" }
  | { type: "ADD_XP"; payload: { amount: number } }
  | {
      type: "COMPLETE_GAME";
      payload: {
        points: number;
        isWin: boolean;
        roundsPlayed: number;
        cardsPlayed: number;
        handsPlayed: Record<string, number>;
        improvements: number;
        maxCardLevel: number;
        pointsSpentOnImprovements: number;
        bonusCardsAcquired: number;
        pointsSpentOnBonusCards: number;
      };
    }
  | { type: "UNLOCK_ACHIEVEMENT"; payload: { achievementId: string } }
  | {
      type: "UNLOCK_ITEM";
      payload: {
        itemType: "themes" | "backgrounds" | "cardBacks";
        itemId: string;
      };
    };

// Reducer
function progressionReducer(
  state: ProgressionState,
  action: ProgressionAction
): ProgressionState {
  switch (action.type) {
    case "INITIALIZE":
      // Charger depuis le localStorage ou initialiser
      const savedState = localStorage.getItem("pokerRPG_progression");
      if (savedState) {
        try {
          return JSON.parse(savedState);
        } catch (e) {
          console.error("Failed to parse saved progression data", e);
          return initializeProgression();
        }
      }
      return initializeProgression();

    case "ADD_XP":
      return addExperience(state, action.payload.amount);

    case "COMPLETE_GAME":
      // Mettre à jour les statistiques
      const updatedStats = updateStatisticsAfterGame(state, action.payload);

      // Calculer l'XP gagnée
      const xpEarned = calculateGameXP(
        action.payload.points,
        action.payload.handsPlayed,
        action.payload.roundsPlayed,
        action.payload.isWin
      );

      // Ajouter l'XP
      const withXP = addExperience(updatedStats, xpEarned);

      // Vérifier les achievements
      return updateAchievements(withXP);

    case "UNLOCK_ACHIEVEMENT":
      return {
        ...state,
        achievements: state.achievements.map((achievement) =>
          achievement.id === action.payload.achievementId
            ? {
                ...achievement,
                unlocked: true,
                progress: achievement.requirement,
              }
            : achievement
        ),
      };

    case "UNLOCK_ITEM":
      return {
        ...state,
        unlockables: {
          ...state.unlockables,
          [action.payload.itemType]: [
            ...state.unlockables[action.payload.itemType],
            action.payload.itemId,
          ],
        },
      };

    default:
      return state;
  }
}

// Context
interface ProgressionContextType {
  progression: ProgressionState;
  addXP: (amount: number) => void;
  completeGame: (gameData: {
    points: number;
    isWin: boolean;
    roundsPlayed: number;
    cardsPlayed: number;
    handsPlayed: Record<string, number>;
    improvements: number;
    maxCardLevel: number;
    pointsSpentOnImprovements: number;
    bonusCardsAcquired: number;
    pointsSpentOnBonusCards: number;
  }) => void;
  unlockAchievement: (achievementId: string) => void;
  unlockItem: (
    itemType: "themes" | "backgrounds" | "cardBacks",
    itemId: string
  ) => void;
}

const ProgressionContext = createContext<ProgressionContextType | undefined>(
  undefined
);

// Provider
export const ProgressionProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [progression, dispatch] = useReducer(progressionReducer, null, () =>
    initializeProgression()
  );

  // Initialiser au montage
  useEffect(() => {
    dispatch({ type: "INITIALIZE" });
  }, []);

  // Sauvegarder dans le localStorage à chaque changement
  useEffect(() => {
    if (progression) {
      localStorage.setItem("pokerRPG_progression", JSON.stringify(progression));
    }
  }, [progression]);

  // Actions
  const addXP = (amount: number) => {
    dispatch({ type: "ADD_XP", payload: { amount } });
  };

  const completeGame = (gameData: {
    points: number;
    isWin: boolean;
    roundsPlayed: number;
    cardsPlayed: number;
    handsPlayed: Record<string, number>;
    improvements: number;
    maxCardLevel: number;
    pointsSpentOnImprovements: number;
    bonusCardsAcquired: number;
    pointsSpentOnBonusCards: number;
  }) => {
    dispatch({ type: "COMPLETE_GAME", payload: gameData });
  };

  const unlockAchievement = (achievementId: string) => {
    dispatch({ type: "UNLOCK_ACHIEVEMENT", payload: { achievementId } });
  };

  const unlockItem = (
    itemType: "themes" | "backgrounds" | "cardBacks",
    itemId: string
  ) => {
    dispatch({ type: "UNLOCK_ITEM", payload: { itemType, itemId } });
  };

  const value = {
    progression,
    addXP,
    completeGame,
    unlockAchievement,
    unlockItem,
  };

  return (
    <ProgressionContext.Provider value={value}>
      {children}
    </ProgressionContext.Provider>
  );
};

// Hook
export const useProgression = () => {
  const context = useContext(ProgressionContext);
  if (context === undefined) {
    throw new Error("useProgression must be used within a ProgressionProvider");
  }
  return context;
};
