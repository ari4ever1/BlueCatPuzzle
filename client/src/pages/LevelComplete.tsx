import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCatGame } from '../lib/stores/useCatGame';
import { useAudio } from '../lib/stores/useAudio';
import Confetti from 'react-confetti';

const LevelComplete = () => {
  const navigate = useNavigate();
  const currentLevel = useCatGame(state => state.currentLevel);
  const levels = useCatGame(state => state.levels);
  const score = useCatGame(state => state.score);
  const startLevel = useCatGame(state => state.startLevel);
  const playSuccess = useAudio(state => state.playSuccess);
  
  // Get the completed level and next level info
  const completedLevel = levels.find(level => level.id === currentLevel);
  const nextLevel = levels.find(level => level.id === currentLevel + 1);
  const isLastLevel = currentLevel >= levels.length;
  
  // Play success sound when component mounts
  useEffect(() => {
    playSuccess();
  }, [playSuccess]);
  
  // If we don't have level info, redirect to home
  useEffect(() => {
    if (!completedLevel) {
      navigate('/');
    }
  }, [completedLevel, navigate]);
  
  // Handle continue to next level
  const handleNextLevel = () => {
    if (nextLevel) {
      startLevel(nextLevel.id);
      navigate('/game');
    } else {
      // No more levels, return to home
      navigate('/');
    }
  };
  
  // Handle replay current level
  const handleReplayLevel = () => {
    startLevel(currentLevel);
    navigate('/game');
  };
  
  // Handle return to level select
  const handleLevelSelect = () => {
    navigate('/');
  };
  
  if (!completedLevel) return null;
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-100 p-4">
      {/* Confetti celebration effect */}
      <Confetti
        width={window.innerWidth}
        height={window.innerHeight}
        recycle={false}
        numberOfPieces={200}
        gravity={0.2}
        colors={['#4299e1', '#3182ce', '#90cdf4', '#ebf8ff', '#2b6cb0']}
      />
      
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md text-center">
        <div className="bg-blue-600 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h1 className="text-3xl font-bold text-blue-800 mb-2">Level Complete!</h1>
        <h2 className="text-xl font-bold text-blue-600 mb-4">Level {currentLevel}</h2>
        
        <div className="mb-6 bg-blue-50 rounded-lg p-4">
          <div className="text-lg font-semibold text-blue-800">Your Score</div>
          <div className="text-3xl font-bold text-blue-700">{score}</div>
          
          {completedLevel.targetScore && (
            <div className="text-sm text-blue-600 mt-1">
              Target score: {completedLevel.targetScore}
            </div>
          )}
          
          {/* Star rating based on score compared to target */}
          <div className="flex justify-center mt-3">
            {Array.from({ length: 3 }).map((_, i) => {
              // Award stars based on score ratio to target
              // 1 star: met target, 2 stars: 25% above target, 3 stars: 50% above target
              const threshold = completedLevel.targetScore * (1 + i * 0.25);
              const achieved = score >= threshold;
              
              return (
                <div 
                  key={i}
                  className={`w-8 h-8 mx-1 ${achieved ? 'text-yellow-400' : 'text-gray-300'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                  </svg>
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="grid gap-3">
          {nextLevel && (
            <button
              onClick={handleNextLevel}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors shadow-md"
            >
              Next Level
            </button>
          )}
          
          {isLastLevel && (
            <div className="text-lg font-bold text-green-600 mb-3">
              Congratulations! You've completed all levels!
            </div>
          )}
          
          <button
            onClick={handleReplayLevel}
            className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg transition-colors shadow-md"
          >
            Replay Level
          </button>
          
          <button
            onClick={handleLevelSelect}
            className="w-full py-3 bg-gray-200 hover:bg-gray-300 text-blue-800 font-bold rounded-lg transition-colors shadow-md"
          >
            Level Select
          </button>
        </div>
      </div>
    </div>
  );
};

export default LevelComplete;
