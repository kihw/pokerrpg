// src/components/ProfileModal/ProfileModal.tsx
import React, { useState } from "react";
import { X, Award, Trophy, Star, Zap, BarChart2, User } from "lucide-react";
import { useProgression } from "../../context/ProgressionContext";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { progression } = useProgression();
  const [activeTab, setActiveTab] = useState<
    "profile" | "stats" | "achievements"
  >("profile");

  if (!isOpen) return null;

  // Calculer les pourcentages et les statistiques affichables
  const xpPercentage = Math.floor(
    (progression.playerLevel.currentXP /
      progression.playerLevel.xpToNextLevel) *
      100
  );
  const achievementsUnlocked = progression.achievements.filter(
    (a) => a.unlocked
  ).length;
  const achievementsTotal = progression.achievements.length;
  const achievementPercentage = Math.floor(
    (achievementsUnlocked / achievementsTotal) * 100
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg w-full max-w-3xl shadow-2xl border border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white flex items-center">
            <User className="mr-2 text-blue-400" />
            Profil du Joueur
          </h2>
          <button className="text-gray-400 hover:text-white" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-700">
          <button
            className={`px-4 py-3 flex items-center ${
              activeTab === "profile"
                ? "bg-blue-900 bg-opacity-30 text-blue-400 border-b-2 border-blue-400"
                : "text-gray-400 hover:text-gray-200"
            }`}
            onClick={() => setActiveTab("profile")}
          >
            <User size={18} className="mr-2" />
            Profil
          </button>
          <button
            className={`px-4 py-3 flex items-center ${
              activeTab === "stats"
                ? "bg-green-900 bg-opacity-30 text-green-400 border-b-2 border-green-400"
                : "text-gray-400 hover:text-gray-200"
            }`}
            onClick={() => setActiveTab("stats")}
          >
            <BarChart2 size={18} className="mr-2" />
            Statistiques
          </button>
          <button
            className={`px-4 py-3 flex items-center ${
              activeTab === "achievements"
                ? "bg-yellow-900 bg-opacity-30 text-yellow-400 border-b-2 border-yellow-400"
                : "text-gray-400 hover:text-gray-200"
            }`}
            onClick={() => setActiveTab("achievements")}
          >
            <Trophy size={18} className="mr-2" />
            Succès ({achievementsUnlocked}/{achievementsTotal})
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === "profile" && (
            <div className="space-y-6">
              {/* Niveau et XP */}
              <div className="bg-blue-900 bg-opacity-30 rounded-lg p-4 border border-blue-800">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-blue-300">
                    Niveau {progression.playerLevel.level}
                  </h3>
                  <span className="text-blue-300">
                    {progression.playerLevel.currentXP} /{" "}
                    {progression.playerLevel.xpToNextLevel} XP
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-4">
                  <div
                    className="bg-blue-500 h-4 rounded-full"
                    style={{ width: `${xpPercentage}%` }}
                  ></div>
                </div>
                <div className="text-right text-sm text-gray-400 mt-1">
                  {progression.playerLevel.totalXPEarned} XP totale gagnée
                </div>
              </div>

              {/* Statistiques principales */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <div className="flex items-center text-gray-400 mb-2">
                    <Trophy size={18} className="mr-2 text-yellow-400" />
                    <h3>Parties jouées</h3>
                  </div>
                  <p className="text-2xl font-bold">
                    {progression.statistics.gamesPlayed}
                  </p>
                </div>
                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <div className="flex items-center text-gray-400 mb-2">
                    <Star size={18} className="mr-2 text-yellow-400" />
                    <h3>Meilleur score</h3>
                  </div>
                  <p className="text-2xl font-bold">
                    {progression.statistics.highestScore}
                  </p>
                </div>
                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <div className="flex items-center text-gray-400 mb-2">
                    <Zap size={18} className="mr-2 text-yellow-400" />
                    <h3>Série de victoires</h3>
                  </div>
                  <p className="text-2xl font-bold">
                    {progression.statistics.longestWinStreak}
                  </p>
                </div>
                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <div className="flex items-center text-gray-400 mb-2">
                    <Award size={18} className="mr-2 text-yellow-400" />
                    <h3>Succès débloqués</h3>
                  </div>
                  <p className="text-2xl font-bold">
                    {achievementsUnlocked}/{achievementsTotal}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "stats" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                {/* Statistiques générales */}
                <div className="bg-gray-800 rounded-lg p-4">
                  <h3 className="text-lg font-bold mb-3 text-green-400">
                    Statistiques générales
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex justify-between">
                      <span className="text-gray-400">Parties jouées</span>
                      <span className="font-bold">
                        {progression.statistics.gamesPlayed}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-400">Parties gagnées</span>
                      <span className="font-bold">
                        {progression.statistics.gamesWon}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-400">Total de points</span>
                      <span className="font-bold">
                        {progression.statistics.totalPoints}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-400">Meilleur score</span>
                      <span className="font-bold">
                        {progression.statistics.highestScore}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-400">Tours joués</span>
                      <span className="font-bold">
                        {progression.statistics.totalRoundsPlayed}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-400">Cartes jouées</span>
                      <span className="font-bold">
                        {progression.statistics.totalCardsPlayed}
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Statistiques de mains */}
                <div className="bg-gray-800 rounded-lg p-4">
                  <h3 className="text-lg font-bold mb-3 text-green-400">
                    Combinaisons jouées
                  </h3>
                  <ul className="space-y-2">
                    {Object.entries(progression.statistics.handsPlayed).map(
                      ([hand, count]) => (
                        <li key={hand} className="flex justify-between">
                          <span className="text-gray-400">{hand}</span>
                          <span className="font-bold">{count}</span>
                        </li>
                      )
                    )}
                  </ul>
                </div>

                {/* Statistiques d'amélioration */}
                <div className="bg-gray-800 rounded-lg p-4">
                  <h3 className="text-lg font-bold mb-3 text-green-400">
                    Améliorations
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex justify-between">
                      <span className="text-gray-400">
                        Total d'améliorations
                      </span>
                      <span className="font-bold">
                        {progression.statistics.totalImprovements}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-400">Niveau max. atteint</span>
                      <span className="font-bold">
                        {progression.statistics.maxCardLevel}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-400">Points dépensés</span>
                      <span className="font-bold">
                        {progression.statistics.pointsSpentOnImprovements}
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Statistiques de cartes bonus */}
                <div className="bg-gray-800 rounded-lg p-4">
                  <h3 className="text-lg font-bold mb-3 text-green-400">
                    Cartes bonus
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex justify-between">
                      <span className="text-gray-400">Cartes acquises</span>
                      <span className="font-bold">
                        {progression.statistics.bonusCardsAcquired}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-400">Points dépensés</span>
                      <span className="font-bold">
                        {progression.statistics.pointsSpentOnBonusCards}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === "achievements" && (
            <div className="space-y-4">
              {/* Barre de progression générale */}
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Progression totale</span>
                  <span className="text-yellow-400">
                    {achievementsUnlocked}/{achievementsTotal} (
                    {achievementPercentage}%)
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                  <div
                    className="bg-yellow-400 h-2.5 rounded-full"
                    style={{ width: `${achievementPercentage}%` }}
                  ></div>
                </div>
              </div>

              {/* Liste des achievements par catégorie */}
              <div className="space-y-6">
                {["basics", "combos", "cards", "challenge", "mastery"].map(
                  (category) => {
                    const categoryAchievements =
                      progression.achievements.filter(
                        (a) => a.category === category
                      );
                    const categoryTitle = {
                      basics: "Les bases",
                      combos: "Combinaisons",
                      cards: "Cartes",
                      challenge: "Défis",
                      mastery: "Maîtrise",
                    }[category];

                    return (
                      <div
                        key={category}
                        className="bg-gray-800 rounded-lg p-4"
                      >
                        <h3 className="text-lg font-bold mb-3 text-yellow-400">
                          {categoryTitle}
                        </h3>

                        <div className="space-y-3">
                          {categoryAchievements.map((achievement) => {
                            const progressPercentage = Math.min(
                              100,
                              Math.floor(
                                (achievement.progress /
                                  achievement.requirement) *
                                  100
                              )
                            );

                            return (
                              <div
                                key={achievement.id}
                                className={`rounded-lg p-3 ${
                                  achievement.unlocked
                                    ? "bg-yellow-900 bg-opacity-30 border border-yellow-800"
                                    : "bg-gray-700"
                                }`}
                              >
                                <div className="flex justify-between items-center mb-1">
                                  <div className="flex items-center">
                                    <span
                                      className={`mr-2 ${
                                        achievement.unlocked
                                          ? "text-yellow-400"
                                          : "text-gray-500"
                                      }`}
                                    >
                                      <Trophy size={16} />
                                    </span>
                                    <h4
                                      className={`font-bold ${
                                        achievement.unlocked
                                          ? "text-yellow-300"
                                          : "text-gray-400"
                                      }`}
                                    >
                                      {achievement.name}
                                    </h4>
                                  </div>
                                  {achievement.unlocked && (
                                    <span className="bg-yellow-600 text-yellow-100 text-xs px-2 py-1 rounded-full">
                                      Débloqué
                                    </span>
                                  )}
                                </div>

                                <p className="text-sm text-gray-400 mb-2">
                                  {achievement.description}
                                </p>

                                <div className="flex justify-between text-xs text-gray-500 mb-1">
                                  <span>Progression</span>
                                  <span>
                                    {achievement.progress}/
                                    {achievement.requirement} (
                                    {progressPercentage}%)
                                  </span>
                                </div>

                                <div className="w-full bg-gray-600 rounded-full h-1.5">
                                  <div
                                    className={`h-1.5 rounded-full ${
                                      achievement.unlocked
                                        ? "bg-yellow-400"
                                        : "bg-blue-500"
                                    }`}
                                    style={{ width: `${progressPercentage}%` }}
                                  ></div>
                                </div>

                                {achievement.reward && (
                                  <div className="mt-2 text-xs">
                                    <span className="text-gray-500">
                                      Récompense:{" "}
                                    </span>
                                    {achievement.reward.type === "xp" && (
                                      <span className="text-blue-400">
                                        +{achievement.reward.value} XP
                                      </span>
                                    )}
                                    {achievement.reward.type ===
                                      "bonusCard" && (
                                      <span className="text-purple-400">
                                        {achievement.reward.value} Carte(s)
                                        bonus spéciale(s)
                                      </span>
                                    )}
                                    {achievement.reward.type === "bonus" && (
                                      <span className="text-yellow-400">
                                        +{achievement.reward.value} points
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
