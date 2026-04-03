# Fogg Habit / 福格习惯

基于 **福格行为模型 (Fogg Behavior Model)** 的习惯养成 PWA，以策略游戏风格包装，让建立微习惯像指挥战役一样有趣。

## 核心理念

福格行为模型认为，行为的发生需要三个要素同时到位：

- **锚点 (Anchor)** — 触发新习惯的已有行为（"在我做完 X 之后..."）
- **微行为 (Tiny Behavior)** — 小到不可能失败的行动
- **庆祝 (Celebration)** — 完成后的即时正反馈

本 App 围绕这三个要素，加入"心力等级"机制，根据每天的精力状态自动调整任务难度。

## 功能一览

| 功能 | 说明 |
|------|------|
| 心力仪表盘 | 每日选择精力状态：拿破仑/行军/冬眠三档 |
| 行为设计器 | 4 步引导式表单，设计锚点、微行为、三档难度和庆祝方式 |
| 预置模板 | 论文写作、强化学习、体能维持、边界练习，一键添加 |
| 今日任务 | 根据心力状态显示对应难度，打卡带粒子庆祝动画 |
| 战役地图 | 节点进度图可视化长期进展，里程碑：前哨站 → 桥头堡 → 要塞 → 奥斯特里茨 |
| 数据复盘 | 周报、30 天趋势图、心力分布统计 |
| 智能提醒 | 基于锚点时间的通知推送，自适应难度建议 |
| 深色/浅色模式 | 设置中切换，偏好自动保存 |
| PWA 支持 | 可添加到手机主屏幕，离线可用 |

## 技术栈

- **React 19** + **TypeScript** + **Vite 8**
- **Tailwind CSS** — 样式
- **Dexie.js** — IndexedDB 数据持久化
- **Zustand** — 状态管理
- **Framer Motion** — 过渡动画
- **Canvas Confetti** — 打卡庆祝效果
- **Recharts** — 统计图表
- **React Router** — 路由

## 快速开始

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

打开 http://localhost:5173 即可使用。

## 项目结构

```
src/
├── components/     # 可复用组件
│   ├── EnergyDashboard.tsx    # 心力仪表盘
│   ├── TaskCard.tsx           # 任务卡片
│   ├── BehaviorDesigner.tsx   # 行为设计器
│   ├── PresetPicker.tsx       # 预置模板选择
│   ├── CampaignMap.tsx        # 战役地图
│   ├── StatsView.tsx          # 数据统计
│   ├── ReminderSettings.tsx   # 提醒设置
│   ├── AdaptiveSuggestions.tsx # 自适应建议
│   └── ThemeToggle.tsx        # 主题切换
├── pages/          # 页面
│   ├── HomePage.tsx           # 营地（首页）
│   ├── DesignerPage.tsx       # 行为设计器
│   ├── MapPage.tsx            # 战役地图
│   ├── StatsPage.tsx          # 数据复盘
│   └── SettingsPage.tsx       # 设置
├── stores/         # 状态管理
│   ├── db.ts                  # Dexie 数据库
│   ├── useAppStore.ts         # 全局状态
│   └── useThemeStore.ts       # 主题状态
├── types/          # TypeScript 类型
└── utils/          # 工具函数
```

## 数据存储

所有数据保存在浏览器 IndexedDB 中，无需后端服务器，隐私数据不离开设备。

## License

MIT
