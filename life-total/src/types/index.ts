export interface Player {
  id: string;
  name: string;
  life: number;
  maxLife: number;
  commanderDamage: Record<string, number>; // playerId -> damage
  isStartingPlayer: boolean;
  position: number;
  isEliminated: boolean;
  lifeLinkActive: boolean;
}

export interface GameSettings {
  playerCount: number;
  startingLife: number;
  commanderFormat: boolean;
  lifeLinkEnabled: boolean;
}

export interface GameState {
  players: Player[];
  settings: GameSettings;
  currentTurn: number;
  gameStarted: boolean;
}

export type PlayerAction = 
  | { type: 'CHANGE_LIFE'; playerId: string; amount: number }
  | { type: 'CHANGE_COMMANDER_DAMAGE'; playerId: string; fromPlayerId: string; amount: number }
  | { type: 'RESET_PLAYER'; playerId: string }
  | { type: 'ELIMINATE_PLAYER'; playerId: string }
  | { type: 'SET_STARTING_PLAYER'; playerId: string }
  | { type: 'UPDATE_SETTINGS'; settings: Partial<GameSettings> }
  | { type: 'RESET_GAME' };