import { useMemo } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
} from 'recharts'
import { db } from '../stores/db'
import { energyConfig } from '../utils/presets'
import type { EnergyLevel } from '../types'

function getLast7Days(): string[] {
  const days: string[] = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    days.push(d.toISOString().slice(0, 10))
  }
  return days
}

function getLast30Days(): string[] {
  const days: string[] = []
  for (let i = 29; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    days.push(d.toISOString().slice(0, 10))
  }
  return days
}

export default function StatsView() {
  const logs = useLiveQuery(() => db.dailyLogs.toArray()) ?? []
  const habits = useLiveQuery(() => db.habits.toArray()) ?? []

  const last7 = useMemo(() => getLast7Days(), [])
  const last30 = useMemo(() => getLast30Days(), [])

  const logMap = useMemo(() => {
    const m = new Map<string, (typeof logs)[0]>()
    for (const l of logs) m.set(l.date, l)
    return m
  }, [logs])

  // Weekly completion data
  const weeklyData = last7.map((date) => {
    const log = logMap.get(date)
    const completed = log?.completedBehaviors.length ?? 0
    const total = habits.length || 1
    return {
      day: date.slice(5), // MM-DD
      rate: Math.round((completed / total) * 100),
      energy: log?.energyLevel ?? null,
    }
  })

  // 30-day trend
  const trendData = last30.map((date) => {
    const log = logMap.get(date)
    const completed = log?.completedBehaviors.length ?? 0
    const total = habits.length || 1
    return {
      day: date.slice(5),
      rate: Math.round((completed / total) * 100),
    }
  })

  // Energy distribution this week
  const energyCounts: Record<EnergyLevel, number> = { napoleon: 0, march: 0, hibernate: 0 }
  for (const date of last7) {
    const log = logMap.get(date)
    if (log?.energyLevel) energyCounts[log.energyLevel]++
  }

  // Best streak
  const bestStreak = habits.reduce((max, h) => Math.max(max, h.currentStreak), 0)

  // Summary
  const weekTotal = weeklyData.reduce((s, d) => s + d.rate, 0)
  const weekAvg = Math.round(weekTotal / 7)

  const milestoneLabels: Record<number, string> = { 7: '前哨站', 21: '桥头堡', 60: '要塞', 100: '奥斯特里茨' }
  const nextMilestoneDay = [7, 21, 60, 100].find((d) => d > bestStreak) ?? 100

  if (habits.length === 0) {
    return (
      <div className="text-center text-[var(--text-secondary)] text-sm py-12">
        还没有数据，先去创建习惯并打卡吧
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-[var(--bg-card)] rounded-xl p-3 text-center border border-[var(--border)]">
          <p className="text-xl font-bold text-[var(--accent-gold)]">{weekAvg}%</p>
          <p className="text-[10px] text-[var(--text-secondary)]">本周平均</p>
        </div>
        <div className="bg-[var(--bg-card)] rounded-xl p-3 text-center border border-[var(--border)]">
          <p className="text-xl font-bold text-[var(--accent-amber)]">🔥{bestStreak}</p>
          <p className="text-[10px] text-[var(--text-secondary)]">最长连续</p>
        </div>
        <div className="bg-[var(--bg-card)] rounded-xl p-3 text-center border border-[var(--border)]">
          <p className="text-xl font-bold text-[var(--accent-green)]">{habits.length}</p>
          <p className="text-[10px] text-[var(--text-secondary)]">行为数</p>
        </div>
      </div>

      {/* Next milestone */}
      {bestStreak > 0 && (
        <div className="bg-[var(--bg-card)] rounded-xl p-3 border border-[var(--border)] text-center text-sm">
          距离 <span className="text-[var(--accent-gold)] font-medium">{milestoneLabels[nextMilestoneDay]}</span>
          还需 <span className="text-[var(--accent-amber)]">{nextMilestoneDay - bestStreak}</span> 天
        </div>
      )}

      {/* Energy this week */}
      <div className="bg-[var(--bg-card)] rounded-xl p-4 border border-[var(--border)]">
        <h3 className="text-sm font-medium mb-3">本周心力分布</h3>
        <div className="flex justify-around">
          {(Object.entries(energyCounts) as [EnergyLevel, number][]).map(([level, count]) => (
            <div key={level} className="text-center">
              <span className="text-lg">{energyConfig[level].icon}</span>
              <p className="text-sm font-bold">{count}天</p>
              <p className="text-[10px] text-[var(--text-secondary)]">{energyConfig[level].label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly bar chart */}
      <div className="bg-[var(--bg-card)] rounded-xl p-4 border border-[var(--border)]">
        <h3 className="text-sm font-medium mb-3">本周完成率</h3>
        <ResponsiveContainer width="100%" height={140}>
          <BarChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="day" tick={{ fontSize: 10, fill: 'var(--text-secondary)' }} />
            <YAxis tick={{ fontSize: 10, fill: 'var(--text-secondary)' }} domain={[0, 100]} />
            <Bar dataKey="rate" fill="var(--accent-gold)" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 30-day trend */}
      <div className="bg-[var(--bg-card)] rounded-xl p-4 border border-[var(--border)]">
        <h3 className="text-sm font-medium mb-3">30 天趋势</h3>
        <ResponsiveContainer width="100%" height={140}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="day" tick={{ fontSize: 10, fill: 'var(--text-secondary)' }} interval={4} />
            <YAxis tick={{ fontSize: 10, fill: 'var(--text-secondary)' }} domain={[0, 100]} />
            <Line type="monotone" dataKey="rate" stroke="var(--accent-amber)" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
