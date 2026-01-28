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
