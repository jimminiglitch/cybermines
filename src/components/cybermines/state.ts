import { useState, useEffect, useCallback } from 'react'
import type React from 'react'
import { useCyberminesSound } from '../cybermines-sound'
import { generateGrid } from './grid'
import type { Cell, Difficulty, StoryLevel } from './types'
export type GameMode = 'classic' | 'story'

export const difficulties: Difficulty[] = [
  { name: 'NOVICE', rows: 8, cols: 8, mines: 10 },
  { name: 'AGENT', rows: 12, cols: 12, mines: 25 },
  { name: 'ELITE', rows: 16, cols: 16, mines: 50 },
]

export const storyLevels: StoryLevel[] = [
  {
    id: 1,
    name: 'First Contact',
    description: 'Tutorial Mission',
    difficulty: { name: 'TUTORIAL', rows: 6, cols: 6, mines: 5 },
    objective: 'Clear the grid',
    unlocked: true,
    completed: false,
    stars: 0,
    narrative:
      'Welcome to the Neural Network, Agent. Your first mission is simple - locate and neutralize the corrupted data nodes.',
  },
  {
    id: 2,
    name: 'Data Breach',
    description: 'Corporate Infiltration',
    difficulty: { name: 'EASY', rows: 8, cols: 8, mines: 8 },
    objective: 'Complete in under 2 minutes',
    unlocked: false,
    completed: false,
    stars: 0,
    narrative:
      "MegaCorp's mainframe has been compromised. Navigate through their security protocols quickly and quietly.",
  },
  {
    id: 3,
    name: 'Virus Hunt',
    description: 'System Cleansing',
    difficulty: { name: 'MEDIUM', rows: 10, cols: 10, mines: 15 },
    objective: 'Use no more than 3 flags',
    unlocked: false,
    completed: false,
    stars: 0,
    narrative:
      "A dangerous virus is spreading through the network. Trust your instincts - you won't have many chances to mark suspicious nodes.",
  },
  {
    id: 4,
    name: 'Firewall Breach',
    description: 'Advanced Security',
    difficulty: { name: 'HARD', rows: 12, cols: 12, mines: 20 },
    objective: 'Complete without power-ups',
    unlocked: false,
    completed: false,
    stars: 0,
    narrative:
      "The enemy has adapted. Their new firewall blocks all enhancement protocols. You're on your own, Agent.",
  },
  {
    id: 5,
    name: 'The Core',
    description: 'Final Confrontation',
    difficulty: { name: 'NIGHTMARE', rows: 16, cols: 16, mines: 40 },
    objective: 'Survive the ultimate test',
    unlocked: false,
    completed: false,
    stars: 0,
    narrative:
      "You've reached the core of the hostile XL. This is where it all ends - one way or another.",
  },
]

