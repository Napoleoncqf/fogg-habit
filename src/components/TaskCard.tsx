import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import { useAppStore } from '../stores/useAppStore'
import { categoryConfig } from '../utils/presets'
import type { HabitBehavior, EnergyLevel } from '../types'

interface Props {
  habit: HabitBehavior
}

export default function TaskCard({ habit }: Props) {
  const { todayEnergy, completeBehavior, isBehaviorCompletedToday } = useAppStore()
  const completed = isBehaviorCompletedToday(habit.id!)
  const energy: EnergyLevel = todayEnergy ?? 'march'
  const taskText = habit.difficultyLevels[energy]
  const cat = categoryConfig[habit.category]

  const handleComplete = async () => {
    if (completed) return
    await completeBehavior(habit.id!, energy)
    confetti({
      particleCount: 60,
      spread: 50,
      origin: { y: 0.7 },
      colors: ['#d4a843', '#f59e0b', '#22c55e'],
    })
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-4 rounded-xl border transition-all ${
        completed
          ? 'bg-[var(--bg-card)] border-[var(--accent-green)]/30 opacity-70'
          : 'bg-[var(--bg-card)] border-[var(--border)]'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span>{cat.icon}</span>
            <span className="text-sm font-medium">{habit.name}</span>
            {habit.currentStreak > 0 && (
              <span className="text-xs text-[var(--accent-gold)]">
                🔥{habit.currentStreak}天
              </span>
            )}
          </div>
          <p className="text-xs text-[var(--text-secondary)] mb-2">
            在 {habit.anchorEvent} 之后...
          </p>
          <p className={`text-sm ${completed ? 'line-through text-[var(--text-secondary)]' : ''}`}>
            {taskText}
          </p>
        </div>

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleComplete}
          disabled={completed}
          className={`shrink-0 w-11 h-11 rounded-full flex items-center justify-center text-lg transition-colors ${
            completed
              ? 'bg-[var(--accent-green)] text-white'
              : 'bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-secondary)]'
          }`}
        >
          {completed ? '✓' : '○'}
        </motion.button>
      </div>

      {completed && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-[var(--accent-green)] mt-2"
        >
          🎉 {habit.celebration}
        </motion.p>
      )}
    </motion.div>
  )
}
