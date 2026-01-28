#!/bin/bash

# Backend Scraping Script - AI Prompt Marketplace
> 使用 bird skill 从 Twitter/X 抓取 AI 提示词

set -e

PROJECT_DIR="/root/clawd/ai-prompt-marketplace/backend"
SCRAPER_DIR="$PROJECT_DIR/scraper"
RESULTS_DIR="$PROJECT_DIR/results"

echo "╔════════════════════════════════╗"
echo "║  🤖 后端抓取脚本启动           ║"
echo "╚════════════════════════════════╝"
echo ""

echo "📅 日期: $(date '+%Y-%m-%d')"
echo "⏱️  开始时间: $(date '+%H:%M:%S')"
echo ""

# 创建目录
mkdir -p "$SCRAPER_DIR"
mkdir -p "$SCRAPER_DIR/twitter"
mkdir -p "$RESULTS_DIR"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔍 1. 搜索可用的抓取技能"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 查找抓取相关技能
AVAILABLE_SKILLS=()
if [ -d "/usr/lib/node_modules/clawdbot/skills/bird" ]; then
    AVAILABLE_SKILLS+=("Bird CLI - Twitter/X 抓取")
fi

if [ ${#AVAILABLE_SKILLS[@]} -eq 0 ]; then
    echo "⚠️  未找到抓取技能"
    echo "💡 将手动创建抓取脚本"
else
    echo "✅ 找到抓取技能:"
    for skill in "${AVAILABLE_SKILLS[@]}"; do
        echo "   - $skill"
    done
    echo ""
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 2. 创建后端项目结构"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 创建项目结构
cd "$PROJECT_DIR"

# 创建源代码目录
mkdir -p src/{models,controllers,routes,services,middleware,utils,config}

echo "✅ 项目结构已创建"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📝 3. 创建数据模型"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 创建 Prompt 数据模型
cat > "src/models/Prompt.ts" << 'EOF'
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPrompt extends Document {
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
PromptSchema.index({ 'evaluation.rank': -1 });

const Prompt = mongoose.model('Prompt', PromptSchema);

export default Prompt;
EOF

echo "✅ Prompt 数据模型已创建"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🧪 4. 创建评估服务"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 创建评估服务
cat > "src/services/evaluationService.ts" << 'EOF'
import Prompt from '../models/Prompt';

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
  static async evaluate(prompt: any): Promise<any> {
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

    const tier = this.determineTier(score);
    const rank = await this.calculateRank(score);

    return {
      score: Math.round(score),
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
    if (score >= 60) return 'basic';
    if (score >= 50) return 'basic';
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
EOF

echo "✅ 评估服务已创建"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔍 5. 创建抓取服务"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 创建抓取服务（手动实现）
cat > "src/services/scraperService.ts" << 'EOF'
import { execSync } from 'child_process';

export interface ScrapeResult {
  success: boolean;
  prompts: any[];
  error?: string;
}

export class ScraperService {
  /**
   * 从 Twitter/X 抓取提示词（使用 bird skill）
   */
  static async scrapeTwitter(
    query: string,
    count: number = 20
  ): Promise<ScrapeResult> {
    try {
      console.log(`🔍 Scraping Twitter for: ${query}`);

      // 尝试使用 bird CLI
      let results: any[];
      try {
        const birdOutput = execSync(`bird tweets "${query}" --limit ${count} --json`, {
          encoding: 'utf-8'
        });
        
        results = JSON.parse(birdOutput);
      } catch (error) {
        console.error('❌ Bird CLI error:', error);
        return {
          success: false,
          prompts: [],
          error: 'Bird CLI not configured or failed'
        };
      }

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
      const prompts = results.map((tweet: any) => ({
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
          followerCount: tweet.follower_count || 0,
          verified: tweet.verified || false,
          professional: (tweet.follower_count || 0) > 10000,
          expertise: this.detectExpertise(tweet.text)
        },
        publishedAt: new Date(tweet.date || tweet.created_at),
        scrapedAt: new Date(),
        metrics: {
          likes: tweet.favorite_count || 0,
          retweets: tweet.retweet_count || 0,
          replies: tweet.reply_count || 0,
          quotes: tweet.quote_count || 0,
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
      chatgpt: /ChatGPT|chatgpt|GPT-?/gi,
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
      '生成创意': /(?:生成|创建|想出)(?:创意|想法|idea|creative|ideation|brainstorm)/gi
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

        // 保存到数据库（模拟）
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
EOF

echo "✅ 抓取服务已创建"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎯 6. 创建主服务器"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 创建 Express.js 服务器
cat > "src/app.ts" << 'EOF'
import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

// MongoDB 连接
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-prompt-marketplace';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// 创建 Express 应用
const app = express();

// 中间件
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 路由
import { ScraperService } from './services/scraperService';
import { EvaluationService } from './services/evaluationService';

// 抓取端点
app.post('/api/scrape', async (req: Request, res: Response) => {
  try {
    const { query, count } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    const result = await ScraperService.scrapeTwitter(query, count || 20);
    
    // 评估提示词
    const evaluated = await EvaluationService.evaluateBatch(result.prompts);
    const sorted = EvaluationService.sortAndRank(evaluated);

    return res.json({
      success: true,
      scraped: result.prompts.length,
      evaluated: sorted.length,
      prompts: sorted
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// 批量抓取端点
app.post('/api/scrape/batch', async (req: Request, res: Response) => {
  try {
    const { queries } = req.body;
    
    if (!queries || !Array.isArray(queries)) {
      return res.status(400).json({ error: 'Queries must be an array' });
    }

    const prompts = await ScraperService.scrapeBatch(queries);
    
    // 评估提示词
    const evaluated = await EvaluationService.evaluateBatch(prompts);
    const sorted = EvaluationService.sortAndRank(evaluated);

    return res.json({
      success: true,
      scraped: prompts.length,
      evaluated: sorted.length,
      prompts: sorted
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// 评估端点
app.post('/api/evaluate', async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const evaluation = await EvaluationService.evaluate(prompt);
    
    return res.json({
      success: true,
      evaluation
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// 批量评估端点
app.post('/api/evaluate/batch', async (req: Request, res: Response) => {
  try {
    const { prompts } = req.body;
    
    if (!prompts || !Array.isArray(prompts)) {
      return res.status(400).json({ error: 'Prompts must be an array' });
    }

    const evaluated = await EvaluationService.evaluateBatch(prompts);
    const sorted = EvaluationService.sortAndRank(evaluated);

    return res.json({
      success: true,
      evaluated: sorted.length,
      prompts: sorted
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// 更新所有 Rank
app.post('/api/evalution/update-ranks', async (req: Request, res: Response) => {
  try {
    await EvaluationService.updateAllRanks();
    
    return res.json({
      success: true,
      message: 'All ranks updated successfully'
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// 健康检查
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 错误处理
app.use((err: Error, req: Request, res: Response, next: any) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('╔════════════════════════════════╗');
  console.log('║  🚀 服务器启动                ║');
  console.log('║  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━ ║');
  console.log('║  📡  端口: ' + PORT + '             ║');
  console.log('║  🧪  环境: ' + (process.env.NODE_ENV || 'development') + '     ║');
  console.log('╚════════════════════════════════╝');
  console.log('');
  console.log('📋 可用的端点:');
  console.log('  POST /api/scrape - 抓取单次查询');
  console.log('  POST /api/scrape/batch - 批量抓取');
  console.log('  POST /api/evaluate - 评估单个提示词');
  console.log('  POST /api/evaluate/batch - 批量评估');
  console.log('  POST /api/evalution/update-ranks - 更新所有 Rank');
  console.log('  GET  /api/health - 健康检查');
  console.log('');
});
EOF

echo "✅ 主服务器已创建"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📝 7. 创建 package.json"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

cat > "package.json" << 'EOF'
{
  "name": "ai-prompt-marketplace-backend",
  "version": "1.0.0",
  "description": "AI Prompt Marketplace Backend - Scraping & Evaluation System",
  "main": "dist/app.js",
  "scripts": {
    "dev": "ts-node src/app.ts",
    "build": "tsc",
    "start": "node dist/app.js",
    "lint": "eslint . --ext .ts",
    "test": "jest"
  },
  "keywords": [
    "ai",
    "prompt",
    "marketplace",
    "scraping",
    "evaluation",
    "twitter",
    "chatgpt",
    "claude"
  ],
  "author": "jack happy + Clawdbot",
  "license": "MIT",
  "devDependencies": {
    "@types/express": "^4.17.0",
    "@types/node": "^20.0.0",
    "ts-node": "^10.9.0",
    "typescript": "^5.0.0",
    "eslint": "^9.0.0",
    "jest": "^29.0.0",
    "eslint-config-airbnb-typescript": "^24.0.0"
  },
  "dependencies": {
    "express": "^4.18.0",
    "mongoose": "^8.0.0",
    "dotenv": "^16.0.0",
    "cors": "^2.8.5",
    "helmet": "^7.0.0",
    "morgan": "^1.10.0"
  },
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=9.0.0"
  }
}
EOF

echo "✅ package.json 已创建"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📝 8. 创建 tsconfig.json"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

cat > "tsconfig.json" << 'EOF'
{
  "compilerOptions": {
    "target": "es2020",
    "module": "commonjs",
    "lib": ["es2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "allowUmdGlobalAccess": true
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
EOF

echo "✅ tsconfig.json 已创建"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📝 9. 创建 .env.example"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

cat > ".env.example" << 'EOF'
# MongoDB 连接
MONGODB_URI=mongodb://localhost:27017/ai-prompt-marketplace

# 服务器配置
PORT=3000
NODE_ENV=development

# 抓取配置
SCRAPE_INTERVAL=3600000  # 6 hours in milliseconds

# 评估配置
ENABLE_EVALUATION=true
ENABLE_AUTO_RANKING=true

# 日志配置
LOG_LEVEL=info
ENABLE_DEBUG=true
EOF

echo "✅ .env.example 已创建"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📝 10. 创建 .gitignore"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

cat > ".gitignore" << 'EOF'
# Dependencies
node_modules/
dist/
jspm_packages/

# Environment
.env
.env.local

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db
EOF

echo "✅ .gitignore 已创建"
echo ""

echo "╔════════════════════════════════════════╗"
echo "║  🎉 后端项目已创建！                   ║"
echo "╚════════════════════════════════════════╝"
echo ""

echo "📊 项目结构:"
echo ""
tree -L 3 || find . -maxdepth 3 -type d | sort
echo ""

echo "📋 下一步:"
echo ""
echo "1. 安装依赖:"
echo "   npm install"
echo ""
echo "2. 运行开发服务器:"
echo "   npm run dev"
echo ""
echo "3. 测试抓取端点:"
echo "   curl -X POST http://localhost:3000/api/scrape \\"
echo "     -H 'Content-Type: application/json' \\"
echo "     -d '{\"query\": \"ChatGPT提示词\", \"count\": 20}'"
echo ""
echo "4. 测试评估端点:"
echo "   curl -X POST http://localhost:3000/api/evaluate \\"
echo "     -H 'Content-Type: application/json' \\"
echo "     -d '{\"prompt\": {...}}'"
echo ""
echo "5. 更新所有 Rank:"
echo "   curl -X POST http://localhost:3000/api/evalution/update-ranks"
echo ""

echo "🎯 核心功能:"
echo "  - ✅ 数据模型（Prompt)"
echo "  - ✅ 评估服务（5 维度 100 分制）"
echo "  - ✅ 抓取服务（Twitter/X 使用 bird skill）"
echo "  - ✅ Express.js 服务器"
echo "  - ✅ REST API 端点"
echo "  - ✅ TypeScript 类型安全"
echo "  - ✅ MongoDB 集成"
echo "  - ✅ 批量抓取和评估"
echo ""
echo "🚀 准备好了吗？"
echo ""
echo "下一步:"
echo "1. cd /root/clawd/ai-prompt-marketplace/backend"
echo "2. npm install"
echo "3. npm run dev"
echo "4. 测试 API 端点"
echo ""
echo "📞 有问题？"
echo "   - 检查日志"
echo "   - 查看 API 文档"
echo "   - 询问 jack happy"
echo ""
