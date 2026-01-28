# AI Prompt Marketplace - Brainstorming Session 🧠

> 使用 brainstorming 技能讨论 Next.js 前端需求

**项目**: AI Prompt Marketplace  
**阶段**: 前端开发  
**技能**: brainstorming  
**日期**: 2026-01-28

---

## 🎯 讨论目标

明确 Next.js 前端需求，包括：
1. 页面结构和路由
2. 组件设计
3. 状态管理方案
4. 样式和主题
5. 性能优化考虑

---

## 📋 需求澄清

### 页面结构

**jack happy 的需求**：
- 用户应该能看到什么页面？
- 页面之间如何导航？
- 需要多少个主要页面？

**建议页面**：
1. **首页** (`/`) - 热门提示词展示
2. **分类浏览** (`/categories`) - 按类型浏览
3. **搜索页面** (`/search`) - 搜索和过滤
4. **提示词列表** (`/prompts`) - 所有提示词
5. **提示词详情** (`/prompts/[id]`) - 完整内容
6. **套餐页面** (`/packages`) - 套餐浏览
7. **我的提示词** (`/my-prompts`) - 收藏和购买
8. **用户仪表板** (`/dashboard`) - 用户信息
9. **关于** (`/about`) - 项目介绍
10. **定价** (`/pricing`) - 套餐和定价

**jack happy 的问题**：
- 你需要所有这些页面吗？
- 哪些页面是最重要的？
- 可以从 MVP（最小可行产品）开始吗？

---

### 组件设计

**核心组件**：
- **PromptCard** - 提示词卡片展示
- **PackageCard** - 套餐卡片
- **SearchBar** - 搜索和过滤
- **CategoryList** - 分类列表
- **PromptDetail** - 完整提示词详情
- **PurchaseModal** - 购买模态框
- **SubscriptionModal** - 订阅模态框
- **UserDropdown** - 用户下拉菜单
- **DarkModeToggle** - 深色模式切换

**jack happy 的问题**：
- 你有特定的 UI 设计偏好吗？
- 你喜欢什么样的卡片样式？
- 需要动画效果吗？

---

### 状态管理方案

**方案选项**：

#### 选项 1: Zustand（推荐）
```typescript
// 简单、轻量、TypeScript 友好
interface AppState {
  prompts: Prompt[]
  packages: Package[]
  user: User | null
  cart: CartItem[]
  filters: Filters
  searchQuery: string
}
```

**优点**：
- ✅ 轻量（1.4KB）
- ✅ 简单的 API
- ✅ TypeScript 类型安全
- ✅ 支持 DevTools

#### 选项 2: Redux Toolkit
```typescript
// 功能强大、生态系统完善
interface AppState {
  prompts: PromptsState
  packages: PackagesState
  user: UserState
  ui: UIState
}
```

**优点**：
- ✅ 功能强大
- ✅ 大型项目支持
- ✅ 丰富的中间件
- ✅ 优秀的 DevTools

**缺点**：
- ⚠️ 文件较多
- ⚠️ 配置较复杂

**jack happy 的决定**：
- 你想要简单的项目？→ 用 Zustand
- 你想要功能完整的项目？→ 用 Redux Toolkit

---

### 样式和主题

**Tailwind CSS 配置**：
```javascript
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#3b82f6',
          dark: '#60a5fa',
        },
        secondary: {
          light: '#8b5cf6',
          dark: '#a78bfa',
        },
        accent: {
          light: '#10b981',
          dark: '#34d399',
        },
        background: {
          light: '#ffffff',
          dark: '#0f172a',
        },
        foreground: {
          light: '#1e293b',
          dark: '#f8fafc',
        },
        muted: {
          light: '#64748b',
          dark: '#94a3b8',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
  darkMode: 'class',
}
```

**深色模式实现**：
- ✅ 使用 `darkMode: 'class'`
- ✅ 支持 Tailwind 的 `dark:` 修饰符
- ✅ 系统级深色模式支持

