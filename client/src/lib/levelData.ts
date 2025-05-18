import { GameLevel } from './stores/useCatGame';

// Define backgrounds for cycling through levels
const backgroundTypes = ['bg1', 'bg2', 'bg3'];

const levels: GameLevel[] = [
  // Level 1: Simple introduction
  {
    id: 1,
    name: "Kitty Training",
    description: "Match 3 cats to score points",
    targetScore: 500,
    moves: 20,
    objectives: [],
    gridSize: { rows: 8, cols: 8 },
    difficulty: 1,
    unlocked: true,
    availableCatTypes: ['blue', 'orange', 'purple', 'green', 'red'], // Start with 5 cat types
    background: 'bg1'
  },
  
  // Level 2: Introduce objectives
  {
    id: 2,
    name: "Blue Cat Collector",
    description: "Collect blue cats",
    targetScore: 600,
    moves: 18,
    objectives: [
      { type: 'blue', count: 10, label: 'Collect 10 blue cats' }
    ],
    gridSize: { rows: 8, cols: 8 },
    difficulty: 1,
    unlocked: false,
    availableCatTypes: ['blue', 'orange', 'purple', 'green', 'red'],
    background: 'bg1'
  },
  
  // Level 3: Multiple objectives
  {
    id: 3,
    name: "Cat Party",
    description: "Collect orange and purple cats",
    targetScore: 700,
    moves: 16,
    objectives: [
      { type: 'orange', count: 8, label: 'Collect 8 orange cats' },
      { type: 'purple', count: 8, label: 'Collect 8 purple cats' }
    ],
    gridSize: { rows: 8, cols: 8 },
    difficulty: 2,
    unlocked: false,
    availableCatTypes: ['blue', 'orange', 'purple', 'green', 'red'],
    background: 'bg2'
  },
  
  // Level 4: Introduce Bomb Power-up
  {
    id: 4,
    name: "Explosive Kittens",
    description: "Make bomb cats by matching 4 in a row",
    targetScore: 800,
    moves: 15,
    objectives: [
      { type: 'bomb', count: 2, label: 'Create 2 bomb cats' }
    ],
    gridSize: { rows: 8, cols: 8 },
    difficulty: 2,
    unlocked: false,
    availableCatTypes: ['blue', 'orange', 'purple', 'green', 'red', 'yellow'],
    background: 'bg2'
  },
  
  // Level 5: Introduce Rainbow Power-up
  {
    id: 5,
    name: "Rainbow Whiskers",
    description: "Make rainbow cats by matching 5 in a line",
    targetScore: 1000,
    moves: 14,
    objectives: [
      { type: 'rainbow', count: 1, label: 'Create 1 rainbow cat' }
    ],
    gridSize: { rows: 8, cols: 8 },
    difficulty: 3,
    unlocked: false,
    availableCatTypes: ['blue', 'orange', 'purple', 'green', 'red', 'yellow'],
    background: 'bg3'
  },
  
  // Continue with more levels with increasing difficulty...
  // Level 6-10: Medium difficulty
  {
    id: 6,
    name: "Rainbow Collection",
    description: "Use rainbow cats to clear lots of cats at once",
    targetScore: 1200,
    moves: 13,
    objectives: [
      { type: 'rainbow', count: 2, label: 'Create 2 rainbow cats' },
      { type: 'green', count: 15, label: 'Collect 15 green cats' }
    ],
    gridSize: { rows: 8, cols: 8 },
    difficulty: 3,
    unlocked: false,
    availableCatTypes: ['blue', 'orange', 'purple', 'green', 'red', 'yellow'],
    background: 'bg3'
  },
  
  // Adding a few more levels to show progression...
  // Level 7
  {
    id: 7,
    name: "Cat Symphony",
    description: "Collect cats of all colors",
    targetScore: 1500,
    moves: 15,
    objectives: [
      { type: 'blue', count: 8, label: 'Collect 8 blue cats' },
      { type: 'orange', count: 8, label: 'Collect 8 orange cats' },
      { type: 'purple', count: 8, label: 'Collect 8 purple cats' }
    ],
    gridSize: { rows: 8, cols: 8 },
    difficulty: 3,
    unlocked: false,
    availableCatTypes: ['blue', 'orange', 'purple', 'green', 'red', 'yellow', 'pink'],
    background: 'bg1'
  },
  
  // Level 8
  {
    id: 8,
    name: "Bomb Squad",
    description: "Use bomb cats strategically",
    targetScore: 1800,
    moves: 12,
    objectives: [
      { type: 'bomb', count: 4, label: 'Create 4 bomb cats' },
      { type: 'yellow', count: 20, label: 'Collect 20 yellow cats' }
    ],
    gridSize: { rows: 8, cols: 8 },
    difficulty: 4,
    unlocked: false,
    availableCatTypes: ['blue', 'orange', 'purple', 'green', 'red', 'yellow', 'pink'],
    background: 'bg2'
  },
  
  // Level 9
  {
    id: 9,
    name: "Power Cat Challenge",
    description: "Create and use power-ups",
    targetScore: 2000,
    moves: 16,
    objectives: [
      { type: 'bomb', count: 3, label: 'Create 3 bomb cats' },
      { type: 'rainbow', count: 2, label: 'Create 2 rainbow cats' }
    ],
    gridSize: { rows: 8, cols: 8 },
    difficulty: 4,
    unlocked: false,
    availableCatTypes: ['blue', 'orange', 'purple', 'green', 'red', 'yellow', 'pink'],
    background: 'bg3'
  },
  
  // Level 10
  {
    id: 10,
    name: "Cat Master",
    description: "Show your mastery of cat matching",
    targetScore: 2500,
    moves: 18,
    objectives: [
      { type: 'red', count: 25, label: 'Collect 25 red cats' },
      { type: 'bomb', count: 3, label: 'Create 3 bomb cats' },
      { type: 'rainbow', count: 1, label: 'Create 1 rainbow cat' }
    ],
    gridSize: { rows: 8, cols: 8 },
    difficulty: 5,
    unlocked: false,
    availableCatTypes: ['blue', 'orange', 'purple', 'green', 'red', 'yellow', 'pink', 'teal'],
    background: 'bg1'
  },
];

// Generate remaining levels (11-50) with increasing difficulty
for (let i = 11; i <= 50; i++) {
  const baseLevel = levels[Math.min(i - 1, 9)]; // Use level 10 as base for all levels above 10
  
  const newLevel: GameLevel = {
    ...baseLevel,
    id: i,
    name: `Level ${i}`,
    description: `Challenge level ${i}`,
    targetScore: baseLevel.targetScore + (i - 10) * 250, // Increase score target
    moves: Math.max(10, baseLevel.moves - Math.floor((i - 10) / 5)), // Gradually decrease moves
    objectives: baseLevel.objectives.map(obj => ({
      ...obj,
      count: Math.ceil(obj.count * (1 + (i - 10) * 0.1)), // Increase objective counts
      label: obj.label.replace(/\d+/, match => String(Math.ceil(parseInt(match) * (1 + (i - 10) * 0.1))))
    })),
    difficulty: Math.min(10, Math.ceil(i / 5)),
    unlocked: false,
    background: backgroundTypes[i % 3] // Cycle through backgrounds
  };
  
  levels.push(newLevel);
}

export default levels;