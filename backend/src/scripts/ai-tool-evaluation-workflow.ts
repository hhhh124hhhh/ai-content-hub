/**
 * AI Tool Evaluation Workflow
 * 评估 AI 工具的质量，生成排行榜和推荐报告
 */

import { AIToolEvaluatorService } from '../services/aiToolEvaluatorService';
import * as fs from 'fs';
import * as path from 'path';

export interface AIToolEvaluationWorkflowConfig {
  tools: any[];
  outputDir: string;
  generateLeaderboard?: boolean;
  generateDetailedReports?: boolean;
}

export class AIToolEvaluationWorkflow {
  /**
   * 完整工作流：评估 → 排名 → 生成报告
   */
  static async runWorkflow(
    config: AIToolEvaluationWorkflowConfig
  ) {
    const {
      tools,
      outputDir,
      generateLeaderboard = true,
      generateDetailedReports = true
    } = config;

    console.log('🚀 Starting AI Tool Evaluation Workflow...\n');

    // 步骤 1: 评估所有工具
    console.log('📊 Step 1: Evaluating AI tools...');
    const evaluations = await AIToolEvaluatorService.evaluateBatch(tools);
    console.log(`✅ Evaluated ${evaluations.length} tools\n`);

    // 步骤 2: 排序并排名
    console.log('🏆 Step 2: Ranking tools...');
    const rankedTools = AIToolEvaluatorService.sortAndRank(tools, evaluations);
    console.log(`✅ Ranked ${rankedTools.length} tools\n`);

    // 步骤 3: 保存评估结果
    console.log('💾 Step 3: Saving evaluation results...');
    await this.saveEvaluationResults(rankedTools, outputDir);
    console.log('✅ Results saved\n');

    // 步骤 4: 生成排行榜
    if (generateLeaderboard) {
      console.log('📋 Step 4: Generating leaderboard...');
      const leaderboard = AIToolEvaluatorService.generateLeaderboard(rankedTools);
      await this.saveLeaderboard(leaderboard, outputDir);
      console.log('✅ Leaderboard generated\n');
    }

    // 步骤 5: 生成详细报告
    if (generateDetailedReports) {
      console.log('📄 Step 5: Generating detailed reports...');
      await this.generateDetailedReports(rankedTools, outputDir);
      console.log('✅ Detailed reports generated\n');
    }

    // 步骤 6: 生成汇总报告
    console.log('📊 Step 6: Generating summary report...');
    const summaryReport = this.generateSummaryReport(rankedTools, evaluations);
    await this.saveSummaryReport(summaryReport, outputDir);
    console.log('✅ Summary report generated\n');

    console.log('🎉 Workflow completed successfully!\n');

    return {
      evaluated: evaluations.length,
      ranked: rankedTools.length,
      outputDir,
      topTool: rankedTools[0]
    };
  }

  /**
   * 保存评估结果
   */
  private static async saveEvaluationResults(
    rankedTools: any[],
    outputDir: string
  ): Promise<void> {
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const jsonPath = path.join(outputDir, `ai-tools-evaluation-${Date.now()}.json`);
    fs.writeFileSync(jsonPath, JSON.stringify(rankedTools, null, 2), 'utf-8');
    console.log(`📄 Saved to: ${jsonPath}`);
  }

  /**
   * 保存排行榜
   */
  private static async saveLeaderboard(
    leaderboard: string,
    outputDir: string
  ): Promise<void> {
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const leaderboardPath = path.join(outputDir, `ai-tools-leaderboard-${Date.now()}.md`);
    fs.writeFileSync(leaderboardPath, leaderboard, 'utf-8');
    console.log(`📄 Saved to: ${leaderboardPath}`);
  }

