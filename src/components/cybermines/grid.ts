import type { Cell, Difficulty } from './types'

export function createEmptyGrid(rows: number, cols: number): Cell[][] {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({
      mine: false,
      revealed: false,
      flagged: false,
      adjacent: 0,
    }))
  )
}

export function placeMines(grid: Cell[][], mines: number): void {
  const rows = grid.length
  const cols = grid[0].length
  let placed = 0
  while (placed < mines) {
    const r = Math.floor(Math.random() * rows)
    const c = Math.floor(Math.random() * cols)
    if (!grid[r][c].mine) {
      grid[r][c].mine = true
      placed++
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue
          const nr = r + dr
          const nc = c + dc
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
            grid[nr][nc].adjacent += 1
          }
        }
      }
    }
  }
}

export function generateGrid(difficulty: Difficulty): Cell[][] {
  const grid = createEmptyGrid(difficulty.rows, difficulty.cols)
  placeMines(grid, difficulty.mines)
  return grid
}
