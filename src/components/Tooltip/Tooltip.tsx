// src/components/Tooltip/Tooltip.tsx
import React, { useState, useRef, useEffect } from "react";
import { HelpCircle } from "lucide-react";

interface TooltipProps {
  content: React.ReactNode;
  children?: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  icon?: boolean;
  iconSize?: number;
  iconClassName?: string;
  className?: string;
  delayShow?: number;
  delayHide?: number;
}

const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = "top",
  icon = true,
  iconSize = 16,
  iconClassName = "",
  className = "",
  delayShow = 200,
  delayHide = 100,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const targetRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const showTimeoutRef = useRef<NodeJS.Timeout>();
  const hideTimeoutRef = useRef<NodeJS.Timeout>();

  // Positionner le tooltip
  useEffect(() => {
    if (isVisible && targetRef.current && tooltipRef.current) {
      const targetRect = targetRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();

      let x = 0;
      let y = 0;

      switch (position) {
        case "top":
          x = targetRect.left + targetRect.width / 2 - tooltipRect.width / 2;
          y = targetRect.top - tooltipRect.height - 8;
          break;
        case "bottom":
          x = targetRect.left + targetRect.width / 2 - tooltipRect.width / 2;
          y = targetRect.bottom + 8;
          break;
        case "left":
          x = targetRect.left - tooltipRect.width - 8;
          y = targetRect.top + targetRect.height / 2 - tooltipRect.height / 2;
          break;
        case "right":
          x = targetRect.right + 8;
          y = targetRect.top + targetRect.height / 2 - tooltipRect.height / 2;
          break;
      }

      // Ajustements pour éviter que le tooltip ne sorte de l'écran
      if (x < 0) x = 0;
      if (x + tooltipRect.width > window.innerWidth) {
        x = window.innerWidth - tooltipRect.width;
      }
      if (y < 0) y = 0;
      if (y + tooltipRect.height > window.innerHeight) {
        y = window.innerHeight - tooltipRect.height;
      }

      setCoords({ x, y });
    }
  }, [isVisible, position]);

  // Gérer les événements de souris avec délai
  const handleMouseEnter = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = undefined;
    }

    showTimeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delayShow);
  };

  const handleMouseLeave = () => {
    if (showTimeoutRef.current) {
      clearTimeout(showTimeoutRef.current);
      showTimeoutRef.current = undefined;
    }

    hideTimeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, delayHide);
  };

  // Nettoyer les timeouts à la suppression du composant
  useEffect(() => {
    return () => {
      if (showTimeoutRef.current) clearTimeout(showTimeoutRef.current);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, []);

  // Rendu du tooltip
  const tooltipClasses = `
    fixed z-50 rounded-lg shadow-lg p-3 text-sm
    bg-gray-900 text-white max-w-xs
    animate-fadeIn ${className}
  `;

  // Flèche du tooltip
  const getArrowClass = () => {
    switch (position) {
      case "top":
        return "after:absolute after:top-full after:left-1/2 after:-ml-2 after:border-8 after:border-t-gray-900 after:border-x-transparent after:border-b-transparent";
      case "bottom":
        return "after:absolute after:bottom-full after:left-1/2 after:-ml-2 after:border-8 after:border-b-gray-900 after:border-x-transparent after:border-t-transparent";
      case "left":
        return "after:absolute after:left-full after:top-1/2 after:-mt-2 after:border-8 after:border-l-gray-900 after:border-y-transparent after:border-r-transparent";
      case "right":
        return "after:absolute after:right-full after:top-1/2 after:-mt-2 after:border-8 after:border-r-gray-900 after:border-y-transparent after:border-l-transparent";
    }
  };

  return (
    <>
      <div
        ref={targetRef}
        className="inline-flex items-center cursor-help"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleMouseEnter}
        onBlur={handleMouseLeave}
      >
        {children ||
          (icon && (
            <HelpCircle
              size={iconSize}
              className={`text-blue-400 hover:text-blue-300 ${iconClassName}`}
            />
          ))}
      </div>

      {isVisible && (
        <div
          ref={tooltipRef}
          className={`${tooltipClasses} ${getArrowClass()}`}
          style={{ left: `${coords.x}px`, top: `${coords.y}px` }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {content}
        </div>
      )}
    </>
  );
};

export default Tooltip;