  /**
   * 生成详细报告
   */
  private static async generateDetailedReports(
    rankedTools: any[],
    outputDir: string
  ): Promise<void> {
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const reportsDir = path.join(outputDir, 'detailed-reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    for (const item of rankedTools) {
      const report = AIToolEvaluatorService.generateEvaluationReport(
        item.tool,
        item.evaluation
      );

      const reportPath = path.join(
        reportsDir,
        `${this.sanitizeFileName(item.tool.name)}-${Date.now()}.md`
      );
      fs.writeFileSync(reportPath, report, 'utf-8');
    }

    console.log(`📄 Generated ${rankedTools.length} detailed reports`);
  }

  /**
   * 保存汇总报告
   */
  private static async saveSummaryReport(
    report: string,
    outputDir: string
  ): Promise<void> {
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const reportPath = path.join(outputDir, `ai-tools-summary-${Date.now()}.md`);
    fs.writeFileSync(reportPath, report, 'utf-8');
    console.log(`📄 Saved to: ${reportPath}`);
  }

  /**
   * 生成汇总报告
   */
  private static generateSummaryReport(
    rankedTools: any[],
    evaluations: any[]
  ): string {
    const avgScore = evaluations.reduce((sum, e) => sum + e.score, 0) / evaluations.length;
    const premiumCount = evaluations.filter(e => e.tier === 'premium').length;
    const proCount = evaluations.filter(e => e.tier === 'pro').length;
    const basicCount = evaluations.filter(e => e.tier === 'basic').length;
    const freeCount = evaluations.filter(e => e.tier === 'free').length;

    let report = `# AI Tools Evaluation Summary Report

Generated: ${new Date().toISOString()}

## Overview

| Metric | Value |
|--------|-------|
| Total Tools Evaluated | ${evaluations.length} |
| Average Score | ${avgScore.toFixed(1)}/100 |
| Premium Tier (≥90) | ${premiumCount} |
| Pro Tier (80-89) | ${proCount} |
| Basic Tier (70-79) | ${basicCount} |
| Free Tier (<70) | ${freeCount} |

## Top 10 AI Tools

`;

    const top10 = rankedTools.slice(0, 10);

    top10.forEach((item, index) => {
      report += `
### ${index + 1}. ${item.tool.name} (Rank: ${item.rank})

**Score:** ${item.evaluation.score}/100
**Tier:** ${item.evaluation.tier.toUpperCase()}
**Category:** ${item.tool.category}

**Sub-Scores:**
- Functionality: ${item.evaluation.subScores.functionality}/25
- Performance: ${item.evaluation.subScores.performance}/20
- Usability: ${item.evaluation.subScores.usability}/20
- Innovation: ${item.evaluation.subScores.innovation}/15
- Popularity: ${item.evaluation.subScores.popularity}/20

**Recommendations:**
${item.evaluation.recommendations.map(r => `- ${r}`).join('\n')}

**Concerns:**
${item.evaluation.concerns.map(c => `- ${c}`).join('\n') || 'None'}

**Pricing:** ${item.tool.pricing?.model || 'N/A'}
${item.tool.pricing?.priceRange ? `- ${item.tool.pricing.priceRange}` : ''}

---
`;
    });

    // 统计分析
    report += `
## Statistical Analysis

### Score Distribution

| Range | Count | Percentage |
|-------|-------|------------|
| 90-100 | ${evaluations.filter(e => e.score >= 90).length} | ${((evaluations.filter(e => e.score >= 90).length / evaluations.length) * 100).toFixed(1)}% |
| 80-89 | ${evaluations.filter(e => e.score >= 80 && e.score < 90).length} | ${((evaluations.filter(e => e.score >= 80 && e.score < 90).length / evaluations.length) * 100).toFixed(1)}% |
| 70-79 | ${evaluations.filter(e => e.score >= 70 && e.score < 80).length} | ${((evaluations.filter(e => e.score >= 70 && e.score < 80).length / evaluations.length) * 100).toFixed(1)}% |
| 60-69 | ${evaluations.filter(e => e.score >= 60 && e.score < 70).length} | ${((evaluations.filter(e => e.score >= 60 && e.score < 70).length / evaluations.length) * 100).toFixed(1)}% |
| <60 | ${evaluations.filter(e => e.score < 60).length} | ${((evaluations.filter(e => e.score < 60).length / evaluations.length) * 100).toFixed(1)}% |

### Category Distribution

`;

    // 按类别统计
    const categories = {};
    rankedTools.forEach(item => {
      const cat = item.tool.category;
      categories[cat] = (categories[cat] || 0) + 1;
    });

    Object.entries(categories)
      .sort((a, b) => b[1] - a[1])
      .forEach(([category, count]) => {
        report += `- ${category}: ${count} tools (${((count / evaluations.length) * 100).toFixed(1)}%)\n`;
      });

    report += `

---

*Generated by Clawdbot AI Tool Evaluator*
`;

    return report;
  }

