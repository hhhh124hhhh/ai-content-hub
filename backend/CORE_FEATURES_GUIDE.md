# 核心功能实现指南

> 提示词转 Skill + AI 工具测评

## 概述

本项目实现了两个核心功能：

1. **提示词 → Skill 自动转换** - 从 X (Twitter) 抓取 AI 提示词，评估质量，转换为 Clawdbot Skill 格式，并发布到 ClawdHub
2. **AI 工具测评** - 评估 AI 工具的功能性、性能、易用性、创新性和热度，生成排行榜和推荐报告

---

## 功能 1: 提示词转 Skill

### 工作流程

```
X (Twitter) → 抓取提示词 → 评估质量 → 过滤高质量提示词 → 转换为 Skill → 发布到 ClawdHub
```

### 核心服务

#### 1. ScraperService - 抓取服务

**文件**: `backend/src/services/scraperService.ts`

**功能**:
- 从 X (Twitter) 抓取 AI 提示词
- 自动检测提示词类型、分类、模型、难度
- 提取标签、使用场景、作者信息
- 提取指标（点赞、转发、评论等）

**使用示例**:
```typescript
import { ScraperService } from './services/scraperService';

// 抓取单个查询
const result = await ScraperService.scrapeTwitter('ChatGPT提示词', 20);
console.log(`Found ${result.prompts.length} prompts`);

// 批量抓取
const queries = ['ChatGPT提示词', 'Claude提示词', 'PromptEngineering'];
const prompts = await ScraperService.scrapeBatch(queries);
console.log(`Total: ${prompts.length} prompts`);
```

#### 2. EvaluationService - 评估服务

**文件**: `backend/src/services/evaluationService.ts`

**功能**:
- 评估提示词质量（0-100 分）
- 5 个维度评分：
  - 实用性 (30%) - 实际应用价值
  - 创新性 (25%) - 新颖性和独特性
  - 完整性 (20%) - 详细程度和可复用性
  - 热度 (25%) - 点赞、转发、收藏
- 分配 Tier（premium/pro/basic/free）
- 计算排名

**使用示例**:
```typescript
import { EvaluationService } from './services/evaluationService';

// 评估单个提示词
const evaluation = await EvaluationService.evaluate(prompt);
console.log(`Score: ${evaluation.score}/100`);
console.log(`Tier: ${evaluation.tier}`);

// 批量评估
const evaluations = await EvaluationService.evaluateBatch(prompts);
```

#### 3. SkillConverterService - Skill 转换服务

**文件**: `backend/src/services/skillConverterService.ts`

**功能**:
- 将提示词转换为 Clawdbot Skill 格式
- 自动生成 SKILL.md
- 生成 references 文件（prompt-template.md, use-cases.md）
- 打包为 .skill 文件
- 发布到 ClawdHub

**使用示例**:
```typescript
import { SkillConverterService } from './services/skillConverterService';

// 转换单个提示词
const skillPath = await SkillConverterService.convertPromptToSkill(prompt);
console.log(`Skill created: ${skillPath}`);

// 批量转换
const skillPaths = await SkillConverterService.convertBatchToSkills(prompts);

// 发布到 ClawdHub
const success = await SkillConverterService.publishToClawdHub(skillPath);
```

### 完整工作流

**文件**: `backend/src/scripts/prompt-to-skill-workflow.ts`

**使用方法**:

#### 测试模式
```bash
cd /root/clawd/ai-prompt-marketplace/backend
npx ts-node src/scripts/prompt-to-skill-workflow.ts test "ChatGPT提示词"
```

#### 生产模式
```bash
cd /root/clawd/ai-prompt-marketplace/backend
npx ts-node src/scripts/prompt-to-skill-workflow.ts production
```

**工作流步骤**:

1. **抓取提示词** - 从 X 抓取指定查询的提示词
2. **评估质量** - 使用 5 维度评分算法评估每个提示词
3. **过滤高质量** - 只保留评分 >= 70 的提示词
4. **转换为 Skills** - 自动生成 Skill 目录结构和文件
5. **发布到 ClawdHub** - 将 Skills 发布到 ClawdHub 市场
6. **生成报告** - 生成详细的评估报告

