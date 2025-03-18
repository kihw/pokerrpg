// src/App.tsx
import React from "react";
import PokerRPG from "./components/PokerRPG";
import "./styles/global.css";
import { GameProvider } from "./context/GameContext";
import { ProgressionProvider } from "./context/ProgressionContext";

const App: React.FC = () => {
  return (
    <ProgressionProvider>
      <GameProvider>
        <div className="min-h-screen bg-gradient-to-b from-green-900 to-green-800 flex items-center justify-center">
          <PokerRPG />
        </div>
      </GameProvider>
    </ProgressionProvider>
  );
};

export default App;
