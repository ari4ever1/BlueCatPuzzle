import React from 'react';
import { Tile as TileType } from '../../lib/stores/useCatGame';
import { defaultCatIcons, defaultPowerUps } from '../../assets/cats';
import { useCatGame } from '../../lib/stores/useCatGame';

interface TileProps {
  tile: TileType;
  size: number;
  isSelected: boolean;
  onClick: () => void;
}

const Tile: React.FC<TileProps> = ({ tile, size, isSelected, onClick }) => {
  const { type, row, col, isMatched, isSpecial, specialType, isNew, isMoving } = tile;
  const customCatImages = useCatGame(state => state.customCatImages);
  
  // Find the appropriate cat icon
  const getCatIcon = () => {
    // First check if it's a special tile
    if (isSpecial && specialType) {
      const powerUp = defaultPowerUps.find(p => p.id === specialType);
      if (powerUp) {
        // Check if there's a custom image for this power-up
        if (customCatImages[specialType]) {
          return null; // Will render image instead
        }
        return powerUp;
      }
    }
    
    // Otherwise, find the regular cat icon
    const catIcon = defaultCatIcons.find(cat => cat.id === type);
    if (catIcon) {
      // Check if there's a custom image for this cat type
      if (customCatImages[type]) {
        return null; // Will render image instead
      }
      return catIcon;
    }
    
    return null;
  };
  
  const catIcon = getCatIcon();
  
  // Style for positioning
  const positionStyle = {
    top: `calc(${row * size}px + ${row * 4}px)`, // Size plus gap
    left: `calc(${col * size}px + ${col * 4}px)`,
    width: `${size}px`,
    height: `${size}px`,
    transition: isMoving ? 'all 0.3s ease-in-out' : 'none'
  };
  
  // Style for the tile
  const tileClasses = `
    absolute rounded-lg flex items-center justify-center cursor-pointer shadow-md
    ${isMatched ? 'animate-ping opacity-70' : ''}
    ${isNew ? 'animate-fadeIn' : ''}
    ${isSelected ? 'ring-4 ring-yellow-400 z-10' : ''}
    ${isSpecial ? 'z-20' : ''}
  `;
  
  // Render the tile content (either SVG or custom image)
  const renderTileContent = () => {
    // Check for custom image first
    const customImage = (isSpecial && specialType && customCatImages[specialType]) ? 
      customCatImages[specialType] : 
      (customCatImages[type] ? customCatImages[type] : null);
    
    if (customImage) {
      return (
        <img 
          src={customImage} 
          alt={isSpecial && specialType ? specialType : type}
          className="w-full h-full object-contain rounded-lg"
        />
      );
    }
    
    // Otherwise, render a colored cat tile based on type
    if (catIcon) {
      // Handle special tiles (Rainbow and Bomb)
      if (isSpecial && specialType) {
        if (specialType === 'rainbow') {
          return (
            <div 
              className="w-full h-full p-1 rounded-lg flex items-center justify-center"
              style={{ 
                background: 'linear-gradient(45deg, red, orange, yellow, green, blue, indigo, violet)',
              }}
            >
              <svg viewBox="0 0 24 24" className="w-full h-full" fill="white">
                <path d="M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10s10-4.48,10-10S17.52,2,12,2z M7.77,9.25l3.12-1.56C11.18,7.53,11.59,7.5,12,7.5s0.82,0.03,1.11,0.19l3.12,1.56c0.76,0.38,1.12,1.26,0.9,2.04l-0.84,2.93c-0.53,1.85-2.28,3.18-4.29,3.18s-3.76-1.33-4.29-3.18l-0.84-2.93C6.65,10.51,7.01,9.63,7.77,9.25z M8.5,11c-0.55,0-1-0.45-1-1s0.45-1,1-1s1,0.45,1,1S9.05,11,8.5,11z M15.5,11c-0.55,0-1-0.45-1-1s0.45-1,1-1s1,0.45,1,1S16.05,11,15.5,11z" />
                <path d="M13.95,15.5c-0.55,0.34-1.26,0.34-1.81,0c-0.27-0.17-0.62-0.08-0.79,0.19c-0.17,0.27-0.08,0.62,0.19,0.79c0.45,0.28,0.97,0.42,1.49,0.42s1.04-0.14,1.49-0.42c0.27-0.17,0.35-0.52,0.19-0.79S14.22,15.33,13.95,15.5z" />
                <circle cx="12" cy="12" r="9" fill="none" stroke="white" strokeWidth="1" strokeDasharray="1,1"/>
              </svg>
            </div>
          );
        } else if (specialType === 'bomb') {
          return (
            <div 
              className="w-full h-full p-1 rounded-lg flex items-center justify-center"
              style={{ 
                background: '#2d3748',
              }}
            >
              <svg viewBox="0 0 24 24" className="w-full h-full" fill="white">
                <path d="M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10s10-4.48,10-10S17.52,2,12,2z M7.77,9.25l3.12-1.56C11.18,7.53,11.59,7.5,12,7.5s0.82,0.03,1.11,0.19l3.12,1.56c0.76,0.38,1.12,1.26,0.9,2.04l-0.84,2.93c-0.53,1.85-2.28,3.18-4.29,3.18s-3.76-1.33-4.29-3.18l-0.84-2.93C6.65,10.51,7.01,9.63,7.77,9.25z M8.5,11c-0.55,0-1-0.45-1-1s0.45-1,1-1s1,0.45,1,1S9.05,11,8.5,11z M15.5,11c-0.55,0-1-0.45-1-1s0.45-1,1-1s1,0.45,1,1S16.05,11,15.5,11z" />
                <path d="M13.95,15.5c-0.55,0.34-1.26,0.34-1.81,0c-0.27-0.17-0.62-0.08-0.79,0.19c-0.17,0.27-0.08,0.62,0.19,0.79c0.45,0.28,0.97,0.42,1.49,0.42s1.04-0.14,1.49-0.42c0.27-0.17,0.35-0.52,0.19-0.79S14.22,15.33,13.95,15.5z" />
                <circle cx="12" cy="12" r="5" fill="#ff0000" stroke="white" strokeWidth="1" opacity="0.7"/>
              </svg>
            </div>
          );
        }
      }
      
      // Regular cat tile
      return (
        <div 
          className="w-full h-full p-1 rounded-lg flex items-center justify-center"
          style={{ 
            background: catIcon.color,
          }}
        >
          <svg viewBox="0 0 24 24" className="w-full h-full" fill="white">
            <path d="M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10s10-4.48,10-10S17.52,2,12,2z M7.77,9.25l3.12-1.56C11.18,7.53,11.59,7.5,12,7.5s0.82,0.03,1.11,0.19l3.12,1.56c0.76,0.38,1.12,1.26,0.9,2.04l-0.84,2.93c-0.53,1.85-2.28,3.18-4.29,3.18s-3.76-1.33-4.29-3.18l-0.84-2.93C6.65,10.51,7.01,9.63,7.77,9.25z M8.5,11c-0.55,0-1-0.45-1-1s0.45-1,1-1s1,0.45,1,1S9.05,11,8.5,11z M15.5,11c-0.55,0-1-0.45-1-1s0.45-1,1-1s1,0.45,1,1S16.05,11,15.5,11z" />
            <path d="M13.95,15.5c-0.55,0.34-1.26,0.34-1.81,0c-0.27-0.17-0.62-0.08-0.79,0.19c-0.17,0.27-0.08,0.62,0.19,0.79c0.45,0.28,0.97,0.42,1.49,0.42s1.04-0.14,1.49-0.42c0.27-0.17,0.35-0.52,0.19-0.79S14.22,15.33,13.95,15.5z" />
          </svg>
        </div>
      );
    }
    
    // Fallback
    return (
      <div className="w-full h-full bg-gray-300 rounded-lg flex items-center justify-center">
        ?
      </div>
    );
  };
  
  return (
    <div
      className={tileClasses}
      style={positionStyle}
      onClick={onClick}
    >
      {renderTileContent()}
    </div>
  );
};

export default Tile;
