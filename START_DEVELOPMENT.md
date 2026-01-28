# 🚀 开始 AI Prompt Marketplace 开发

> 使用现有技能开始 Next.js 前端开发

---

## 🧠 使用技能开发

### 步骤 1: 创建 Next.js 项目

```bash
cd /root/clawd/ai-prompt-marketplace
npx create-next-app@latest frontend --typescript --tailwind --eslint --app
```

### 步骤 2: 安装依赖

```bash
cd frontend
npm install shadcn-ui lucide-react zustand framer-motion recharts
npm install -D @types/node
```

### 步骤 3: 初始化 shadcn/ui

```bash
npx shadcn-ui@latest init -d
npx shadcn-ui@latest add button card input dropdown-menu dialog sheet badge avatar separator
```

### 步骤 4: 创建首页

创建 `frontend/app/page.tsx`:

```typescript
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter:blur(4px)]">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              AI Prompt Marketplace
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/search">
              <Button variant="ghost">Search</Button>
            </Link>
            <Link href="/categories">
              <Button variant="ghost">Categories</Button>
            </Link>
            <Link href="/pricing">
              <Button variant="default">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-4xl font-bold mb-4">
          High-Quality AI Prompts
          <br />
          <span className="text-2xl font-semibold text-muted-foreground">
            Organized by Category, Rated by Quality
          </span>
        </h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Discover 1000+ professionally crafted AI prompts for ChatGPT, Claude, and more.
          All prompts are evaluated across 5 dimensions and guaranteed to work.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/categories">
            <Button size="lg" variant="default">
              Browse Prompts
            </Button>
          </Link>
          <Link href="/pricing">
            <Button size="lg" variant="outline">
              View Plans
            </Button>
          </Link>
        </div>
      </section>

      {/* Hot Prompts */}
      <section className="container mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold mb-8">
          🔥 Hot Prompts (A+ Quality)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="text-lg font-semibold">
                    AI Prompt {i}
                  </span>
                  <Badge variant="default">A+</Badge>
                </CardTitle>
                <CardDescription>
                  Perfect for {i % 2 === 0 ? 'writing' : i % 3 === 0 ? 'coding' : 'marketing'}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-sm text-muted-foreground mb-4">
                  This is a high-quality AI prompt designed for {['writing', 'coding', 'marketing', 'design', 'analysis'][i % 5]}.
                  It has been carefully crafted and tested to ensure maximum effectiveness.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium">Use Cases:</span>
                    <span className="text-muted-foreground">
                      {['Write blog posts', 'Generate code', 'Create marketing copy', 'Design graphics', 'Analyze data'][i % 5]}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium">Models:</span>
                    <span className="text-muted-foreground">
                      {['ChatGPT', 'Claude', 'Gemini', 'Midjourney', 'Stable Diffusion'][i % 5]}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium">Difficulty:</span>
                    <span className="text-muted-foreground">
                      {['Beginner', 'Intermediate', 'Advanced'][i % 3]}
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex items-center justify-between pt-4">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <span>❤️ {Math.floor(Math.random() * 500 + 500)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>🔄 {Math.floor(Math.random() * 100 + 50)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>💬 {Math.floor(Math.random() * 50 + 20)}</span>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  Created by @promptMaster
                </div>
                <div>
                  <Button size="sm">View Details</Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link href="/prompts">
            <Button variant="outline" size="lg">
              View All Prompts
            </Button>
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold mb-8">
          📋 Browse by Category
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { name: 'Writing Assistant', icon: '✍️', color: 'from-blue-500 to-cyan-500', count: 254 },
            { name: 'Coding Assistant', icon: '💻', color: 'from-purple-500 to-pink-500', count: 186 },
            { name: 'Marketing Assistant', icon: '📢', color: 'from-red-500 to-orange-500', count: 142 },
            { name: 'Design Assistant', icon: '🎨', color: 'from-yellow-500 to-green-500', count: 128 },
            { name: 'Analysis Assistant', icon: '📊', color: 'from-indigo-500 to-purple-500', count: 98 },
            { name: 'Other', icon: '📚', color: 'from-gray-500 to-slate-500', count: 67 },
          ].map((category, i) => (
            <Link key={i} href={`/categories/${category.name.toLowerCase().replace(' ', '-')}`}>
              <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-105">
                <CardContent className="pt-6">
                  <div className={`flex items-center gap-4 mb-4 text-2xl ${category.color}`}>
                    {category.icon}
                  </div>
                  <CardTitle className="text-xl font-semibold mb-2">
                    {category.name}
                  </CardTitle>
                  <CardDescription>
                    {category.count} prompts available
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="container mx-auto px-4 py-16 bg-gradient-to-b from-muted/20 to-background">
        <h3 className="text-3xl font-bold mb-8 text-center">
          💰 Affordable Pricing
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: 'Basic',
              price: '$4.99',
              period: '/month',
              features: ['100 prompts', 'Basic search', 'Email support'],
              popular: false,
            },
            {
              name: 'Standard',
              price: '$9.99',
              period: '/month',
              features: ['300 prompts', 'Advanced search', 'Priority support', 'Weekly updates'],
              popular: true,
            },
            {
              name: 'Pro',
              price: '$19.99',
              period: '/month',
              features: ['1000+ prompts', 'Advanced features', '24/7 support', 'Daily updates', 'Exclusive prompts'],
              popular: false,
            },
          ].map((plan, i) => (
            <Card key={i} className={`relative ${plan.popular ? 'border-2 border-primary' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge variant="default" className="bg-primary text-primary-foreground">
                    Most Popular
                  </Badge>
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <CardDescription className="text-3xl font-bold">
                  {plan.price}
                  <span className="text-base font-normal text-muted-foreground">
                    {plan.period}
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <ul className="space-y-2">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant={plan.popular ? 'default' : 'outline'}>
                  Get Started
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground mb-4">
            All plans include 7-day free trial
          </p>
          <Link href="/pricing">
            <Button variant="link" size="lg">
              Compare all plans →
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
```

### 步骤 5: 创建 Badge 组件

创建 `frontend/components/ui/badge.tsx`:

```typescript
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring-950 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
      secondary:
        "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
      destructive:
        "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
      outline: "text-foreground",
    },
    defaultVariants: {
      default: "border-transparent",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
```

---

## 🚀 立即开始

### 选项 1: 手动创建

```bash
cd /root/clawd/ai-prompt-marketplace
npx create-next-app@latest frontend --typescript --tailwind --eslint --app
```

### 选项 2: 等待技能安装

如果 frontend-design 技能安装成功，可以使用它来创建项目。

### 选项 3: 使用现有文件

如果项目创建成功，我会创建更多的页面和组件。

---

## 💡 建议

**立即手动创建项目**，因为：
- ✅ 网络或 GitHub 可能有临时问题
- ✅ 手动创建更可靠
- ✅ 可以立即开始开发

**创建后**，我们再集成 frontend-design 技能（如果安装成功）。

---

**准备好手动创建项目了吗？** 🚀
