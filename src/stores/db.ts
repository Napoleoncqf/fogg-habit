import Dexie, { type Table } from 'dexie'
import type { HabitBehavior, DailyLog } from '../types'

class FoggHabitDB extends Dexie {
  habits!: Table<HabitBehavior, number>
  dailyLogs!: Table<DailyLog, number>

  constructor() {
    super('fogg-habit')
    this.version(1).stores({
      habits: '++id, category, createdAt',
      dailyLogs: '++id, date',
    })
  }
}

export const db = new FoggHabitDB()
