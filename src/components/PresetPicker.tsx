import { motion } from 'framer-motion'
import { useAppStore } from '../stores/useAppStore'
import { presetTemplates, createHabitFromPreset, categoryConfig } from '../utils/presets'

interface Props {
  onDone: () => void
}

export default function PresetPicker({ onDone }: Props) {
  const { addHabit } = useAppStore()

  const handlePick = async (index: number) => {
    const habit = createHabitFromPreset(presetTemplates[index])
    await addHabit(habit)
    onDone()
  }

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-medium text-[var(--text-secondary)]">
        快速添加预置行为
      </h2>
      {presetTemplates.map((p, i) => {
        const cat = categoryConfig[p.category]
        return (
          <motion.button
            key={p.name}
            whileTap={{ scale: 0.97 }}
            onClick={() => handlePick(i)}
            className="w-full text-left p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] flex items-center gap-3"
          >
            <span className="text-2xl">{cat.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{p.name}</p>
              <p className="text-xs text-[var(--text-secondary)] truncate">
                {p.description}
              </p>
            </div>
            <span className="text-[var(--accent-gold)] text-lg">+</span>
          </motion.button>
        )
      })}
    </div>
  )
}
