import React from 'react';
import { useCatGame } from '../../lib/stores/useCatGame';
import { useNavigate } from 'react-router-dom';

const GameOverlay = () => {
  const score = useCatGame(state => state.score);
  const movesLeft = useCatGame(state => state.movesLeft);
  const currentLevel = useCatGame(state => state.currentLevel);
  const levels = useCatGame(state => state.levels);
  const objectivesCompleted = useCatGame(state => state.objectivesCompleted);
  const isGameOver = useCatGame(state => state.isGameOver);
  const isLevelComplete = useCatGame(state => state.isLevelComplete);
  const toggleSettings = useCatGame(state => state.toggleSettings);
  
  const navigate = useNavigate();
  
  // Find the current level info
  const currentLevelInfo = levels.find(level => level.id === currentLevel);
  
  if (!currentLevelInfo) return null;
  
  const { targetScore, objectives } = currentLevelInfo;
  
  const handlePause = () => {
    navigate('/');
  };
  
  const handleSettings = () => {
    toggleSettings();
  };
  
  return (
    <div className="absolute top-0 left-0 w-full p-4 flex flex-col">
      {/* Top bar with level, score, and moves */}
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          <button 
            onClick={handlePause}
            className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center mr-2 shadow-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h2 className="text-lg font-bold text-white bg-blue-600 px-3 py-1 rounded-md shadow-md">
            Level {currentLevel}
          </h2>
        </div>
        
        <button 
          onClick={handleSettings}
          className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-md"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>
      
      {/* Score and moves */}
      <div className="flex justify-between mb-2">
        <div className="bg-blue-600 text-white px-3 py-1 rounded-md shadow-md w-1/2 mr-1">
          <div className="text-sm">Score</div>
          <div className="font-bold">{score} / {targetScore}</div>
        </div>
        
        <div className="bg-blue-600 text-white px-3 py-1 rounded-md shadow-md w-1/2 ml-1">
          <div className="text-sm">Moves</div>
          <div className="font-bold">{movesLeft}</div>
        </div>
      </div>
      
      {/* Objectives */}
      {objectives && objectives.length > 0 && (
        <div className="bg-blue-100 bg-opacity-80 rounded-md p-2 shadow-md mb-2">
          <h3 className="text-sm font-bold text-blue-800 mb-1">Objectives:</h3>
          {objectives.map((objective, index) => {
            const current = objectivesCompleted[objective.type] || 0;
            const isComplete = current >= objective.count;
            
            return (
              <div key={index} className="flex justify-between items-center text-sm">
                <div className={`${isComplete ? 'text-green-700' : 'text-blue-700'}`}>
                  {objective.label}
                </div>
                <div className={`font-bold ${isComplete ? 'text-green-700' : 'text-blue-700'}`}>
                  {current}/{objective.count}
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      {/* Game over and level complete overlays handled by parent component */}
    </div>
  );
};

export default GameOverlay;
