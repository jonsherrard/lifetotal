"use client";

import { useState, useReducer, useCallback } from "react";
import { Player, GameState, PlayerAction, GameSettings } from "@/types";
import PlayerCard from "@/components/PlayerCard";
import SettingsModal from "@/components/SettingsModal";

const initialSettings: GameSettings = {
  playerCount: 4,
  startingLife: 40,
  commanderFormat: true,
  lifeLinkEnabled: true,
  fivePlayerLayout: "3v2",
};

const createInitialPlayer = (
  id: string,
  name: string,
  startingLife: number,
  position: number
): Player => ({
  id,
  name,
  life: startingLife,
  maxLife: startingLife,
  commanderDamage: {},
  isStartingPlayer: false,
  position,
  isEliminated: false,
  lifeLinkActive: false,
});

const gameReducer = (state: GameState, action: PlayerAction): GameState => {
  switch (action.type) {
    case "CHANGE_LIFE":
      return {
        ...state,
        players: state.players.map((player) =>
          player.id === action.playerId
            ? { ...player, life: Math.max(0, player.life + action.amount) }
            : player
        ),
      };

    case "CHANGE_COMMANDER_DAMAGE":
      return {
        ...state,
        players: state.players.map((player) =>
          player.id === action.playerId
            ? {
                ...player,
                commanderDamage: {
                  ...player.commanderDamage,
                  [action.fromPlayerId]: Math.max(
                    0,
                    (player.commanderDamage[action.fromPlayerId] || 0) +
                      action.amount
                  ),
                },
              }
            : player
        ),
      };

    case "RESET_PLAYER":
      return {
        ...state,
        players: state.players.map((player) =>
          player.id === action.playerId
            ? {
                ...player,
                life: player.maxLife,
                commanderDamage: {},
                isEliminated: false,
              }
            : player
        ),
      };

    case "ELIMINATE_PLAYER":
      return {
        ...state,
        players: state.players.map((player) =>
          player.id === action.playerId
            ? { ...player, isEliminated: true }
            : player
        ),
      };

    case "SET_STARTING_PLAYER":
      return {
        ...state,
        players: state.players.map((player) => ({
          ...player,
          isStartingPlayer: player.id === action.playerId,
        })),
      };

    case "UPDATE_SETTINGS":
      const newSettings = { ...state.settings, ...action.settings };
      let newPlayers = state.players;

      // Update player count
      if (
        action.settings.playerCount &&
        action.settings.playerCount !== state.settings.playerCount
      ) {
        if (action.settings.playerCount > state.players.length) {
          // Add players
          const playersToAdd =
            action.settings.playerCount - state.players.length;
          for (let i = 0; i < playersToAdd; i++) {
            const newId = `player-${state.players.length + i + 1}`;
            newPlayers = [
              ...newPlayers,
              createInitialPlayer(
                newId,
                `Player ${state.players.length + i + 1}`,
                newSettings.startingLife,
                state.players.length + i + 1
              ),
            ];
          }
        } else if (action.settings.playerCount < state.players.length) {
          // Remove players
          newPlayers = newPlayers.slice(0, action.settings.playerCount);
        }
      }

      // Update starting life
      if (
        action.settings.startingLife &&
        action.settings.startingLife !== state.settings.startingLife
      ) {
        newPlayers = newPlayers.map((player) => ({
          ...player,
          life: action.settings.startingLife!,
          maxLife: action.settings.startingLife!,
        }));
      }

      return {
        ...state,
        settings: newSettings,
        players: newPlayers,
      };

    case "RESET_GAME":
      return {
        ...state,
        players: state.players.map((player) => ({
          ...player,
          life: player.maxLife,
          commanderDamage: {},
          isEliminated: false,
          isStartingPlayer: false,
        })),
        currentTurn: 0,
        gameStarted: false,
      };

    default:
      return state;
  }
};

const createInitialState = (): GameState => {
  const players = Array.from({ length: initialSettings.playerCount }, (_, i) =>
    createInitialPlayer(
      `player-${i + 1}`,
      `Player ${i + 1}`,
      initialSettings.startingLife,
      i + 1
    )
  );

  return {
    players,
    settings: initialSettings,
    currentTurn: 0,
    gameStarted: false,
  };
};

