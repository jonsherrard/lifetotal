'use client';

import { GameSettings } from '@/types';
import { useState } from 'react';

interface SettingsModalProps {
  settings: GameSettings;
  onUpdateSettings: (settings: Partial<GameSettings>) => void;
  onClose: () => void;
  onResetGame: () => void;
  onRandomizeStartingPlayer: () => void;
  orientation: 'top' | 'right' | 'bottom' | 'left';
}

export default function SettingsModal({
  settings,
  onUpdateSettings,
  onClose,
  onResetGame,
  onRandomizeStartingPlayer,
  orientation
}: SettingsModalProps) {
  const [localSettings, setLocalSettings] = useState<GameSettings>(settings);

  const getModalClasses = () => {
    const baseClasses = "fixed bg-gray-800 border-2 border-gray-600 rounded-lg p-6 z-50 transform";
    
    switch (orientation) {
      case 'top':
        return `${baseClasses} top-4 left-1/2 -translate-x-1/2`;
      case 'right':
        return `${baseClasses} right-4 top-1/2 -translate-y-1/2`;
      case 'bottom':
        return `${baseClasses} bottom-4 left-1/2 -translate-x-1/2`;
      case 'left':
        return `${baseClasses} left-4 top-1/2 -translate-y-1/2`;
      default:
        return `${baseClasses} top-4 left-1/2 -translate-x-1/2`;
    }
  };

  const handleSettingChange = (key: keyof GameSettings, value: GameSettings[keyof GameSettings]) => {
    const newSettings = { ...localSettings, [key]: value };
    setLocalSettings(newSettings);
    onUpdateSettings({ [key]: value });
  };

  const handleResetGame = () => {
    onResetGame();
    onClose();
  };

  const handleRandomizeStartingPlayer = () => {
    onRandomizeStartingPlayer();
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className={getModalClasses()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Game Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white w-6 h-6 flex items-center justify-center"
          >
            ×
          </button>
        </div>

        <div className="space-y-4 min-w-[300px]">
          {/* Player Count */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Number of Players
            </label>
            <div className="flex gap-2">
              {[3, 4, 5].map(count => (
                <button
                  key={count}
                  onClick={() => handleSettingChange('playerCount', count)}
                  className={`px-3 py-2 rounded font-medium transition-colors ${
                    localSettings.playerCount === count
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>

          {/* Starting Life */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Starting Life
            </label>
            <div className="flex gap-2">
              {[20, 30, 40].map(life => (
                <button
                  key={life}
                  onClick={() => handleSettingChange('startingLife', life)}
                  className={`px-3 py-2 rounded font-medium transition-colors ${
                    localSettings.startingLife === life
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {life}
                </button>
              ))}
            </div>
            <div className="mt-2">
              <input
                type="number"
                value={localSettings.startingLife}
                onChange={(e) => handleSettingChange('startingLife', parseInt(e.target.value, 10))}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                min="1"
                max="999"
              />
            </div>
          </div>

          {/* Game Format Options */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Game Format
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={localSettings.commanderFormat}
                  onChange={(e) => handleSettingChange('commanderFormat', e.target.checked)}
                  className="mr-2 rounded"
                />
                <span className="text-gray-300">Commander Format</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={localSettings.lifeLinkEnabled}
                  onChange={(e) => handleSettingChange('lifeLinkEnabled', e.target.checked)}
                  className="mr-2 rounded"
                />
                <span className="text-gray-300">Life Link</span>
              </label>
            </div>
          </div>

          {/* Game Actions */}
          <div className="space-y-3 pt-4 border-t border-gray-600">
            <button
              onClick={handleRandomizeStartingPlayer}
              className="w-full px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-white rounded font-medium transition-colors"
            >
              Randomize Starting Player
            </button>
            
            <button
              onClick={handleResetGame}
              className="w-full px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded font-medium transition-colors"
            >
              Reset Game
            </button>
          </div>
        </div>
      </div>
    </>
  );
}