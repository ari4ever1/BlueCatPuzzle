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
    const customImage = isSpecial && specialType ? 
      customCatImages[specialType] : 
      customCatImages[type];
    
    if (customImage) {
      return (
        <img 
          src={customImage} 
          alt={isSpecial && specialType ? specialType : type}
          className="w-full h-full object-contain rounded-lg"
        />
      );
    }
    
    // Otherwise, render SVG
    if (catIcon) {
      return (
        <div 
          className="w-full h-full p-1"
          style={{ 
            color: 'white',
            background: catIcon.color,
          }}
          dangerouslySetInnerHTML={{ __html: catIcon.svg }}
        />
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
