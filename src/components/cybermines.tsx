import type React from 'react'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { Badge } from './ui/badge'
import {
  RotateCcw,
  Skull,
  Settings,
  Volume2,
  VolumeX,
  Gamepad2,
  BookOpen,
  Clock,
  Star,
  Lightbulb,
  Flag,
  Zap,
} from 'lucide-react'
import { useCyberminesState } from './cybermines/state'
import '../styles/cybermines.css'

export type GameMode = 'classic' | 'story'

export default function Cybermines() {
  const {
    particles,
    soundEnabled,
    setSoundEnabled,
    gameMode,
    setGameMode,
    currentDifficulty,
    setCurrentDifficulty,
    grid,
    reveal,
    toggleFlag,
    flagMode,
    setFlagMode,
    showHint,
    quickReveal,
    gameOver,
    gameWon,
    flagCount,
    time,
    initializeGrid,
    startStoryLevel,
    storyProgress,
    showEpilogue,
    setShowEpilogue,
    difficulties,
    storyLevels,
    getCellContent,
    getCellAriaLabel,
    getCellClass,
    formatTime,
    getGridSize,
    hintCell,
  } = useCyberminesState()

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black p-4 relative overflow-y-auto">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Particles */}
      <div className="absolute inset-0 pointer-events-none z-50">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              left: particle.x,
              top: particle.y,
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color,
              opacity: particle.life / particle.maxLife,
              boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-6xl mx-auto pb-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h1
            className="cyber-title glitch text-2xl sm:text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
            data-text="CYBERMINES"
          >
            CYBERMINES
          </h1>
        </div>

        {/* Instructions - Enhanced visibility */}
        <Card className="cyber-panel mb-6 p-4">
          <div className="text-center text-sm font-mono">
            <p className="text-cyan-300 font-bold" style={{ color: '#00ffff', textShadow: '0 0 5px #00ffff' }}>
              LEFT CLICK: Probe neural node | RIGHT CLICK or FLAG BUTTON: Deploy
              security flag
            </p>
            <p className="mt-1 text-purple-300 font-bold" style={{ color: '#ff00ff', textShadow: '0 0 5px #ff00ff' }}>
              Locate all {currentDifficulty.mines} corrupted nodes without
              triggering security protocols
            </p>
          </div>
        </Card>

        {/* Game Mode Selector & Main Controls */}
        <Card className="cyber-panel mb-6 p-3">
          {/* ALL BUTTONS IN ONE ROW SPANNING FULL WIDTH */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-1 mb-3">
            <Button
              onClick={() => setGameMode(gameMode === 'classic' ? 'story' : 'classic')}
              className="cyber-button text-xs px-2 py-1 whitespace-nowrap w-full"
              size="sm"
            >
              {gameMode === 'classic' ? (
                <>
                  <Gamepad2 className="w-3 h-3 mr-1" />
                  CLASSIC
                </>
              ) : (
                <>
                  <BookOpen className="w-3 h-3 mr-1" />
                  STORY
                </>
              )}
            </Button>
            
            <Button
              onClick={() => {
                const currentIndex = difficulties.findIndex(d => d.name === currentDifficulty.name)
                const nextIndex = (currentIndex + 1) % difficulties.length
                setCurrentDifficulty(difficulties[nextIndex])
              }}
              className="cyber-button text-xs px-2 py-1 whitespace-nowrap w-full"
              size="sm"
              variant="outline"
            >
              <Settings className="w-3 h-3 mr-1" />
              {currentDifficulty.name}
            </Button>

            <Button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="cyber-button text-xs px-2 py-1 whitespace-nowrap w-full"
              size="sm"
              variant="outline"
            >
              {soundEnabled ? (
                <Volume2 className="w-3 h-3" />
              ) : (
                <VolumeX className="w-3 h-3" />
              )}
            </Button>

            <Button
              onClick={initializeGrid}
              className="cyber-button text-xs px-2 py-1 whitespace-nowrap w-full"
              size="sm"
            >
              <RotateCcw className="w-3 h-3 mr-1" />
              RESET
            </Button>
            
            <Button
              onClick={() => setFlagMode(!flagMode)}
              className={`cyber-button text-xs px-2 py-1 whitespace-nowrap w-full ${flagMode ? 'bg-yellow-400 text-black' : ''}`}
              size="sm"
            >
              <Flag className="w-3 h-3 mr-1" />
              FLAG
            </Button>
            
            <Button
              onClick={showHint}
              className="cyber-button text-xs px-2 py-1 whitespace-nowrap w-full"
              size="sm"
            >
              <Lightbulb className="w-3 h-3 mr-1" />
              HINT
            </Button>
            
            {hintCell && (
              <Button
                onClick={quickReveal}
                className="cyber-button text-xs px-2 py-1 whitespace-nowrap w-full"
                size="sm"
              >
                <Zap className="w-3 h-3 mr-1" />
                REVEAL
              </Button>
            )}
          </div>

          {/* STATS IN SEPARATE ROW BELOW */}
          <div className="flex justify-center items-center gap-4 flex-nowrap">
            <Badge variant="outline" className="cyber-badge text-xs px-2 py-1 whitespace-nowrap">
              <Skull className="w-3 h-3 mr-1" />
              MINES: {currentDifficulty.mines - flagCount}
            </Badge>
            <Badge variant="outline" className="cyber-badge text-xs px-2 py-1 whitespace-nowrap">
              <Clock className="w-3 h-3 mr-1" />
              TIME: {formatTime(time)}
            </Badge>
          </div>
        </Card>

        {/* Story Mode */}
        {gameMode === 'story' && (
          <Card className="cyber-panel mb-6 p-4">
            <h3 className="text-cyan-400 text-xl mb-4">STORY CAMPAIGN</h3>
            <p className="text-purple-300 mb-4">
              PROGRESS: {storyProgress.filter((l) => l.completed).length}/
              {storyLevels.length}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {storyProgress.map((level) => (
                <Card
                  key={level.id}
                  className={`p-4 ${level.unlocked ? 'cyber-panel' : 'opacity-50'}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-purple-300 font-bold text-base">{level.name}</h4>
                    <div className="flex">
                      {[1, 2, 3].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${star <= level.stars ? 'text-yellow-400 fill-current' : 'text-gray-600'}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-cyan-100 text-sm mb-2 font-medium">
                    {level.description}
                  </p>
                  <p className="text-gray-300 text-xs mb-3">
                    {level.narrative}
                  </p>
                  <Button
                    onClick={() => startStoryLevel(level.id)}
                    disabled={!level.unlocked}
                    className="cyber-button w-full"
                    size="sm"
                  >
                    {level.completed ? 'REPLAY' : 'START'}
                  </Button>
                </Card>
              ))}
            </div>
          </Card>
        )}

        {/* Game Status */}
        {(gameOver || gameWon) && (
          <Card
            className={`cyber-panel mb-6 p-4 text-center ${gameWon ? 'border-green-400' : 'border-red-400'}`}
          >
            <div
              className={`text-2xl font-bold ${gameWon ? 'text-green-400' : 'text-red-400'}`}
            >
              {gameWon
                ? '🎉 BREACH SUCCESSFUL! 🎉'
                : '💥 SYSTEM COMPROMISED! 💥'}
            </div>
            <p className="text-cyan-300 mt-2">
              {gameWon
                ? `Neural pathways secured in ${formatTime(time)}`
                : 'Security protocols activated'}
            </p>
            {gameMode === 'story' && gameWon && (
              <div className="flex justify-center mt-2">
                {[1, 2, 3].map((star) => (
                  <Star
                    key={star}
                    className={`w-6 h-6 ${star <= (time < 60 ? 3 : time < 120 ? 2 : 1) ? 'text-yellow-400 fill-current' : 'text-gray-600'}`}
                  />
                ))}
              </div>
            )}
          </Card>
        )}

        {/* Game Grid */}
        <Card className="cyber-panel p-6">
          <div
            className="cyber-grid"
            style={{
              gridTemplateColumns: `repeat(${currentDifficulty.cols}, 1fr)`,
              maxWidth: `${getGridSize()}px`,
              margin: '0 auto',
            }}
          >
            {grid.map((row, r) =>
              row.map((cell, c) => (
                <button
                  key={`${r}-${c}`}
                  id={`cell-${r}-${c}`}
                  className={getCellClass(cell, r, c)}
                  onClick={(e) =>
                    flagMode ? toggleFlag(e, r, c) : reveal(r, c)
                  }
                  onContextMenu={(e) => toggleFlag(e, r, c)}
                  disabled={gameOver || gameWon}
                  aria-label={getCellAriaLabel(cell)}
                >
                  <span className="cell-content">{getCellContent(cell)}</span>
                </button>
              ))
            )}
          </div>
        </Card>
      </div>

      {showEpilogue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 animate-fade-in">
          <div className="text-center space-y-4 p-6">
            <h2 className="text-cyan-400 text-2xl font-bold">EPILOGUE</h2>
            <p className="text-purple-300 max-w-md">
              With the network secure, your exploits echo across the datasphere.
            </p>
            <Button
              className="cyber-button"
              onClick={() => setShowEpilogue(false)}
            >
              CLOSE
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
