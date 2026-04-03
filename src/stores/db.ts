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
    this.version(2).stores({
      habits: '++id, category, createdAt, sortOrder',
      dailyLogs: '++id, date',
    }).upgrade((tx) => {
      return tx.table('habits').toCollection().modify((habit) => {
        if (habit.sortOrder === undefined) habit.sortOrder = habit.id ?? 0
        if (habit.lastCompletedDate === undefined) habit.lastCompletedDate = undefined
      })
    })
  }
}

export const db = new FoggHabitDB()
