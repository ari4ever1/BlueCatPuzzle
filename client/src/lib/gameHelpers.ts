import { Tile, BoardState, GameLevel } from './stores/useCatGame';

// Board and game helper functions

/**
 * Checks if two positions are adjacent
 */
export const isAdjacent = (pos1: { row: number; col: number }, pos2: { row: number; col: number }): boolean => {
  const rowDiff = Math.abs(pos1.row - pos2.row);
  const colDiff = Math.abs(pos1.col - pos2.col);
  
  // Adjacent if exactly one position away in one direction only
  return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
};

/**
 * Creates a new random board
 */
export const createNewBoard = (rows: number, cols: number, catTypes: string[]): BoardState => {
  const tiles: Tile[][] = [];
  
  // Create initial board with random cats
  for (let row = 0; row < rows; row++) {
    tiles[row] = [];
    for (let col = 0; col < cols; col++) {
      // Ensure we don't create matches initially
      let validTypes = [...catTypes];
      
      // Check left two tiles for potential horizontal match
      if (col >= 2) {
        if (tiles[row][col-1].type === tiles[row][col-2].type) {
          validTypes = validTypes.filter(type => type !== tiles[row][col-1].type);
        }
      }
      
      // Check top two tiles for potential vertical match
      if (row >= 2) {
        if (tiles[row-1][col].type === tiles[row-2][col].type) {
          validTypes = validTypes.filter(type => type !== tiles[row-1][col].type);
        }
      }
      
      // If no valid types (rare case), just use any type that doesn't match at least one direction
      if (validTypes.length === 0) {
        validTypes = [...catTypes];
        
        if (col >= 1) {
          validTypes = validTypes.filter(type => type !== tiles[row][col-1].type);
        }
        
        if (row >= 1 && validTypes.length > 1) {
          validTypes = validTypes.filter(type => type !== tiles[row-1][col].type);
        }
        
        // If still no valid types, just use any cat type
        if (validTypes.length === 0) {
          validTypes = [...catTypes];
        }
      }
      
      // Choose a random valid type
      const randomType = validTypes[Math.floor(Math.random() * validTypes.length)];
      
      tiles[row][col] = {
        id: `${row}-${col}`,
        type: randomType,
        row,
        col,
        isMatched: false,
        isSpecial: false,
        specialType: null,
        isNew: false,
        isMoving: false
      };
    }
  }
  
  return { tiles, width: cols, height: rows };
};

/**
 * Find all matches in the current board
 */
export const findMatches = (board: BoardState): Tile[] => {
  const matches: Tile[] = [];
  const { tiles, width, height } = board;
  
  // Check for horizontal matches
  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width - 2; col++) {
      const currentTile = tiles[row][col];
      
      // Skip empty cells and special tiles (we check them separately)
      if (!currentTile || currentTile.isSpecial) continue;
      
      const type = currentTile.type;
      let matchLength = 1;
      
      // Count consecutive tiles of the same type
      while (col + matchLength < width && 
             tiles[row][col + matchLength] && 
             tiles[row][col + matchLength].type === type &&
             !tiles[row][col + matchLength].isSpecial) {
        matchLength++;
      }
      
      // If we have a match of at least 3
      if (matchLength >= 3) {
        for (let i = 0; i < matchLength; i++) {
          matches.push(tiles[row][col + i]);
        }
        
        // Skip the tiles we've already matched
        col += matchLength - 1;
      }
    }
  }
  
  // Check for vertical matches
  for (let col = 0; col < width; col++) {
    for (let row = 0; row < height - 2; row++) {
      const currentTile = tiles[row][col];
      
      // Skip empty cells and special tiles
      if (!currentTile || currentTile.isSpecial) continue;
      
      const type = currentTile.type;
      let matchLength = 1;
      
      // Count consecutive tiles of the same type
      while (row + matchLength < height && 
             tiles[row + matchLength][col] && 
             tiles[row + matchLength][col].type === type &&
             !tiles[row + matchLength][col].isSpecial) {
        matchLength++;
      }
      
      // If we have a match of at least 3
      if (matchLength >= 3) {
        for (let i = 0; i < matchLength; i++) {
          matches.push(tiles[row + i][col]);
        }
        
        // Skip the tiles we've already matched
        row += matchLength - 1;
      }
    }
  }
  
  // Remove duplicates (a tile could be part of both horizontal and vertical match)
  return Array.from(new Set(matches));
};

/**
 * Check for special matches (bomb - 4 in a row, rainbow - 5 in L or T shape)
 */
