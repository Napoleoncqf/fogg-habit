import { useRef, useEffect, useMemo } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { motion } from 'framer-motion'
import { db } from '../stores/db'
import { categoryConfig } from '../utils/presets'
import type { HabitCategory } from '../types'

const milestones = [
  { days: 7, name: '前哨站', icon: '🏕️' },
  { days: 21, name: '桥头堡', icon: '🏰' },
  { days: 60, name: '要塞', icon: '🏯' },
  { days: 100, name: '奥斯特里茨', icon: '👑' },
]

interface FrontLine {
  category: HabitCategory
  totalDays: number
}

// Animated terrain canvas background
function TerrainCanvas({ frontLines }: { frontLines: FrontLine[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const w = canvas.clientWidth
    const h = canvas.clientHeight
    canvas.width = w * dpr
    canvas.height = h * dpr
    ctx.scale(dpr, dpr)

    let frame = 0
    const totalProgress = frontLines.reduce((s, f) => s + Math.min(f.totalDays, 100), 0)
    const maxPossible = frontLines.length * 100 || 1
    const globalProgress = totalProgress / maxPossible

    function draw() {
      ctx!.clearRect(0, 0, w, h)
      frame++

      // Grid lines (strategy map feel)
      ctx!.strokeStyle = 'rgba(212, 168, 67, 0.06)'
      ctx!.lineWidth = 1
      for (let x = 0; x < w; x += 30) {
        ctx!.beginPath()
        ctx!.moveTo(x, 0)
        ctx!.lineTo(x, h)
        ctx!.stroke()
      }
      for (let y = 0; y < h; y += 30) {
        ctx!.beginPath()
        ctx!.moveTo(0, y)
        ctx!.lineTo(w, y)
        ctx!.stroke()
      }

      // Conquered territory glow (grows with progress)
      const conqueredWidth = w * globalProgress
      const gradient = ctx!.createLinearGradient(0, 0, conqueredWidth, 0)
      gradient.addColorStop(0, 'rgba(212, 168, 67, 0.08)')
      gradient.addColorStop(1, 'rgba(212, 168, 67, 0.03)')
      ctx!.fillStyle = gradient
      ctx!.fillRect(0, 0, conqueredWidth, h)

      // Frontline pulse at the edge of conquered territory
      if (globalProgress > 0 && globalProgress < 1) {
        const pulseX = conqueredWidth
        const pulseAlpha = 0.15 + 0.1 * Math.sin(frame * 0.03)
        ctx!.strokeStyle = `rgba(212, 168, 67, ${pulseAlpha})`
        ctx!.lineWidth = 2
        ctx!.setLineDash([4, 6])
        ctx!.beginPath()
        ctx!.moveTo(pulseX, 0)
        ctx!.lineTo(pulseX, h)
        ctx!.stroke()
        ctx!.setLineDash([])
      }

      // Floating particles in conquered area
      const particleCount = Math.floor(globalProgress * 12)
      for (let i = 0; i < particleCount; i++) {
        const px = ((frame * 0.3 + i * 137) % conqueredWidth)
        const py = ((Math.sin(frame * 0.01 + i * 2.1) * 0.4 + 0.5) * h)
        const size = 1.5 + Math.sin(frame * 0.02 + i) * 0.5
        const alpha = 0.3 + 0.2 * Math.sin(frame * 0.015 + i * 0.7)
        ctx!.fillStyle = `rgba(212, 168, 67, ${alpha})`
        ctx!.beginPath()
        ctx!.arc(px, py, size, 0, Math.PI * 2)
        ctx!.fill()
      }

      animRef.current = requestAnimationFrame(draw)
    }

    draw()
    return () => cancelAnimationFrame(animRef.current)
  }, [frontLines])

  return (
    <canvas
      ref={canvasRef}
      className="w-full rounded-xl border border-[var(--border)]"
      style={{ height: 120 }}
    />
  )
}

