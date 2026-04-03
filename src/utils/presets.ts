import type { HabitBehavior, HabitCategory } from '../types'

interface PresetTemplate {
  name: string
  description: string
  category: HabitCategory
  anchorEvent: string
  tinyBehavior: string
  celebration: string
  difficultyLevels: { hibernate: string; march: string; napoleon: string }
}

export const presetTemplates: PresetTemplate[] = [
  {
    name: '论文写作',
    description: '每天推进论文一小步',
    category: 'thesis',
    anchorEvent: '到单位打开电脑后',
    tinyBehavior: '打开论文文档',
    celebration: '对自己说"推进了一步"',
    difficultyLevels: {
      hibernate: '打开论文文档，读上次写的最后一段',
      march: '写 200 字',
      napoleon: '写 30 分钟',
    },
  },
  {
    name: '强化学习',
    description: '持续学习 RL 知识',
    category: 'learning',
    anchorEvent: '晚上到家吃完饭后',
    tinyBehavior: '打开学习笔记',
    celebration: '在笔记里写一句今天学到的',
    difficultyLevels: {
      hibernate: '打开学习笔记，看 5 分钟',
      march: '读一篇论文或教程的一个章节',
      napoleon: '写代码实现一个小功能',
    },
  },
  {
    name: '体能维持',
    description: '保持身体活力',
    category: 'fitness',
    anchorEvent: '早上起床后',
    tinyBehavior: '做 10 个深蹲',
    celebration: '看一下体重记录的趋势',
    difficultyLevels: {
      hibernate: '做 10 个深蹲',
      march: '跑步 20 分钟',
      napoleon: '完整训练 45 分钟',
    },
  },
  {
    name: '边界练习',
    description: '学会说不',
    category: 'boundary',
    anchorEvent: '遇到不合理要求时',
    tinyBehavior: '在心里默念"这不是我的责任"',
    celebration: '记录下来，告诉自己"做得好"',
    difficultyLevels: {
      hibernate: '在心里默念"这不是我的责任"',
      march: '说"我需要考虑一下"来争取时间',
      napoleon: '直接清晰地拒绝',
    },
  },
]

export function createHabitFromPreset(preset: PresetTemplate, sortOrder: number): Omit<HabitBehavior, 'id'> {
  const now = Date.now()
  return {
    ...preset,
    currentStreak: 0,
    sortOrder,
    createdAt: now,
    updatedAt: now,
  }
}

export const categoryConfig: Record<HabitCategory, { label: string; icon: string }> = {
  thesis: { label: '论文写作', icon: '📝' },
  learning: { label: '强化学习', icon: '🤖' },
  fitness: { label: '体能维持', icon: '💪' },
  boundary: { label: '边界练习', icon: '🛡️' },
  custom: { label: '自定义', icon: '✨' },
}

export const energyConfig = {
  napoleon: { label: '拿破仑模式', icon: '🔥', desc: '今天精力充沛，可以打硬仗', color: 'var(--accent-red)' },
  march: { label: '行军模式', icon: '⚔️', desc: '状态一般，稳步推进', color: 'var(--accent-amber)' },
  hibernate: { label: '冬眠模式', icon: '🌙', desc: '今天很累，只做最小行动', color: 'var(--accent-blue)' },
} as const
