import { create } from 'zustand'

type Theme = 'light' | 'dark'

interface ThemeState {
  theme: Theme
  setTheme: (t: Theme) => void
  initTheme: () => void
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: 'dark',

  setTheme: (t) => {
    localStorage.setItem('fogg-theme', t)
    applyTheme(t)
    set({ theme: t })
  },

  initTheme: () => {
    const saved = localStorage.getItem('fogg-theme') as Theme | null
    const theme = saved ?? 'dark'
    applyTheme(theme)
    set({ theme })
  },
}))

function applyTheme(t: Theme) {
  document.documentElement.classList.toggle('dark', t === 'dark')
}