export default function Home() {
  const [gameState, dispatch] = useReducer(gameReducer, createInitialState());
  const [showSettings, setShowSettings] = useState(false);
  const [settingsOrientation, setSettingsOrientation] = useState<
    "top" | "right" | "bottom" | "left"
  >("top");

  const handlePlayerAction = useCallback((action: PlayerAction) => {
    dispatch(action);
  }, []);

  const getPlayerOrientation = useCallback(
    (playerPosition: number): "top" | "right" | "bottom" | "left" => {
      const { playerCount, fivePlayerLayout } = gameState.settings;

      // 2 players: 1 top, 1 bottom
      if (playerCount === 2) {
        return playerPosition === 1 ? "bottom" : "top";
      }

      // 3 players: 2 bottom, 1 top
      if (playerCount === 3) {
        return playerPosition <= 2 ? "bottom" : "top";
      }

      // 4 players: 2x2 grid (2 top, 2 bottom)
      if (playerCount === 4) {
        return playerPosition <= 2 ? "bottom" : "top";
      }

      // 5 players: layout depends on setting
      if (playerCount === 5) {
        if (fivePlayerLayout === "2-2-1") {
          // 2-2-1 layout with correct orientations:
          // Player 1 (bottom left) faces up
          if (playerPosition === 1) return "bottom";
          // Player 2 (top left) faces down
          if (playerPosition === 2) return "top";
          // Player 3 (top center) faces down
          if (playerPosition === 3) return "top";
          // Player 4 (right column) faces left
          if (playerPosition === 4) return "right";
          // Player 5 (bottom center) faces up
          return "bottom";
        } else {
          // 3v2 layout
          return playerPosition <= 3 ? "bottom" : "top";
        }
      }
      return "bottom";
    },
    [gameState.settings]
  );

  const handleSettingsOpen = useCallback(
    (playerPosition: number) => {
      const orientation = getPlayerOrientation(playerPosition);
      setSettingsOrientation(orientation);
      setShowSettings(true);
    },
    [getPlayerOrientation]
  );

  const randomizeStartingPlayer = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * gameState.players.length);
    const randomPlayer = gameState.players[randomIndex];
    dispatch({ type: "SET_STARTING_PLAYER", playerId: randomPlayer.id });
  }, [gameState.players]);

  const getGridLayout = (playerCount: number): string => {
    switch (playerCount) {
      case 3:
        return "grid-cols-2 grid-rows-2 gap-2";
      case 4:
        return "grid-cols-2 grid-rows-2 gap-2";
      case 5:
        if (gameState.settings.fivePlayerLayout === "2-2-1") {
          return "grid-cols-3 grid-rows-2 gap-2";
        }
        return "grid-cols-3 grid-rows-2 gap-2";
      default:
        return "grid-cols-2 grid-rows-2 gap-2";
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-2 overflow-hidden">
      <div
        className={`grid ${getGridLayout(
          gameState.settings.playerCount
        )} h-screen max-h-screen`}
      >
        {gameState.players.map((player, index) => {
          const { playerCount, fivePlayerLayout } = gameState.settings;

          // Special grid positioning for layouts
          let gridClasses = "";
          if (playerCount === 5) {
            if (fivePlayerLayout === "2-2-1") {
              // 2-2-1 layout positioning:
              // Column 1: Player 2 above Player 1
              // Column 2: Player 3 above Player 5
              // Column 3: Player 4 (full height)
              if (index === 0) gridClasses = "col-start-1 row-start-2"; // Player 1 - bottom left
              if (index === 1) gridClasses = "col-start-1 row-start-1"; // Player 2 - top left
              if (index === 2) gridClasses = "col-start-2 row-start-1"; // Player 3 - top center
              if (index === 3)
                gridClasses = "col-start-3 row-start-1 row-span-2"; // Player 4 - full right
              if (index === 4) gridClasses = "col-start-2 row-start-2"; // Player 5 - bottom center
            } else {
              // 3v2 layout: 2 at top, 3 at bottom
              if (index === 0) gridClasses = "col-start-1 row-start-2";
              if (index === 1) gridClasses = "col-start-2 row-start-2";
              if (index === 2) gridClasses = "col-start-3 row-start-2";
              if (index === 3)
                gridClasses = "col-start-1 row-start-1 col-span-1";
              if (index === 4)
                gridClasses = "col-start-3 row-start-1 col-span-1";
            }
          }

          return (
            <PlayerCard
              key={player.id}
              player={player}
              allPlayers={gameState.players}
              settings={gameState.settings}
              onAction={handlePlayerAction}
              onSettingsOpen={() => handleSettingsOpen(player.position)}
              orientation={getPlayerOrientation(player.position)}
              isThreePlayer={
                gameState.settings.playerCount === 3 && index === 2
              }
              className={gridClasses}
            />
          );
        })}
      </div>

      {showSettings && (
        <SettingsModal
          settings={gameState.settings}
          onUpdateSettings={(settings: Partial<GameSettings>) =>
            dispatch({ type: "UPDATE_SETTINGS", settings })
          }
          onClose={() => setShowSettings(false)}
          onResetGame={() => dispatch({ type: "RESET_GAME" })}
          onRandomizeStartingPlayer={randomizeStartingPlayer}
          orientation={settingsOrientation}
        />
      )}
    </div>
  );
}
