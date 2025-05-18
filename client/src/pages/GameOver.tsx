import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCatGame } from '../lib/stores/useCatGame';

const GameOver = () => {
  const navigate = useNavigate();
  const currentLevel = useCatGame(state => state.currentLevel);
  const score = useCatGame(state => state.score);
  const levels = useCatGame(state => state.levels);
  const startLevel = useCatGame(state => state.startLevel);
  
  // Get the current level info
  const level = levels.find(lvl => lvl.id === currentLevel);
  
  // If we don't have level info, redirect to home
  if (!level) {
    navigate('/');
    return null;
  }
  
  // Handle retry button
  const handleRetry = () => {
    startLevel(currentLevel);
    navigate('/game');
  };
  
  // Handle return to level select
  const handleLevelSelect = () => {
    navigate('/');
  };
  
  // Calculate how close the player got to the target score (as percentage)
  const progressPercentage = Math.min(100, Math.round((score / level.targetScore) * 100));
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-100 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md text-center">
        <div className="bg-red-500 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        
        <h1 className="text-3xl font-bold text-red-800 mb-2">Game Over!</h1>
        <h2 className="text-xl font-bold text-gray-700 mb-4">Level {currentLevel}</h2>
        
        <div className="mb-6 bg-gray-50 rounded-lg p-4">
          <div className="flex justify-between text-lg font-semibold text-gray-800 mb-2">
            <span>Your Score</span>
            <span>{score}</span>
          </div>
          
          <div className="flex justify-between text-lg font-semibold text-gray-800 mb-2">
            <span>Target Score</span>
            <span>{level.targetScore}</span>
          </div>
          
          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
            <div 
              className="bg-blue-600 h-4 rounded-full" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          
          <div className="text-sm text-gray-600">
            {progressPercentage >= 90 ? 
              "So close! Just a bit more and you'll make it!" :
              progressPercentage >= 50 ?
                "Good effort! Keep trying!" :
                "Keep practicing to improve your score!"
            }
          </div>
          
          {/* If there are specific objectives, show progress */}
          {level.objectives && level.objectives.length > 0 && (
            <div className="mt-4 text-left">
              <div className="text-md font-semibold text-gray-800 mb-1">Objectives Progress:</div>
              {level.objectives.map((objective, index) => {
                const current = useCatGame.getState().objectivesCompleted[objective.type] || 0;
                const progressPercent = Math.min(100, Math.round((current / objective.count) * 100));
                
                return (
                  <div key={index} className="text-sm mb-1">
                    <div className="flex justify-between mb-1">
                      <span>{objective.label}</span>
                      <span>{current}/{objective.count}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-400 h-2 rounded-full" 
                        style={{ width: `${progressPercent}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        
        <div className="grid gap-3">
          <button
            onClick={handleRetry}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors shadow-md"
          >
            Try Again
          </button>
          
          <button
            onClick={handleLevelSelect}
            className="w-full py-3 bg-gray-200 hover:bg-gray-300 text-blue-800 font-bold rounded-lg transition-colors shadow-md"
          >
            Level Select
          </button>
        </div>
        
        <div className="mt-4 text-gray-500 text-sm">
          <p>Hint: Try creating matches of 4 or 5 to get special power-ups!</p>
        </div>
      </div>
    </div>
  );
};

export default GameOver;