export default function CampaignMap() {
  const habits = useLiveQuery(() => db.habits.toArray()) ?? []
  const logs = useLiveQuery(() => db.dailyLogs.toArray()) ?? []

  const frontLines = useMemo(() => {
    const catMap = new Map<HabitCategory, Set<string>>()
    for (const log of logs) {
      for (const cb of log.completedBehaviors) {
        const habit = habits.find((h) => h.id === cb.behaviorId)
        if (!habit) continue
        if (!catMap.has(habit.category)) catMap.set(habit.category, new Set())
        catMap.get(habit.category)!.add(log.date)
      }
    }

    const lines: FrontLine[] = []
    for (const [category, dates] of catMap) {
      lines.push({ category, totalDays: dates.size })
    }
    for (const h of habits) {
      if (!lines.some((f) => f.category === h.category)) {
        lines.push({ category: h.category, totalDays: 0 })
      }
    }
    return lines
  }, [habits, logs])

  if (frontLines.length === 0 && habits.length === 0) {
    return (
      <div className="text-center text-[var(--text-secondary)] text-sm py-12">
        还没有行为记录，先去创建一些习惯吧
      </div>
    )
  }

  const totalDays = frontLines.reduce((s, f) => s + f.totalDays, 0)

  return (
    <div className="space-y-4">
      {/* Animated terrain overview */}
      <div className="relative">
        <TerrainCanvas frontLines={frontLines} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-2xl font-bold text-[var(--accent-gold)]">{totalDays}</p>
            <p className="text-xs text-[var(--text-secondary)]">总征程天数</p>
          </div>
        </div>
      </div>

      {/* Front lines */}
      {frontLines.map((fl) => {
        const cat = categoryConfig[fl.category]
        const nextMilestone = milestones.find((m) => m.days > fl.totalDays) ?? milestones[milestones.length - 1]
        const prevMilestone = [...milestones].reverse().find((m) => m.days <= fl.totalDays)
        const progress = Math.min(fl.totalDays / nextMilestone.days, 1)

        return (
          <div key={fl.category} className="bg-[var(--bg-card)] rounded-xl p-4 border border-[var(--border)]">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">{cat.icon}</span>
              <span className="text-sm font-medium">{cat.label}</span>
              <span className="ml-auto text-xs text-[var(--accent-gold)]">
                {fl.totalDays} 天
              </span>
            </div>

            {/* Node path */}
            <div className="relative flex items-center justify-between px-2">
              <div className="absolute left-2 right-2 h-0.5 bg-[var(--border)] top-1/2 -translate-y-1/2" />
              <motion.div
                className="absolute left-2 h-0.5 bg-[var(--accent-gold)] top-1/2 -translate-y-1/2"
                initial={{ width: 0 }}
                animate={{ width: `${progress * 100}%` }}
                transition={{ duration: 0.8 }}
              />

              {milestones.map((m) => {
                const reached = fl.totalDays >= m.days
                const isCurrent = m === nextMilestone && !reached
                return (
                  <div key={m.days} className="relative z-10 flex flex-col items-center">
                    <motion.div
                      animate={isCurrent ? { scale: [1, 1.2, 1] } : {}}
                      transition={isCurrent ? { repeat: Infinity, duration: 2 } : {}}
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm border-2 ${
                        reached
                          ? 'bg-[var(--accent-gold)] border-[var(--accent-gold)] text-[var(--bg-primary)]'
                          : 'bg-[var(--bg-secondary)] border-[var(--border)]'
                      }`}
                    >
                      {reached ? m.icon : m.days}
                    </motion.div>
                    <span className="text-[10px] text-[var(--text-secondary)] mt-1">
                      {m.name}
                    </span>
                  </div>
                )
              })}
            </div>

            {prevMilestone && (
              <p className="text-xs text-[var(--accent-green)] mt-2 text-center">
                已达成 {prevMilestone.icon} {prevMilestone.name}
              </p>
            )}
          </div>
        )
      })}
    </div>
  )
}
