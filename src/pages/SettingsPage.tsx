import { useEffect } from 'react'
import { useAppStore } from '../stores/useAppStore'
import ReminderSettings from '../components/ReminderSettings'
import ThemeToggle from '../components/ThemeToggle'
import DataManager from '../components/DataManager'

export default function SettingsPage() {
  const { init } = useAppStore()

  useEffect(() => {
    init()
  }, [init])

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-[var(--accent-gold)] mb-2">
        设置
      </h1>
      <p className="text-[var(--text-secondary)] text-xs mb-4">
        提醒与偏好
      </p>

      <div className="space-y-6">
        <ThemeToggle />
        <ReminderSettings />
        <DataManager />
      </div>
    </div>
  )
}
