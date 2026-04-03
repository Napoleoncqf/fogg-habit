import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '../stores/useAppStore'
import { categoryConfig } from '../utils/presets'
import type { HabitCategory } from '../types'

const steps = ['分类', '锚点', '微行为', '庆祝']

const anchorSuggestions = [
  '到单位坐下后',
  '午饭吃完后',
  '下班到家后',
  '早上起床后',
  '洗完澡后',
  '喝完咖啡后',
]

const celebrationSuggestions = [
  '对自己说"干得好"',
  '伸个懒腰',
  '喝口水',
  '做个胜利手势',
  '深呼吸三次',
]

interface Props {
  onDone: () => void
}

export default function BehaviorDesigner({ onDone }: Props) {
  const { addHabit, habits } = useAppStore()
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<HabitCategory>('custom')
  const [anchor, setAnchor] = useState('')
  const [levelHibernate, setLevelHibernate] = useState('')
  const [levelMarch, setLevelMarch] = useState('')
  const [levelNapoleon, setLevelNapoleon] = useState('')
  const [celebration, setCelebration] = useState('')

  const canNext = () => {
    switch (step) {
      case 0: return name.trim().length > 0
      case 1: return anchor.trim().length > 0
      case 2: return levelHibernate.trim().length > 0
      case 3: return celebration.trim().length > 0
      default: return false
    }
  }

  const handleSubmit = async () => {
    const now = Date.now()
    await addHabit({
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
      currentStreak: 0,
      sortOrder: habits.length,
      createdAt: now,
      updatedAt: now,
    })
    onDone()
  }

  const slideVariants = {
    enter: { x: 50, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: -50, opacity: 0 },
  }

  return (
    <div className="p-4">
      {/* Progress */}
      <div className="flex gap-1 mb-6">
        {steps.map((s, i) => (
          <div
            key={s}
            className={`flex-1 h-1 rounded-full transition-colors ${
              i <= step ? 'bg-[var(--accent-gold)]' : 'bg-[var(--border)]'
            }`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.2 }}
        >
          {step === 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold">你想养成什么习惯？</h2>
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
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="行为名称"
                className="w-full p-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] text-sm outline-none focus:border-[var(--accent-gold)]"
              />
              <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="简短描述（可选）"
                className="w-full p-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] text-sm outline-none focus:border-[var(--accent-gold)]"
              />
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold">在什么之后做？</h2>
              <p className="text-sm text-[var(--text-secondary)]">在我 ______ 之后</p>
              <div className="flex flex-wrap gap-2">
                {anchorSuggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => setAnchor(s)}
                    className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${
                      anchor === s
                        ? 'border-[var(--accent-gold)] bg-[var(--bg-card)]'
                        : 'border-[var(--border)] bg-[var(--bg-secondary)]'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <input
                value={anchor}
                onChange={(e) => setAnchor(e.target.value)}
                placeholder="或自定义锚点..."
                className="w-full p-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] text-sm outline-none focus:border-[var(--accent-gold)]"
              />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold">最小版本是什么？</h2>
              <p className="text-sm text-[var(--text-secondary)]">
                小到不可能失败。如果只有 30 秒，你会做什么？
              </p>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-[var(--text-secondary)] flex items-center gap-1 mb-1">
                    🌙 冬眠模式（最小）
                  </label>
                  <input
                    value={levelHibernate}
                    onChange={(e) => setLevelHibernate(e.target.value)}
                    placeholder="比如：打开论文文档"
                    className="w-full p-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] text-sm outline-none focus:border-[var(--accent-gold)]"
                  />
                </div>
                <div>
                  <label className="text-xs text-[var(--text-secondary)] flex items-center gap-1 mb-1">
                    ⚔️ 行军模式（标准）
                  </label>
                  <input
                    value={levelMarch}
                    onChange={(e) => setLevelMarch(e.target.value)}
                    placeholder="比如：写一段话"
                    className="w-full p-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] text-sm outline-none focus:border-[var(--accent-gold)]"
                  />
                </div>
                <div>
                  <label className="text-xs text-[var(--text-secondary)] flex items-center gap-1 mb-1">
                    🔥 拿破仑模式（完整）
                  </label>
                  <input
                    value={levelNapoleon}
                    onChange={(e) => setLevelNapoleon(e.target.value)}
                    placeholder="比如：写 30 分钟"
                    className="w-full p-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] text-sm outline-none focus:border-[var(--accent-gold)]"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold">完成后怎么庆祝？</h2>
              <p className="text-sm text-[var(--text-secondary)]">
                做一个让自己开心的小动作
              </p>
              <div className="flex flex-wrap gap-2">
                {celebrationSuggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => setCelebration(s)}
                    className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${
                      celebration === s
                        ? 'border-[var(--accent-gold)] bg-[var(--bg-card)]'
                        : 'border-[var(--border)] bg-[var(--bg-secondary)]'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <input
                value={celebration}
                onChange={(e) => setCelebration(e.target.value)}
                placeholder="或自定义庆祝方式..."
                className="w-full p-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] text-sm outline-none focus:border-[var(--accent-gold)]"
              />
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex gap-3 mt-8">
        {step > 0 && (
          <button
            onClick={() => setStep(step - 1)}
            className="flex-1 py-3 rounded-lg border border-[var(--border)] text-sm"
          >
            上一步
          </button>
        )}
        {step < 3 ? (
          <button
            onClick={() => setStep(step + 1)}
            disabled={!canNext()}
            className="flex-1 py-3 rounded-lg bg-[var(--accent-gold)] text-[var(--bg-primary)] font-medium text-sm disabled:opacity-40"
          >
            下一步
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!canNext()}
            className="flex-1 py-3 rounded-lg bg-[var(--accent-green)] text-white font-medium text-sm disabled:opacity-40"
          >
            创建行为
          </button>
        )}
      </div>
    </div>
  )
}
