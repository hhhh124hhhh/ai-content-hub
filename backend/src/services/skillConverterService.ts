import * as fs from 'fs';
import * as path from 'path';
import * as archiver from 'archiver';
import { execSync } from 'child_process';

export interface SkillConfig {
  name: string;
  description: string;
  category: string;
  tags: string[];
}

export interface PromptToConvert {
  id: string;
  title: string;
  content: string;
  description: string;
  type: string;
  category: string;
  tags: string[];
  useCases: string[];
  difficulty: string;
  evaluation: any;
  author: any;
}

export class SkillConverterService {
  /**
   * 将提示词转换为 Skill 格式
   */
  static async convertPromptToSkill(prompt: PromptToConvert): Promise<string> {
    const skillName = this.sanitizeSkillName(prompt.title);
    const skillDir = path.join('/root/clawd/skills', skillName);

    console.log(`🔄 Converting prompt to Skill: ${skillName}`);

    // 创建 Skill 目录结构
    await this.createSkillDirectory(skillDir);

    // 生成 SKILL.md
    await this.generateSkillMd(skillDir, prompt);

    // 生成 references 文件
    await this.generateReferences(skillDir, prompt);

    // 打包为 .skill 文件
    const skillFilePath = await this.packageSkill(skillDir, skillName);

    console.log(`✅ Skill created: ${skillFilePath}`);

    return skillFilePath;
  }

  /**
   * 批量转换提示词为 Skills
   */
  static async convertBatchToSkills(prompts: PromptToConvert[]): Promise<string[]> {
    const results: string[] = [];

    for (const prompt of prompts) {
      try {
        // 只转换高质量提示词（评分 >= 70）
        if (prompt.evaluation && prompt.evaluation.score >= 70) {
          const skillPath = await this.convertPromptToSkill(prompt);
          results.push(skillPath);
        }
      } catch (error) {
        console.error(`❌ Failed to convert prompt ${prompt.id}:`, error);
      }
    }

    console.log(`✅ Converted ${results.length} prompts to Skills`);
    return results;
  }

  /**
   * 创建 Skill 目录结构
   */
  private static async createSkillDirectory(skillDir: string): Promise<void> {
    const dirs = [
      skillDir,
      path.join(skillDir, 'references'),
      path.join(skillDir, 'scripts')
    ];

    for (const dir of dirs) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    }
  }

  /**
   * 生成 SKILL.md
   */
  private static async generateSkillMd(skillDir: string, prompt: PromptToConvert): Promise<void> {
    const skillMdPath = path.join(skillDir, 'SKILL.md');

    const content = this.generateSkillMdContent(prompt);

    fs.writeFileSync(skillMdPath, content, 'utf-8');
  }

  /**
   * 生成 SKILL.md 内容
   */
  private static generateSkillMdContent(prompt: PromptToConvert): string {
    const tier = prompt.evaluation.tier || 'basic';
    const score = prompt.evaluation.score || 0;
    const author = prompt.author?.username || 'Unknown';

    let content = `---
name: ${this.sanitizeSkillName(prompt.title)}
description: ${this.escapeYaml(prompt.description)}
category: ${this.escapeYaml(prompt.category)}
tags: ${JSON.stringify(prompt.tags)}
tier: ${tier}
score: ${score}
original_author: ${this.escapeYaml(author)}
---

# ${prompt.title}

## Overview

${prompt.description}

## Original Score: ${score}/100

This Skill was automatically generated from a high-quality AI prompt found on X (Twitter).

**Evaluation:**
- **Usefulness**: ${prompt.evaluation.subScores?.usefulness || 0}/30
- **Innovation**: ${prompt.evaluation.subScores?.innovation || 0}/25
- **Completeness**: ${prompt.evaluation.subScores?.completeness || 0}/20
- **Popularity**: ${prompt.evaluation.subScores?.popularity || 0}/25

## Core Capabilities

### ${prompt.title}

**Original Prompt:**
\`\`\`
${prompt.content}
\`\`\`

**Use Cases:**
${prompt.useCases.map(useCase => `- ${useCase}`).join('\n')}

**Difficulty:** ${prompt.difficulty}

**Category:** ${prompt.category}

## Usage

When to use this Skill:
${prompt.useCases.map(useCase => `- ${useCase}`).join('\n')}

## Examples

### Example 1
\`\`\`
User: [Describe your task]
Codex: [Apply the prompt]
\`\`\`

### Example 2
\`\`\`
User: [Another task description]
Codex: [Apply the prompt with modifications]
\`\`\`

## Tips

- Use this skill for ${prompt.category.toLowerCase()} tasks
- Adjust the prompt based on your specific needs
- Combine with other skills for more complex tasks

## References

See \`references/\` directory for additional resources and templates.

---

*Generated from X (Twitter) by Clawdbot AI Prompt Marketplace*
`;

    return content;
  }

  /**
   * 生成 references 文件
   */
  private static async generateReferences(skillDir: string, prompt: PromptToConvert): Promise<void> {
    const referencesDir = path.join(skillDir, 'references');

    // 生成 prompt-template.md
    const templatePath = path.join(referencesDir, 'prompt-template.md');
    const templateContent = `# Prompt Template

## Original Prompt

${prompt.content}

## How to Use

1. Copy the prompt above
2. Replace variables ({{variable}}) with your specific values
3. Run with your preferred AI model (ChatGPT, Claude, etc.)

## Variables Used

${this.extractVariables(prompt.content).map(v => `- \`\`${{v}}\`\``).join('\n') || 'No variables detected'}

