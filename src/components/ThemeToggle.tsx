import { useThemeStore } from '../stores/useThemeStore'

export default function ThemeToggle() {
  const { theme, setTheme } = useThemeStore()

  return (
    <div className="bg-[var(--bg-card)] rounded-xl p-4 border border-[var(--border)] flex items-center justify-between">
      <div>
        <p className="text-sm font-medium">外观模式</p>
        <p className="text-xs text-[var(--text-secondary)]">
          {theme === 'dark' ? '深色模式' : '浅色模式'}
        </p>
      </div>
      <button
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="w-14 h-8 rounded-full relative transition-colors"
        style={{ background: theme === 'dark' ? 'var(--accent-gold)' : 'var(--border)' }}
      >
        <span
          className="absolute top-1 w-6 h-6 rounded-full bg-white shadow transition-all flex items-center justify-center text-sm"
          style={{ left: theme === 'dark' ? '30px' : '4px' }}
        >
          {theme === 'dark' ? '🌙' : '☀️'}
        </span>
      </button>
    </div>
  )
}
