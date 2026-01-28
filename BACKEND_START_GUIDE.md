# Backend Development - Immediate Start

> 立即开始后端开发 - 不需要 npm install

---

## 🚀 立即开始（无需 npm install）

### 步骤 1: 手动创建项目结构

```bash
cd /root/clawd/ai-prompt-marketplace/backend

# 创建目录结构
mkdir -p src/{models,controllers,routes,services,middleware,utils,config}
mkdir -p scraper/{twitter,reddit,discord,blogs}
mkdir -p scheduler
```

### 步骤 2: 创建数据模型

**文件**: `src/models/Prompt.ts`

```typescript
import mongoose, { Schema, Document, Model } from 'mongoose';

interface IPrompt extends Document {
  title: string;
  description: string;
  content: string;
  type: 'writing' | 'coding' | 'marketing' | 'design' | 'analysis' | 'other';
  category: string;
  tags: string[];
  models: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  useCases: string[];
  author: {
    username: string;
    followerCount: number;
    verified: boolean;
    professional: boolean;
    expertise: string[];
  };
  publishedAt: Date;
  scrapedAt: Date;
  metrics: {
    likes: number;
    retweets: number;
    replies: number;
    quotes: number;
    bookmarks: number;
    views: number;
  };
  evaluation: {
    score: number;
    subScores: {
      usefulness: number;
      innovation: number;
      completeness: number;
      popularity: number;
      authorInfluence: number;
    };
    tier: 'free' | 'basic' | 'pro' | 'premium';
    rank: number;
  };
  tier: 'free' | 'basic' | 'pro' | 'premium';
  sales: {
    count: number;
    revenue: number;
    lastSale: Date;
  };
}

const PromptSchema = new Schema<IPrompt>({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  content: { type: String, required: true, trim: true },
  type: { 
    type: String, 
    required: true,
    enum: ['writing', 'coding', 'marketing', 'design', 'analysis', 'other']
  },
  category: { type: String, required: true, trim: true },
  tags: [{ type: String, trim: true }],
  models: [{ type: String, trim: true }],
  difficulty: {
    type: String,
    required: true,
    enum: ['beginner', 'intermediate', 'advanced']
  },
  useCases: [{ type: String, trim: true }],
  author: {
    username: { type: String, required: true, trim: true },
    followerCount: { type: Number, default: 0 },
    verified: { type: Boolean, default: false },
    professional: { type: Boolean, default: false },
    expertise: [{ type: String, trim: true }]
  },
  publishedAt: { type: Date, required: true },
  scrapedAt: { type: Date, default: Date.now },
  metrics: {
    likes: { type: Number, default: 0 },
    retweets: { type: Number, default: 0 },
    replies: { type: Number, default: 0 },
    quotes: { type: Number, default: 0 },
    bookmarks: { type: Number, default: 0 },
    views: { type: Number, default: 0 }
  },
  evaluation: {
    score: { type: Number, required: true, min: 0, max: 100 },
    subScores: {
      usefulness: { type: Number, default: 0, min: 0, max: 30 },
      innovation: { type: Number, default: 0, min: 0, max: 25 },
      completeness: { type: Number, default: 0, min: 0, max: 20 },
      popularity: { type: Number, default: 0, min: 0, max: 25 },
      authorInfluence: { type: Number, default: 0, min: 0, max: 5 }
    },
    tier: {
      type: String,
      enum: ['free', 'basic', 'pro', 'premium'],
      default: 'free'
    },
    rank: { type: Number, default: 999 }
  },
  tier: {
    type: String,
    enum: ['free', 'basic', 'pro', 'premium'],
    default: 'free'
  },
  sales: {
    count: { type: Number, default: 0 },
    revenue: { type: Number, default: 0 },
    lastSale: { type: Date }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: false }
});

// Indexes
PromptSchema.index({ title: 'text', evaluation: 1, type: 1, tier: 1 });
PromptSchema.index({ category: 1, type: 1, difficulty: 1 });
PromptSchema.index({ tags: 1, evaluation: 1 });
PromptSchema.index({ 'evaluation.score': -1 });
PromptSchema.index({ 'evaluation.rank': 1 });

const Prompt = mongoose.model('Prompt', PromptSchema);

export default Prompt;
```

### 步骤 3: 创建评估服务

**文件**: `src/services/evaluationService.ts`

