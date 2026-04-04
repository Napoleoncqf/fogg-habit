# Fogg Habit / 福格习惯

基于 **福格行为模型 (Fogg Behavior Model)** 的习惯养成应用，以策略游戏风格包装，让建立微习惯像指挥战役一样有趣。

支持 **Web / PWA / Android APK** 三种使用方式。

**在线体验**: https://napoleoncqf.github.io/fogg-habit/

## 核心理念

福格行为模型认为，行为的发生需要三个要素同时到位：

- **锚点 (Anchor)** — 触发新习惯的已有行为（"在我做完 X 之后..."）
- **微行为 (Tiny Behavior)** — 小到不可能失败的行动
- **庆祝 (Celebration)** — 完成后的即时正反馈

本 App 加入**心力等级**机制，根据每天的精力状态自动调整任务难度：

| 状态 | 含义 | 示例 |
|------|------|------|
| 🔥 拿破仑模式 | 精力充沛，打硬仗 | 写论文 30 分钟 |
| ⚔️ 行军模式 | 状态一般，稳步推进 | 写 200 字 |
| 🌙 冬眠模式 | 很累，只做最小行动 | 打开论文文档 |

## 功能一览

| 功能 | 说明 |
|------|------|
| 心力仪表盘 | 每日选择精力状态，任务难度自动匹配 |
| 行为设计器 | 4 步引导式表单：分类 → 锚点 → 三档难度 → 庆祝方式 |
| 预置模板 | 论文写作、强化学习、体能维持、边界练习，一键添加 |
| 今日任务 | 打卡带粒子庆祝动画，连续天数追踪（断裂自动归零） |
| 行为编辑 | 随时修改已有行为的所有字段 |
| 拖拽排序 | 长按拖拽调整行为顺序 |
| 战役地图 | Canvas 动画地图 + 节点进度图，里程碑：前哨站 → 桥头堡 → 要塞 → 奥斯特里茨 |
| 数据复盘 | 周报柱状图、30 天趋势线、心力分布、里程碑进度 |
| 智能提醒 | 基于锚点时间的通知推送，自适应难度升降建议 |
| 每日激励 | 首页展示福格/拿破仑语录，每天轮换 |
| 深色/浅色模式 | 设置中一键切换，偏好自动保存 |
| 数据导入/导出 | JSON 备份，支持跨设备迁移 |
| PWA 支持 | 可添加到手机主屏幕，离线可用 |
| Android APK | Capacitor 打包，GitHub Actions 自动构建 |

## 使用方式

### 方式一：在线访问（推荐）

打开 https://napoleoncqf.github.io/fogg-habit/ ，手机浏览器可"添加到主屏幕"当原生应用使用。

### 方式二：Android APK

前往 [GitHub Actions](https://github.com/Napoleoncqf/fogg-habit/actions/workflows/build-apk.yml)，点击最新一次成功的构建，下载 `fogg-habit-debug` artifact 中的 APK 文件安装。

### 方式三：本地开发

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建 Web 版本（部署到 GitHub Pages）
npm run build

# 构建 APK 版本（base=/ + Capacitor sync）
npm run build:apk
```

## 技术栈

| 层面 | 技术 |
|------|------|
| 框架 | React 19 + TypeScript |
| 构建 | Vite 8，路由级 Code Splitting |
| 样式 | Tailwind CSS |
| 持久化 | Dexie.js (IndexedDB)，数据不离开设备 |
| 状态管理 | Zustand |
| 动画 | Framer Motion + Canvas (战役地图) |
| 庆祝效果 | Canvas Confetti |
| 图表 | Recharts |
| 路由 | React Router (HashRouter) |
| 原生打包 | Capacitor (Android) |
| CI/CD | GitHub Actions → Pages 部署 + APK 构建 |

## 项目结构

```
fogg-habit/
├── src/
│   ├── components/          # UI 组件
│   │   ├── EnergyDashboard  # 心力仪表盘
│   │   ├── TaskCard         # 任务卡片 + 打卡
│   │   ├── BehaviorDesigner # 行为创建向导
│   │   ├── BehaviorEditor   # 行为编辑
│   │   ├── PresetPicker     # 预置模板
│   │   ├── CampaignMap      # 战役地图 (Canvas)
│   │   ├── StatsView        # 统计图表
│   │   ├── DailyQuote       # 每日激励
│   │   ├── AdaptiveSuggestions # 智能建议
│   │   ├── ReminderSettings # 提醒设置
│   │   ├── ThemeToggle      # 主题切换
│   │   └── DataManager      # 导入/导出
│   ├── pages/               # 5 个页面路由
│   ├── stores/              # Zustand + Dexie
│   ├── types/               # TypeScript 类型
│   └── utils/               # 工具函数
├── android/                 # Capacitor Android 项目
├── .github/workflows/       # CI/CD
│   ├── deploy.yml           # GitHub Pages 自动部署
│   └── build-apk.yml        # APK 自动构建
└── public/                  # 静态资源 + PWA manifest
```

## 数据模型

```typescript
// 行为设计
HabitBehavior {
  name, category, anchorEvent,      // 基本信息
  difficultyLevels: {               // 三档难度
    hibernate, march, napoleon
  },
  celebration,                       // 庆祝方式
  currentStreak, lastCompletedDate,  // 连续天数
  sortOrder, reminderTime            // 排序与提醒
}

// 每日记录
DailyLog {
  date, energyLevel,                 // 日期与心力
  completedBehaviors[]               // 完成的行为列表
}
```

## 里程碑系统

| 天数 | 称号 | 含义 |
|------|------|------|
| 7 天 | 🏕️ 前哨站 | 习惯萌芽 |
| 21 天 | 🏰 桥头堡 | 初步建立 |
| 60 天 | 🏯 要塞 | 稳固扎根 |
| 100 天 | 👑 奥斯特里茨 | 决定性胜利 |

## License

MIT