**jack happy 的问题**：
- 你有特定的颜色偏好吗？
- 你想要什么样的主题风格？（现代、专业、活泼等）
- 你需要浅色和深色两种模式吗？

---

### 性能优化考虑

**优化策略**：

#### 1. 代码分割和懒加载
```typescript
// Next.js App Router 自动代码分割
// 只在需要时加载页面组件

// 动态导入 heavy 组件
const HeavyComponent = dynamic(
  () => import('./components/HeavyComponent'),
  { ssr: false, loading: () => <Skeleton /> }
);
```

#### 2. 图片优化
```typescript
// 使用 Next.js Image 组件
import Image from 'next/image'

<Image
  src={prompt.image}
  alt={prompt.title}
  width={800}
  height={600}
  loading="lazy"
  placeholder="blur"
/>
```

#### 3. 数据获取优化
```typescript
// 使用 React Query 进行数据缓存
import { useQuery } from '@tanstack/react-query'

function Prompts() {
  const { data, isLoading } = useQuery({
    queryKey: ['prompts'],
    queryFn: fetchPrompts,
    staleTime: 5 * 60 * 1000, // 5 分钟
    cacheTime: 10 * 60 * 1000, // 10 分钟
  });

  // ...
}
```

#### 4. 虚拟化长列表
```typescript
// 对于大量提示词，使用虚拟化
import { useVirtualizer } from '@tanstack/react-virtual'

function VirtualizedPromptList({ prompts }) {
  const parentRef = useRef(null);

  const virtualizer = useVirtualizer({
    count: prompts.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100, // 估算每项高度
    overscan: 5,
  });

  // ...
}
```

**jack happy 的问题**：
- 预计会有多少个提示词？（影响虚拟化策略）
- 你对加载速度有要求吗？（2s, 1s, < 1s）

---

## 🎨 设计建议

### 首页设计

**布局建议**：
```
┌─────────────────────────────────┐
│  🔍 搜索...  🔐 登录          │
├─────────────────────────────────┤
│  🏷️ 分类: [全部 ▼] [热门 ▼]  │
├─────────────────────────────────┤
│  🔥 热门提示词 (A+ 精品）      │
│  ┌─────┬─────┬─────┬─────┐  │
│  │ 提示│ 提示│ 提示│ 提示│  │
│  │  1  │  2  │  3  │  4  │  │
│  └─────┴─────┴─────┴─────┘  │
│  ┌─────┬─────┬─────┬─────┐  │
│  │ 提示│ 提示│ 提示│ 提示│  │
│  │  5  │  6  │  7  │  8  │  │
│  └─────┴─────┴─────┴─────┘  │
├─────────────────────────────────┤
│  📚 最新发布                    │
│  ┌─────┬─────┬─────┬─────┐  │
│  │ 提示│ 提示│ 提示│ 提示│  │
│  │  9  │ 10 │ 11 │ 12 │  │
│  └─────┴─────┴─────┴─────┘  │
└─────────────────────────────────┘
```

**元素**：
- 搜索栏（顶部，居中）
- 分类过滤（横向滚动）
- 热门提示词（2x2 网格）
- 最新发布（2x2 网格）
- 评分标签（A+, A, B+ 等）

### 提示词卡片设计

**布局建议**：
```
┌─────────────────────────────────┐
│  [🏷️ 写作]   [🌟 A+ - 9.2分]  │
├─────────────────────────────────┤
│  📝 提示词标题               │
│  优秀的 ChatGPT 写作提示词，   │
│  包含 3 种不同风格...         │
├─────────────────────────────────┤
│  👨‍💻 作者: @promptMaster      │
│  📅 发布: 2 天前               │
│  ❤️ 2.5k | 🔄 500 | 💬 100     │
├─────────────────────────────────┤
│  📊 使用场景:                  │
│  ┌─────────────────────────┐  │
│  │ 1. 写博客文章         │  │
│  │ 2. 撰写营销文案       │  │
│  │ 3. 创建邮件内容       │  │
│  └─────────────────────────┘  │
├─────────────────────────────────┤
│  [👀 预览] [💰 购买 $1.99]     │
└─────────────────────────────────┘
```

