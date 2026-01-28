# AI Prompt Marketplace 🎯

> 智能评估和售卖 AI 提示词的电商平台

[![GitHub stars](https://img.shields.io/github/stars/hhhh124hhhh/ai-prompt-marketplace?style=social)](https://github.com/hhhh124hhhh/ai-prompt-marketplace/stargazers)
[![Monetization](https://img.shields.io/badge/monetization-paid-success-brightgreen.svg)]()
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## 💰 项目概述

### 商业模式
**核心心理念**: 抓取 X (Twitter) 上流行的 AI 提示词 → 评估质量 → 打包为 skill → 售卖赚钱

**收入来源**:
- 💰 单次购买 ($0.99 - $4.99)
- 💳️ 包月订阅 ($2.99 - $19.99)
- 💎️ 年度订阅 ($29.99 - $119.99)
- 🏢️ 企业版 ($199.99/月)

---

## 📋 核心功能

### 1. 提示词抓取 🤖

**搜索关键词**:
```
#提示词
#ChatGPT技巧
#Claude技巧
#PromptEngineering
#AI工具
#AI开发
```

**抓取频率**:
- 每天扫描热门标签
- 实时追踪趋势话题
- 关注权威账号（AI 研究员、工具开发者）

**数据收集**:
- 提示词内容
- 使用场景
- 效果展示（截图、结果）
- 作者信息和权威度

### 2. 质量评估 📊

**评估维度** (总分 100):
- 🎯 实用性 (30%) - 实际应用价值
- 🎨 创新性 (20%) - 独特性和新颖性
- 📖 完整性 (20%) - 详细程度和可复用性
- 🔥 热度 (25%) - 点赞、转发、收藏数
- 👨‍💼 作者影响力 (5%) - 粉丝数和认证状态

**评分标准**:
- A+ (90-100): 优秀，高价售卖
- A (85-89):  很好，高价售卖
- B+ (80-84): 良好，中高价售卖
- B (70-79): 良好，中等价售卖
- C+ (60-69): 一般，低价售卖
- C (50-59): 一般，免费赠送
- D (0-49): 较差，不予收录

### 3. 打包系统 📦

**打包策略**:

#### 按类别
- 📝 写作助手 (20 个) - $4.99
- 💻 编程助手 (20 个) - $6.99
- 📢 营销助手 (20 个) - $4.99
- 🎨 设计助手 (20 个) - $4.99

#### 按难度
- 🌱 初级包 (100 个) - $2.99
- ⭐ 中级包 (100 个) - $4.99
- 🚀 高级包 (100 个) - $9.99

#### 按模型
- ChatGPT 专用包 (100 个) - $6.99
- Claude 专用包 (100 个) - $6.99
- 多模型兼容包 (100 个) - $9.99

### 4. 售卖系统 💳️

**支付方式**:
- 💳️ Stripe (信用卡、借记卡)
- 💰 PayPal
- 加密货币 (USDT, BTC, ETH)

**产品类型**:
- 单次购买提示词
- 月度订阅包
- 年度订阅包
- 企业版无限制访问

**定价策略**:
- 免费试用 (7 天)
- 早鸟优惠 (前 100 名 50% off)
- 季节促销 (黑五 8 折)
- 学生优惠 (凭学生证 50% off)

---

## 🏗️ 技术架构

### 前端
- **Next.js 14** (App Router)
- **TypeScript** - 类型安全
- **Tailwind CSS** - 实用优先
- **shadcn/ui** - 现代 UI 组件
- **Zustand** - 轻量状态管理
- **Framer Motion** - 流畅动画

### 后端
- **Node.js 20 LTS**
- **Express.js** - Web 框架
- **MongoDB** - 主数据库
- **Redis** - 缓存层
- **Cron** - 定时任务

### 抓取和支付
- **Bird CLI** - Twitter/X 抓取
- **Stripe SDK** - 支付处理
- **OpenAI API** - 提示词优化建议
- **Puppeteer** - 动态内容抓取

---

## 📊 数据模型

### Prompt (提示词)
```typescript
interface Prompt {
  id: string
  title: string
  content: string
  description: string
  type: PromptType
  category: Category
  tags: string[]
  models: Model[]
  useCases: string[]
  difficulty: Difficulty
  examples: PromptExample[]
  author: Author
  publishedAt: Date
  scrapedAt: Date
  metrics: Metrics
  evaluation: Evaluation
  tier: Tier
}
```

### Category (分类)
```typescript
type Category =
  | 'writing'
  | 'coding'
  | 'marketing'
  | 'design'
  | 'analysis'
  | 'other'
```

### Model (模型)
```typescript
type Model = 'chatgpt' | 'claude' | 'gemini' | 'midjourney' | 'stable-diffusion' | 'other'
```

### Difficulty (难度)
```typescript
type Difficulty = 'beginner' | 'intermediate' | 'advanced'
```

### Metrics (指标)
```typescript
interface Metrics {
  likes: number
  retweets: number
  replies: number
  quotes: number
  bookmarks: number
  views: number
  createdAt: Date
}
```

### Evaluation (评估)
```typescript
interface Evaluation {
  score: number
  subScores: {
    usefulness: number      // 实用性 (0-30)
    innovation: number      // 创新性 (0-20)
    completeness: number    // 完整性 (0-20)
    popularity: number       // 热度 (0-25)
    authorInfluence: number  // 作者影响力 (0-5)
  }
  tier: Tier
  rank: number
  updatedAt: Date
}
```

### Tier (等级)
```typescript
type Tier = 'free' | 'basic' | 'pro' | 'premium'
```

---

## 🎯 评分算法

### 实用性 (30%)

```typescript
function calculateUsefulness(prompt: Prompt): number {
  let score = 0
  
  // 是否包含具体的使用场景 (0-10)
  if (prompt.useCases.length > 0) {
    score += 10
  } else if (prompt.description.includes('示例') || prompt.description.includes('可以')) {
    score += 5
  }
  
  // 是否有步骤说明 (0-10)
  if (prompt.content.includes('步骤') || prompt.content.includes('第一步')) {
    score += 10
  } else if (prompt.content.split(/[。！；]/).length > 2) {
    score += 5
  }
  
  // 是否有参数说明 (0-10)
  if (prompt.content.includes('{{') || prompt.content.includes('[变量]')) {
    score += 10
  } else if (prompt.content.includes('参数') || prompt.content.includes('设置')) {
    score += 5
  }
  
  return Math.min(score, 30)
}
```

### 创新性 (20%)

```typescript
function calculateInnovation(prompt: Prompt): number {
  let score = 0
  
  // 方法是否独特 (0-10)
  if (prompt.description.includes('创新') || prompt.description.includes('独特')) {
    score += 10
  } else if (!isCommonPattern(prompt.content)) {
    score += 5
  }
  
  // 是否有新颖的角度 (0-10)
  if (prompt.tags.some(tag => ['新方法', '突破', '创新'].includes(tag))) {
    score += 10
  }
  
  return Math.min(score, 20)
}
```

### 完整性 (20%)

```typescript
function calculateCompleteness(prompt: Prompt): number {
  let score = 0
  
  // 说明详细程度 (0-5)
  if (prompt.description.length > 100) {
    score += 5
  } else if (prompt.description.length > 50) {
    score += 3
  }
  
  // 示例数量 (0-5)
  score += Math.min(prompt.examples.length * 2, 5)
  
  // 参数说明 (0-5)
  if (prompt.content.includes('{{') || prompt.content.includes('[可选]')) {
    score += 5
  }
  
  // 注意事项 (0-5)
  if (prompt.description.includes('注意') || prompt.description.includes('提示')) {
    score += 5
  }
  
  return Math.min(score, 20)
}
```

### 热度 (25%)

```typescript
function calculatePopularity(prompt: Prompt): number {
  let score = 0
  
  // 点赞数 (0-10)
  score += Math.min(prompt.metrics.likes / 100, 10)
  
  // 转发数 (0-10)
  score += Math.min(prompt.metrics.retweets / 50, 10)
  
  // 评论数 (0-5)
  score += Math.min(prompt.metrics.replies / 20, 5)
  
  return Math.min(score, 25)
}
```

---

## 💳️ 售卖系统

### 单次购买
- 每个提示词单独定价
- 基于 Tier 等级
- 下载次数不限
- 7 天退款保证

### 月度订阅
- 基础包: 50 个提示词/月 ($2.99)
- 标准包: 100 个提示词/月 ($4.99)
- 专业包: 200 个提示词/月 ($9.99)
- 无限访问所有提示词

### 年度订阅
- 基础包: 50 个提示词/年 ($29.99) - 节省 60%
- 标准包: 100 个提示词/年 ($49.99) - 节省 60%
- 专业包: 200 个提示词/年 ($99.99) - 节省 60%

### 企业版
- 无限制访问所有提示词
- API 访问权限
- 商业使用授权
- 优先技术支持
- 定制包开发服务

---

## 📂 项目结构

```
ai-prompt-marketplace/
├── frontend/                  # Next.js 前端
│   ├── app/                    # App Router
│   ├── components/             # React 组件
│   ├── lib/                    # 工具函数
│   ├── hooks/                  # 自定义 Hooks
│   ├── stores/                 # Zustand stores
│   └── public/                 # 静态资源
├── backend/                   # Express 后端
│   ├── src/
│   │   ├── controllers/        # 控制器
│   │   ├── models/             # 数据模型
│   │   ├── routes/             # API 路由
│   │   ├── services/           # 业务逻辑
│   │   └── utils/              # 工具函数
│   ├── config/               # 配置文件
│   └── middleware/           # 中间件
├── scraper/                   # 抓取脚本
│   ├── twitter/               # Twitter 抓取
│   ├── scheduler/             # 定时任务
│   └── utils/                 # 工具函数
├── shared/                    # 共享代码
│   ├── types/                 # TypeScript 类型
│   ├── constants/             # 常量
│   └── utils/                 # 工具函数
└── docs/                     # 文档
    ├── api/                   # API 文档
    ├── deployment/            # 部署指南
    └── business/              # 商业文档
```

---

## 🚀 快速开始

### 前置要求

- Node.js 18+
- npm 或 pnpm
- MongoDB 6+
- Stripe 账号
- Twitter/X 账户

### 安装

```bash
# 克隆仓库
git clone https://github.com/hhhh124hhhh/ai-prompt-marketplace.git
cd ai-prompt-marketplace

# 安装依赖
npm install
```

### 开发

```bash
# 前端开发
npm run dev:frontend

# 后端开发
npm run dev:backend

# 所有服务
npm run dev:all
```

### 构建

```bash
# 前端构建
npm run build:frontend

# 后端构建
npm run build:backend

# 所有构建
npm run build:all
```

---

## 💰 定价策略

### 基础定价
- 单个提示词: $0.99 (Tier C)
- 单个提示词: $1.99 (Tier B)
- 单个提示词: $2.99 (Tier B+)
- 单个提示词: $3.99 (Tier A)
- 单个提示词: $4.99 (Tier A+)
- 优秀提示词: $9.99 (Tier A+)

### 订阅定价
- 基础包: $2.99/月 (50 个)
- 标准包: $4.99/月 (100 个)
- 专业包: $9.99/月 (200 个)
- 企业版: $19.99/月 (无限制)

### 企业版
- 小团队: $49.99/月 (5 用户)
- 中团队: $99.99/月 (10 用户)
- 大团队: $199.99/月 (20 用户)
- 企业定制: 联系我们

---

## 📊 收入预测

### 保守估计

| 时期 | 提示词数 | 单次收入 | 月度收入 | 年度收入 |
|------|---------|---------|---------|---------|
| 第 1 月 | 100 | $500 | $1,000 | $12,000 |
| 第 3 月 | 200 | $1,000 | $2,000 | $24,000 |
| 第 6 月 | 500 | $2,500 | $5,000 | $60,000 |
| 第 12 月 | 1,000 | $5,000 | $10,000 | $120,000 |

### 乐观估计

| 时期 | 提示词数 | 单次收入 | 月度收入 | 年度收入 |
|------|---------|---------|---------|---------|
| 第 1 月 | 100 | $500 | $2,000 | $24,000 |
| 第 3 月 | 200 | $1,000 | $4,000 | $48,000 |
| 第 6 月 | 500 | $2,500 | $10,000 | $120,000 |
| 第 12 月 | 1,000 | $5,000 | $20,000 | $240,000 |

---

## 🎯 成功指标

### 早期目标 (第 1 月)
- [x] 100 个提示词上线
- [x] 50 个购买
- [x] $500 收入

### 中期目标 (第 3 月)
- [x] 200 个提示词上线
- [x] 150 个购买
- [x] $2,000 收入

### 长期目标 (第 6 月)
- [x] 500 个提示词上线
- [x] 500 个购买
- [x] $5,000 月收入

---

## 📝 License

MIT License - 详见 [LICENSE](LICENSE) 文件

---

## 🙏 致谢

本项目的技术支持来自于：

- **Next.js** - Vercel 的 React 框架
- **Tailwind CSS** - 实用优先的 CSS 框架
- **shadcn/ui** - 美观的 UI 组件
- **Stripe** - 在线支付
- **Bird CLI** - steipete 的 Twitter 工具

---

**Made with 💰 by jack happy + Clawdbot**

*AI Prompt Marketplace - Monetization Project*
