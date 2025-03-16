// src/components/PokerRPG/MessageBox.tsx
import React, { memo } from "react";
import { Star } from "lucide-react";

interface MessageBoxProps {
  message: string;
}

const MessageBox: React.FC<MessageBoxProps> = ({ message }) => {
  return (
    <div className="bg-black bg-opacity-50 rounded-lg p-4 mb-4 flex items-center">
      <Star className="text-yellow-400 mr-2" size={24} />
      <span className="text-white">{message}</span>
    </div>
  );
};

export default memo(MessageBox);
