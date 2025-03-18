// src/components/GameDashboard.tsx
import React from "react";
import { Heart, Flame, Award, Shield, Zap } from "lucide-react";
import { GAME_RULES } from "../constants/gameRules";

interface GameDashboardProps {
  playerHP: number;
  playerPoints: number;
  currentStreak: number;
  streakMultiplier: number;
  round: number;
  lastPointsEarned?: number;
  lastHPChange?: number;
}

const GameDashboard: React.FC<GameDashboardProps> = ({
  playerHP,
  playerPoints,
  currentStreak,
  streakMultiplier,
  round,
  lastPointsEarned = 0,
  lastHPChange = 0,
}) => {
  // Calculer le pourcentage de santé
  const hpPercentage = Math.max(
    0,
    Math.min(100, (playerHP / GAME_RULES.STARTING_HP) * 100)
  );

  // Déterminer la couleur de la barre de santé
  const getHPBarColor = () => {
    if (hpPercentage < 25) return "bg-red-600";
    if (hpPercentage < 50) return "bg-yellow-500";
    return "bg-green-500";
  };

  // Déterminer le statut de santé
  const getHPStatus = () => {
    if (hpPercentage < 25) return { text: "Critique", color: "text-red-500" };
    if (hpPercentage < 50) return { text: "Faible", color: "text-yellow-500" };
    if (hpPercentage < 75) return { text: "Bonne", color: "text-green-400" };
    return { text: "Excellente", color: "text-green-300" };
  };

  const hpStatus = getHPStatus();

  return (
    <div className="bg-black bg-opacity-60 rounded-lg p-4 mb-4">
      <div className="flex flex-wrap -mx-2">
        {/* Section Santé */}
        <div className="w-full md:w-1/3 px-2 mb-4 md:mb-0">
          <div className="bg-gray-800 bg-opacity-50 rounded-lg p-3">
            <div className="flex items-center mb-2">
              <Heart
                className={`mr-2 ${hpStatus.color}`}
                size={24}
                fill={hpPercentage > 50 ? "currentColor" : "none"}
              />
              <h3 className="text-lg font-bold">Santé</h3>
            </div>

            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-400">Points de vie</span>
              <span className="font-bold">
                {playerHP}/{GAME_RULES.STARTING_HP}
                {lastHPChange !== 0 && (
                  <span
                    className={
                      lastHPChange > 0
                        ? "text-green-400 ml-1"
                        : "text-red-400 ml-1"
                    }
                  >
                    {lastHPChange > 0 ? `+${lastHPChange}` : lastHPChange}
                  </span>
                )}
              </span>
            </div>

            <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
              <div
                className={`${getHPBarColor()} h-2 rounded-full transition-all duration-500`}
                style={{ width: `${hpPercentage}%` }}
              ></div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className={`${hpStatus.color} font-medium`}>
                {hpStatus.text}
              </span>
              <span className="text-gray-400">{Math.round(hpPercentage)}%</span>
            </div>

            {hpPercentage < 25 && (
              <div className="mt-2 text-xs text-red-400 flex items-center">
                <Shield size={14} className="mr-1" />
                Attention: Santé critique! Jouez des mains fortes pour
                récupérer.
              </div>
            )}
          </div>
        </div>

        {/* Section Points */}
        <div className="w-full md:w-1/3 px-2 mb-4 md:mb-0">
          <div className="bg-gray-800 bg-opacity-50 rounded-lg p-3">
            <div className="flex items-center mb-2">
              <Award className="mr-2 text-yellow-400" size={24} />
              <h3 className="text-lg font-bold">Points</h3>
            </div>

            <div className="text-2xl font-bold text-yellow-300 mb-2">
              {playerPoints}
              {lastPointsEarned > 0 && (
                <span className="text-green-400 text-sm ml-2">
                  +{lastPointsEarned}
                </span>
              )}
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Tour actuel</span>
              <span className="font-medium">
                {round}/{GAME_RULES.MAX_ROUNDS}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm mt-1">
              <span className="text-gray-400">Points/Tour</span>
              <span className="font-medium">
                {round > 0 ? Math.round(playerPoints / round) : 0}
              </span>
            </div>
          </div>
        </div>

        {/* Section Série */}
        <div className="w-full md:w-1/3 px-2">
          <div
            className={`bg-gray-800 bg-opacity-50 rounded-lg p-3 ${
              currentStreak >= 3 ? "border border-yellow-600 animate-pulse" : ""
            }`}
          >
            <div className="flex items-center mb-2">
              <Flame
                className={`mr-2 ${
                  currentStreak >= 3 ? "text-orange-500" : "text-gray-500"
                }`}
                size={24}
                fill={currentStreak >= 3 ? "currentColor" : "none"}
              />
              <h3 className="text-lg font-bold">Série</h3>
            </div>

            <div className="flex items-center mb-2">
              <div className="text-2xl font-bold mr-2">{currentStreak}</div>
              <div className="text-sm text-gray-400">
                main{currentStreak > 1 ? "s" : ""} consécutive
                {currentStreak > 1 ? "s" : ""}
              </div>
            </div>

            {currentStreak >= 3 ? (
              <div className="bg-yellow-900 bg-opacity-40 rounded p-2 flex items-center">
                <Zap className="text-yellow-400 mr-2" size={18} />
                <div>
                  <div className="text-sm font-bold text-yellow-300">
                    Multiplicateur ×{streakMultiplier.toFixed(1)}
                  </div>
                  <div className="text-xs text-yellow-200">
                    Continuez la série pour augmenter le bonus!
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-400">
                Enchaînez 3+ bonnes mains pour obtenir un multiplicateur de
                points!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(GameDashboard);
