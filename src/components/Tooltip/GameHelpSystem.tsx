// src/components/Tooltip/GameHelpSystem.tsx
import React from "react";
import Tooltip from "./Tooltip";
import { GAME_RULES, HAND_RANKINGS } from "../../constants/gameRules";

/**
 * Composant pour afficher l'aide contextuelle sur les règles du jeu
 */
export const RuleTooltip: React.FC<{
  rule: keyof typeof GAME_RULES;
  children?: React.ReactNode;
}> = ({ rule, children }) => {
  const ruleDescriptions = {
    MAX_ROUNDS: "Nombre maximum de tours dans une partie.",
    STARTING_HP: "Points de vie de départ du joueur.",
    INITIAL_HAND_SIZE: "Nombre de cartes distribuées au début de chaque tour.",
    MAX_HAND_SIZE: "Nombre de cartes à sélectionner pour jouer une main.",
    DAMAGE_ON_NO_HAND:
      "Dégâts subis lorsqu'aucune combinaison valide n'est jouée.",
    CRITICAL_DAMAGE_THRESHOLD:
      "Seuil de PV en dessous duquel des pénalités s'appliquent.",
    MAX_DISCARDS: "Nombre maximal de défausses autorisées par partie.",
    DISCARD_COST: "Coût en points pour acheter une défausse supplémentaire.",
    MAX_CARD_IMPROVEMENT: "Niveau maximum d'amélioration des cartes.",
    BASE_IMPROVEMENT_COST: "Coût de base pour améliorer une carte.",
    BONUS_CARD_SLOT_LIMIT:
      "Nombre maximum de cartes bonus que vous pouvez équiper.",
  };

  const ruleValue = GAME_RULES[rule];
  const description =
    ruleDescriptions[rule] || "Information sur les règles du jeu.";

  return (
    <Tooltip
      content={
        <div>
          <div className="font-bold border-b border-gray-700 pb-1 mb-1">
            {rule}
          </div>
          <p>{description}</p>
          <div className="mt-1 text-blue-300">Valeur: {ruleValue}</div>
        </div>
      }
    >
      {children}
    </Tooltip>
  );
};

/**
 * Composant pour afficher l'aide sur les combinaisons de poker
 */
export const HandRankTooltip: React.FC<{
  rank: keyof typeof HAND_RANKINGS;
  children?: React.ReactNode;
}> = ({ rank, children }) => {
  const handDescriptions = {
    "Haute carte":
      "Aucune combinaison. La carte la plus haute détermine la force de la main.",
    Paire: "Deux cartes de même valeur.",
    "Double paire": "Deux paires différentes.",
    Brelan: "Trois cartes de même valeur.",
    Suite: "Cinq cartes qui se suivent, peu importe la couleur.",
    Couleur: "Cinq cartes de même couleur, pas nécessairement consécutives.",
    Full: "Un brelan et une paire.",
    Carré: "Quatre cartes de même valeur.",
    "Quinte flush": "Cinq cartes qui se suivent, toutes de la même couleur.",
  };

  const points = HAND_RANKINGS[rank];
  const description =
    handDescriptions[rank] || "Information sur cette combinaison de poker.";

  return (
    <Tooltip
      content={
        <div>
          <div className="font-bold border-b border-gray-700 pb-1 mb-1">
            {rank}
          </div>
          <p>{description}</p>
          <div className="mt-1 text-yellow-300">Points de base: {points}</div>
        </div>
      }
    >
      {children}
    </Tooltip>
  );
};

/**
 * Composant pour afficher un tutoriel contextuel
 */
export const TutorialTooltip: React.FC<{
  id: string;
  title: string;
  step: number;
  totalSteps: number;
  children: React.ReactNode;
}> = ({ id, title, step, totalSteps, children }) => {
  return (
    <Tooltip
      position="bottom"
      className="tutorial-tooltip border-2 border-yellow-400"
      content={
        <div className="w-64">
          <div className="font-bold text-yellow-300 border-b border-gray-700 pb-1 mb-2">
            {title} - Étape {step}/{totalSteps}
          </div>
          <div className="mb-2">{children}</div>
          <div className="text-xs text-gray-400 mt-2">
            Cliquez n'importe où pour continuer
          </div>
        </div>
      }
    >
      <div className="animate-pulse bg-yellow-400 bg-opacity-30 rounded-full p-1 cursor-pointer">
        <div className="bg-yellow-500 text-yellow-900 rounded-full w-5 h-5 flex items-center justify-center font-bold text-xs">
          {step}
        </div>
      </div>
    </Tooltip>
  );
};
