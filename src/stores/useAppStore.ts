import { create } from 'zustand'
import { db } from './db'
import { getTodayStr } from '../utils/date'
import type { EnergyLevel, DailyLog, HabitBehavior, CompletedBehavior } from '../types'

interface AppState {
  todayEnergy: EnergyLevel | null
  todayLog: DailyLog | null
  habits: HabitBehavior[]
  initialized: boolean

  init: () => Promise<void>
  setTodayEnergy: (level: EnergyLevel) => Promise<void>
  addHabit: (habit: Omit<HabitBehavior, 'id'>) => Promise<void>
  deleteHabit: (id: number) => Promise<void>
  completeBehavior: (behaviorId: number, difficulty: EnergyLevel) => Promise<void>
  isBehaviorCompletedToday: (behaviorId: number) => boolean
}

export const useAppStore = create<AppState>((set, get) => ({
  todayEnergy: null,
  todayLog: null,
  habits: [],
  initialized: false,

  init: async () => {
    if (get().initialized) return
    const today = getTodayStr()
    const habits = await db.habits.toArray()
    const log = await db.dailyLogs.where('date').equals(today).first()
    set({
      habits,
      todayLog: log ?? null,
      todayEnergy: log?.energyLevel ?? null,
      initialized: true,
    })
  },

  setTodayEnergy: async (level) => {
    const today = getTodayStr()
    let log = await db.dailyLogs.where('date').equals(today).first()
    if (log) {
      await db.dailyLogs.update(log.id!, { energyLevel: level })
      log = { ...log, energyLevel: level }
    } else {
      const id = await db.dailyLogs.add({
        date: today,
        energyLevel: level,
        completedBehaviors: [],
      })
      log = { id, date: today, energyLevel: level, completedBehaviors: [] }
    }
    set({ todayEnergy: level, todayLog: log })
  },

  addHabit: async (habit) => {
    const id = await db.habits.add(habit as HabitBehavior)
    const habits = await db.habits.toArray()
    set({ habits })
  },

  deleteHabit: async (id) => {
    await db.habits.delete(id)
    const habits = await db.habits.toArray()
    set({ habits })
  },

  completeBehavior: async (behaviorId, difficulty) => {
    const today = getTodayStr()
    let log = await db.dailyLogs.where('date').equals(today).first()
    const entry: CompletedBehavior = {
      behaviorId,
      timestamp: Date.now(),
      difficultyUsed: difficulty,
    }

    if (log) {
      const already = log.completedBehaviors.some((b) => b.behaviorId === behaviorId)
      if (already) return
      const updated = [...log.completedBehaviors, entry]
      await db.dailyLogs.update(log.id!, { completedBehaviors: updated })
      log = { ...log, completedBehaviors: updated }
    } else {
      const id = await db.dailyLogs.add({
        date: today,
        energyLevel: get().todayEnergy ?? 'march',
        completedBehaviors: [entry],
      })
      log = { id, date: today, energyLevel: get().todayEnergy ?? 'march', completedBehaviors: [entry] }
    }

    // Update streak
    const habit = await db.habits.get(behaviorId)
    if (habit) {
      await db.habits.update(behaviorId, {
        currentStreak: habit.currentStreak + 1,
        updatedAt: Date.now(),
      })
    }

    const habits = await db.habits.toArray()
    set({ todayLog: log, habits })
  },

  isBehaviorCompletedToday: (behaviorId) => {
    const log = get().todayLog
    if (!log) return false
    return log.completedBehaviors.some((b) => b.behaviorId === behaviorId)
  },
}))
