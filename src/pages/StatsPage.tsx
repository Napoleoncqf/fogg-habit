import { useEffect } from 'react'
import { useAppStore } from '../stores/useAppStore'
import StatsView from '../components/StatsView'

export default function StatsPage() {
  const { init } = useAppStore()

  useEffect(() => {
    init()
  }, [init])

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-[var(--accent-gold)] mb-2">
        数据复盘
      </h1>
      <p className="text-[var(--text-secondary)] text-xs mb-4">
        回顾与洞察
      </p>
      <StatsView />
    </div>
  )
}