## Examples

### Example 1
\`\`\`
[Example usage with specific values]
\`\`\`

### Example 2
\`\`\`
[Another example]
\`\`\`
`;
    fs.writeFileSync(templatePath, templateContent, 'utf-8');

    // 生成 use-cases.md
    const useCasesPath = path.join(referencesDir, 'use-cases.md');
    const useCasesContent = `# Use Cases

${prompt.useCases.map((useCase, index) => `
## ${index + 1}. ${useCase}

**Description:** [How to use this prompt for ${useCase}]

**Example:**
\`\`\`
[Example prompt applied to ${useCase}]
\`\`\`
`).join('\n')}
`;
    fs.writeFileSync(useCasesPath, useCasesContent, 'utf-8');
  }

  /**
   * 提取变量
   */
  private static extractVariables(content: string): string[] {
    const variables = content.match(/{{\w+}}/g);
    return variables ? [...new Set(variables)] : [];
  }

  /**
   * 打包 Skill 为 .skill 文件
   */
  private static async packageSkill(skillDir: string, skillName: string): Promise<string> {
    const outputDir = path.join('/root/clawd/dist');
    const outputPath = path.join(outputDir, `${skillName}.skill`);

    // 确保输出目录存在
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // 使用 archiver 创建 zip 文件
    const output = fs.createWriteStream(outputPath);
    const archive = archiver('zip', {
      zlib: { level: 9 }
    });

    return new Promise((resolve, reject) => {
      output.on('close', () => {
        console.log(`✅ Skill packaged: ${outputPath} (${archive.pointer()} bytes)`);
        resolve(outputPath);
      });

      archive.on('error', (err) => {
        reject(err);
      });

      archive.pipe(output);
      archive.directory(skillDir, false);
      archive.finalize();
    });
  }

  /**
   * 清理 Skill 名称
   */
  private static sanitizeSkillName(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 50);
  }

  /**
   * 转义 YAML 字符
   */
  private static escapeYaml(text: string): string {
    return text
      .replace(/"/g, '\\"')
      .replace(/'/g, "\\'")
      .substring(0, 200);
  }

  /**
   * 发布 Skill 到 ClawdHub
   */
  static async publishToClawdHub(skillPath: string): Promise<boolean> {
    try {
      console.log(`📤 Publishing skill to ClawdHub: ${skillPath}`);

      // 使用 clawdhub CLI 发布
      const result = execSync(`clawdhub publish "${skillPath}"`, {
        encoding: 'utf-8',
        stdio: 'pipe'
      });

      console.log('✅ Skill published to ClawdHub');
      console.log(result);

      return true;
    } catch (error) {
      console.error('❌ Failed to publish to ClawdHub:', error);
      return false;
    }
  }

  /**
   * 批量发布 Skills 到 ClawdHub
   */
  static async publishBatchToClawdHub(skillPaths: string[]): Promise<{ success: number; failed: number }> {
    let success = 0;
    let failed = 0;

    for (const skillPath of skillPaths) {
      const result = await this.publishToClawdHub(skillPath);
      if (result) {
        success++;
      } else {
        failed++;
      }

      // 避免请求过快
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log(`✅ Published ${success} skills, ${failed} failed`);

    return { success, failed };
  }

  /**
   * 从评估结果自动转换并发布
   */
  static async autoConvertAndPublish(prompts: PromptToConvert[]): Promise<{
    converted: number;
    published: number;
    failed: number
  }> {
    console.log('🚀 Starting automatic conversion and publishing...');

    // 转换为 Skills
    const skillPaths = await this.convertBatchToSkills(prompts);

    // 发布到 ClawdHub
    const { success: published } = await this.publishBatchToClawdHub(skillPaths);

    return {
      converted: skillPaths.length,
      published,
      failed: skillPaths.length - published
    };
  }
}
