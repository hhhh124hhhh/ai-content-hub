/**
 * Prompt to Skill Workflow
 * 从 X 抓取提示词 → 评估质量 → 转换为 Skill → 发布到 ClawdHub
 */

import { ScraperService } from '../services/scraperService';
import { EvaluationService } from '../services/evaluationService';
import { SkillConverterService } from '../services/skillConverterService';
import * as fs from 'fs';
import * as path from 'path';

export class PromptToSkillWorkflow {
  /**
   * 完整工作流：抓取 → 评估 → 转换 → 发布
   */
  static async runWorkflow(
    queries: string[],
    options: {
      scrapeCount?: number;
      minScore?: number;
      autoPublish?: boolean;
      outputDir?: string;
    } = {}
  ) {
    const {
      scrapeCount = 20,
      minScore = 70,
      autoPublish = true,
      outputDir = '/root/clawd/ai-prompt-marketplace/backend/results'
    } = options;

    console.log('🚀 Starting Prompt to Skill Workflow...\n');

    // 步骤 1: 抓取提示词
    console.log('📥 Step 1: Scraping prompts from X...');
    const scrapeResults = await Promise.all(
      queries.map(query => ScraperService.scrapeTwitter(query, scrapeCount))
    );

    const allPrompts = scrapeResults.flatMap(r => r.prompts);
    console.log(`✅ Scraped ${allPrompts.length} prompts\n`);

    if (allPrompts.length === 0) {
      console.log('⚠️  No prompts found. Exiting.');
      return;
    }

    // 步骤 2: 评估提示词
    console.log('📊 Step 2: Evaluating prompts...');
    const evaluatedPrompts = await EvaluationService.evaluateBatch(allPrompts);
    console.log(`✅ Evaluated ${evaluatedPrompts.length} prompts\n`);

    // 步骤 3: 过滤高质量提示词
    console.log(`🔍 Step 3: Filtering prompts (min score: ${minScore})...`);
    const highQualityPrompts = evaluatedPrompts.filter(p => p.evaluation.score >= minScore);
    console.log(`✅ Found ${highQualityPrompts.length} high-quality prompts\n`);

    if (highQualityPrompts.length === 0) {
      console.log('⚠️  No high-quality prompts found. Try lowering the minScore.');
      return;
    }

    // 步骤 4: 保存评估结果
    console.log('💾 Step 4: Saving evaluation results...');
    await this.saveEvaluationResults(highQualityPrompts, outputDir);
    console.log('✅ Results saved\n');

    // 步骤 5: 转换为 Skills
    if (autoPublish) {
      console.log('🔄 Step 5: Converting prompts to Skills...');
      const { converted, published, failed } =
        await SkillConverterService.autoConvertAndPublish(highQualityPrompts);

      console.log(`✅ Converted: ${converted}`);
      console.log(`✅ Published: ${published}`);
      console.log(`❌ Failed: ${failed}\n`);
    } else {
      console.log('⏭️  Step 5: Skipping auto-publish (autoPublish=false)');
    }

    // 步骤 6: 生成报告
    console.log('📋 Step 6: Generating report...');
    const report = this.generateWorkflowReport(allPrompts, evaluatedPrompts, highQualityPrompts);
    await this.saveReport(report, outputDir);
    console.log('✅ Report generated\n');

    console.log('🎉 Workflow completed successfully!\n');

    return {
      scraped: allPrompts.length,
      evaluated: evaluatedPrompts.length,
      highQuality: highQualityPrompts.length,
      converted: autoPublish ? 'auto' : 'skipped',
      outputDir
    };
  }

  /**
   * 保存评估结果
   */
  private static async saveEvaluationResults(
    prompts: any[],
    outputDir: string
  ): Promise<void> {
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const jsonPath = path.join(outputDir, `prompts-${Date.now()}.json`);
    fs.writeFileSync(jsonPath, JSON.stringify(prompts, null, 2), 'utf-8');
    console.log(`📄 Saved to: ${jsonPath}`);
  }