```typescript
import Prompt from '../models/Prompt';

interface EvaluationResult {
  score: number;
  subScores: {
    usefulness: number;
    innovation: number;
    completeness: number;
    popularity: number;
    authorInfluence: number;
  };
  tier: string;
  rank: number;
}

export class EvaluationService {
  /**
   * 计算实用性分数 (0-30)
   */
  static calculateUsefulness(prompt: any): number {
    let score = 0;
    const { content, useCases, description } = prompt;

    // 是否包含具体使用场景（10 分）
    if (useCases && useCases.length > 0) {
      score += 10;
    } else if (description && (
      description.includes('示例') || 
      description.includes('可以') || 
      description.includes('用于')
    )) {
      score += 5;
    }

    // 是否提供详细步骤（10 分）
    if (content && content.includes('步骤')) {
      score += 10;
    } else if (content && content.split(/[。！；]/).length > 2) {
      score += 5;
    }

    // 是否有参数说明（10 分）
    if (content && (content.includes('{{') || content.includes('[变量]'))) {
      score += 10;
    } else if (content && content.includes('参数') || content.includes('设置')) {
      score += 5;
    }

    return Math.min(score, 30);
  }

  /**
   * 计算创新性分数 (0-25)
   */
  static calculateInnovation(prompt: any): number {
    let score = 0;
    const { tags, description } = prompt;

    // 方法是否独特（10 分）
    if (tags && tags.some(tag => tag.includes('创新') || tag.includes('新方法'))) {
      score += 10;
    } else if (!this.isCommonPattern(prompt.content)) {
      score += 5;
    }

    // 是否有新颖的角度（10 分）
    if (tags && tags.some(tag => ['新方法', '突破', '创新'].includes(tag))) {
      score += 10;
    }

    // 是否结合了多个技巧（5 分）
    if (tags && tags.length > 2) {
      score += 5;
    }

    return Math.min(score, 25);
  }

  /**
   * 计算完整性分数 (0-20)
   */
  static calculateCompleteness(prompt: any): number {
    let score = 0;
    const { content, description, tags } = prompt;

    // 说明详细程度（8 分）
    if (description && description.length > 100) {
      score += 8;
    } else if (description && description.length > 50) {
      score += 3;
    }

    // 参数说明（7 分）
    if (content && content.includes('{{') || content.includes('[可选]')) {
      score += 7;
    } else if (content && content.includes('参数') || content.includes('设置')) {
      score += 4;
    }

    // 注意事项（5 分）
    if (description && (description.includes('注意') || description.includes('提示'))) {
      score += 5;
    }

    return Math.min(score, 20);
  }

  /**
   * 计算热度分数 (0-25)
   */
  static calculatePopularity(prompt: any): number {
    const { metrics } = prompt;
    const { likes, retweets, replies, quotes, bookmarks, views } = metrics;

    // 点赞数（10 分）
    const likesScore = Math.min(likes / 100, 10);

    // 转发数（8 分）
    const retweetsScore = Math.min(retweets / 50, 8);

    // 评论数（7 分）
    const repliesScore = Math.min(replies / 20, 7);

    return likesScore + retweetsScore + repliesScore;
  }

  /**
   * 计算作者影响力分数 (0-5)
   */
  static calculateAuthorInfluence(prompt: any): number {
    const { author } = prompt;
    const { followerCount, verified, professional, expertise } = author;

    let score = 0;

    // 粉丝数（2 分）
    score += Math.min(Math.floor(followerCount / 10000), 2);

    // 认证状态（1 分）
    if (verified) {
      score += 1;
    }

    // 专业性（2 分）
    if (professional) {
      score += 2;
    }

    return Math.min(score, 5);
  }

  /**
   * 计算总分 (0-100)
   */
  static async evaluate(prompt: any): Promise<EvaluationResult> {
    const usefulness = this.calculateUsefulness(prompt);
    const innovation = this.calculateInnovation(prompt);
    const completeness = this.calculateCompleteness(prompt);
    const popularity = this.calculatePopularity(prompt);
    const authorInfluence = this.calculateAuthorInfluence(prompt);

    const score = usefulness * 0.3 + 
                  innovation * 0.25 + 
                  completeness * 0.2 + 
                  popularity * 0.25;

    const subScores = {
      usefulness,
      innovation,
      completeness,
      popularity,
      authorInfluence
    };

    // 确定 Tier
    const tier = this.determineTier(score);

    // 计算 Rank
    const rank = await this.calculateRank(score);

    return {
      score: Math.round(score * 100) / 100,
      subScores,
      tier,
      rank
    };
  }

  /**
   * 确定 Tier
   */
  static determineTier(score: number): string {
    if (score >= 90) return 'premium';
    if (score >= 85) return 'pro';
    if (score >= 80) return 'basic';
    if (score >= 70) return 'basic';
    if (score >= 60) return 'free';
    return 'free';
  }

  /**
   * 计算 Rank
   */
  static async calculateRank(score: number): Promise<number> {
    const higherRanked = await Prompt.countDocuments({
      'evaluation.score': { $gt: score }
    });

    return higherRanked + 1;
  }

  /**
   * 检查是否是常见模式
   */
  static isCommonPattern(content: string): boolean {
    const commonPatterns = [
      /tell me about/gi,
      /what is/gi,
      /how to/gi,
      /explain/gi,
      /give me/gi
    ];

    return commonPatterns.some(pattern => pattern.test(content));
  }

  /**
   * 批量评估提示词
   */
  static async evaluateBatch(prompts: any[]): Promise<any[]> {
    const results = await Promise.all(
      prompts.map(prompt => this.evaluate(prompt))
    );

    return prompts.map((prompt, index) => ({
      ...prompt,
      evaluation: results[index]
    }));
  }

  /**
   * 根据 Tier 和 Rank 排序
   */
  static sortAndRank(prompts: any[]): any[] {
    return prompts.sort((a, b) => {
      // 先按 Tier 排序
      const tierOrder = { premium: 4, pro: 3, basic: 2, free: 1 };
      const tierDiff = tierOrder[b.evaluation.tier] - tierOrder[a.evaluation.tier];

      if (tierDiff !== 0) {
        return tierDiff;
      }

      // 同 Tier 内按 Rank 排序
      return a.evaluation.rank - b.evaluation.rank;
    });
  }

  /**
   * 更新所有提示词的 Rank
   */
  static async updateAllRanks(): Promise<void> {
    const prompts = await Prompt.find({});
    const evaluated = await this.evaluateBatch(prompts);
    const sorted = this.sortAndRank(evaluated);

    for (const prompt of sorted) {
      await Prompt.findByIdAndUpdate(prompt._id, {
        $set: {
          'evaluation.rank': prompt.evaluation.rank
        }
      });
    }
  }
}
```

