import { useMemo } from 'react'
import { motion } from 'framer-motion'

const quotes = [
  { text: '微小的行动胜过宏大的计划', author: 'BJ Fogg' },
  { text: '先求存在，再求完美', author: '福格行为模型' },
  { text: '不是靠意志力，而是靠设计', author: 'BJ Fogg' },
  { text: '庆祝是习惯的肥料', author: 'BJ Fogg' },
  { text: '从你已经在做的事情出发', author: '锚点原则' },
  { text: '一次战役的胜利始于第一步行军', author: '拿破仑' },
  { text: '胜利属于最有毅力的人', author: '拿破仑' },
  { text: '不想当将军的士兵不是好士兵', author: '拿破仑' },
  { text: '环境比意志更能塑造行为', author: '行为设计学' },
  { text: '让它简单到无法拒绝', author: '微习惯原则' },
  { text: '进步不在于速度，而在于方向', author: '' },
  { text: '每一天都是新的战役', author: '' },
  { text: '坚持的秘诀是让开始变得容易', author: 'BJ Fogg' },
  { text: '行为发生在动机、能力和提示交汇时', author: 'BJ Fogg' },
]

export default function DailyQuote() {
  const quote = useMemo(() => {
    const day = Math.floor(Date.now() / 86400000)
    return quotes[day % quotes.length]
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="mx-4 mb-2 px-4 py-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] text-center"
    >
      <p className="text-sm italic text-[var(--text-primary)]">"{quote.text}"</p>
      {quote.author && (
        <p className="text-xs text-[var(--text-secondary)] mt-1">— {quote.author}</p>
      )}
    </motion.div>
  )
}
