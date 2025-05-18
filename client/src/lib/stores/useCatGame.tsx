import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { defaultCatIcons, defaultPowerUps, CatIcon } from '../../assets/cats';
import { createNewBoard, findMatches, findSpecialMatches, getBombAffectedTiles, getRainbowAffectedTiles, isLevelComplete, hasValidMoves, shuffleBoard } from '../gameHelpers';
import levels from '../levelData';
import { setLocalStorage } from '../utils';

// Types for the game
export interface Tile {
  id: string;
  type: string;
  row: number;
  col: number;
  isMatched: boolean;
  isSpecial: boolean;
  specialType: string | null;
  isNew: boolean;
  isMoving: boolean;
}

export interface BoardState {
  tiles: Tile[][];
  width: number;
  height: number;
}

export interface GameLevel {
  id: number;
  name: string;
  description: string;
  targetScore: number;
  moves: number;
  objectives: {
    type: string;
    count: number;
    label: string;
  }[];
  gridSize: {
    rows: number;
    cols: number;
  };
  difficulty: number;
  unlocked: boolean;
  availableCatTypes?: string[];
  background: string;
}

export interface GameState {
  // Game state
  currentLevel: number;
  levels: GameLevel[];
  board: BoardState | null;
  score: number;
  movesLeft: number;
  isGameOver: boolean;
  isLevelComplete: boolean;
  
  // UI state
  selectedTile: { row: number; col: number } | null;
  isSwapping: boolean;
  isProcessingMatches: boolean;
  isAnimating: boolean;
  showSettings: boolean;
  
  // Custom cat images
  catIcons: CatIcon[];
  customCatImages: Record<string, string>;
  
  // Gameplay tracking
  objectivesCompleted: Record<string, number>;
  
  // Actions
  initializeGame: (savedState?: any) => void;
  startLevel: (levelId: number) => void;
  selectTile: (row: number, col: number) => void;
  swapTiles: (row1: number, col1: number, row2: number, col2: number) => void;
  processMatches: () => void;
  fallTiles: () => void;
  refillBoard: () => void;
  useSpecialTile: (row: number, col: number, targetRow?: number, targetCol?: number) => void;
  shuffleBoardIfNeeded: () => void;
  toggleSettings: () => void;
  setCustomCatImage: (catType: string, imageUrl: string) => void;
  resetCustomImages: () => void;
}

