"use client";

import { Player, GameSettings, PlayerAction, PlayerOrientation } from "@/types";
import { useState, useRef, useEffect } from "react";
import "./PlayerCard.module.css";

interface PlayerCardProps {
  player: Player;
  allPlayers: Player[];
  settings: GameSettings;
  onAction: (action: PlayerAction) => void;
  onSettingsOpen: () => void;
  orientation: PlayerOrientation;
  isThreePlayer?: boolean;
  className?: string;
}

export default function PlayerCard({
  player,
  allPlayers,
  settings,
  onAction,
  onSettingsOpen,
  orientation,
  isThreePlayer,
  className = "",
}: PlayerCardProps) {
  const [showCommanderDamage, setShowCommanderDamage] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(player.life.toString());
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const handleLifeChange = (amount: number) => {
    if (settings.lifeLinkEnabled && player.lifeLinkActive) {
      allPlayers.forEach((p) => {
        if (p.id !== player.id) {
          onAction({ type: "CHANGE_LIFE", playerId: p.id, amount });
        }
      });
    }
    onAction({ type: "CHANGE_LIFE", playerId: player.id, amount });
  };

  const handleDirectEdit = () => {
    const newLife = parseInt(editValue, 10);
    if (!isNaN(newLife) && newLife >= 0) {
      const difference = newLife - player.life;
      handleLifeChange(difference);
    }
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleDirectEdit();
    } else if (e.key === "Escape") {
      setEditValue(player.life.toString());
      setIsEditing(false);
    }
  };

  const getCommanderDamageTotal = () => {
    return Object.values(player.commanderDamage).reduce(
      (sum, damage) => sum + damage,
      0
    );
  };

  const getLifeDisplayColor = () => {
    if (player.isEliminated) return "text-red-500";
    if (player.life <= 5) return "text-red-400";
    if (player.life <= 10) return "text-yellow-400";
    return "text-white";
  };

  const cardClasses = `
    relative h-full min-h-[200px] bg-gray-800 border-2 rounded-lg overflow-hidden
    ${player.isStartingPlayer ? "border-yellow-400" : "border-gray-600"}
    ${player.isEliminated ? "opacity-50" : ""}
    ${isThreePlayer ? "col-span-2 row-span-1" : ""}
  `;

  // Main container flex direction based on orientation
  const getContainerClasses = () => {
    switch (orientation) {
      case "left":
        return "flex flex-row items-center justify-between h-full p-4";
      case "right":
        return "flex flex-row-reverse items-center justify-between h-full p-4";
      case "top":
        return "flex flex-col-reverse items-center justify-between h-full p-4";
      default: // bottom
        return "flex flex-col items-center justify-between h-full p-4";
    }
  };

  // Get order classes for flex items
  const getPlayerNameOrder = () => {
    switch (orientation) {
      case "left":
      case "right":
        return "order-1";
      case "top":
        return "order-4";
      default: // bottom
        return "order-1";
    }
  };

  const getLifeTotalOrder = () => {
    return "order-2"; // Life total is always in the middle
  };

  const getButtonsOrder = () => {
    switch (orientation) {
      case "left":
      case "right":
        return "order-3";
      case "top":
        return "order-1";
      default: // bottom
        return "order-3";
    }
  };

  const getCommanderDamageOrder = () => {
    switch (orientation) {
      case "left":
      case "right":
        return "order-4";
      case "top":
        return "order-2";
      default: // bottom
        return "order-4";
    }
  };

  const getSettingsButtonPosition = () => {
    switch (orientation) {
      case "left":
        return "top-2 left-2";
      case "right":
        return "top-2 right-2";
      case "top":
        return "bottom-2 right-2";
      default:
        return "top-2 right-2";
    }
  };

  // Get text rotation for elements
  const getTransformClasses = () => {
    switch (orientation) {
      case "left":
        return "rotate-90";
      case "right":
        return "-rotate-90";
      case "top":
        return "rotate-180";
      default:
        return "";
    }
  };

  // Get button layout
  const getButtonContainerClasses = () => {
    switch (orientation) {
      case "left":
      case "right":
        return "flex flex-col gap-2";
      case "top":
        return "flex flex-row-reverse gap-2";
      default: // bottom
        return "flex flex-row gap-2";
    }
  };

  const getCommanderDamagePopupClasses = () => {
    switch (orientation) {
      case "top":
        return "absolute top-0 left-0 right-0 bg-gray-900 bg-opacity-95 p-2 max-h-1/3 overflow-y-auto";
      case "left":
        return "absolute top-0 bottom-0 left-0 bg-gray-900 bg-opacity-95 p-2 w-1/3 overflow-y-auto";
      case "right":
        return "absolute top-0 bottom-0 right-0 bg-gray-900 bg-opacity-95 p-2 w-1/3 overflow-y-auto";
      default: // bottom
        return "absolute bottom-0 left-0 right-0 bg-gray-900 bg-opacity-95 p-2 max-h-1/3 overflow-y-auto";
    }
  };

  return (
    <div className={`${cardClasses} ${className}`}>
      <div className={getContainerClasses()}>
        {/* Settings Button */}
        <button
          onClick={onSettingsOpen}
          className={`absolute ${getSettingsButtonPosition()} w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors z-10`}
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {/* Player Name and Starting Player */}
        <div
          className={`text-center ${getPlayerNameOrder()} ${getTransformClasses()}`}
        >
          <h2 className="text-lg font-semibold whitespace-nowrap">
            {player.name}
          </h2>
          {player.isStartingPlayer && (
            <div className="text-yellow-400 text-sm font-medium whitespace-nowrap">
              Starting Player
            </div>
          )}
        </div>

        {/* Life Total */}
        <div
          className={`flex-1 flex items-center justify-center ${getLifeTotalOrder()}`}
        >
          {isEditing ? (
            <input
              ref={inputRef}
              type="number"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleDirectEdit}
              onKeyDown={handleKeyPress}
              className={`text-6xl font-bold text-center bg-transparent border-b-2 border-white w-32 text-white outline-none ${getTransformClasses()}`}
              min="0"
            />
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className={`text-6xl font-bold hover:scale-105 transition-transform ${getLifeDisplayColor()} ${getTransformClasses()}`}
            >
              {player.life}
            </button>
          )}
        </div>

        {/* Life Controls */}
        <div className={`${getButtonContainerClasses()} ${getButtonsOrder()}`}>
          <button
            onClick={() => handleLifeChange(-5)}
            className="w-12 h-12 bg-red-600 hover:bg-red-500 rounded-full text-white font-bold text-lg"
          >
            -5
          </button>
          <button
            onClick={() => handleLifeChange(-1)}
            className="w-12 h-12 bg-red-600 hover:bg-red-500 rounded-full text-white font-bold text-lg"
          >
            -1
          </button>
          <button
            onClick={() => handleLifeChange(1)}
            className="w-12 h-12 bg-green-600 hover:bg-green-500 rounded-full text-white font-bold text-lg"
          >
            +1
          </button>
          <button
            onClick={() => handleLifeChange(5)}
            className="w-12 h-12 bg-green-600 hover:bg-green-500 rounded-full text-white font-bold text-lg"
          >
            +5
          </button>
        </div>

        {/* Commander Damage */}
        {settings.commanderFormat && (
          <div className={`text-center ${getCommanderDamageOrder()}`}>
            <button
              onClick={() => setShowCommanderDamage(!showCommanderDamage)}
              className={`text-sm text-gray-400 hover:text-white transition-colors whitespace-nowrap ${getTransformClasses()}`}
            >
              Commander Damage: {getCommanderDamageTotal()}
            </button>
          </div>
        )}

        {/* Commander Damage Details (shown when expanded) */}
        {showCommanderDamage && (
          <div className={getCommanderDamagePopupClasses()}>
            <div className="space-y-1">
              {allPlayers
                .filter((p) => p.id !== player.id)
                .map((opponent) => (
                  <div
                    key={opponent.id}
                    className={`flex items-center justify-between text-xs ${
                      orientation === "left" || orientation === "right"
                        ? `${getTransformClasses()} origin-center my-4`
                        : ""
                    }`}
                  >
                    <span className="whitespace-nowrap">{opponent.name}:</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() =>
                          onAction({
                            type: "CHANGE_COMMANDER_DAMAGE",
                            playerId: player.id,
                            fromPlayerId: opponent.id,
                            amount: -1,
                          })
                        }
                        className="w-5 h-5 bg-red-600 hover:bg-red-500 rounded text-white"
                      >
                        -
                      </button>
                      <span className="w-6 text-center">
                        {player.commanderDamage[opponent.id] || 0}
                      </span>
                      <button
                        onClick={() =>
                          onAction({
                            type: "CHANGE_COMMANDER_DAMAGE",
                            playerId: player.id,
                            fromPlayerId: opponent.id,
                            amount: 1,
                          })
                        }
                        className="w-5 h-5 bg-green-600 hover:bg-green-500 rounded text-white"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
