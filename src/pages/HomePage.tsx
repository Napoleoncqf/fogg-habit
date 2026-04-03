import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAppStore } from '../stores/useAppStore'
import EnergyDashboard from '../components/EnergyDashboard'
import TaskCard from '../components/TaskCard'
import AdaptiveSuggestions from '../components/AdaptiveSuggestions'
import DailyQuote from '../components/DailyQuote'
import { scheduleNotifications } from '../utils/notifications'

export default function HomePage() {
  const { habits, todayEnergy, initialized, init } = useAppStore()

  useEffect(() => {
    init()
  }, [init])

  // Re-schedule notifications when energy or habits change
  useEffect(() => {
    if (initialized) scheduleNotifications()
  }, [initialized, todayEnergy, habits.length])

  if (!initialized) {
    return <div className="p-4 text-center text-[var(--text-secondary)]">加载中...</div>
  }

  const completedCount = habits.filter((h) =>
    useAppStore.getState().isBehaviorCompletedToday(h.id!)
  ).length

  return (
    <div>
      <div className="p-4 pb-2">
        <h1 className="text-2xl font-bold text-[var(--accent-gold)]">
          福格习惯
        </h1>
        <p className="text-[var(--text-secondary)] text-xs">
          你的行为战略指挥部
        </p>
      </div>

      <DailyQuote />
      <EnergyDashboard />

      <div className="px-4 pb-4 space-y-3">
        <AdaptiveSuggestions />

        {!todayEnergy && habits.length > 0 && (
          <p className="text-sm text-[var(--accent-amber)] text-center">
            先选择今日心力状态 ↑
          </p>
        )}

        {habits.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-[var(--text-secondary)] text-sm mb-4">
              还没有行为，去创建你的第一个习惯
            </p>
            <Link
              to="/designer"
              className="inline-block px-6 py-2.5 rounded-lg bg-[var(--accent-gold)] text-[var(--bg-primary)] font-medium text-sm"
            >
              开始设计
            </Link>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium text-[var(--text-secondary)]">
                今日任务
              </h2>
              <span className="text-xs text-[var(--accent-gold)]">
                {completedCount}/{habits.length} 已完成
              </span>
            </div>
            {habits.map((h) => (
              <TaskCard key={h.id} habit={h} />
            ))}
          </>
        )}
      </div>
    </div>
  )
}
