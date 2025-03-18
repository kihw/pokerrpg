// src/components/BettingSystem.tsx
import React, { useState } from "react";
import { TrendingUp, AlertTriangle, DollarSign } from "lucide-react";

interface BettingSystemProps {
  playerHP: number;
  onBet: (betAmount: number, betType: "safe" | "risky" | "all-in") => void;
  disabled?: boolean;
  currentBet?: {
    amount: number;
    type: string;
    multiplier: number;
  };
}

const BettingSystem: React.FC<BettingSystemProps> = ({
  playerHP,
  onBet,
  disabled = false,
  currentBet = { amount: 0, type: "none", multiplier: 0 },
}) => {
  const [selectedBet, setSelectedBet] = useState<
    "none" | "safe" | "risky" | "all-in"
  >("none");

  // Si un pari est déjà en cours, désactiver le système
  const hasBet = currentBet.amount > 0;
  if (hasBet) disabled = true;

  // Calculer les montants de paris basés sur les PV actuels
  const safeBet = Math.floor(playerHP * 0.1); // 10% des PV
  const riskyBet = Math.floor(playerHP * 0.25); // 25% des PV
  const allInBet = Math.floor(playerHP * 0.5); // 50% des PV

  // Calculer les multiplicateurs potentiels
  const safeMultiplier = 1.5;
  const riskyMultiplier = 2.5;
  const allInMultiplier = 4;

  const handleBet = () => {
    if (selectedBet === "none" || disabled) return;

    const betAmount =
      selectedBet === "safe"
        ? safeBet
        : selectedBet === "risky"
        ? riskyBet
        : allInBet;

    onBet(betAmount, selectedBet);
    setSelectedBet("none");
  };

  return (
    <div className="bg-black bg-opacity-60 rounded-lg p-4 mb-4">
      <div className="flex items-center mb-3">
        <DollarSign className="text-yellow-400 mr-2" size={20} />
        <h3 className="text-lg font-bold">
          Pariez vos PV pour plus de points!
        </h3>
      </div>

      {hasBet ? (
        <div className="bg-yellow-900 bg-opacity-30 p-3 rounded-lg mb-3">
          <div className="font-bold mb-1 flex items-center">
            <TrendingUp className="mr-2" size={16} />
            Pari en cours
          </div>
          <div className="text-sm">
            Vous avez parié{" "}
            <span className="text-yellow-300 font-bold">
              {currentBet.amount} PV
            </span>{" "}
            avec un multiplicateur{" "}
            <span className="text-green-300 font-bold">
              ×{currentBet.multiplier}
            </span>
            .
          </div>
          <div className="text-xs mt-1 text-gray-400">
            Jouez une bonne main pour gagner votre pari et récupérer vos PV avec
            des intérêts!
          </div>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-300 mb-4">
            Pariez une partie de vos PV avant de jouer votre main. Si votre main
            est gagnante, vous récupérez votre mise avec un bonus. Si elle est
            perdante, vous perdez votre mise.
          </p>

          <div className="flex flex-wrap -mx-2 mb-4">
            {/* Pari sûr */}
            <div className="w-full sm:w-1/3 px-2 mb-2 sm:mb-0">
              <button
                onClick={() =>
                  setSelectedBet(selectedBet === "safe" ? "none" : "safe")
                }
                disabled={disabled}
                className={`w-full p-3 rounded-lg border ${
                  selectedBet === "safe"
                    ? "bg-blue-900 bg-opacity-50 border-blue-500"
                    : "bg-gray-800 bg-opacity-50 border-gray-700 hover:border-blue-600"
                } transition-colors ${
                  disabled ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <div className="font-bold mb-1">Pari Sûr</div>
                <div className="text-sm mb-2">
                  <span className="text-blue-400">{safeBet} PV</span>
                  <span className="text-gray-400"> à risquer</span>
                </div>
                <div className="text-xs">
                  <span className="text-green-400">×{safeMultiplier}</span>
                  <span className="text-gray-400"> multiplicateur</span>
                </div>
              </button>
            </div>

            {/* Pari risqué */}
            <div className="w-full sm:w-1/3 px-2 mb-2 sm:mb-0">
              <button
                onClick={() =>
                  setSelectedBet(selectedBet === "risky" ? "none" : "risky")
                }
                disabled={disabled}
                className={`w-full p-3 rounded-lg border ${
                  selectedBet === "risky"
                    ? "bg-yellow-900 bg-opacity-50 border-yellow-500"
                    : "bg-gray-800 bg-opacity-50 border-gray-700 hover:border-yellow-600"
                } transition-colors ${
                  disabled ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <div className="font-bold mb-1">Pari Risqué</div>
                <div className="text-sm mb-2">
                  <span className="text-yellow-400">{riskyBet} PV</span>
                  <span className="text-gray-400"> à risquer</span>
                </div>
                <div className="text-xs">
                  <span className="text-green-400">×{riskyMultiplier}</span>
                  <span className="text-gray-400"> multiplicateur</span>
                </div>
              </button>
            </div>

            {/* Pari all-in */}
            <div className="w-full sm:w-1/3 px-2">
              <button
                onClick={() =>
                  setSelectedBet(selectedBet === "all-in" ? "none" : "all-in")
                }
                disabled={disabled}
                className={`w-full p-3 rounded-lg border ${
                  selectedBet === "all-in"
                    ? "bg-red-900 bg-opacity-50 border-red-500"
                    : "bg-gray-800 bg-opacity-50 border-gray-700 hover:border-red-600"
                } transition-colors ${
                  disabled ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <div className="font-bold mb-1">All-In!</div>
                <div className="text-sm mb-2">
                  <span className="text-red-400">{allInBet} PV</span>
                  <span className="text-gray-400"> à risquer</span>
                </div>
                <div className="text-xs">
                  <span className="text-green-400">×{allInMultiplier}</span>
                  <span className="text-gray-400"> multiplicateur</span>
                </div>
              </button>
            </div>
          </div>

          {selectedBet !== "none" && (
            <div className="flex justify-between items-center">
              <div className="text-sm">
                {selectedBet === "safe" && (
                  <span className="text-blue-400">
                    Pari sûr sélectionné: {safeBet} PV
                  </span>
                )}
                {selectedBet === "risky" && (
                  <span className="text-yellow-400">
                    Pari risqué sélectionné: {riskyBet} PV
                  </span>
                )}
                {selectedBet === "all-in" && (
                  <span className="text-red-400">
                    All-in sélectionné: {allInBet} PV
                  </span>
                )}
              </div>

              <button
                onClick={handleBet}
                disabled={disabled}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white font-bold"
              >
                Confirmer Pari
              </button>
            </div>
          )}

          {selectedBet === "none" && (
            <div className="text-center text-sm text-gray-400">
              Sélectionnez un pari avant de jouer votre main, ou jouez sans
              parier.
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BettingSystem;
