import React, { useEffect, useRef } from 'react';
import { useCatGame } from '../../lib/stores/useCatGame';
import Tile from './Tile';
import { useAudio } from '../../lib/stores/useAudio';

const Board = () => {
  const board = useCatGame(state => state.board);
  const selectTile = useCatGame(state => state.selectTile);
  const selectedTile = useCatGame(state => state.selectedTile);
  const isAnimating = useCatGame(state => state.isAnimating);
  const isSwapping = useCatGame(state => state.isSwapping);
  const hitSound = useAudio(state => state.hitSound);
  const playHit = useAudio(state => state.playHit);
  const successSound = useAudio(state => state.successSound);
  const playSuccess = useAudio(state => state.playSuccess);
  
  const boardRef = useRef(null);
  
  // Play sound effects
  useEffect(() => {
    if (isSwapping) {
      playHit();
    }
  }, [isSwapping, playHit]);
  
  // Load sounds
  useEffect(() => {
    if (!hitSound) {
      const sound = new Audio('/sounds/hit.mp3');
      sound.volume = 0.3;
      useAudio.getState().setHitSound(sound);
    }
    
    if (!successSound) {
      const sound = new Audio('/sounds/success.mp3');
      sound.volume = 0.5;
      useAudio.getState().setSuccessSound(sound);
    }
  }, [hitSound, successSound]);
  
  if (!board) return null;
  
  const { tiles, width, height } = board;
  
  // Calculate tile size based on available space with a fixed minimum size
  const calculateTileSize = () => {
    if (!boardRef.current) return 40; // Default minimum size
    
    const containerWidth = boardRef.current.clientWidth;
    const containerHeight = boardRef.current.clientHeight;
    
    // Calculate size while reserving space for gaps
    const tileWidth = (containerWidth - (width + 1) * 4) / width;
    const tileHeight = (containerHeight - (height + 1) * 4) / height;
    
    // Use minimum of width/height but ensure a minimum size
    return Math.max(Math.min(tileWidth, tileHeight), 40);
  };
  
  // Get the tile size
  const tileSize = calculateTileSize();
  
  const handleTileClick = (row, col) => {
    if (isAnimating) return;
    
    // If clicking on the already selected tile, deselect it
    if (selectedTile && selectedTile.row === row && selectedTile.col === col) {
      selectTile(row, col); // Will toggle selection
      return;
    }
    
    // If we have a selected tile and clicking an adjacent tile, attempt to swap
    if (selectedTile) {
      const rowDiff = Math.abs(selectedTile.row - row);
      const colDiff = Math.abs(selectedTile.col - col);
      
      if ((rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1)) {
        playHit();
      }
    }
    
    selectTile(row, col);
  };
  
  return (
    <div 
      ref={boardRef}
      className="w-full h-full flex items-center justify-center p-1 sm:p-2 overflow-hidden touch-none"
    >
      <div 
        className="relative grid gap-1"
        style={{ 
          gridTemplateColumns: `repeat(${width}, ${tileSize}px)`,
          gridTemplateRows: `repeat(${height}, ${tileSize}px)`,
          maxWidth: '95vw',
          maxHeight: '70vh',
        }}
      >
        {/* Create the actual board cells with light borders for clarity */}
        {Array.from({ length: height }).map((_, row) => (
          Array.from({ length: width }).map((_, col) => (
            <div 
              key={`cell-${row}-${col}`}
              className="bg-blue-100 bg-opacity-30 rounded-lg border border-blue-300 border-opacity-30"
              style={{ width: tileSize, height: tileSize }}
            />
          ))
        ))}
        
        {/* Render the tiles on top */}
        {tiles.map(row => 
          row.map(tile => {
            if (!tile) return null;
            
            const isSelected = selectedTile && 
              selectedTile.row === tile.row && 
              selectedTile.col === tile.col;
            
            return (
              <Tile
                key={tile.id}
                tile={tile}
                size={tileSize}
                isSelected={isSelected}
                onClick={() => handleTileClick(tile.row, tile.col)}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

export default Board;
