// src/components/Tooltip/HelpContent.tsx
import React from "react";

/**
 * Collection de contenus d'aide prédéfinis pour différentes parties du jeu
 */
export const HelpContent = {
  // Aide générale
  gameOverview: (
    <div>
      <h3 className="font-bold mb-2">Poker Solo RPG</h3>
      <p>
        Un jeu de poker avec des mécaniques RPG où vous jouez des mains de poker
        pour marquer des points.
      </p>
      <ul className="list-disc pl-4 mt-2 space-y-1">
        <li>Chaque partie dure 20 tours</li>
        <li>Sélectionnez les meilleures combinaisons possibles</li>
        <li>Améliorez vos cartes pour gagner plus de points</li>
        <li>Achetez des cartes bonus pour des capacités spéciales</li>
      </ul>
    </div>
  ),

  // Système de cartes
  cardSystem: (
    <div>
      <h3 className="font-bold mb-2">Système de cartes</h3>
      <p>Il existe deux types de cartes dans le jeu :</p>
      <ul className="list-disc pl-4 mt-2 space-y-1">
        <li>
          <span className="font-bold text-white">Cartes standards</span> -
          Utilisées pour former des combinaisons de poker
        </li>
        <li>
          <span className="font-bold text-yellow-300">Cartes bonus</span> -
          Fournissent des capacités spéciales et des multiplicateurs
        </li>
      </ul>
      <p className="mt-2">
        Les cartes standards peuvent être améliorées pour augmenter leur valeur
        en points.
      </p>
    </div>
  ),

  // Système de points
  pointSystem: (
    <div>
      <h3 className="font-bold mb-2">Système de points</h3>
      <p>Les points sont calculés comme suit :</p>
      <ul className="list-disc pl-4 mt-2 space-y-1">
        <li>
          <span className="font-bold">Points de base</span> - Déterminés par le
          rang de la main de poker
        </li>
        <li>
          <span className="font-bold">Points de valeur</span> - Basés sur la
          valeur numérique des cartes
        </li>
        <li>
          <span className="font-bold">Points d'amélioration</span> - Bonus des
          cartes améliorées
        </li>
        <li>
          <span className="font-bold">Bonus permanents</span> - Modificateurs
          achetés avec des points
        </li>
      </ul>
    </div>
  ),

  // Combinaisons de poker
  pokerHands: (
    <div>
      <h3 className="font-bold mb-2">Combinaisons de poker</h3>
      <p>Les mains sont classées de la plus faible à la plus forte :</p>
      <ol className="list-decimal pl-4 mt-2 space-y-1">
        <li>Haute carte</li>
        <li>Paire</li>
        <li>Double paire</li>
        <li>Brelan</li>
        <li>Suite</li>
        <li>Couleur</li>
        <li>Full</li>
        <li>Carré</li>
        <li>Quinte flush</li>
      </ol>
      <p className="mt-2 text-xs">
        Plus la combinaison est forte, plus vous gagnez de points.
      </p>
    </div>
  ),

  // Système d'amélioration
  improvementSystem: (
    <div>
      <h3 className="font-bold mb-2">Amélioration des cartes</h3>
      <p>Vous pouvez améliorer les cartes pour augmenter leur valeur :</p>
      <ul className="list-disc pl-4 mt-2 space-y-1">
        <li>Chaque carte a un niveau maximum d'amélioration</li>
        <li>Le coût d'amélioration augmente avec le niveau</li>
        <li>Les cartes améliorées donnent des points bonus à chaque main</li>
      </ul>
      <p className="mt-2 text-xs">
        Conseil : Concentrez-vous sur l'amélioration des cartes à fort potentiel
        !
      </p>
    </div>
  ),

  // Système de cartes bonus
  bonusCardSystem: (
    <div>
      <h3 className="font-bold mb-2">Cartes bonus</h3>
      <p>Les cartes bonus offrent des avantages spéciaux :</p>
      <ul className="list-disc pl-4 mt-2 space-y-1">
        <li>Achetez des cartes bonus dans la boutique</li>
        <li>Équipez jusqu'à 5 cartes bonus à la fois</li>
        <li>
          Les cartes ont différentes raretés : Commune, Rare, Épique, Légendaire
        </li>
        <li>Plus la rareté est élevée, plus l'effet est puissant</li>
      </ul>
    </div>
  ),

  // Système de défausse
  discardSystem: (
    <div>
      <h3 className="font-bold mb-2">Système de défausse</h3>
      <p>Vous pouvez défausser des cartes pour rafraîchir votre main :</p>
      <ul className="list-disc pl-4 mt-2 space-y-1">
        <li>
          Vous avez droit à {GAME_RULES.MAX_DISCARDS} défausses par partie
        </li>
        <li>
          Vous pouvez acheter des défausses supplémentaires pour{" "}
          {GAME_RULES.DISCARD_COST} points
        </li>
        <li>
          Défaussez les cartes qui ne s'intègrent pas dans une bonne combinaison
        </li>
      </ul>
    </div>
  ),
};
