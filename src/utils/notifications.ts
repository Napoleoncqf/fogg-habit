import { db } from '../stores/db'
import { getTodayStr } from './date'
import { energyConfig } from './presets'
import type { EnergyLevel } from '../types'

let timers: ReturnType<typeof setTimeout>[] = []

export function scheduleNotifications() {
  // Clear previous timers
  timers.forEach(clearTimeout)
  timers = []

  if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return

  db.habits.toArray().then(async (habits) => {
    const today = getTodayStr()
    const log = await db.dailyLogs.where('date').equals(today).first()
    const energy: EnergyLevel = log?.energyLevel ?? 'march'
    const completedIds = new Set(log?.completedBehaviors.map((b) => b.behaviorId) ?? [])

    for (const h of habits) {
      if (!h.reminderTime || completedIds.has(h.id!)) continue

      const [hh, mm] = h.reminderTime.split(':').map(Number)
      const now = new Date()
      const target = new Date()
      target.setHours(hh, mm, 0, 0)

      const diff = target.getTime() - now.getTime()
      if (diff <= 0) continue // Already passed today

      const cfg = energyConfig[energy]
      const taskText = h.difficultyLevels[energy]

      const timer = setTimeout(() => {
        new Notification(`${cfg.icon} ${h.name}`, {
          body: `${cfg.label}：${taskText}`,
          tag: `fogg-${h.id}`,
        })
      }, diff)

      timers.push(timer)
    }
  })
}

export async function checkAdaptiveSuggestions(): Promise<string[]> {
  const suggestions: string[] = []
  const habits = await db.habits.toArray()
  const logs = await db.dailyLogs.toArray()

  for (const h of habits) {
    // Count recent completions
    const recent7 = logs
      .filter((l) => {
        const d = new Date(l.date)
        const now = new Date()
        const diff = (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24)
        return diff <= 7
      })

    const completedDays = recent7.filter((l) =>
      l.completedBehaviors.some((b) => b.behaviorId === h.id)
    ).length

    const missedDays = 7 - completedDays

    if (missedDays >= 3 && completedDays > 0) {
      suggestions.push(`"${h.name}" 最近完成率较低，建议切换到冬眠模式`)
    }

    if (completedDays >= 7) {
      suggestions.push(`"${h.name}" 连续 7 天完成！可以尝试升级难度`)
    }
  }

  return suggestions
}
