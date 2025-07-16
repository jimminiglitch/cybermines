export interface Cell {
  mine: boolean
  revealed: boolean
  flagged: boolean
  adjacent: number
}

export interface Difficulty {
  name: string
  rows: number
  cols: number
  mines: number
}

export interface StoryLevel {
  id: number
  name: string
  description: string
  difficulty: Difficulty
  objective: string
  unlocked: boolean
  completed: boolean
  stars: number
  narrative: string
}
