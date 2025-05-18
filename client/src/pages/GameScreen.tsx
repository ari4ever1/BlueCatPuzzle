import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Board from '../components/game/Board';
import GameOverlay from '../components/game/GameOverlay';
import Settings from '../components/game/Settings';
import { useCatGame } from '../lib/stores/useCatGame';
import { backgrounds } from '../assets/cats';

const GameScreen = () => {
  const navigate = useNavigate();
  const board = useCatGame(state => state.board);
  const currentLevel = useCatGame(state => state.currentLevel);
  const levels = useCatGame(state => state.levels);
  const isGameOver = useCatGame(state => state.isGameOver);
  const isLevelComplete = useCatGame(state => state.isLevelComplete);
  const showSettings = useCatGame(state => state.showSettings);
  
  // Get the level info
  const currentLevelInfo = levels.find(level => level.id === currentLevel);
  
  // If no board or level info, redirect back to start
  useEffect(() => {
    if (!board || !currentLevelInfo) {
      navigate('/');
    }
  }, [board, currentLevelInfo, navigate]);
  
  if (!board || !currentLevelInfo) return null;
  
  // Get background for current level
  const bgId = currentLevelInfo.background || 'bg1';
  const background = backgrounds.find(bg => bg.id === bgId) || backgrounds[0];
  
  // Handle continue button for level complete
  const handleContinue = () => {
    if (currentLevel < levels.length) {
      navigate('/level-complete');
    } else {
      // All levels complete!
      navigate('/');
    }
  };
  
  // Handle retry button for game over
  const handleRetry = () => {
    navigate('/game-over');
  };
  
  return (
    <div 
      className="min-h-screen relative flex flex-col"
      style={{ background: background.value }}
    >
      <GameOverlay />
      
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md aspect-square">
          <Board />
        </div>
      </div>
      
      {/* Level complete overlay */}
      {isLevelComplete && (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center z-40">
          <div className="bg-white rounded-xl p-6 text-center w-4/5 max-w-sm">
            <h2 className="text-2xl font-bold text-blue-600 mb-4">
              Level Complete!
            </h2>
            
            <div className="mb-6">
              <p className="text-xl font-bold mb-2">Great job!</p>
              <p className="text-gray-600">
                You've completed level {currentLevel} with style!
              </p>
            </div>
            
            <button
              onClick={handleContinue}
              className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-500 transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
      )}
      
      {/* Game over overlay */}
      {isGameOver && (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center z-40">
          <div className="bg-white rounded-xl p-6 text-center w-4/5 max-w-sm">
            <h2 className="text-2xl font-bold text-red-500 mb-4">
              Game Over
            </h2>
            
            <div className="mb-6">
              <p className="text-xl font-bold mb-2">Out of moves!</p>
              <p className="text-gray-600">
                You ran out of moves. Want to try again?
              </p>
            </div>
            
            <button
              onClick={handleRetry}
              className="w-full py-3 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      )}
      
      {/* Settings modal */}
      {showSettings && <Settings />}
    </div>
  );
};

export default GameScreen;
