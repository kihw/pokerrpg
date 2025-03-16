// src/components/HelpButton.tsx
import React, { useState } from "react";
import { HelpCircle, X } from "lucide-react";
import { HelpContent } from "./HelpContent";

interface HelpButtonProps {
  className?: string;
}

const HelpButton: React.FC<HelpButtonProps> = ({ className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("gameOverview");

  const tabs = [
    { id: "gameOverview", label: "Aperçu du jeu" },
    { id: "cardSystem", label: "Cartes" },
    { id: "pointSystem", label: "Points" },
    { id: "pokerHands", label: "Combinaisons" },
    { id: "improvementSystem", label: "Améliorations" },
    { id: "bonusCardSystem", label: "Cartes bonus" },
    { id: "discardSystem", label: "Défausse" },
  ];

  return (
    <>
      <button
        className={`rounded-full bg-blue-600 hover:bg-blue-700 p-2 text-white shadow-lg transition-colors ${className}`}
        onClick={() => setIsOpen(true)}
        aria-label="Aide"
      >
        <HelpCircle size={24} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg max-w-2xl w-full max-h-[80vh] shadow-2xl border border-gray-700 flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center border-b border-gray-700 p-4">
              <h2 className="text-xl font-bold text-white">
                Aide - Poker Solo RPG
              </h2>
              <button
                className="text-gray-400 hover:text-white"
                onClick={() => setIsOpen(false)}
                aria-label="Fermer"
              >
                <X size={24} />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex overflow-x-auto border-b border-gray-700">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`px-4 py-2 whitespace-nowrap ${
                    activeTab === tab.id
                      ? "text-blue-400 border-b-2 border-blue-400 font-medium"
                      : "text-gray-400 hover:text-gray-200"
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto flex-grow">
              {HelpContent[activeTab]}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-700 p-4 text-center text-sm text-gray-400">
              Pour plus d'informations, cliquez sur les icônes{" "}
              <HelpCircle size={14} className="inline text-blue-400" />{" "}
              présentes dans le jeu.
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HelpButton;
