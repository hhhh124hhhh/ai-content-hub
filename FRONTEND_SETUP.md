# Pencil MCP 集成 + 前端技能安装方案

> 实时设计工具集成 + 前端技能安装

---

## 🎯 目标

1. **Pencil MCP 集成** - 实时设计工具
2. **前端技能安装** - Next.js, React, Tailwind CSS 等
3. **开始开发** - 实际开发前端页面

---

## 🖥️ Pencil MCP

### 功能
- 实时设计 UI 组件
- 可视化拖放
- 实时预览
- 代码生成

### 集成方案

#### 方案 1: 直接安装（推荐）

```bash
# 安装 Pencil MCP 服务器
npm install -g @pencilapp/mcp-server

# 启动 MCP 服务器
pencil-mcp-server --port 3000
```

#### 方案 2: 使用现有技能

如果 Pencil MCP 已经安装，直接使用。

#### 方案 3: 前端集成

在 Next.js 项目中：

```typescript
// app/api/pencil/route.ts
import { Pencil } from '@pencilapp/sdk';

export async function POST(req: Request) {
  const pencil = new Pencil({
    apiKey: process.env.PENCIL_API_KEY
  });
  
  const design = req.body;
  const result = await pencil.generateCode(design);
  
  return Response.json(result);
}
```

---

## 📦 前端技能安装

### 1. Next.js 前端技能

#### 技能列表

**frontend-design**
- 现代化 UI 设计
- 响应式布局
- 移动端优化

**component-library**
- shadcn/ui 集成
- 组件最佳实践
- 可访问性

**styling**
- Tailwind CSS 高级技巧
- 自定义主题
- 深色模式

**performance**
- 性能优化
- 代码分割
- 懒加载

### 2. 安装步骤

#### 步骤 1: 创建 Next.js 项目

```bash
cd /root/clawd/ai-prompt-marketplace

# 创建 frontend 目录
mkdir -p frontend

# 初始化 Next.js
cd frontend
npx create-next-app@latest . --typescript --tailwind --eslint
```

#### 步骤 2: 安装依赖

```bash
# UI 组件库
npm install shadcn-ui lucide-react

# 状态管理
npm install zustand

# 动画
npm install framer-motion

# 数据可视化
npm install recharts

# 支付集成
npm install @stripe/stripe-js

# 图标
npm install lucide-react

# 类型定义
npm install -D @types/node @types/react @types/react-dom
```

#### 步骤 3: 初始化 shadcn/ui

```bash
# 初始化 shadcn/ui
npx shadcn-ui@latest init

# 添加常用组件
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add input
npx shadcn-ui@latest add select
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add sheet
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add avatar
npx shadcn-ui@latest add separator
```

#### 步骤 4: 安装 Ultimate Skills Bundle 前端技能

```bash
# 克隆技能仓库
cd /root/clawd/ai-prompt-marketplace
git clone https://github.com/hhhh124hhhh/ultimate-skills-bundle.git skills

# 复制前端技能到项目
cp -r skills/skills-bundle/anthropic-skills/frontend-design/* frontend/skills/
cp -r skills/skills-bundle/anthropic-skills/component-library/* frontend/skills/
cp -r skills/skills-bundle/anthropic-skills/styling/* frontend/skills/
cp -r skills/skills-bundle/anthropic-skills/performance/* frontend/skills/
```

---

## 🚀 开始开发

### 使用技能开始开发

#### 1. 使用 frontend-design 技能

**prompt**:
```
Claude，使用 frontend-design 技能为 AI Prompt Marketplace 设计一个现代化的首页。

要求：
1. 导航栏：Logo、搜索、用户菜单
2. Hero Section：标题、描述、CTA 按钮
3. 热门提示词：2x3 卡片布局
4. 分类导航：水平滚动的分类标签
5. 响应式设计：移动端和桌面端适配

技术栈：
- Next.js 14 (App Router)
- Tailwind CSS
- shadcn/ui 组件
- Framer Motion 动画

设计风格：
- 现代化、简洁
- 深色模式支持
- 优雅的动画效果

请使用 frontend-design 技能创建所有页面组件。
```

#### 2. 使用 component-library 技能