export const findSpecialMatches = (board: BoardState): { matches: Tile[], specialTile?: Tile, specialType?: string } => {
  const { tiles, width, height } = board;
  const matches: Tile[] = [];
  let specialTile: Tile | undefined;
  let specialType: string | undefined;
  
  // Check for horizontal matches of 4 or more (bomb cat)
  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width - 3; col++) { // Need at least 4 in a row
      const currentTile = tiles[row][col];
      
      if (!currentTile) continue;
      
      const type = currentTile.type;
      let matchLength = 1;
      
      // Count consecutive tiles of the same type
      while (col + matchLength < width && 
             tiles[row][col + matchLength] && 
             tiles[row][col + matchLength].type === type) {
        matchLength++;
      }
      
      // If we have a match of 4 exactly - it's a bomb cat
      if (matchLength === 4) {
        const matchTiles = [];
        for (let i = 0; i < matchLength; i++) {
          matchTiles.push(tiles[row][col + i]);
        }
        
        matches.push(...matchTiles);
        
        // Create special tile at the first position
        specialTile = { ...currentTile, isSpecial: true, specialType: 'bomb' };
        specialType = 'bomb';
        
        // Skip ahead past this match
        col += matchLength - 1;
      }
      // If we have a match of 5 or more - it's a rainbow cat
      else if (matchLength >= 5) {
        const matchTiles = [];
        for (let i = 0; i < matchLength; i++) {
          matchTiles.push(tiles[row][col + i]);
        }
        
        matches.push(...matchTiles);
        
        // Create special tile at the middle position
        const middleIdx = Math.floor(matchLength / 2);
        specialTile = { ...tiles[row][col + middleIdx], isSpecial: true, specialType: 'rainbow' };
        specialType = 'rainbow';
        
        // Skip ahead past this match
        col += matchLength - 1;
      }
    }
  }
  
  // If we found a special match already, return it
  if (specialTile) {
    return { matches, specialTile, specialType };
  }
  
  // Check for vertical matches of 4 or more
  for (let col = 0; col < width; col++) {
    for (let row = 0; row < height - 3; row++) { // Need at least 4 in a column
      const currentTile = tiles[row][col];
      
      if (!currentTile) continue;
      
      const type = currentTile.type;
      let matchLength = 1;
      
      // Count consecutive tiles of the same type
      while (row + matchLength < height && 
             tiles[row + matchLength][col] && 
             tiles[row + matchLength][col].type === type) {
        matchLength++;
      }
      
      // If we have a match of 4 exactly - it's a bomb cat
      if (matchLength === 4) {
        const matchTiles = [];
        for (let i = 0; i < matchLength; i++) {
          matchTiles.push(tiles[row + i][col]);
        }
        
        matches.push(...matchTiles);
        
        // Create special tile at the first position
        specialTile = { ...currentTile, isSpecial: true, specialType: 'bomb' };
        specialType = 'bomb';
        
        // Skip ahead past this match
        row += matchLength - 1;
      }
      // If we have a match of 5 or more - it's a rainbow cat
      else if (matchLength >= 5) {
        const matchTiles = [];
        for (let i = 0; i < matchLength; i++) {
          matchTiles.push(tiles[row + i][col]);
        }
        
        matches.push(...matchTiles);
        
        // Create special tile at the middle position
        const middleIdx = Math.floor(matchLength / 2);
        specialTile = { ...tiles[row + middleIdx][col], isSpecial: true, specialType: 'rainbow' };
        specialType = 'rainbow';
        
        // Skip ahead past this match
        row += matchLength - 1;
      }
    }
  }
  
  // Check for L and T shapes (rainbow cat)
  // Check for L shape (horizontal 3 + vertical 3)
  for (let row = 0; row < height - 2; row++) {
    for (let col = 0; col < width - 2; col++) {
      const currentTile = tiles[row][col];
      if (!currentTile) continue;
      
      const type = currentTile.type;
      
      // Check horizontal 3 then vertical 3 (L shape)
      if (col + 2 < width && row + 2 < height &&
          tiles[row][col + 1]?.type === type &&
          tiles[row][col + 2]?.type === type &&
          tiles[row + 1][col]?.type === type &&
          tiles[row + 2][col]?.type === type) {
        
        const matchTiles = [
          tiles[row][col],
          tiles[row][col + 1],
          tiles[row][col + 2],
          tiles[row + 1][col],
          tiles[row + 2][col]
        ];
        
        matches.push(...matchTiles);
        specialTile = { ...currentTile, isSpecial: true, specialType: 'rainbow' };
        specialType = 'rainbow';
        return { matches, specialTile, specialType };
      }
      
      // Check vertical 3 then horizontal 3 (⅂ shape - reversed L)
      if (col + 2 < width && row + 2 < height &&
          tiles[row][col + 1]?.type === type &&
          tiles[row][col + 2]?.type === type &&
          tiles[row + 1][col + 2]?.type === type &&
          tiles[row + 2][col + 2]?.type === type) {
        
        const matchTiles = [
          tiles[row][col],
          tiles[row][col + 1],
          tiles[row][col + 2],
          tiles[row + 1][col + 2],
          tiles[row + 2][col + 2]
        ];
        
        matches.push(...matchTiles);
        specialTile = { ...currentTile, isSpecial: true, specialType: 'rainbow' };
        specialType = 'rainbow';
        return { matches, specialTile, specialType };
      }
      
      // Check for T shape (horizontal 3 + middle extends vertically 2)
      if (col + 2 < width && row + 2 < height &&
          tiles[row][col]?.type === type &&
          tiles[row][col + 1]?.type === type &&
          tiles[row][col + 2]?.type === type &&
          tiles[row + 1][col + 1]?.type === type &&
          tiles[row + 2][col + 1]?.type === type) {
        
        const matchTiles = [
          tiles[row][col],
          tiles[row][col + 1],
          tiles[row][col + 2],
          tiles[row + 1][col + 1],
          tiles[row + 2][col + 1]
        ];
        
        matches.push(...matchTiles);
        specialTile = { ...tiles[row][col + 1], isSpecial: true, specialType: 'rainbow' };
        specialType = 'rainbow';
        return { matches, specialTile, specialType };
      }
    }
  }
  
  return { matches, specialTile, specialType };
};

