# 🎮 Cybermines

A cyberpunk-themed minesweeper game with an epic story mode and futuristic UI.

## 🚀 Play Online

**[🎯 Play Cybermines](https://jimminiglitch.github.io/cybermines/)**

## ✨ Features

- **� Story Mode**: 5 challenging levels with increasing difficulty
- **⚡ Classic Mode**: Traditional minesweeper with customizable grid sizes
- **� Cyberpunk Theme**: Neon effects, particle animations, and retro-futuristic UI
- **🔊 Audio System**: Immersive sound effects for every action
- **💾 Progress Saving**: Your story mode progress is automatically saved
- **⭐ Star Rating System**: Earn up to 3 stars per level based on performance
- **🎯 Hint System**: Get help when you're stuck
- 💾 Local storage for progress
- ⭐ Star rating system for story mode

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

## Building

### For Development
```bash
npm run build
```

### For Library Distribution
```bash
npm run build:lib
```

This creates a library bundle that can be imported into other projects.

## Usage

### As a Standalone App
The game can be run directly in development mode or built as a standalone web application.

### As a Library Component
After building with `npm run build:lib`, you can import the component:

```tsx
import { Cybermines } from 'cybermines-game'
import 'cybermines-game/style.css'

function App() {
  return <Cybermines />
}
```

## Game Controls

- **Left Click**: Reveal cell
- **Right Click / Flag Button**: Place/remove flag
- **R Key**: Reset game
- **H Key**: Show hint

## Story Mode

Complete increasingly challenging levels with specific objectives:
- Tutorial Mission
- Data Breach
- Virus Hunt
- Firewall Breach
- The Core

Each level has a unique narrative and difficulty progression.

## License

MIT
