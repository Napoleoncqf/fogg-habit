import { useRef } from 'react'
import { db } from '../stores/db'
import { useAppStore } from '../stores/useAppStore'

export default function DataManager() {
  const fileRef = useRef<HTMLInputElement>(null)

  const handleExport = async () => {
    const habits = await db.habits.toArray()
    const dailyLogs = await db.dailyLogs.toArray()
    const data = { version: 1, exportedAt: new Date().toISOString(), habits, dailyLogs }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `fogg-habit-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const text = await file.text()
      const data = JSON.parse(text)
      if (!data.habits || !data.dailyLogs) {
        alert('文件格式不正确')
        return
      }
      if (!confirm('导入将覆盖当前所有数据，确定继续？')) return

      await db.transaction('rw', db.habits, db.dailyLogs, async () => {
        await db.habits.clear()
        await db.dailyLogs.clear()
        // Remove IDs to let auto-increment assign new ones
        for (const h of data.habits) {
          delete h.id
          if (h.sortOrder === undefined) h.sortOrder = 0
          await db.habits.add(h)
        }
        for (const l of data.dailyLogs) {
          delete l.id
          await db.dailyLogs.add(l)
        }
      })

      // Re-init store
      useAppStore.setState({ initialized: false })
      await useAppStore.getState().init()
      alert('导入成功！')
    } catch {
      alert('导入失败，请检查文件格式')
    }
    // Reset file input
    if (fileRef.current) fileRef.current.value = ''
  }

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-medium text-[var(--text-secondary)]">数据管理</h2>
      <div className="flex gap-2">
        <button
          onClick={handleExport}
          className="flex-1 py-2.5 rounded-lg bg-[var(--accent-gold)] text-[var(--bg-primary)] font-medium text-sm"
        >
          导出数据
        </button>
        <button
          onClick={() => fileRef.current?.click()}
          className="flex-1 py-2.5 rounded-lg border border-[var(--accent-gold)] text-[var(--accent-gold)] font-medium text-sm"
        >
          导入数据
        </button>
      </div>
      <input ref={fileRef} type="file" accept=".json" onChange={handleImport} className="hidden" />
      <p className="text-xs text-[var(--text-secondary)]">
        导出为 JSON 文件，可用于备份或迁移到其他设备
      </p>
    </div>
  )
}