export function useCyberminesState() {
  const {
    particles,
    setParticles,
    soundEnabled,
    setSoundEnabled,
    playClickSound,
    playFlagSound,
    playExplosionSound,
    playWinSound,
    createParticles,
  } = useCyberminesSound()

  const [gameMode, setGameMode] = useState<GameMode>('classic')
  const [currentDifficulty, setCurrentDifficulty] = useState<Difficulty>(
    difficulties[0]
  )
  const [grid, setGrid] = useState<Cell[][]>([])
  const [gameOver, setGameOver] = useState(false)
  const [gameWon, setGameWon] = useState(false)
  const [flagCount, setFlagCount] = useState(0)
  const [time, setTime] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [explosionCells, setExplosionCells] = useState<Set<string>>(new Set())
  const [hintCell, setHintCell] = useState<[number, number] | null>(null)
  const [flagMode, setFlagMode] = useState(false)
  const [paused, setPaused] = useState(false)

  const [currentStoryLevel, setCurrentStoryLevel] = useState(0)
  const [storyProgress, setStoryProgress] = useState<StoryLevel[]>(storyLevels)
  const [showEpilogue, setShowEpilogue] = useState(false)

  const triggerEpilogue = () => {
    createParticles(window.innerWidth / 2, window.innerHeight / 2, 80, [
      '#00ffff',
      '#ff00ff',
      '#ffff00',
    ])
    setShowEpilogue(true)
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedStory = localStorage.getItem('cyber-mines-story')
      if (savedStory) {
        setStoryProgress(JSON.parse(savedStory))
      }
    }
  }, [])

  const saveStoryProgress = (newProgress: StoryLevel[]) => {
    setStoryProgress(newProgress)
    localStorage.setItem('cyber-mines-story', JSON.stringify(newProgress))
  }

  const startStoryLevel = (levelId: number) => {
    const level = storyProgress.find((l) => l.id === levelId)
    if (!level || !level.unlocked) return

    setCurrentStoryLevel(levelId)
    setCurrentDifficulty(level.difficulty)
    setGameMode('story')
    initializeGrid()
  }

  const completeStoryLevel = (stars: number) => {
    const newProgress = storyProgress.map((level) => {
      if (level.id === currentStoryLevel) {
        const updatedLevel = {
          ...level,
          completed: true,
          stars: Math.max(level.stars, stars),
        }
        const nextLevel = storyProgress.find((l) => l.id === level.id + 1)
        if (nextLevel && !nextLevel.unlocked) {
          nextLevel.unlocked = true
        }
        return updatedLevel
      }
      return level
    })

    saveStoryProgress(newProgress)
    if (currentStoryLevel === storyLevels.length) {
      triggerEpilogue()
    }
  }

  const initializeGrid = useCallback(() => {
    const newGrid = generateGrid(currentDifficulty)

    setGrid(newGrid)
    setGameOver(false)
    setGameWon(false)
    setFlagCount(0)
    setTime(0)
    setGameStarted(false)
    setExplosionCells(new Set())
    setParticles([])
    setFlagMode(false)
  }, [currentDifficulty, setParticles])

  useEffect(() => {
    initializeGrid()
  }, [initializeGrid])

  useEffect(() => {
    const handleVisibility = () => setPaused(document.hidden)
    const handleKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'r') {
        initializeGrid()
      } else if (e.key.toLowerCase() === 'h') {
        showHint()
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)
    window.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibility)
      window.removeEventListener('keydown', handleKey)
    }
  }, [initializeGrid])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (gameStarted && !gameOver && !gameWon && !paused) {
      interval = setInterval(() => {
        setTime((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [gameStarted, gameOver, gameWon, paused])

  const reveal = useCallback(
    (r: number, c: number) => {
      if (gameOver || gameWon || grid[r][c].revealed || grid[r][c].flagged)
        return

      if (!gameStarted) setGameStarted(true)
      playClickSound()

      const newGrid = [...grid]
      const cell = newGrid[r][c]
      cell.revealed = true

      if (cell.mine) {
        setGameOver(true)
        playExplosionSound()
        setExplosionCells((prev) => new Set([...prev, `${r}-${c}`]))
        const rect = document
          .getElementById(`cell-${r}-${c}`)
          ?.getBoundingClientRect()
        if (rect) {
          createParticles(
            rect.left + rect.width / 2,
            rect.top + rect.height / 2,
            20,
            ['#ff0066', '#ff3399', '#ffff00', '#ff9900']
          )
        }

        let delay = 0
        for (let i = 0; i < currentDifficulty.rows; i++) {
          for (let j = 0; j < currentDifficulty.cols; j++) {
            if (newGrid[i][j].mine) {
              setTimeout(() => {
                setExplosionCells((prev) => new Set([...prev, `${i}-${j}`]))
                newGrid[i][j].revealed = true
                setGrid([...newGrid])
              }, delay)
              delay += 50
            }
          }
        }
      } else {
        if (cell.adjacent === 0) {
          const queue = [[r, c]]
          let qIndex = 0
          while (qIndex < queue.length) {
            const [cr, cc] = queue[qIndex]
            qIndex++
            for (let dr = -1; dr <= 1; dr++) {
              for (let dc = -1; dc <= 1; dc++) {
                const nr = cr + dr
                const nc = cc + dc
                if (
                  nr >= 0 &&
                  nr < currentDifficulty.rows &&
                  nc >= 0 &&
                  nc < currentDifficulty.cols
                ) {
                  const neighborCell = newGrid[nr][nc]
                  if (
                    !neighborCell.revealed &&
                    !neighborCell.mine &&
                    !neighborCell.flagged
                  ) {
                    neighborCell.revealed = true
                    if (neighborCell.adjacent === 0) {
                      queue.push([nr, nc])
                    }
                  }
                }
              }
            }
          }
        }
      }

      setGrid(newGrid)

      const revealedCount = newGrid
        .flat()
        .filter((cell) => cell.revealed).length
      if (
        revealedCount ===
        currentDifficulty.rows * currentDifficulty.cols -
          currentDifficulty.mines
      ) {
        setGameWon(true)
        playWinSound()

        createParticles(window.innerWidth / 2, window.innerHeight / 2, 50, [
          '#00ff00',
          '#00ffff',
          '#ff00ff',
          '#ffff00',
        ])

        if (gameMode === 'story') {
          const stars = time < 60 ? 3 : time < 120 ? 2 : 1
          completeStoryLevel(stars)
        }
      }
    },
    [
      gameOver,
      gameWon,
      grid,
      gameStarted,
      time,
      currentDifficulty,
      playClickSound,
      playExplosionSound,
      playWinSound,
      gameMode,
    ]
  )

  const toggleFlag = useCallback(
    (e: React.MouseEvent, r: number, c: number) => {
      e.preventDefault()
      if (gameOver || gameWon || grid[r][c].revealed) return

      if (!gameStarted) setGameStarted(true)
      playFlagSound()

      const newGrid = [...grid]
      const cell = newGrid[r][c]
      cell.flagged = !cell.flagged

      setFlagCount((prev) => (cell.flagged ? prev + 1 : prev - 1))
      setGrid(newGrid)
    },
    [gameOver, gameWon, grid, gameStarted, playFlagSound]
  )

  const showHint = useCallback(() => {
    const safeCells: [number, number][] = []
    for (let r = 0; r < currentDifficulty.rows; r++) {
      for (let c = 0; c < currentDifficulty.cols; c++) {
        const cell = grid[r][c]
        if (!cell.mine && !cell.revealed && !cell.flagged) {
          safeCells.push([r, c])
        }
      }
    }
    if (safeCells.length === 0) return
    const choice = safeCells[Math.floor(Math.random() * safeCells.length)]
    setHintCell(choice)
    setTimeout(() => setHintCell(null), 1500)
  }, [grid, currentDifficulty])

  const quickReveal = useCallback(() => {
    if (hintCell) {
      const [r, c] = hintCell
      reveal(r, c)
      setHintCell(null)
    }
  }, [hintCell, reveal])

  const getCellContent = (cell: Cell) => {
    if (cell.flagged) return '🚩'
    if (!cell.revealed) return ''
    if (cell.mine) return '💀'
    if (cell.adjacent > 0) return cell.adjacent.toString()
    return ''
  }

  const getCellAriaLabel = (cell: Cell) => {
    if (cell.flagged) return 'Flagged tile'
    if (!cell.revealed) return 'Hidden tile'
    if (cell.mine) return 'Mine'
    if (cell.adjacent > 0) return `Revealed ${cell.adjacent} adjacent`
    return 'Empty tile'
  }

  const getCellClass = (cell: Cell, r: number, c: number) => {
    let baseClass = 'cyber-cell'
    const cellKey = `${r}-${c}`

    if (explosionCells.has(cellKey)) {
      baseClass += ' exploding-cell'
    }

    if (hintCell && hintCell[0] === r && hintCell[1] === c) {
      baseClass += ' detector-highlight'
    }

    if (cell.revealed) {
      if (cell.mine) {
        baseClass += ' mine-cell'
      } else {
        baseClass += ' revealed-cell'
        if (cell.adjacent > 0) {
          baseClass += ` adjacent-${cell.adjacent}`
        }
      }
    } else if (cell.flagged) {
      baseClass += ' flagged-cell'
    }
    return baseClass
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 0
  )

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const getGridSize = useCallback(() => {
    const maxSize = Math.min(600, windowWidth - 40)
    return Math.min(maxSize, currentDifficulty.cols * 35)
  }, [windowWidth, currentDifficulty.cols])

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 'text-gray-400'
      case 'rare':
        return 'text-blue-400'
      case 'epic':
        return 'text-purple-400'
      case 'legendary':
        return 'text-yellow-400'
      default:
        return 'text-gray-400'
    }
  }

  return {
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
    getRarityColor,
    hintCell,
  }
}
