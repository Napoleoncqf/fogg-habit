import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { checkAdaptiveSuggestions } from '../utils/notifications'

export default function AdaptiveSuggestions() {
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [dismissed, setDismissed] = useState<Set<number>>(new Set())

  useEffect(() => {
    checkAdaptiveSuggestions().then(setSuggestions)
  }, [])

  const visible = suggestions.filter((_, i) => !dismissed.has(i))
  if (visible.length === 0) return null

  return (
    <div className="space-y-2 mb-4">
      <AnimatePresence>
        {suggestions.map((s, i) =>
          dismissed.has(i) ? null : (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-[var(--bg-card)] border border-[var(--accent-amber)]/30 rounded-lg p-3 flex items-start gap-2"
            >
              <span className="text-sm">💡</span>
              <p className="flex-1 text-xs text-[var(--text-secondary)]">{s}</p>
              <button
                onClick={() => setDismissed((prev) => new Set(prev).add(i))}
                className="text-xs text-[var(--text-secondary)] shrink-0"
              >
                ✕
              </button>
            </motion.div>
          )
        )}
      </AnimatePresence>
    </div>
  )
}
