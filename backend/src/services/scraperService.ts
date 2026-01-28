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
