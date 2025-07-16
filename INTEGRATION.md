# Cybermines Integration Guide

## How to Integrate Standalone Cybermines Back into bbfdesktop

You now have a fully functional standalone Cybermines game! Here are three ways to integrate it back into your bbfdesktop project:

## Option 1: Copy the Built Files (Recommended for Quick Setup)

1. **Build the library:**
   ```bash
   cd cybermines-standalone
   npm run build:lib
   ```

2. **Copy the dist files to bbfdesktop:**
   ```bash
   # Copy the built files to your public directory
   cp dist/cybermines.js ../public/external/
   cp dist/cybermines.css ../public/external/
   ```

3. **Create an external loader component in bbfdesktop:**
   
   Create `src/components/CyberminesExternal.tsx`:
   ```tsx
   import { useEffect, useRef } from 'react'

   export default function CyberminesExternal() {
     const containerRef = useRef<HTMLDivElement>(null)

     useEffect(() => {
       // Load CSS
       const link = document.createElement('link')
       link.rel = 'stylesheet'
       link.href = '/external/cybermines.css'
       document.head.appendChild(link)

       // Load JS and initialize
       const script = document.createElement('script')
       script.src = '/external/cybermines.js'
       script.onload = () => {
         if (containerRef.current && window.Cybermines) {
           window.Cybermines.render(containerRef.current)
         }
       }
       document.body.appendChild(script)

       return () => {
         document.head.removeChild(link)
         document.body.removeChild(script)
       }
     }, [])

     return <div ref={containerRef} className="w-full h-full" />
   }
   ```

4. **Update your bbfdesktop config to use the external component:**
   Replace the old Cybermines import with the new external loader.

## Option 2: Git Submodule (For Active Development)

1. **Add as submodule:**
   ```bash
   git submodule add https://github.com/yourusername/cybermines-game.git external/cybermines
   ```

2. **Build when needed:**
   ```bash
   cd external/cybermines
   npm install
   npm run build:lib
   cp dist/* ../../public/external/
   ```

3. **Use the same external loader as Option 1**

## Option 3: NPM Package (Most Professional)

1. **Publish to NPM:**
   ```bash
   cd cybermines-standalone
   npm publish
   ```

2. **Install in bbfdesktop:**
   ```bash
   npm install cybermines-game
   ```

3. **Import and use:**
   ```tsx
   import { Cybermines } from 'cybermines-game'
   import 'cybermines-game/style.css'

   export default function CyberminesWindow() {
     return <Cybermines />
   }
   ```

## Recommended Next Steps

1. **Move the cybermines-standalone folder to its own repository**
2. **Use Option 1 for immediate integration**
3. **Consider Option 3 for long-term maintenance**

## Benefits of This Separation

✅ **Independent Development**: Update Cybermines without affecting bbfdesktop
✅ **Reusability**: Use the game in other projects
✅ **Smaller Bundle Size**: bbfdesktop doesn't include game code unless needed
✅ **Version Control**: Separate version history for the game
✅ **Team Collaboration**: Different teams can work on different components

## File Structure Created

```
cybermines-standalone/
├── src/
│   ├── components/
│   │   ├── ui/              # Self-contained UI components
│   │   ├── cybermines/      # Game logic
│   │   ├── cybermines.tsx   # Main component
│   │   └── cybermines-sound.ts
│   ├── styles/
│   │   └── cybermines.css   # All game styles
│   ├── lib/
│   │   └── utils.ts         # Utility functions
│   ├── App.tsx              # Standalone app
│   ├── main.tsx             # Entry point
│   └── index.ts             # Library export
├── dist/                    # Built files
├── package.json             # Dependencies and scripts
├── vite.config.ts           # Build configuration
├── tailwind.config.js       # Tailwind settings
└── README.md                # Documentation
```

The game is now completely self-contained and ready to be used anywhere!