**输出结果**:

- `prompts-{timestamp}.json` - 评估结果 JSON
- `workflow-report-{timestamp}.md` - 工作流报告
- `dist/{skill-name}.skill` - 生成的 Skill 文件

---

## 功能 2: AI 工具测评

### 工作流程

```
AI 工具列表 → 评估质量 → 排名 → 生成排行榜 → 生成详细报告
```

### 核心服务

#### AIToolEvaluatorService - AI 工具评估服务

**文件**: `backend/src/services/aiToolEvaluatorService.ts`

**功能**:
- 评估 AI 工具质量（0-100 分）
- 5 个维度评分：
  - 功能性 (25%) - 功能数量、多样性、完整性、API 集成
  - 性能 (20%) - 用户评分、用户数量、响应速度、稳定性
  - 易用性 (20%) - 定价模式、文档、UI、社区支持
  - 创新性 (15%) - 独特功能、新颖技术、创新解决方案
  - 热度 (20%) - 用户数量、评论数、社交媒体提及
- 分配 Tier（premium/pro/basic/free）
- 生成推荐和关注点
- 生成排行榜

**使用示例**:
```typescript
import { AIToolEvaluatorService } from './services/aiToolEvaluatorService';

// 定义 AI 工具
const tool = {
  id: '1',
  name: 'ChatGPT',
  description: 'OpenAI\'s advanced language model.',
  category: 'Text Generation',
  features: [
    'Advanced text generation',
    'Code writing',
    'API integration'
  ],
  pricing: {
    model: 'freemium',
    priceRange: '$0-$20/month'
  },
  metrics: {
    users: 100000000,
    rating: 4.5,
    reviewsCount: 50000
  }
};

// 评估工具
const evaluation = await AIToolEvaluatorService.evaluate(tool);
console.log(`Score: ${evaluation.score}/100`);
console.log(`Tier: ${evaluation.tier}`);
console.log('Recommendations:', evaluation.recommendations);
console.log('Concerns:', evaluation.concerns);

// 生成报告
const report = AIToolEvaluatorService.generateEvaluationReport(tool, evaluation);
```

### 完整工作流

**文件**: `backend/src/scripts/ai-tool-evaluation-workflow.ts`

**使用方法**:

#### 测试模式
```bash
cd /root/clawd/ai-prompt-marketplace/backend
npx ts-node src/scripts/ai-tool-evaluation-workflow.ts test
```

#### 生产模式
```bash
cd /root/clawd/ai-prompt-marketplace/backend
npx ts-node src/scripts/ai-tool-evaluation-workflow.ts production tools.json
```

**工作流步骤**:

1. **评估工具** - 使用 5 维度评分算法评估每个工具
2. **排名** - 按评分排序并分配排名
3. **保存结果** - 保存评估结果 JSON
4. **生成排行榜** - 生成 Markdown 格式的排行榜
5. **生成详细报告** - 为每个工具生成详细的评估报告
6. **生成汇总报告** - 生成包含统计分析的汇总报告

**输出结果**:

- `ai-tools-evaluation-{timestamp}.json` - 评估结果 JSON
- `ai-tools-leaderboard-{timestamp}.md` - 排行榜
- `detailed-reports/{tool-name}-{timestamp}.md` - 详细报告
- `ai-tools-summary-{timestamp}.md` - 汇总报告

---

## 快速开始

### 前置要求

- Node.js 18+
- TypeScript
- Bird CLI（用于 X 抓取）
- ClawdHub CLI（用于发布 Skills）

### 安装依赖

```bash
cd /root/clawd/ai-prompt-marketplace/backend
npm install
```

### 运行测试

#### 测试提示词转 Skill
```bash
npx ts-node src/scripts/prompt-to-skill-workflow.ts test "ChatGPT提示词"
```