  /**
   * 保存报告
   */
  private static async saveReport(
    report: string,
    outputDir: string
  ): Promise<void> {
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const reportPath = path.join(outputDir, `workflow-report-${Date.now()}.md`);
    fs.writeFileSync(reportPath, report, 'utf-8');
    console.log(`📄 Report saved to: ${reportPath}`);
  }

  /**
   * 生成工作流报告
   */
  private static generateWorkflowReport(
    allPrompts: any[],
    evaluatedPrompts: any[],
    highQualityPrompts: any[]
  ): string {
    const avgScore = evaluatedPrompts.reduce((sum, p) => sum + p.evaluation.score, 0) / evaluatedPrompts.length;

    let report = `# Prompt to Skill Workflow Report

Generated: ${new Date().toISOString()}

## Summary

| Metric | Count |
|--------|-------|
| Total Prompts Scraped | ${allPrompts.length} |
| Prompts Evaluated | ${evaluatedPrompts.length} |
| High-Quality Prompts (≥70) | ${highQualityPrompts.length} |
| Average Score | ${avgScore.toFixed(1)}/100 |
| Conversion Rate | ${((highQualityPrompts.length / allPrompts.length) * 100).toFixed(1)}% |

## High-Quality Prompts (Top 10)

`;

    const top10 = highQualityPrompts
      .sort((a, b) => b.evaluation.score - a.evaluation.score)
      .slice(0, 10);

    top10.forEach((prompt, index) => {
      report += `
### ${index + 1}. ${prompt.title}

**Score:** ${prompt.evaluation.score}/100 (${prompt.evaluation.tier})

**Description:** ${prompt.description.substring(0, 150)}...

**Category:** ${prompt.category}

**Sub-Scores:**
- Usefulness: ${prompt.evaluation.subScores.usefulness}/30
- Innovation: ${prompt.evaluation.subScores.innovation}/25
- Completeness: ${prompt.evaluation.subScores.completeness}/20
- Popularity: ${prompt.evaluation.subScores.popularity}/25

**Author:** ${prompt.author.username}

**Metrics:**
- Likes: ${prompt.metrics.likes}
- Retweets: ${prompt.metrics.retweets}
- Replies: ${prompt.metrics.replies}

---
`;
    });

    return report;
  }

  /**
   * 测试模式：抓取少量提示词进行测试
   */
  static async testMode(
    query: string = 'ChatGPT提示词'
  ): Promise<any> {
    console.log('🧪 Running in TEST MODE...\n');

    const result = await this.runWorkflow([query], {
      scrapeCount: 5,
      minScore: 60,
      autoPublish: false
    });

    console.log('🧪 Test completed.\n');

    return result;
  }

  /**
   * 生产模式：完整工作流
   */
  static async productionMode(
    queries: string[] = [
      'ChatGPT提示词',
      'Claude提示词',
      'PromptEngineering',
      'AI写作技巧',
      '编程助手'
    ]
  ): Promise<any> {
    console.log('🚀 Running in PRODUCTION MODE...\n');

    const result = await this.runWorkflow(queries, {
      scrapeCount: 20,
      minScore: 70,
      autoPublish: true
    });

    console.log('🚀 Production workflow completed.\n');

    return result;
  }
}

// CLI 接口
if (require.main === module) {
  const args = process.argv.slice(2);
  const mode = args[0] || 'production';
  const query = args[1];

  if (mode === 'test') {
    PromptToSkillWorkflow.testMode(query);
  } else if (mode === 'production') {
    PromptToSkillWorkflow.productionMode();
  } else {
    console.log('Usage:');
    console.log('  node prompt-to-skill-workflow.js test [query]');
    console.log('  node prompt-to-skill-workflow.js production');
    process.exit(1);
  }
}