/**
 * Get tiles that would be affected by a bomb power-up
 */
export const getBombAffectedTiles = (board: BoardState, centerRow: number, centerCol: number): Tile[] => {
  const { tiles, width, height } = board;
  const affected: Tile[] = [];
  
  // Get all tiles in a 3x3 area around the center
  for (let row = Math.max(0, centerRow - 1); row <= Math.min(height - 1, centerRow + 1); row++) {
    for (let col = Math.max(0, centerCol - 1); col <= Math.min(width - 1, centerCol + 1); col++) {
      if (tiles[row][col]) {
        affected.push(tiles[row][col]);
      }
    }
  }
  
  return affected;
};

/**
 * Get tiles that would be affected by a rainbow power-up
 */
export const getRainbowAffectedTiles = (board: BoardState, targetType: string): Tile[] => {
  const { tiles, width, height } = board;
  const affected: Tile[] = [];
  
  // Get all tiles of the target type
  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      if (tiles[row][col] && tiles[row][col].type === targetType) {
        affected.push(tiles[row][col]);
      }
    }
  }
  
  return affected;
};

/**
 * Check if a move is valid (creates a match)
 */
export const isValidMove = (board: BoardState, row1: number, col1: number, row2: number, col2: number): boolean => {
  // Create a copy of the board to simulate the move
  const newBoard: BoardState = JSON.parse(JSON.stringify(board));
  
  // Swap the tiles
  const temp = newBoard.tiles[row1][col1];
  newBoard.tiles[row1][col1] = newBoard.tiles[row2][col2];
  newBoard.tiles[row2][col2] = temp;
  
  // Update positions
  newBoard.tiles[row1][col1].row = row1;
  newBoard.tiles[row1][col1].col = col1;
  newBoard.tiles[row2][col2].row = row2;
  newBoard.tiles[row2][col2].col = col2;
  
  // Check if this creates a match
  const matches = findMatches(newBoard);
  
  // If we have any matches, or either tile is special, the move is valid
  return matches.length > 0 || 
         board.tiles[row1][col1].isSpecial || 
         board.tiles[row2][col2].isSpecial;
};

/**
 * Calculate the score for a match
 */
export const calculateMatchScore = (matches: Tile[]): number => {
  // More matches = higher score
  // Base score is 10 points per tile
  let score = matches.length * 10;
  
  // Bonus for matches more than 3
  if (matches.length === 4) {
    score = 100; // 4 matches = 100 points
  } else if (matches.length >= 5) {
    score = 200; // 5+ matches = 200 points
  } else {
    score = 50; // 3 matches = 50 points
  }
  
  return score;
};

/**
 * Check if the current level is complete
 */
export const isLevelComplete = (level: GameLevel, score: number, objectivesCompleted: Record<string, number>): boolean => {
  // Check if we've met the target score
  if (level.targetScore && score < level.targetScore) {
    return false;
  }
  
  // Check if we've completed all objectives
  if (level.objectives) {
    for (const objective of level.objectives) {
      const current = objectivesCompleted[objective.type] || 0;
      if (current < objective.count) {
        return false;
      }
    }
  }
  
  return true;
};

/**
 * Check if there are any possible moves left on the board
 */
export const hasValidMoves = (board: BoardState): boolean => {
  const { tiles, width, height } = board;
  
  // Check all possible adjacent swaps
  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      // Check right swap
      if (col < width - 1) {
        if (isValidMove(board, row, col, row, col + 1)) {
          return true;
        }
      }
      
      // Check down swap
      if (row < height - 1) {
        if (isValidMove(board, row, col, row + 1, col)) {
          return true;
        }
      }
    }
  }
  
  return false;
};

/**
 * Shuffles the board when no valid moves are available
 */
export const shuffleBoard = (board: BoardState): BoardState => {
  const { width, height } = board;
  const types: string[] = [];
  
  // Collect all tile types from the current board
  board.tiles.forEach(row => {
    row.forEach(tile => {
      if (tile && !tile.isSpecial) {
        types.push(tile.type);
      }
    });
  });
  
  // Create a new shuffled board
  return createNewBoard(height, width, Array.from(new Set(types)));
};