**元素**：
- 分类标签（彩色图标）
- 评分徽章（A+, A, B+ 等）
- 提示词标题（加粗）
- 描述（截断，省略号）
- 作者信息（用户名 + 头像）
- 发布时间（相对时间）
- 互动数据（爱心、转发、评论）
- 使用场景（列表）
- 预览和购买按钮

### 搜索和过滤页面

**布局建议**：
```
┌─────────────────────────────────┐
│  🔍 搜索...                   │
├─────────────────────────────────┤
│  🔽 过滤器:                    │
│  ┌─────────────────────────┐  │
│  │ 分类: [全部 ▼]       │  │
│  │   [✓ 写作]           │  │
│  │   [✓ 编程]           │  │
│  │   [✓ 营销]           │  │
│  │   [✓ 设计]           │  │
│  │   [✓ 分析]           │  │
│  └─────────────────────────┘  │
│  ┌─────────────────────────┐  │
│  │ 难度: [全部 ▼]       │  │
│  │   [✓ 初级]           │  │
│  │   [✓ 中级]           │  │
│  │   [✓ 高级]           │  │
│  └─────────────────────────┘  │
│  ┌─────────────────────────┐  │
│  │ 模型: [全部 ▼]       │  │
│  │   [✓ ChatGPT]        │  │
│  │   [✓ Claude]         │  │
│  │   [✓ Gemini]         │  │
│  │   [✓ Midjourney]      │  │
│  └─────────────────────────┘  │
│  ┌─────────────────────────┐  │
│  │ 价格: [全部 ▼]       │  │
│  │   [✓ 免费]           │  │
│  │   [✓ 基础 $0.99]    │  │
│  │   [✓ 标准 $1.99]    │  │
│  │   [✓ 高级 $2.99]    │  │
│  └─────────────────────────┘  │
│  ┌─────────────────────────┐  │
│  │ 排序: [热门 ▼]       │  │
│  │   [🔥 热门]          │  │
│  │   [📅 最新]          │  │
│  │   [⭐ 评分]          │  │
│  │   [👀 作者]          │  │
│  └─────────────────────────┘  │
└─────────────────────────────────┘
```

**元素**：
- 全文搜索输入框
- 分类过滤器（多选）
- 难度过滤器（单选）
- 模型过滤器（多选）
- 价格过滤器（区间或选项）
- 排序选项（热门、最新、评分、作者）

---

## 🚀 下一步

### 选项 1: 继续 brainstorming

**jack happy 的问题**：
- 你对上述设计有反馈吗？
- 你有其他的想法或需求吗？
- 你想调整某些部分吗？

### 选项 2: 直接进入 writing-plans

**如果我们对设计达成共识**：
- 我会使用 writing-plans 技能制定详细的实施计划
- 包括所有技术细节
- 包括任务分解和时间估算

### 选项 3: 直接开始开发

**如果我们已经明确所有需求**：
- 我会使用 test-driven-development 技能开始开发
- 直接创建 Next.js 项目
- 实现核心功能和页面

---

## 📋 决策清单

**jack happy 的决策**：

- [ ] 页面结构：确认/需要调整
- [ ] 组件设计：确认/需要调整
- [ ] 状态管理：Zustand / Redux Toolkit / 其他
- [ ] 样式主题：现代 / 专业 / 活泼 / 其他
- [ ] 深色模式：是/否
- [ ] 性能要求：2s / 1s / < 1s

**下一步选择**：
- [ ] 继续 brainstorming（讨论更多细节）
- [ ] 进入 writing-plans（制定详细计划）
- [ ] 开始开发（使用 test-driven-development）

---

**请告诉我你的决策！** 🎯

（确认后，我会立即使用相应的技能继续工作！）