#### 测试 AI 工具测评
```bash
npx ts-node src/scripts/ai-tool-evaluation-workflow.ts test
```

### 运行生产模式

#### 提示词转 Skill（完整流程）
```bash
npx ts-node src/scripts/prompt-to-skill-workflow.ts production
```

#### AI 工具测评（完整流程）
```bash
# 先创建 tools.json
cat > tools.json << EOF
[
  {
    "id": "1",
    "name": "ChatGPT",
    "description": "...",
    ...
  }
]
EOF

# 然后运行
npx ts-node src/scripts/ai-tool-evaluation-workflow.ts production tools.json
```

---

## 定制化

### 自定义评估标准

**修改评估权重**（在 `evaluationService.ts` 中）:

```typescript
const score = usefulness * 0.30 +      // 实用性权重
              innovation * 0.25 +       // 创新性权重
              completeness * 0.20 +      // 完整性权重
              popularity * 0.25;         // 热度权重
```

**修改最低分数阈值**（在工作流中）:

```typescript
await PromptToSkillWorkflow.runWorkflow(['ChatGPT提示词'], {
  minScore: 80  // 只转换评分 >= 80 的提示词
});
```

### 自定义抓取查询

修改 `productionMode` 中的查询列表：

```typescript
static async productionMode(
  queries: string[] = [
    'ChatGPT提示词',
    'Claude提示词',
    'PromptEngineering',
    'AI写作技巧',
    '编程助手',
    '添加你的查询'  // 添加更多查询
  ]
) {
  ...
}
```

### 自定义 Skill 模板

修改 `SkillConverterService.generateSkillMdContent` 方法来自定义生成的 SKILL.md 格式。

---

## 输出文件说明

### 提示词转 Skill

| 文件 | 说明 |
|------|------|
| `prompts-{timestamp}.json` | 所有评估的提示词数据 |
| `workflow-report-{timestamp}.md` | 工作流汇总报告 |
| `dist/{skill-name}.skill` | 生成的 Skill 文件 |

### AI 工具测评

| 文件 | 说明 |
|------|------|
| `ai-tools-evaluation-{timestamp}.json` | 所有评估的工具数据 |
| `ai-tools-leaderboard-{timestamp}.md` | 排行榜 |
| `detailed-reports/{tool-name}-{timestamp}.md` | 每个工具的详细报告 |
| `ai-tools-summary-{timestamp}.md` | 汇总报告（含统计分析） |

---

## 故障排除

### Bird CLI 未配置

**错误**: `Bird CLI not configured or failed`

**解决**:
```bash
# 配置 Bird CLI
bird auth
```

### ClawdHub CLI 未配置

**错误**: `ClawdHub CLI not configured`

**解决**:
```bash
# 配置 ClawdHub CLI
clawdhub login
```

### 没有 Bird CLI 选项

如果 Bird CLI 不可用，可以手动创建测试数据：

```typescript
const testPrompt = {
  id: 'test-1',
  title: 'Test Prompt',
  content: 'This is a test prompt.',
  description: 'A test prompt for evaluation.',
  type: 'other',
  category: 'General',
  tags: ['test'],
  useCases: ['Testing'],
  difficulty: 'beginner',
  metrics: {
    likes: 100,
    retweets: 20,
    replies: 5
  },
  author: {
    username: 'testuser',
    followerCount: 1000,
    verified: false,
    professional: false
  }
};

const evaluation = await EvaluationService.evaluate(testPrompt);
```

---

## 下一步

1. **测试功能** - 先在测试模式下验证功能
2. **调整参数** - 根据测试结果调整评估标准和阈值
3. **生产运行** - 在生产模式下运行完整流程
4. **监控结果** - 查看生成的报告和 Skills
5. **优化改进** - 根据反馈持续优化

---

## 支持

如有问题，请查看：
- 项目文档: `/root/clawd/ai-prompt-marketplace/`
- 技能文档: `/root/clawd/skills/`
- ClawdHub: https://clawdhub.com

---

*Made with 🚀 by jack happy + Clawdbot*
