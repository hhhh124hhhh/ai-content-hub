/**
 * AI Tool Evaluator Service
 * 评估 AI 工具的质量，包括功能、性能、用户体验等维度
 */

export interface AITool {
  id: string;
  name: string;
  description: string;
  url?: string;
  category: string;
  features: string[];
  pricing?: PricingInfo;
  metrics?: ToolMetrics;
  reviews?: Review[];
}

export interface PricingInfo {
  model: 'free' | 'freemium' | 'paid' | 'subscription' | 'usage-based';
  priceRange?: string;
  freeTier?: string;
  paidPlans?: string[];
}

export interface ToolMetrics {
  users?: number;
  rating?: number;
  reviewsCount?: number;
  popularityScore?: number;
  mentions?: number;
}

export interface Review {
  author: string;
  rating: number;
  comment: string;
  date: Date;
}

export interface ToolEvaluation {
  score: number; // 0-100
  subScores: {
    functionality: number; // 功能性 (0-25)
    performance: number;   // 性能 (0-20)
    usability: number;     // 易用性 (0-20)
    innovation: number;    // 创新性 (0-15)
    popularity: number;     // 热度 (0-20)
  };
  tier: 'premium' | 'pro' | 'basic' | 'free';
  rank?: number;
  recommendations: string[];
  concerns: string[];
}

export class AIToolEvaluatorService {
  /**
   * 评估 AI 工具
   */
  static async evaluate(tool: AITool): Promise<ToolEvaluation> {
    console.log(`🔍 Evaluating AI Tool: ${tool.name}`);

    const functionality = this.evaluateFunctionality(tool);
    const performance = this.evaluatePerformance(tool);
    const usability = this.evaluateUsability(tool);
    const innovation = this.evaluateInnovation(tool);
    const popularity = this.evaluatePopularity(tool);

    const score = functionality * 0.25 +
                  performance * 0.20 +
                  usability * 0.20 +
                  innovation * 0.15 +
                  popularity * 0.20;

    const subScores = {
      functionality,
      performance,
      usability,
      innovation,
      popularity
    };

    const tier = this.determineTier(score);
    const recommendations = this.generateRecommendations(tool, subScores);
    const concerns = this.generateConcerns(tool, subScores);

    return {
      score: Math.round(score),
      subScores,
      tier,
      recommendations,
      concerns
    };
  }

  /**
   * 评估功能性 (0-25)
   */
  private static evaluateFunctionality(tool: AITool): number {
    let score = 0;

    // 功能数量 (10 分)
    score += Math.min(tool.features.length * 2, 10);

    // 功能多样性 (5 分)
    const categories = new Set(
      tool.features.map(f => this.categorizeFeature(f))
    );
    score += categories.size * 1.25;

    // 核心功能完整性 (5 分)
    if (this.hasCoreFeatures(tool)) {
      score += 5;
    } else if (tool.features.length >= 3) {
      score += 3;
    }

    // API 集成能力 (5 分)
    if (this.hasAPICapability(tool)) {
      score += 5;
    }

    return Math.min(score, 25);
  }

  /**
   * 评估性能 (0-20)
   */
  private static evaluatePerformance(tool: AITool): number {
    let score = 0;

    // 用户评分 (8 分)
    if (tool.metrics?.rating) {
      score += (tool.metrics.rating / 5) * 8;
    } else if (tool.reviews && tool.reviews.length > 0) {
      const avgRating = tool.reviews.reduce((sum, r) => sum + r.rating, 0) / tool.reviews.length;
      score += (avgRating / 5) * 8;
    }

    // 用户数量 (6 分)
    if (tool.metrics?.users) {
      score += Math.min(Math.log10(tool.metrics.users) / 6, 6);
    }

    // 响应速度 (3 分) - 需要实际测试
    score += 3; // 假设平均性能

    // 稳定性 (3 分) - 基于评论
    if (tool.reviews) {
      const stabilityMentions = tool.reviews.filter(r =>
        r.comment.toLowerCase().includes('stable') ||
        r.comment.toLowerCase().includes('reliable')
      ).length;
      score += Math.min(stabilityMentions, 3);
    }

    return Math.min(score, 20);
  }

