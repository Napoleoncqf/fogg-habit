import { useState } from 'react'
import { useAppStore } from '../stores/useAppStore'
import { categoryConfig } from '../utils/presets'
import type { HabitBehavior, HabitCategory } from '../types'

interface Props {
  habit: HabitBehavior
  onDone: () => void
}

export default function BehaviorEditor({ habit, onDone }: Props) {
  const { updateHabit } = useAppStore()
  const [name, setName] = useState(habit.name)
  const [description, setDescription] = useState(habit.description)
  const [category, setCategory] = useState<HabitCategory>(habit.category)
  const [anchor, setAnchor] = useState(habit.anchorEvent)
  const [levelHibernate, setLevelHibernate] = useState(habit.difficultyLevels.hibernate)
  const [levelMarch, setLevelMarch] = useState(habit.difficultyLevels.march)
  const [levelNapoleon, setLevelNapoleon] = useState(habit.difficultyLevels.napoleon)
  const [celebration, setCelebration] = useState(habit.celebration)

  const handleSave = async () => {
    if (!name.trim()) return
    await updateHabit(habit.id!, {
      name: name.trim(),
      description: description.trim(),
      category,
      anchorEvent: anchor.trim(),
      tinyBehavior: levelHibernate.trim(),
      celebration: celebration.trim(),
      difficultyLevels: {
        hibernate: levelHibernate.trim(),
        march: levelMarch.trim() || levelHibernate.trim(),
        napoleon: levelNapoleon.trim() || levelMarch.trim() || levelHibernate.trim(),
      },
    })
    onDone()
  }

  const inputClass =
    'w-full p-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] text-sm outline-none focus:border-[var(--accent-gold)]'

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-bold">编辑行为</h2>

      <div className="grid grid-cols-3 gap-2">
        {(Object.entries(categoryConfig) as [HabitCategory, { label: string; icon: string }][]).map(
          ([key, cfg]) => (
            <button
              key={key}
              onClick={() => setCategory(key)}
              className={`p-2 rounded-lg border text-xs text-center transition-colors ${
                category === key
                  ? 'border-[var(--accent-gold)] bg-[var(--bg-card)]'
                  : 'border-[var(--border)] bg-[var(--bg-secondary)]'
              }`}
            >
              <span className="text-lg block mb-1">{cfg.icon}</span>
              {cfg.label}
            </button>
          )
        )}
      </div>

      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="行为名称" className={inputClass} />
      <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="简短描述" className={inputClass} />
      <input value={anchor} onChange={(e) => setAnchor(e.target.value)} placeholder="锚点行为" className={inputClass} />

      <div className="space-y-3">
        <div>
          <label className="text-xs text-[var(--text-secondary)] mb-1 block">🌙 冬眠模式</label>
          <input value={levelHibernate} onChange={(e) => setLevelHibernate(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="text-xs text-[var(--text-secondary)] mb-1 block">⚔️ 行军模式</label>
          <input value={levelMarch} onChange={(e) => setLevelMarch(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="text-xs text-[var(--text-secondary)] mb-1 block">🔥 拿破仑模式</label>
          <input value={levelNapoleon} onChange={(e) => setLevelNapoleon(e.target.value)} className={inputClass} />
        </div>
      </div>

      <input value={celebration} onChange={(e) => setCelebration(e.target.value)} placeholder="庆祝方式" className={inputClass} />

      <div className="flex gap-3">
        <button onClick={onDone} className="flex-1 py-3 rounded-lg border border-[var(--border)] text-sm">
          取消
        </button>
        <button
          onClick={handleSave}
          disabled={!name.trim()}
          className="flex-1 py-3 rounded-lg bg-[var(--accent-gold)] text-[var(--bg-primary)] font-medium text-sm disabled:opacity-40"
        >
          保存
        </button>
      </div>
    </div>
  )
}