**prompt**:
```
Claude，使用 component-library 技能创建可复用的组件。

组件列表：
1. PromptCard - 提示词卡片组件
2. PackageCard - 套餐卡片组件
3. SearchBar - 搜索和过滤栏
4. CategoryList - 分类列表
5. PurchaseButton - 购买按钮
6. FavoriteButton - 收藏按钮
7. RatingBadge - 评分徽章

要求：
- 使用 shadcn/ui 组件作为基础
- 添加自定义样式
- 完整的 TypeScript 类型
- 支持 Tailwind CSS 配置
- 支持深色模式

请使用 component-library 技能创建所有组件。
```

#### 3. 使用 styling 技能

**prompt**:
```
Claude，使用 styling 技能为 AI Prompt Marketplace 配置完整的样式系统。

要求：
1. 自定义主题颜色
2. 深色模式支持
3. 动画配置
4. 响应式断点
5. 自定义字体

技术栈：
- Tailwind CSS
- CSS Variables
- shadcn/ui 主题

配置文件：
- tailwind.config.js
- globals.css
- components.json

请使用 styling 技能创建完整的样式系统。
```

---

## 📂 项目结构

```
frontend/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Homepage
│   ├── categories/         # Categories page
│   ├── search/             # Search page
│   ├── prompts/            # Prompts list page
│   ├── promts/[id]/        # Prompt detail page
│   ├── packages/           # Packages page
│   ├── dashboard/           # Dashboard page
│   ├── login/              # Login page
│   └── register/           # Register page
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── PromptCard.tsx
│   ├── PackageCard.tsx
│   ├── SearchBar.tsx
│   ├── CategoryList.tsx
│   ├── PurchaseModal.tsx
│   ├── SubscriptionModal.tsx
│   ├── UserDropdown.tsx
│   ├── DarkModeToggle.tsx
│   └── FilterDropdown.tsx
├── lib/
│   ├── utils.ts            # Utility functions
│   ├── api.ts              # API client
│   ├── stripe.ts           # Stripe client
│   └── constants.ts        # Constants
├── hooks/
│   ├── use-prompts.ts      # Prompts hook
│   ├── use-packages.ts     # Packages hook
│   ├── use-user.ts         # User hook
│   └── use-theme.ts       # Theme hook
├── stores/
│   ├── use-prompt-store.ts  # Prompt store
│   ├── use-ui-store.ts     # UI store
│   └── use-user-store.ts   # User store
├── styles/
│   ├── globals.css         # Global styles
│   └── components.css      # Component styles
├── public/
│   └── images/            # Static images
└── tailwind.config.ts      # Tailwind config
```

---

## 🔧 配置文件

### tailwind.config.ts

```typescript
import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./styles/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
} satisfies Config

export default config
```

---

## 🚀 立即开始

### 步骤 1: 集成 Pencil MCP

```bash
# 安装 Pencil MCP 服务器
npm install -g @pencilapp/mcp-server

# 启动 MCP 服务器
pencil-mcp-server --port 3000
```

### 步骤 2: 创建 Next.js 项目

```bash
cd /root/clawd/ai-prompt-marketplace

# 初始化 Next.js
cd frontend
npx create-next-app@latest . --typescript --tailwind --eslint
```

### 步骤 3: 安装依赖和配置

```bash
# 安装依赖
npm install shadcn-ui lucide-react zustand framer-motion recharts @stripe/stripe-js

# 初始化 shadcn/ui
npx shadcn-ui@latest init

# 添加组件
npx shadcn-ui@latest add button card input select dropdown-menu
npx shadcn-ui@latest add dialog sheet badge avatar separator
```

### 步骤 4: 使用技能开始开发

```bash
# 使用 frontend-design 技能
Claude: "Use frontend-design skill to create the homepage"

# 使用 component-library 技能
Claude: "Use component-library skill to create PromptCard component"

# 使用 styling 技能
Claude: "Use styling skill to configure the theme"
```

---

## 🎯 下一步

### 立即开始

1. **集成 Pencil MCP** - 实时设计工具
2. **创建 Next.js 项目** - 前端框架
3. **安装依赖** - shadcn/ui, zustand, framer-motion
4. **使用技能开发** - 开始实际的页面开发

### 技能使用顺序

1. **frontend-design** - 创建首页
2. **component-library** - 创建组件
3. **styling** - 配置样式系统
4. **performance** - 优化性能

---

**准备好开始了吗？** 🚀

（告诉我"开始"，我会立即使用前端技能开始 Next.js 前端的开发！）
