import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import StartScreen from './pages/StartScreen';
import GameScreen from './pages/GameScreen';
import LevelComplete from './pages/LevelComplete';
import GameOver from './pages/GameOver';
import NotFound from './pages/not-found';
import { useCatGame } from './lib/stores/useCatGame';
import { getLocalStorage } from './lib/utils';
import "@fontsource/inter";
import './index.css';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const initializeGame = useCatGame(state => state.initializeGame);
  
  // Initialize game state from localStorage if available
  useEffect(() => {
    // Load game state from localStorage
    const savedGameState = getLocalStorage('catPuzzleGameState');
    
    // Initialize game with saved state or defaults
    initializeGame(savedGameState);
    
    // Simulate loading assets
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [initializeGame]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-100">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-blue-600 mb-4">Meow Match</h1>
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-blue-700">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<StartScreen />} />
        <Route path="/game" element={<GameScreen />} />
        <Route path="/level-complete" element={<LevelComplete />} />
        <Route path="/game-over" element={<GameOver />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
