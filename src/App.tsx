import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'

const HomePage = lazy(() => import('./pages/HomePage'))
const DesignerPage = lazy(() => import('./pages/DesignerPage'))
const MapPage = lazy(() => import('./pages/MapPage'))
const StatsPage = lazy(() => import('./pages/StatsPage'))
const SettingsPage = lazy(() => import('./pages/SettingsPage'))

const navItems = [
  { to: '/', label: '营地', icon: '⚔️' },
  { to: '/designer', label: '设计', icon: '🛠️' },
  { to: '/map', label: '战局', icon: '🗺️' },
  { to: '/stats', label: '复盘', icon: '📊' },
  { to: '/settings', label: '设置', icon: '⚙️' },
]

function Loading() {
  return <div className="p-4 text-center text-[var(--text-secondary)] text-sm">加载中...</div>
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-svh">
        <main className="flex-1 pb-16">
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/designer" element={<DesignerPage />} />
              <Route path="/map" element={<MapPage />} />
              <Route path="/stats" element={<StatsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </Suspense>
        </main>

        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-[var(--bg-secondary)] border-t border-[var(--border)] flex justify-around py-2 z-50">
          {navItems.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 px-2 py-1 text-xs transition-colors ${
                  isActive
                    ? 'text-[var(--accent-gold)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`
              }
            >
              <span className="text-base">{icon}</span>
              <span className="text-[10px]">{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </BrowserRouter>
  )
}
