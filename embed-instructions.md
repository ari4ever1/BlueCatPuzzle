# Adding Meow Match to Your Website

## Option 1: Embed using iframe

You can embed your Replit-hosted game directly on your website:

```html
<iframe 
  src="https://your-repl-name.your-username.repl.co" 
  width="100%" 
  height="800px" 
  style="border:none; max-width: 500px; margin: 0 auto; display: block;"
  allow="fullscreen"
></iframe>
```

Adjust the width, height, and styling as needed for your website's design.

## Option 2: Build and Self-Host

For complete control, build and host the game on your own server:

1. Build the project:
```
npm run build
```

2. Copy the contents of the `dist` folder to your web server.

3. If using a standard web host (like most shared hosting):
   - Upload all files to your hosting directory
   - Make sure your hosting supports Node.js if you want the server component
   - Or use it as a static site if you don't need the server features

4. If using your own server with Node.js:
   - Upload all files
   - Install dependencies with `npm install`
   - Start the server with `npm start`

## Game Controls and Instructions

- Swap adjacent cat tiles to create matches of 3 or more identical cats
- Match 4 in a row to create a Bomb Cat power-up
- Match 5 in an L or T shape to create a Rainbow Cat power-up
- Complete level objectives before running out of moves
- Upload custom cat images in the Settings menu

Enjoy your game!