import { create } from 'zustand'
import { db } from './db'
import { getTodayStr, getYesterdayStr } from '../utils/date'
import type { EnergyLevel, DailyLog, HabitBehavior, CompletedBehavior } from '../types'

interface AppState {
  todayEnergy: EnergyLevel | null
  todayLog: DailyLog | null
  habits: HabitBehavior[]
  initialized: boolean

  init: () => Promise<void>
  setTodayEnergy: (level: EnergyLevel) => Promise<void>
  addHabit: (habit: Omit<HabitBehavior, 'id'>) => Promise<void>
  updateHabit: (id: number, updates: Partial<HabitBehavior>) => Promise<void>
  deleteHabit: (id: number) => Promise<void>
  reorderHabits: (orderedIds: number[]) => Promise<void>
  completeBehavior: (behaviorId: number, difficulty: EnergyLevel) => Promise<void>
  isBehaviorCompletedToday: (behaviorId: number) => boolean
}

async function refreshHabits(): Promise<HabitBehavior[]> {
  const habits = await db.habits.orderBy('sortOrder').toArray()
  return habits
}

export const useAppStore = create<AppState>((set, get) => ({
  todayEnergy: null,
  todayLog: null,
  habits: [],
  initialized: false,

  init: async () => {
    if (get().initialized) return
    const today = getTodayStr()
    const habits = await refreshHabits()
    const log = await db.dailyLogs.where('date').equals(today).first()

    // Check streak resets on init (if yesterday had no completion, reset streak)
    const yesterday = getYesterdayStr()
    for (const h of habits) {
      if (h.currentStreak > 0 && h.lastCompletedDate && h.lastCompletedDate < yesterday) {
        await db.habits.update(h.id!, { currentStreak: 0 })
        h.currentStreak = 0
      }
    }

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
    await db.habits.add(habit as HabitBehavior)
    set({ habits: await refreshHabits() })
  },

  updateHabit: async (id, updates) => {
    await db.habits.update(id, { ...updates, updatedAt: Date.now() })
    set({ habits: await refreshHabits() })
  },

  deleteHabit: async (id) => {
    await db.habits.delete(id)
    set({ habits: await refreshHabits() })
  },

  reorderHabits: async (orderedIds) => {
    await db.transaction('rw', db.habits, async () => {
      for (let i = 0; i < orderedIds.length; i++) {
        await db.habits.update(orderedIds[i], { sortOrder: i })
      }
    })
    set({ habits: await refreshHabits() })
  },

  completeBehavior: async (behaviorId, difficulty) => {
    const today = getTodayStr()
    const yesterday = getYesterdayStr()
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

    // Correct streak: +1 if last completed was yesterday or today, else reset to 1
    const habit = await db.habits.get(behaviorId)
    if (habit) {
      const wasConsecutive = habit.lastCompletedDate === yesterday || habit.lastCompletedDate === today
      const newStreak = wasConsecutive ? habit.currentStreak + 1 : 1
      await db.habits.update(behaviorId, {
        currentStreak: newStreak,
        lastCompletedDate: today,
        updatedAt: Date.now(),
      })
    }

    set({ todayLog: log, habits: await refreshHabits() })
  },

  isBehaviorCompletedToday: (behaviorId) => {
    const log = get().todayLog
    if (!log) return false
    return log.completedBehaviors.some((b) => b.behaviorId === behaviorId)
  },
}))