  /**
   * 清理文件名
   */
  private static sanitizeFileName(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }

  /**
   * 测试模式：评估少量工具进行测试
   */
  static async testMode(): Promise<any> {
    console.log('🧪 Running in TEST MODE...\n');

    const testTools = [
      {
        id: '1',
        name: 'ChatGPT',
        description: 'OpenAI\'s advanced language model for text generation, coding assistance, and problem-solving.',
        url: 'https://chat.openai.com',
        category: 'Text Generation',
        features: [
          'Advanced text generation',
          'Code writing and debugging',
          'Multi-language support',
          'API integration',
          'Custom instructions'
        ],
        pricing: {
          model: 'freemium',
          priceRange: '$0-$20/month',
          freeTier: 'GPT-3.5 free',
          paidPlans: ['Plus $20/month', 'Team $25/user/month']
        },
        metrics: {
          users: 100000000,
          rating: 4.5,
          reviewsCount: 50000,
          popularityScore: 95
        }
      },
      {
        id: '2',
        name: 'Claude',
        description: 'Anthropic\'s AI assistant designed for helpfulness, honesty, and safety.',
        url: 'https://claude.ai',
        category: 'Text Generation',
        features: [
          'Context-aware conversations',
          'Document analysis',
          'Code generation',
          'Long-form writing',
          'Safety-focused design'
        ],
        pricing: {
          model: 'freemium',
          priceRange: '$0-$20/month',
          freeTier: 'Claude Haiku free',
          paidPlans: ['Pro $20/month', 'Team $25/user/month']
        },
        metrics: {
          users: 10000000,
          rating: 4.7,
          reviewsCount: 15000,
          popularityScore: 85
        }
      }
    ];

    const result = await this.runWorkflow({
      tools: testTools,
      outputDir: '/root/clawd/ai-prompt-marketplace/backend/results',
      generateLeaderboard: true,
      generateDetailedReports: true
    });

    console.log('🧪 Test completed.\n');

    return result;
  }

  /**
   * 生产模式：完整工作流
   */
  static async productionMode(tools: any[]): Promise<any> {
    console.log('🚀 Running in PRODUCTION MODE...\n');

    const result = await this.runWorkflow({
      tools,
      outputDir: '/root/clawd/ai-prompt-marketplace/backend/results',
      generateLeaderboard: true,
      generateDetailedReports: true
    });

    console.log('🚀 Production workflow completed.\n');

    return result;
  }
}

// CLI 接口
if (require.main === module) {
  const args = process.argv.slice(2);
  const mode = args[0] || 'production';

  if (mode === 'test') {
    AIToolEvaluationWorkflow.testMode();
  } else if (mode === 'production') {
    console.log('Please provide tools data for production mode.');
    console.log('Usage: node ai-tool-evaluation-workflow.js production <tools.json>');
    process.exit(1);
  } else {
    console.log('Usage:');
    console.log('  node ai-tool-evaluation-workflow.js test');
    console.log('  node ai-tool-evaluation-workflow.js production <tools.json>');
    process.exit(1);
  }
}
