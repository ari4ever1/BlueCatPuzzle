import React, { useState, useRef, useEffect } from 'react';
import { useCatGame } from '../../lib/stores/useCatGame';
import { useNavigate } from 'react-router-dom';

const LevelSelector = () => {
  const levels = useCatGame(state => state.levels);
  const startLevel = useCatGame(state => state.startLevel);
  const navigate = useNavigate();
  
  const [currentPage, setCurrentPage] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const levelsPerPage = 9; // 3x3 grid
  const totalPages = Math.ceil(levels.length / levelsPerPage);
  
  // Function to start a level
  const handleLevelSelect = (levelId: number) => {
    startLevel(levelId);
    navigate('/game');
  };
  
  // Handle swipe/drag for mobile
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
    setTouchEnd(null);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isSwipe = Math.abs(distance) > 50; // Minimum distance for a swipe
    
    if (isSwipe) {
      if (distance > 0 && currentPage < totalPages - 1) {
        // Swipe left - next page
        setCurrentPage(currentPage + 1);
      } else if (distance < 0 && currentPage > 0) {
        // Swipe right - previous page
        setCurrentPage(currentPage - 1);
      }
    }
    
    setTouchStart(null);
    setTouchEnd(null);
  };
  
  // Go to next/previous page
  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  // Get levels for the current page
  const currentLevels = levels.slice(
    currentPage * levelsPerPage, 
    (currentPage + 1) * levelsPerPage
  );
  
  // Render a single level button
  const renderLevelButton = (level) => {
    const { id, unlocked, difficulty } = level;
    
    // Get color based on difficulty
    const getDifficultyColor = (diff) => {
      if (diff <= 2) return 'bg-green-600';
      if (diff <= 5) return 'bg-yellow-500';
      if (diff <= 7) return 'bg-orange-500';
      return 'bg-red-600';
    };
    
    return (
      <button
        key={id}
        onClick={() => unlocked && handleLevelSelect(id)}
        className={`
          w-20 h-20 rounded-lg m-2 flex flex-col items-center justify-center
          ${unlocked ? 'bg-blue-600 hover:bg-blue-500' : 'bg-gray-400'}
          text-white font-bold shadow-md transition-transform transform hover:scale-105
        `}
        disabled={!unlocked}
      >
        <div className="text-xl">{id}</div>
        {unlocked && (
          <div className={`w-4 h-4 mt-1 rounded-full ${getDifficultyColor(difficulty)}`}></div>
        )}
        {!unlocked && (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        )}
      </button>
    );
  };
  
  return (
    <div 
      ref={containerRef}
      className="flex flex-col items-center justify-center w-full p-4"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <h2 className="text-2xl font-bold mb-4 text-blue-800">Select Level</h2>
      
      <div className="flex justify-between w-full mb-2">
        <button
          onClick={prevPage}
          disabled={currentPage === 0}
          className={`w-10 h-10 rounded-full flex items-center justify-center
            ${currentPage === 0 ? 'bg-gray-300' : 'bg-blue-600 text-white'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <div className="text-blue-800 font-bold">
          Page {currentPage + 1} / {totalPages}
        </div>
        
        <button
          onClick={nextPage}
          disabled={currentPage === totalPages - 1}
          className={`w-10 h-10 rounded-full flex items-center justify-center
            ${currentPage === totalPages - 1 ? 'bg-gray-300' : 'bg-blue-600 text-white'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      
      <div className="flex flex-wrap justify-center max-w-md">
        {currentLevels.map(level => renderLevelButton(level))}
      </div>
      
      <div className="mt-4 text-sm text-blue-700">
        <div className="flex items-center mb-1">
          <div className="w-3 h-3 rounded-full bg-green-600 mr-2"></div>
          <span>Easy</span>
        </div>
        <div className="flex items-center mb-1">
          <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
          <span>Medium</span>
        </div>
        <div className="flex items-center mb-1">
          <div className="w-3 h-3 rounded-full bg-orange-500 mr-2"></div>
          <span>Hard</span>
        </div>
        <div className="flex items-center mb-1">
          <div className="w-3 h-3 rounded-full bg-red-600 mr-2"></div>
          <span>Very Hard</span>
        </div>
      </div>
    </div>
  );
};

export default LevelSelector;