  /**
   * 评估易用性 (0-20)
   */
  private static evaluateUsability(tool: AITool): number {
    let score = 0;

    // 定价模式 (5 分)
    if (tool.pricing?.model === 'free') {
      score += 5;
    } else if (tool.pricing?.model === 'freemium') {
      score += 4;
    } else if (tool.pricing?.freeTier) {
      score += 3;
    }

    // 文档和教程 (5 分)
    if (this.hasDocumentation(tool)) {
      score += 5;
    }

    // 用户界面 (5 分) - 需要实际测试
    score += 4; // 假设平均 UI

    // 社区支持 (5 分)
    if (tool.metrics?.mentions && tool.metrics.mentions > 100) {
      score += 5;
    }

    return Math.min(score, 20);
  }

  /**
   * 评估创新性 (0-15)
   */
  private static evaluateInnovation(tool: AITool): number {
    let score = 0;

    // 独特功能 (7 分)
    const uniqueFeatures = tool.features.filter(f => this.isUniqueFeature(f));
    score += Math.min(uniqueFeatures.length * 2, 7);

    // 新颖技术 (4 分)
    if (this.usesNovelTechnology(tool)) {
      score += 4;
    }

    // 解决方案创新 (4 分)
    if (this.hasInnovativeSolution(tool)) {
      score += 4;
    }

    return Math.min(score, 15);
  }

  /**
   * 评估热度 (0-20)
   */
  private static evaluatePopularity(tool: AITool): number {
    let score = 0;

    // 用户数量 (7 分)
    if (tool.metrics?.users) {
      score += Math.min(Math.log10(tool.metrics.users) / 7, 7);
    }

    // 评论数量 (5 分)
    if (tool.metrics?.reviewsCount) {
      score += Math.min(Math.log10(tool.metrics.reviewsCount) / 3, 5);
    }

    // 社交媒体提及 (5 分)
    if (tool.metrics?.mentions) {
      score += Math.min(Math.log10(tool.metrics.mentions) / 3, 5);
    }

    // 流行度评分 (3 分)
    if (tool.metrics?.popularityScore) {
      score += (tool.metrics.popularityScore / 100) * 3;
    }

    return Math.min(score, 20);
  }

  /**
   * 确定等级
   */
  private static determineTier(score: number): 'premium' | 'pro' | 'basic' | 'free' {
    if (score >= 90) return 'premium';
    if (score >= 80) return 'pro';
    if (score >= 70) return 'basic';
    return 'free';
  }

  /**
   * 生成推荐
   */
  private static generateRecommendations(tool: AITool, subScores: any): string[] {
    const recommendations = [];

    if (subScores.functionality >= 20) {
      recommendations.push('✅ 功能强大，适合复杂任务');
    }
    if (subScores.performance >= 15) {
      recommendations.push('✅ 性能优秀，响应快速');
    }
    if (subScores.usability >= 15) {
      recommendations.push('✅ 易于上手，界面友好');
    }
    if (subScores.innovation >= 10) {
      recommendations.push('✅ 创新性强，技术先进');
    }
    if (subScores.popularity >= 15) {
      recommendations.push('✅ 用户广泛，社区活跃');
    }

    if (recommendations.length === 0) {
      recommendations.push('⚠️ 建议进一步评估');
    }

    return recommendations;
  }

  /**
   * 生成关注点
   */
  private static generateConcerns(tool: AITool, subScores: any): string[] {
    const concerns = [];

    if (subScores.functionality < 15) {
      concerns.push('⚠️ 功能相对简单，可能无法满足复杂需求');
    }
    if (subScores.performance < 10) {
      concerns.push('⚠️ 性能表现一般，响应可能较慢');
    }
    if (subScores.usability < 10) {
      concerns.push('⚠️ 学习曲线较陡，需要时间适应');
    }
    if (subScores.innovation < 8) {
      concerns.push('⚠️ 创新性一般，与同类工具差异不大');
    }
    if (subScores.popularity < 10) {
      concerns.push('⚠️ 用户较少，社区支持有限');
    }

    return concerns;
  }

  // 辅助方法

