// src/components/PermanentBonusManager.tsx
import React from "react";
import {
  PermanentBonus,
  calculatePermanentBonusEffect,
  canUpgradePermanentBonus,
  getUpgradeCost,
} from "../types/PermanentBonus";
import { Award, LevelUp } from "lucide-react";
import { useGameContext } from "../context/GameContext";

const bonusStyleConfig = {
  HandCombination: {
    icon: <Award className="text-blue-500 mr-2" size={24} />,
    bgColor: "bg-blue-900 bg-opacity-50",
    textColor: "text-blue-300",
  },
  Rarity: {
    icon: <Award className="text-purple-500 mr-2" size={24} />,
    bgColor: "bg-purple-900 bg-opacity-50",
    textColor: "text-purple-300",
  },
  default: {
    icon: <Award className="text-gray-500 mr-2" size={24} />,
    bgColor: "bg-gray-900 bg-opacity-50",
    textColor: "text-gray-300",
  },
};

const getBonusStyles = (bonus: PermanentBonus) => {
  return bonusStyleConfig[bonus.category] || bonusStyleConfig.default;
};

interface BonusItemProps {
  bonus: PermanentBonus;
}

const BonusItem: React.FC<BonusItemProps> = ({ bonus }) => {
  const { playerPoints, upgradePermanentBonus } = useGameContext();
  const styles = getBonusStyles(bonus);
  const bonusEffect = calculatePermanentBonusEffect(bonus);
  const upgradeCost = getUpgradeCost(bonus);
  const canUpgrade = canUpgradePermanentBonus(bonus, playerPoints);

  return (
    <article
      key={bonus.id}
      className={`${styles.bgColor} rounded-lg p-3 flex justify-between items-center`}
    >
      <div className="flex items-center">
        {styles.icon}
        <div>
          <h3 className={`font-bold ${styles.textColor}`}>{bonus.name}</h3>
          <p className="text-xs text-gray-400">{bonus.description}</p>
          <div className="text-sm mt-1">
            Niveau : {bonus.currentLevel}/{bonus.maxLevel}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-end">
        <div className="text-sm mb-2">
          {bonus.effect.type === "pointMultiplier" ? (
            <span className={styles.textColor}>
              Multiplicateur : x{bonusEffect.toFixed(2)}
            </span>
          ) : (
            <span className={styles.textColor}>
              Bonus : +{bonusEffect} points
            </span>
          )}
        </div>

        {bonus.currentLevel < bonus.maxLevel ? (
          <button
            className={`
              px-3 py-1 rounded-lg text-sm font-bold flex items-center 
              ${
                canUpgrade
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-gray-700 text-gray-400 cursor-not-allowed"
              }
            `}
            onClick={() => upgradePermanentBonus(bonus.id)}
            disabled={!canUpgrade}
          >
            <LevelUp className="mr-1" size={16} />
            Améliorer ({upgradeCost} pts)
          </button>
        ) : (
          <div className="text-green-500 text-sm">Niveau max atteint</div>
        )}
      </div>
    </article>
  );
};

const PermanentBonusManager: React.FC = () => {
  const { permanentBonuses } = useGameContext();

  return (
    <section className="bg-black bg-opacity-50 rounded-lg p-4">
      <header>
        <h2 className="text-xl font-bold text-yellow-300 mb-4">
          Bonus Permanents
        </h2>
      </header>

      <div className="space-y-3">
        {permanentBonuses.map((bonus) => (
          <BonusItem key={bonus.id} bonus={bonus} />
        ))}
      </div>
    </section>
  );
};

export default PermanentBonusManager;