export const useCatGame = create<GameState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    currentLevel: 1,
    levels: levels,
    board: null,
    score: 0,
    movesLeft: 0,
    isGameOver: false,
    isLevelComplete: false,
    
    selectedTile: null,
    isSwapping: false,
    isProcessingMatches: false,
    isAnimating: false,
    showSettings: false,
    
    catIcons: [...defaultCatIcons],
    customCatImages: {},
    
    objectivesCompleted: {},
    
    // Initialize game state (can restore from savedState)
    initializeGame: (savedState) => {
      if (savedState) {
        // Restore saved state
        set({
          currentLevel: savedState.currentLevel || 1,
          levels: savedState.levels || levels,
          score: savedState.score || 0,
          customCatImages: savedState.customCatImages || {},
          // Don't restore board and other game state - just level progress
        });
      } else {
        // Set up new game
        set({
          currentLevel: 1,
          levels,
          score: 0,
          customCatImages: {},
        });
      }
      
      // Always start with the first level unlocked
      const updatedLevels = get().levels.map((level, index) => ({
        ...level,
        unlocked: index === 0 ? true : level.unlocked
      }));
      
      set({ levels: updatedLevels });
    },
    
    // Start a specific level
    startLevel: (levelId) => {
      const level = get().levels.find(l => l.id === levelId);
      
      if (!level || !level.unlocked) {
        console.error('Level not found or not unlocked');
        return;
      }
      
      // Get available cat types for this level
      const catTypes = level.availableCatTypes || 
        defaultCatIcons.slice(0, Math.min(5 + Math.floor(level.difficulty / 2), defaultCatIcons.length))
          .map(cat => cat.id);
      
      // Create a new board
      const board = createNewBoard(
        level.gridSize.rows,
        level.gridSize.cols,
        catTypes
      );
      
      set({
        currentLevel: levelId,
        board,
        score: 0,
        movesLeft: level.moves,
        isGameOver: false,
        isLevelComplete: false,
        selectedTile: null,
        isSwapping: false,
        isProcessingMatches: false,
        objectivesCompleted: {},
      });
      
      // Save game state to localStorage
      const state = get();
      setLocalStorage('catPuzzleGameState', {
        currentLevel: state.currentLevel,
        levels: state.levels,
        score: state.score,
        customCatImages: state.customCatImages,
      });
    },
    
    // Select a tile on the board
    selectTile: (row, col) => {
      const state = get();
      
      // If currently animating or processing, ignore selection
      if (state.isAnimating || state.isProcessingMatches || state.isGameOver || state.isLevelComplete) {
        return;
      }
      
      const { board, selectedTile } = state;
      
      if (!board) return;
      
      // If no tile is selected, just select this one
      if (!selectedTile) {
        set({ selectedTile: { row, col } });
        return;
      }
      
      // If same tile is selected, deselect it
      if (selectedTile.row === row && selectedTile.col === col) {
        set({ selectedTile: null });
        return;
      }
      
      // Check if tiles are adjacent
      const rowDiff = Math.abs(selectedTile.row - row);
      const colDiff = Math.abs(selectedTile.col - col);
      
      if ((rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1)) {
        // Tiles are adjacent, try to swap them
        state.swapTiles(selectedTile.row, selectedTile.col, row, col);
        set({ selectedTile: null });
      } else {
        // Tiles are not adjacent, select the new tile instead
        set({ selectedTile: { row, col } });
      }
    },
    
    // Swap two tiles
    swapTiles: (row1, col1, row2, col2) => {
      const { board, movesLeft } = get();
      
      if (!board || movesLeft <= 0) return;
      
      // Make a deep copy of the board
      const newBoard: BoardState = JSON.parse(JSON.stringify(board));
      
      // Get the tiles to swap
      const tile1 = newBoard.tiles[row1][col1];
      const tile2 = newBoard.tiles[row2][col2];
      
      // If either tile is null, abort
      if (!tile1 || !tile2) return;
      
      // Special case: if one is a special power-up
      if (tile1.isSpecial) {
        get().useSpecialTile(row1, col1, row2, col2);
        return;
      }
      
      if (tile2.isSpecial) {
        get().useSpecialTile(row2, col2, row1, col1);
        return;
      }
      
      // Swap the tiles
      newBoard.tiles[row1][col1] = tile2;
      newBoard.tiles[row2][col2] = tile1;
      
      // Update positions
      newBoard.tiles[row1][col1].row = row1;
      newBoard.tiles[row1][col1].col = col1;
      newBoard.tiles[row2][col2].row = row2;
      newBoard.tiles[row2][col2].col = col2;
      
      // Mark as swapping for animation
      newBoard.tiles[row1][col1].isMoving = true;
      newBoard.tiles[row2][col2].isMoving = true;
      
      set({ board: newBoard, isSwapping: true, isAnimating: true });
      
      // Check if this creates a match
      setTimeout(() => {
        const { board } = get();
        if (!board) return;
        
        // Find matches after the swap
        const matches = findMatches(board);
        
        if (matches.length > 0) {
          // Valid move, decrement moves and process matches
          set({ 
            movesLeft: get().movesLeft - 1,
            isSwapping: false,
            isAnimating: false
          });
          get().processMatches();
        } else {
          // Invalid move, swap back
          const newBoard: BoardState = JSON.parse(JSON.stringify(board));
          
          // Swap back
          const tile1 = newBoard.tiles[row1][col1];
          const tile2 = newBoard.tiles[row2][col2];
          
          newBoard.tiles[row1][col1] = tile2;
          newBoard.tiles[row2][col2] = tile1;
          
          // Update positions
          newBoard.tiles[row1][col1].row = row1;
          newBoard.tiles[row1][col1].col = col1;
          newBoard.tiles[row2][col2].row = row2;
          newBoard.tiles[row2][col2].col = col2;
          
          set({ 
            board: newBoard, 
            isSwapping: false,
            isAnimating: false
          });
        }
      }, 300); // Wait for swap animation to complete
    },
    
    // Process matches on the board
    processMatches: () => {
      const { board } = get();
      
      if (!board) return;
      
      set({ isProcessingMatches: true });
      
      // First, check for special matches (like 4 or 5 in a row)
      const specialResult = findSpecialMatches(board);
      
      // If we found a special match, process it
      if (specialResult.specialTile) {
        const { matches, specialTile, specialType } = specialResult;
        
        // Mark all matched tiles
        const newBoard: BoardState = JSON.parse(JSON.stringify(board));
        
        matches.forEach(match => {
          const { row, col } = match;
          if (newBoard.tiles[row][col]) {
            newBoard.tiles[row][col].isMatched = true;
          }
        });
        
        // Create the special tile at the specified location
        if (specialTile) {
          newBoard.tiles[specialTile.row][specialTile.col] = {
            ...specialTile,
            isMatched: false
          };
          
          // Update objectives completed
          const objectivesCompleted = { ...get().objectivesCompleted };
          if (specialType) {
            objectivesCompleted[specialType] = (objectivesCompleted[specialType] || 0) + 1;
          }
          
          set({ objectivesCompleted });
        }
        
        // Update score
        const matchScore = matches.length * 20;
        const newScore = get().score + matchScore;
        
        set({ 
          board: newBoard, 
          score: newScore,
          isProcessingMatches: false
        });
        
        // Delay to show the matches, then let tiles fall
        setTimeout(() => {
          get().fallTiles();
        }, 500);
        
        return;
      }
      
      // Otherwise, find normal matches
      const matches = findMatches(board);
      
      if (matches.length === 0) {
        set({ isProcessingMatches: false });
        get().shuffleBoardIfNeeded();
        return;
      }
      
      // Mark all matched tiles
      const newBoard: BoardState = JSON.parse(JSON.stringify(board));
      
      matches.forEach(match => {
        const { row, col, type } = match;
        if (newBoard.tiles[row][col]) {
          newBoard.tiles[row][col].isMatched = true;
          
          // Update objectives completed
          const objectivesCompleted = { ...get().objectivesCompleted };
          objectivesCompleted[type] = (objectivesCompleted[type] || 0) + 1;
          set({ objectivesCompleted });
        }
      });
      
      // Update score
      const matchScore = matches.length < 4 ? 50 : matches.length * 25;
      const newScore = get().score + matchScore;
      
      set({ 
        board: newBoard, 
        score: newScore,
        isProcessingMatches: false
      });
      
      // Delay to show the matches, then let tiles fall
      setTimeout(() => {
        get().fallTiles();
      }, 500);
    },
    
    // Make tiles fall after matches are removed
    fallTiles: () => {
      const { board } = get();
      
      if (!board) return;
      
      set({ isAnimating: true });
      
      const newBoard: BoardState = JSON.parse(JSON.stringify(board));
      const { width, height } = board;
      
      // For each column, from bottom to top
      for (let col = 0; col < width; col++) {
        let emptySpaces = 0;
        
        // From bottom to top
        for (let row = height - 1; row >= 0; row--) {
          if (newBoard.tiles[row][col]?.isMatched) {
            // This is a matched tile to be removed
            emptySpaces++;
            newBoard.tiles[row][col] = null as any;
          } else if (newBoard.tiles[row][col] && emptySpaces > 0) {
            // Move this tile down
            const fallingTile = newBoard.tiles[row][col];
            newBoard.tiles[row + emptySpaces][col] = {
              ...fallingTile,
              row: row + emptySpaces,
              isMoving: true
            };
            newBoard.tiles[row][col] = null as any;
          }
        }
      }
      
      set({ board: newBoard });
      
      // After tiles have fallen, fill empty spaces
      setTimeout(() => {
        get().refillBoard();
      }, 300); // Wait for fall animation
    },
    
    // Refill empty spaces with new tiles
    refillBoard: () => {
      const { board } = get();
      
      if (!board) return;
      
      const newBoard: BoardState = JSON.parse(JSON.stringify(board));
      const { width, height } = board;
      
      // Find the current level to get available cat types
      const level = get().levels.find(l => l.id === get().currentLevel);
      const catTypes = level?.availableCatTypes || 
        defaultCatIcons.slice(0, Math.min(5 + Math.floor((level?.difficulty || 1) / 2), defaultCatIcons.length))
          .map(cat => cat.id);
      
      // Refill empty spaces from top
      for (let col = 0; col < width; col++) {
        let emptyRow = 0;
        while (emptyRow < height && newBoard.tiles[emptyRow][col]) {
          emptyRow++;
        }
        
        // Fill empty spaces from top down
        let fillRow = emptyRow;
        while (fillRow < height) {
          if (!newBoard.tiles[fillRow][col]) {
            // Create a new random tile
            const randomType = catTypes[Math.floor(Math.random() * catTypes.length)];
            newBoard.tiles[fillRow][col] = {
              id: `new-${fillRow}-${col}-${Date.now()}`,
              type: randomType,
              row: fillRow,
              col,
              isMatched: false,
              isSpecial: false,
              specialType: null,
              isNew: true,
              isMoving: true
            };
          }
          fillRow++;
        }
      }
      
      set({ board: newBoard });
      
      // Wait for new tiles to drop in
      setTimeout(() => {
        // Reset new and moving flags
        const resetBoard: BoardState = JSON.parse(JSON.stringify(get().board));
        if (resetBoard) {
          for (let row = 0; row < height; row++) {
            for (let col = 0; col < width; col++) {
              if (resetBoard.tiles[row][col]) {
                resetBoard.tiles[row][col].isNew = false;
                resetBoard.tiles[row][col].isMoving = false;
              }
            }
          }
          
          set({ 
            board: resetBoard,
            isAnimating: false
          });
          
          // Check if there are still matches
          const matches = findMatches(resetBoard);
          if (matches.length > 0) {
            // Continue cascading matches
            setTimeout(() => {
              get().processMatches();
            }, 300);
          } else {
            // Check level completion or game over
            const { currentLevel, levels, score, movesLeft, objectivesCompleted } = get();
            const level = levels.find(l => l.id === currentLevel);
            
            if (level && isLevelComplete(level, score, objectivesCompleted)) {
              // Level completed!
              const updatedLevels = levels.map(l => {
                if (l.id === currentLevel + 1) {
                  return { ...l, unlocked: true };
                }
                return l;
              });
              
              set({ 
                isLevelComplete: true,
                levels: updatedLevels
              });
              
              // Save game state
              const state = get();
              setLocalStorage('catPuzzleGameState', {
                currentLevel: state.currentLevel,
                levels: updatedLevels,
                score: state.score,
                customCatImages: state.customCatImages,
              });
            } else if (movesLeft <= 0) {
              // No more moves, game over
              set({ isGameOver: true });
            } else {
              // Continue game, check if board has valid moves
              get().shuffleBoardIfNeeded();
            }
          }
        }
      }, 500);
    },
    
    // Handle special tiles
    useSpecialTile: (row, col, targetRow, targetCol) => {
      const { board } = get();
      
      if (!board) return;
      
      set({ isProcessingMatches: true });
      
      const newBoard: BoardState = JSON.parse(JSON.stringify(board));
      const specialTile = newBoard.tiles[row][col];
      let affectedTiles: Tile[] = [];
      
      if (!specialTile?.isSpecial) return;
      
      // Handle different special tile types
      switch (specialTile.specialType) {
        case 'bomb':
          // Bomb affects 3x3 area
          affectedTiles = getBombAffectedTiles(newBoard, row, col);
          break;
          
        case 'rainbow':
          // Rainbow affects all tiles of the target type
          if (targetRow !== undefined && targetCol !== undefined) {
            const targetType = newBoard.tiles[targetRow][targetCol]?.type;
            if (targetType) {
              affectedTiles = getRainbowAffectedTiles(newBoard, targetType);
            }
          }
          break;
      }
      
      // Mark all affected tiles as matched
      affectedTiles.forEach(tile => {
        const { row, col, type } = tile;
        newBoard.tiles[row][col].isMatched = true;
        
        // Update objectives completed
        const objectivesCompleted = { ...get().objectivesCompleted };
        objectivesCompleted[type] = (objectivesCompleted[type] || 0) + 1;
        set({ objectivesCompleted });
      });
      
      // Remove the special tile too
      newBoard.tiles[row][col].isMatched = true;
      
      // Update score (special power-ups give bonus points)
      const scoreBonus = affectedTiles.length * 30;
      const newScore = get().score + scoreBonus;
      
      // Use a move for the special tile
      const newMovesLeft = get().movesLeft - 1;
      
      set({ 
        board: newBoard, 
        score: newScore,
        movesLeft: newMovesLeft,
        isProcessingMatches: false
      });
      
      // Delay to show the matches, then let tiles fall
      setTimeout(() => {
        get().fallTiles();
      }, 500);
    },
    
    // Shuffle board if no valid moves are available
    shuffleBoardIfNeeded: () => {
      const { board } = get();
      
      if (!board) return;
      
      if (!hasValidMoves(board)) {
        // No valid moves, shuffle the board
        const shuffledBoard = shuffleBoard(board);
        set({ 
          board: shuffledBoard,
          isAnimating: true
        });
        
        // Wait for shuffle animation
        setTimeout(() => {
          set({ isAnimating: false });
        }, 500);
      }
    },
    
    // Toggle settings modal
    toggleSettings: () => {
      set({ showSettings: !get().showSettings });
    },
    
    // Set custom cat image
    setCustomCatImage: (catType, imageUrl) => {
      const customCatImages = { ...get().customCatImages, [catType]: imageUrl };
      set({ customCatImages });
      
      // Save to localStorage
      const state = get();
      setLocalStorage('catPuzzleGameState', {
        currentLevel: state.currentLevel,
        levels: state.levels,
        score: state.score,
        customCatImages,
      });
    },
    
    // Reset custom images
    resetCustomImages: () => {
      set({ customCatImages: {} });
      
      // Save to localStorage
      const state = get();
      setLocalStorage('catPuzzleGameState', {
        currentLevel: state.currentLevel,
        levels: state.levels,
        score: state.score,
        customCatImages: {},
      });
    }
  }))
);
