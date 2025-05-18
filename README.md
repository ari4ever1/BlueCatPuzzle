# Meow Match - Cat Puzzle Game

A portrait-oriented, mobile-friendly match-three puzzle game with a blue cat theme, custom image uploads, and 50 progressive levels.

## Game Features

- Match 3 or more identical cats to earn points
- Create special power-ups:
  - Bomb Cat: Match 4 in a row
  - Rainbow Cat: Match 5 in L or T shapes
- 50 levels with increasing difficulty
- Custom cat image uploads in Settings
- Mobile-friendly design for portrait orientation

## How to Export to Your Website

### Option 1: Using the built files

1. Run the build command to generate optimized files:
```
npm run build
```

2. After building, the `dist` folder will contain all the files you need.

3. Upload these files to your web hosting service.

### Option 2: Embedding via iframe

If your game is hosted on Replit, you can embed it in your website using an iframe:

```html
<iframe 
  src="https://your-repl-url-here" 
  width="100%" 
  height="800px" 
  style="border:none; max-width: 500px; margin: 0 auto; display: block;"
  allow="fullscreen"
></iframe>
```

Adjust the width, height, and styling to fit your website's design.

## For Development

To run the game locally:

```
npm install
npm run dev
```

This will start the development server, and you can access the game at `localhost:5000`.

Enjoy your cat-matching puzzle game!