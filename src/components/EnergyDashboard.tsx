import { motion } from 'framer-motion'
import { useAppStore } from '../stores/useAppStore'
import { energyConfig } from '../utils/presets'
import type { EnergyLevel } from '../types'

const levels: EnergyLevel[] = ['napoleon', 'march', 'hibernate']

export default function EnergyDashboard() {
  const { todayEnergy, setTodayEnergy } = useAppStore()

  return (
    <div className="p-4">
      <h2 className="text-sm font-medium text-[var(--text-secondary)] mb-3">
        今日心力状态
      </h2>
      <div className="grid grid-cols-3 gap-2">
        {levels.map((level) => {
          const cfg = energyConfig[level]
          const active = todayEnergy === level
          return (
            <motion.button
              key={level}
              whileTap={{ scale: 0.95 }}
              onClick={() => setTodayEnergy(level)}
              className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-colors ${
                active
                  ? 'border-[var(--accent-gold)] bg-[var(--bg-card)]'
                  : 'border-[var(--border)] bg-[var(--bg-secondary)] opacity-60'
              }`}
            >
              <span className="text-2xl">{cfg.icon}</span>
              <span className="text-xs font-medium">{cfg.label}</span>
            </motion.button>
          )
        })}
      </div>
      {todayEnergy && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-[var(--text-secondary)] text-center mt-2"
        >
          {energyConfig[todayEnergy].desc}
        </motion.p>
      )}
    </div>
  )
}
