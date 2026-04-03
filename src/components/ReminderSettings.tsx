import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../stores/db'
import { categoryConfig } from '../utils/presets'

export default function ReminderSettings() {
  const habits = useLiveQuery(() => db.habits.toArray()) ?? []
  const [notifPermission, setNotifPermission] = useState(
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  )

  const requestPermission = async () => {
    if (typeof Notification === 'undefined') return
    const result = await Notification.requestPermission()
    setNotifPermission(result)
  }

  const updateReminderTime = async (id: number, time: string) => {
    await db.habits.update(id, { reminderTime: time, updatedAt: Date.now() })
  }

  if (notifPermission === 'default') {
    return (
      <div className="bg-[var(--bg-card)] rounded-xl p-4 border border-[var(--border)] text-center space-y-3">
        <p className="text-sm">开启通知提醒，不错过每个锚点时刻</p>
        <p className="text-xs text-[var(--text-secondary)]">
          iOS 用户需先将 App 添加到主屏幕
        </p>
        <button
          onClick={requestPermission}
          className="px-6 py-2 rounded-lg bg-[var(--accent-gold)] text-[var(--bg-primary)] text-sm font-medium"
        >
          开启通知
        </button>
      </div>
    )
  }

  if (notifPermission === 'denied') {
    return (
      <div className="bg-[var(--bg-card)] rounded-xl p-4 border border-[var(--border)] text-center">
        <p className="text-sm text-[var(--text-secondary)]">
          通知权限已被拒绝，请在浏览器设置中开启
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-medium text-[var(--text-secondary)]">
        提醒时间设置
      </h2>
      {habits.length === 0 ? (
        <p className="text-xs text-[var(--text-secondary)]">还没有行为</p>
      ) : (
        habits.map((h) => {
          const cat = categoryConfig[h.category]
          return (
            <div
              key={h.id}
              className="bg-[var(--bg-card)] rounded-xl p-3 border border-[var(--border)] flex items-center gap-3"
            >
              <span>{cat.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate">{h.name}</p>
                <p className="text-xs text-[var(--text-secondary)] truncate">
                  {h.anchorEvent}
                </p>
              </div>
              <input
                type="time"
                value={h.reminderTime ?? ''}
                onChange={(e) => updateReminderTime(h.id!, e.target.value)}
                className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg px-2 py-1 text-sm outline-none"
              />
            </div>
          )
        })
      )}
    </div>
  )
}
