import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LevelSelector from '../components/game/LevelSelector';
import Settings from '../components/game/Settings';
import { useCatGame } from '../lib/stores/useCatGame';
import { useAudio } from '../lib/stores/useAudio';
import { backgrounds } from '../assets/cats';

const StartScreen = () => {
  const navigate = useNavigate();
  const [showLevelSelector, setShowLevelSelector] = useState(false);
  const toggleSettings = useCatGame(state => state.toggleSettings);
  const showSettings = useCatGame(state => state.showSettings);
  const currentLevel = useCatGame(state => state.currentLevel);
  const startLevel = useCatGame(state => state.startLevel);
  
  // Load background music
  useEffect(() => {
    const backgroundMusic = new Audio('/sounds/background.mp3');
    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.3;
    useAudio.getState().setBackgroundMusic(backgroundMusic);
    
    // Try to play music (may be blocked by browser)
    backgroundMusic.play().catch(err => {
      console.log('Auto-play prevented:', err);
    });
    
    return () => {
      backgroundMusic.pause();
    };
  }, []);
  
  const handlePlay = () => {
    startLevel(currentLevel);
    navigate('/game');
  };
  
  const handleContinue = () => {
    setShowLevelSelector(true);
  };
  
  const handleSettings = () => {
    toggleSettings();
  };
  
  // Choose a random background
  const randomBg = backgrounds[Math.floor(Math.random() * backgrounds.length)];
  
  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-4"
      style={{ background: randomBg.value }}
    >
      {/* Game title and cat logo */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
          Meow Match
        </h1>
        <p className="text-blue-100 text-lg drop-shadow-md">
          Match 3 cats to solve puzzles!
        </p>
        
        {/* Cat icon */}
        <div className="w-32 h-32 mx-auto mt-4">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white">
            <path d="M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10s10-4.48,10-10S17.52,2,12,2z M7.77,9.25l3.12-1.56C11.18,7.53,11.59,7.5,12,7.5s0.82,0.03,1.11,0.19l3.12,1.56c0.76,0.38,1.12,1.26,0.9,2.04l-0.84,2.93c-0.53,1.85-2.28,3.18-4.29,3.18s-3.76-1.33-4.29-3.18l-0.84-2.93C6.65,10.51,7.01,9.63,7.77,9.25z M8.5,11c-0.55,0-1-0.45-1-1s0.45-1,1-1s1,0.45,1,1S9.05,11,8.5,11z M15.5,11c-0.55,0-1-0.45-1-1s0.45-1,1-1s1,0.45,1,1S16.05,11,15.5,11z"/>
            <path d="M13.95,15.5c-0.55,0.34-1.26,0.34-1.81,0c-0.27-0.17-0.62-0.08-0.79,0.19c-0.17,0.27-0.08,0.62,0.19,0.79c0.45,0.28,0.97,0.42,1.49,0.42s1.04-0.14,1.49-0.42c0.27-0.17,0.35-0.52,0.19-0.79S14.22,15.33,13.95,15.5z"/>
          </svg>
        </div>
      </div>
      
      {showLevelSelector ? (
        <div className="bg-white rounded-xl p-4 shadow-xl w-full max-w-md">
          <LevelSelector />
          
          <button
            onClick={() => setShowLevelSelector(false)}
            className="mt-4 w-full py-3 bg-blue-600 text-white rounded-md font-bold shadow-md hover:bg-blue-700 transition-colors"
          >
            Back to Menu
          </button>
        </div>
      ) : (
        <div className="flex flex-col w-full max-w-xs">
          <button
            onClick={handlePlay}
            className="mb-4 py-4 bg-blue-600 text-white rounded-xl font-bold text-xl shadow-lg hover:bg-blue-500 transition-transform transform hover:scale-105"
          >
            Play
          </button>
          
          <button
            onClick={handleContinue}
            className="mb-4 py-3 bg-blue-500 text-white rounded-xl font-bold shadow-lg hover:bg-blue-400 transition-transform transform hover:scale-105"
          >
            Select Level
          </button>
          
          <button
            onClick={handleSettings}
            className="py-3 bg-blue-700 text-white rounded-xl font-bold shadow-lg hover:bg-blue-600 transition-transform transform hover:scale-105"
          >
            Settings
          </button>
        </div>
      )}
      
      {/* Show the settings modal if active */}
      {showSettings && <Settings />}
      
      {/* Footer */}
      <div className="mt-8 text-center text-white text-sm opacity-80">
        <p>© 2023 Cat Puzzle Game</p>
        <p>Match cats. Earn points. Have fun!</p>
      </div>
    </div>
  );
};

export default StartScreen;