  private static categorizeFeature(feature: string): string {
    const categories = {
      'text': ['text', 'writing', 'content', 'generation', 'copy'],
      'image': ['image', 'visual', 'graphic', 'design', 'photo'],
      'audio': ['audio', 'sound', 'voice', 'speech', 'music'],
      'code': ['code', 'programming', 'development', 'api'],
      'data': ['data', 'analysis', 'analytics', 'statistics'],
      'automation': ['automation', 'workflow', 'integration']
    };

    const lowerFeature = feature.toLowerCase();
    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some(kw => lowerFeature.includes(kw))) {
        return category;
      }
    }
    return 'other';
  }

  private static hasCoreFeatures(tool: AITool): boolean {
    const coreKeywords = ['generate', 'create', 'analyze', 'transform', 'process'];
    return tool.features.some(f =>
      coreKeywords.some(kw => f.toLowerCase().includes(kw))
    );
  }

  private static hasAPICapability(tool: AITool): boolean {
    return tool.features.some(f =>
      f.toLowerCase().includes('api') ||
      f.toLowerCase().includes('integration') ||
      f.toLowerCase().includes('plugin')
    );
  }

  private static hasDocumentation(tool: AITool): boolean {
    // 在实际应用中，这里可以检查是否有文档链接
    return true;
  }

  private static isUniqueFeature(feature: string): boolean {
    const uniqueKeywords = ['novel', 'unique', 'first-of-its-kind', 'breakthrough'];
    return uniqueKeywords.some(kw => feature.toLowerCase().includes(kw));
  }

  private static usesNovelTechnology(tool: AITool): boolean {
    const novelTechKeywords = ['gpt-4', 'claude-3', 'midjourney', 'dall-e 3', 'stable diffusion'];
    return tool.description.toLowerCase().split(' ').some(word =>
      novelTechKeywords.some(tech => word.includes(tech))
    );
  }

  private static hasInnovativeSolution(tool: AITool): boolean {
    const solutionKeywords = ['new approach', 'innovative', 'breakthrough', 'revolutionary'];
    return solutionKeywords.some(kw => tool.description.toLowerCase().includes(kw));
  }

  /**
   * 批量评估工具
   */
  static async evaluateBatch(tools: AITool[]): Promise<ToolEvaluation[]> {
    console.log(`🔍 Evaluating ${tools.length} AI Tools...`);

    const results = await Promise.all(
      tools.map(tool => this.evaluate(tool))
    );

    console.log(`✅ Evaluated ${results.length} tools`);

    return results;
  }

  /**
   * 生成评估报告
   */
  static generateEvaluationReport(
    tool: AITool,
    evaluation: ToolEvaluation
  ): string {
    return `
# AI Tool Evaluation Report

## ${tool.name}

### Overview
${tool.description}

### Category
${tool.category}

### Overall Score: ${evaluation.score}/100
Tier: **${evaluation.tier.toUpperCase()}**

### Detailed Scores

| Dimension | Score | Max |
|-----------|-------|-----|
| Functionality | ${evaluation.subScores.functionality}/25 | 25 |
| Performance | ${evaluation.subScores.performance}/20 | 20 |
| Usability | ${evaluation.subScores.usability}/20 | 20 |
| Innovation | ${evaluation.subScores.innovation}/15 | 15 |
| Popularity | ${evaluation.subScores.popularity}/20 | 20 |

### Features
${tool.features.map(f => `- ${f}`).join('\n')}

### Recommendations
${evaluation.recommendations.map(r => `- ${r}`).join('\n')}

### Concerns
${evaluation.concerns.map(c => `- ${c}`).join('\n')}

### Pricing
${tool.pricing?.model || 'N/A'}
${tool.pricing?.priceRange ? `- ${tool.pricing.priceRange}` : ''}

---

*Generated by Clawdbot AI Tool Evaluator*
`;
  }

  /**
   * 排序并排名工具
   */
  static sortAndRank(tools: AITool[], evaluations: ToolEvaluation[]): {
    tool: AITool;
    evaluation: ToolEvaluation;
    rank: number;
  }[] {
    const ranked = tools.map((tool, index) => ({
      tool,
      evaluation: evaluations[index],
      rank: 0
    }));

    // 按评分排序
    ranked.sort((a, b) => b.evaluation.score - a.evaluation.score);

    // 分配排名
    ranked.forEach((item, index) => {
      item.rank = index + 1;
    });

    return ranked;
  }

  /**
   * 生成排行榜
   */
  static generateLeaderboard(rankedTools: {
    tool: AITool;
    evaluation: ToolEvaluation;
    rank: number;
  }[]): string {
    let output = `
# AI Tools Leaderboard

## Top ${rankedTools.length} AI Tools

| Rank | Tool | Score | Tier | Category |
|------|------|-------|------|----------|
`;

    rankedTools.forEach(item => {
      output += `| ${item.rank} | ${item.tool.name} | ${item.evaluation.score}/100 | ${item.evaluation.tier} | ${item.tool.category} |\n`;
    });

    return output;
  }
}
