# 福格习惯 (Fogg Habit) — 项目规范

## 技术栈
- React 18 + TypeScript + Vite 8
- Tailwind CSS (via @tailwindcss/vite)
- Dexie.js (IndexedDB)
- Zustand (状态管理)
- Framer Motion (动画)
- Canvas Confetti (庆祝效果)
- Recharts (图表)
- React Router DOM (路由)

## 设计规范
- **主题**：深色策略游戏风格（全面战争/文明系列）
- **配色**：深色背景 (#0f1117)，琥珀金高亮 (#d4a843)
- **语言**：全中文界面
- **目标设备**：手机优先 (max-width: 480px)，PWA 可添加到主屏幕

## 目录结构
- `src/components/` — 可复用组件
- `src/pages/` — 页面组件（对应路由）
- `src/stores/` — Zustand store + Dexie 数据库
- `src/types/` — TypeScript 类型定义
- `src/utils/` — 工具函数

## 核心概念（福格行为模型）
- **锚点行为** (Anchor): 触发新习惯的已有行为
- **微行为** (Tiny Behavior): 小到不可能失败的行动
- **庆祝** (Celebration): 完成后的即时正反馈
- **心力等级**: napoleon(拿破仑) / march(行军) / hibernate(冬眠) 三档
