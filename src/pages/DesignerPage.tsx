import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '../stores/useAppStore'
import BehaviorDesigner from '../components/BehaviorDesigner'
import PresetPicker from '../components/PresetPicker'
import { categoryConfig } from '../utils/presets'

export default function DesignerPage() {
  const { habits, init, deleteHabit } = useAppStore()
  const [mode, setMode] = useState<'list' | 'preset' | 'custom'>('list')

  useEffect(() => {
    init()
  }, [init])

  if (mode === 'custom') {
    return (
      <div>
        <div className="p-4 pb-0">
          <button
            onClick={() => setMode('list')}
            className="text-sm text-[var(--text-secondary)]"
          >
            ← 返回
          </button>
        </div>
        <BehaviorDesigner onDone={() => setMode('list')} />
      </div>
    )
  }

  if (mode === 'preset') {
    return (
      <div className="p-4">
        <button
          onClick={() => setMode('list')}
          className="text-sm text-[var(--text-secondary)] mb-4"
        >
          ← 返回
        </button>
        <PresetPicker onDone={() => setMode('list')} />
      </div>
    )
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-[var(--accent-gold)] mb-2">
        行为设计器
      </h1>
      <p className="text-[var(--text-secondary)] text-xs mb-4">
        设计你的微习惯
      </p>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setMode('preset')}
          className="flex-1 py-2.5 rounded-lg bg-[var(--accent-gold)] text-[var(--bg-primary)] font-medium text-sm"
        >
          快速添加
        </button>
        <button
          onClick={() => setMode('custom')}
          className="flex-1 py-2.5 rounded-lg border border-[var(--accent-gold)] text-[var(--accent-gold)] font-medium text-sm"
        >
          自定义设计
        </button>
      </div>

      {habits.length === 0 ? (
        <p className="text-center text-[var(--text-secondary)] text-sm py-8">
          还没有行为，点击上方按钮创建
        </p>
      ) : (
        <div className="space-y-3">
          <h2 className="text-sm font-medium text-[var(--text-secondary)]">
            已有行为 ({habits.length})
          </h2>
          <AnimatePresence>
            {habits.map((h) => {
              const cat = categoryConfig[h.category]
              return (
                <motion.div
                  key={h.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="bg-[var(--bg-card)] rounded-xl p-4 border border-[var(--border)]"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span>{cat.icon}</span>
                        <span className="text-sm font-medium">{h.name}</span>
                      </div>
                      <p className="text-xs text-[var(--text-secondary)]">
                        锚点：{h.anchorEvent}
                      </p>
                      <div className="mt-2 space-y-1 text-xs text-[var(--text-secondary)]">
                        <p>🌙 {h.difficultyLevels.hibernate}</p>
                        <p>⚔️ {h.difficultyLevels.march}</p>
                        <p>🔥 {h.difficultyLevels.napoleon}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteHabit(h.id!)}
                      className="text-[var(--text-secondary)] text-xs px-2 py-1 hover:text-[var(--accent-red)]"
                    >
                      删除
                    </button>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
