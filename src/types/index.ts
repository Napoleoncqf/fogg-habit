export type EnergyLevel = 'napoleon' | 'march' | 'hibernate'

export type HabitCategory = 'thesis' | 'learning' | 'fitness' | 'boundary' | 'custom'

export interface DifficultyLevels {
  hibernate: string
  march: string
  napoleon: string
}

export interface HabitBehavior {
  id?: number
  name: string
  description: string
  anchorEvent: string
  tinyBehavior: string
  celebration: string
  category: HabitCategory
  difficultyLevels: DifficultyLevels
  currentStreak: number
  reminderTime?: string
  createdAt: number
  updatedAt: number
}

export interface CompletedBehavior {
  behaviorId: number
  timestamp: number
  difficultyUsed: EnergyLevel
}

export interface DailyLog {
  id?: number
  date: string // YYYY-MM-DD
  energyLevel: EnergyLevel
  completedBehaviors: CompletedBehavior[]
  note?: string
}