### 步骤 4: 创建抓取服务

**文件**: `src/services/scraperService.ts`

```typescript
import bird from 'bird';

export interface ScrapeResult {
  success: boolean;
  prompts: any[];
  error?: string;
}

export class ScraperService {
  /**
   * 从 Twitter 抓取提示词
   */
  static async scrapeTwitter(
    query: string,
    count: number = 20
  ): Promise<ScrapeResult> {
    try {
      console.log(`🔍 Scraping Twitter for: ${query}`);

      // 使用 Bird CLI 抓取
      const results = bird.tweets(query, { 
        'limit': count,
        'format': 'json'
      });

      if (!results || results.length === 0) {
        console.log('⚠️  No tweets found');
        return {
          success: false,
          prompts: [],
          error: 'No tweets found'
        };
      }

      console.log(`✅ Found ${results.length} tweets`);

      // 转换为提示词格式
      const prompts = results.map(tweet => ({
        title: tweet.text.substring(0, 100),
        description: tweet.text.substring(0, 200),
        content: tweet.text,
        type: this.detectType(tweet.text),
        category: this.detectCategory(tweet.text),
        tags: this.extractTags(tweet.text),
        models: this.detectModels(tweet.text),
        difficulty: this.detectDifficulty(tweet.text),
        useCases: this.extractUseCases(tweet.text),
        author: {
          username: tweet.username,
          followerCount: tweet.follower_count,
          verified: tweet.verified,
          professional: tweet.follower_count > 10000,
          expertise: this.detectExpertise(tweet.text)
        },
        publishedAt: new Date(tweet.date),
        scrapedAt: new Date(),
        metrics: {
          likes: tweet.favorite_count,
          retweets: tweet.retweet_count,
          replies: tweet.reply_count,
          quotes: tweet.quote_count,
          bookmarks: tweet.bookmark_count || 0,
          views: tweet.views || 0
        }
      }));

      console.log(`✅ Converted ${prompts.length} tweets to prompts`);

      return {
        success: true,
        prompts
      };
    } catch (error) {
      console.error('❌ Error scraping Twitter:', error);
      return {
        success: false,
        prompts: [],
        error: error.message
      };
    }
  }

  /**
   * 检测提示词类型
   */
  static detectType(text: string): 'writing' | 'coding' | 'marketing' | 'design' | 'analysis' | 'other' {
    const keywords = {
      writing: ['写', '文章', '博客', '邮件', '文案', '内容', '创作'],
      coding: ['代码', '编程', '开发', '应用', '网站', '算法', '调试', '优化'],
      marketing: ['营销', '广告', '推广', '销售', '转化', '品牌', '市场'],
      design: ['设计', 'UI', 'UX', '视觉', '图形', '图片', '色彩', '排版'],
      analysis: ['分析', '数据', '统计', '报告', '洞察', '预测', '模型']
    };

    text = text.toLowerCase();

    for (const [type, typeKeywords] of Object.entries(keywords)) {
      if (typeKeywords.some(keyword => text.includes(keyword))) {
        return type as any;
      }
    }

    return 'other';
  }

  /**
   * 检测分类
   */
  static detectCategory(text: string): string {
    const categories = {
      'ChatGPT写作': ['chatgpt', 'gpt', '写作', '文章', '博客'],
      '编程开发': ['编程', '开发', '代码', '应用', '网站'],
      'AI工具': ['工具', '应用', '平台', '软件'],
      'AI研究': ['研究', '论文', '模型', '算法'],
      'AI教程': ['教程', '学习', '入门', '指南'],
      'AI技巧': ['技巧', '方法', '最佳实践']
    };

    text = text.toLowerCase();

    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some(keyword => text.includes(keyword))) {
        return category;
      }
    }

    return '通用';
  }

  /**
   * 提取标签
   */
  static extractTags(text: string): string[] {
    const tags = [];
    const patterns = {
      hashtags: /#[\w]+/g,
      keywords: /(?:写作|编程|营销|设计|分析|教程|技巧|工具|应用|平台|软件|算法|模型|gpt|chatgpt|claude|ai|人工智能|机器学习|深度学习)/gi,
      model: /(?:ChatGPT|Claude|Gemini|Midjourney|Stable Diffusion|DALL-E)/gi
    };

    // 提取 hashtags
    const hashtags = text.match(patterns.hashtags);
    if (hashtags) {
      tags.push(...hashtags.map(tag => tag.replace('#', '').toLowerCase()));
    }

    // 提取关键词
    const keywords = text.match(patterns.keywords);
    if (keywords) {
      tags.push(...keywords.map(kw => kw.toLowerCase()));
    }

    // 提取模型
    const model = text.match(patterns.model);
    if (model) {
      tags.push(model[0].toLowerCase());
    }

    // 去重
    return [...new Set(tags)].slice(0, 10);
  }

  /**
   * 检测模型
   */
  static detectModels(text: string): string[] {
    const models = [];
    const patterns = {
      chatgpt: /ChatGPT|chatgpt|GPT-?|gpt-?/gi,
      claude: /Claude|claude|anthropic/gi,
      gemini: /Gemini|gemini|google/gi,
      midjourney: /Midjourney|midjourney|mj/gi,
      stableDiffusion: /Stable Diffusion|stable diffusion|sdxl/gi,
      dalle: /DALL-E|dalle|dall-e/gi
    };

    text = text.toLowerCase();

    for (const [model, pattern] of Object.entries(patterns)) {
      if (pattern.test(text)) {
        models.push(model);
      }
    }

    return [...new Set(models)].slice(0, 5);
  }

  /**
   * 检测难度
   */
  static detectDifficulty(text: string): 'beginner' | 'intermediate' | 'advanced' {
    const beginnerKeywords = ['入门', '基础', '新手', '初级', '开始'];
    const advancedKeywords = ['高级', '进阶', '精通', '专家', '深度'];

    text = text.toLowerCase();

    if (beginnerKeywords.some(kw => text.includes(kw))) {
      return 'beginner';
    }

    if (advancedKeywords.some(kw => text.includes(kw))) {
      return 'advanced';
    }

    return 'intermediate';
  }

  /**
   * 提取使用场景
   */
  static extractUseCases(text: string): string[] {
    const useCases = [];

    const patterns = {
      '写博客文章': /(?:写|写|创作|生成)(?:博客|文章|post|content)/gi,
      '生成代码': /(?:生成|写|创建)(?:代码|编程|code|programming|app|application)/gi,
      '撰写邮件': /(?:写|创建|生成)(?:邮件|邮件|email|message)/gi,
      '设计图形': /(?:设计|创建|生成)(?:图形|图片|UI|UX|design|graphic|image)/gi,
      '分析数据': /(?:分析|统计|报告|可视化)(?:数据|分析|analytics|data|visualize|report)/gi,
      '创建营销内容': /(?:生成|写|创作)(?:营销|广告|内容|文案|copywriting|marketing|content)/gi,
      '优化文本': /(?:优化|改进|编辑)(?:文本|内容|text|content|optimize|improve|edit)/gi,
      '生成创意': /(?:生成|创建|想出)(?:创意|想法|想法|idea|creative|ideation|brainstorm)/gi
    };

    for (const [useCase, pattern] of Object.entries(patterns)) {
      if (pattern.test(text)) {
        useCases.push(useCase);
      }
    }

    return useCases.slice(0, 5);
  }

  /**
   * 检测专业领域
   */
  static detectExpertise(text: string): string[] {
    const expertise = [];
    const patterns = {
      '自然语言处理': /(?:NLP|自然语言|文本处理|text processing|natural language)/gi,
      '计算机视觉': /(?:CV|计算机视觉|图像识别|image recognition|computer vision)/gi,
      '机器学习': /(?:机器学习|ML|machine learning|algorithmic learning)/gi,
      '深度学习': /(?:深度学习|DL|deep learning|neural|cnn|rnn)/gi,
      '大语言模型': /(?:LLM|大模型|large language model|GPT|Transformer|BERT)/gi
    };

    text = text.toLowerCase();

    for (const [exp, pattern] of Object.entries(patterns)) {
      if (pattern.test(text)) {
        expertise.push(exp);
      }
    }

    return expertise.slice(0, 3);
  }

  /**
   * 批量抓取
   */
  static async scrapeBatch(queries: string[]): Promise<any[]> {
    const results = await Promise.all(
      queries.map(query => this.scrapeTwitter(query, 20))
    );

    return results.flatMap(result => result.prompts);
  }

  /**
   * 定时抓取
   */
  static async scheduleScrape(queries: string[], interval: number = 3600000): Promise<void> {
    console.log(`⏰  Scheduled scrape every ${interval / 60000} hours`);

    while (true) {
      const startTime = Date.now();

      try {
        // 批量抓取
        const prompts = await this.scrapeBatch(queries);
        console.log(`✅ Scraped ${prompts.length} prompts`);

        // 评估所有提示词
        const { EvaluationService } = await import('./evaluationService');
        const evaluated = await EvaluationService.evaluateBatch(prompts);
        const sorted = EvaluationService.sortAndRank(evaluated);

        // 保存到数据库
        // （假设有 savePrompts 函数）

        console.log(`✅ Evaluated and sorted ${sorted.length} prompts`);

      } catch (error) {
        console.error('❌ Error in scheduled scrape:', error);
      }

      // 等待下一次抓取
      const elapsedTime = Date.now() - startTime;
      const waitTime = Math.max(0, interval - elapsedTime);
      console.log(`⏳  Waiting ${waitTime / 1000} seconds until next scrape...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
}
```

---

## 📋 手动创建项目结构

### 选项 1: 创建基础文件

**我会创建**:
- ✅ `backend/src/models/Prompt.ts` - 提示词数据模型
- ✅ `backend/src/services/evaluationService.ts` - 评估服务
- ✅ `backend/src/services/scraperService.ts` - 抓取服务
- ✅ `backend/src/config/database.ts` - 数据库配置
- ✅ `backend/src/routes/prompts.ts` - 提示词路由

### 选项 2: 创建完整 API

**我会创建**:
- ✅ 完整的 Express.js 项目结构
- ✅ MongoDB 连接
- ✅ Redis 缓存
- ✅ Stripe 支付集成
- ✅ 定时抓取任务

### 选项 3: 使用现有技能

**如果前端技能安装成功**:
- ✅ 使用 frontend-design 技能创建页面
- ✅ 使用 component-library 技能创建组件
- ✅ 使用 styling 技能配置主题

---

## 🎯 立即开始

### 选项 1: 创建后端数据模型

**你说**: "创建数据模型"

**我会**:
1. 创建 `Prompt.ts` 数据模型
2. 创建 `User.ts` 用户模型
3. 创建 `Category.ts` 分类模型
4. 创建 `Package.ts` 套餐模型
5. 创建数据库配置

### 选项 2: 创建评估系统

**你说**: "创建评估系统"

**我会**:
1. 创建 `evaluationService.ts` - 完整的评估逻辑
2. 实现 5 个维度的评分算法
3. 实现 Tier 分配逻辑
4. 实现 Rank 计算逻辑
5. 实现批量评估

### 选项 3: 创建抓取系统

**你说**: "创建抓取系统"

**我会**:
1. 创建 `scraperService.ts` - 抓取服务
2. 实现 Twitter 抓取
3. 实现数据转换和清洗
4. 实现自动分类和标签
5. 实现批量抓取

---

## 🚀 准备好了吗？

**请告诉我你的选择**：

- [ ] 选项 1: 创建数据模型
- [ ] 选项 2: 创建评估系统
- [ ] 选项 3: 创建抓取系统
- [ ] 选项 4: 创建完整 API（推荐）

---

**或者直接说"全部创建"**，我会创建所有后端系统！

---

**准备好开始了吗？** 🚀

（告诉我你的选择，我会立即开始创建文件！）
