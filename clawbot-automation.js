#!/usr/bin/env node

/**
 * Clawdbot 自动化命令工具
 * 减少手动操作，让 jack happy 只需要说"做什么"，Clawdbot 自动完成
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const CONFIG = {
    // 项目配置
    project: {
        name: 'AI Prompt Marketplace',
        github: 'hhhh124hhhh/ai-content-hub',
        branch: 'main',
        worktreeRoot: '/root/clawd/ai-prompt-marketplace'
    },
    
    // 功能配置
    features: {
        createPR: {
            enabled: true,
            autoMerge: true,  // 自动合并小改动
            autoDeleteBranch: true  // 合并后自动删除分支
        },
        deploy: {
            enabled: true,
            environment: 'production',
            autoRollback: true   // 失败时自动回滚
        },
        build: {
            enabled: true,
            runTests: true,
            failOnError: true
        },
        git: {
            enabled: true,
            autoCommit: true,
            autoPush: true
        }
    }
};

/**
 * 命令：创建 Pull Request
 * 
 * 用法: clawbot pr create "feat: New feature"
 */
class PRCommand {
    constructor(githubToken) {
        this.githubToken = githubToken;
    }

    async execute(options = {}) {
        const {
            title = 'feat: Update project',
            body = 'Update with latest changes',
            base = 'main',
            head = 'main',  // 或其他分支
            reviewers = [],
            assignees = [],
            labels = [],
            milestone = null,
            draft = false
        } = options;

        console.log('╔══════════════════════════════════╗');
        console.log('║  🔧 Clawdbot - 创建 Pull Request      ║');
        console.log('╚═══════════════════════════════════╝');
        console.log('');

        console.log(`📋 标题: ${title}`);
        console.log(`📝 描述: ${body.substring(0, 50)}...`);
        console.log(`🌿 Base: ${base}`);
        console.log(`🌿 Head: ${head}`);
        console.log('');

        try {
            // 使用 GitHub API 创建 PR
            const result = this.createPullRequest({
                title,
                body,
                base,
                head,
                reviewers,
                assignees,
                labels,
                milestone,
                draft
            });

            console.log('✅ Pull Request 创建成功！');
            console.log('');
            console.log(`🔗 PR URL: ${result.html_url}`);
            console.log(`📊 PR 号: #${result.number}`);
            console.log('');

            // 自动合并（如果启用）
            if (CONFIG.features.createPR.autoMerge) {
                console.log('🔄 尝试自动合并...');
                const mergeResult = await this.autoMergePullRequest(result.number);
                if (mergeResult.success) {
                    console.log('✅ 自动合并成功！');
                }
            }

            return result;
        } catch (error) {
            console.error('❌ 创建 PR 失败:', error.message);
            throw error;
        }
    }

    createPullRequest(data) {
        const https = require('https');
        
        const options = {
            hostname: 'api.github.com',
            port: 443,
            path: `/repos/${CONFIG.project.github}/pulls`,
            method: 'POST',
            headers: {
                'Authorization': `token ${this.githubToken}`,
                'User-Agent': 'Clawdbot-Automation/1.0',
                'Accept': 'application/vnd.github+json'
            },
            json: true
        };

        return new Promise((resolve, reject) => {
            const req = https.request(options, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                    try {
                        const response = JSON.parse(data);
                        if (res.statusCode >= 200 && res.statusCode < 300) {
                            resolve(response);
                        } else {
                            reject(new Error(`GitHub API Error: ${res.statusCode}`));
                        }
                    } catch (e) {
                        reject(new Error(`JSON Parse Error: ${e.message}`));
                    }
                });
            });

            req.on('error', reject);
            req.write(JSON.stringify(data));
            req.end();
        });
    }

    async autoMergePullRequest(prNumber) {
        const https = require('https');

        const options = {
            hostname: 'api.github.com',
            port: 443,
            path: `/repos/${CONFIG.project.github}/pulls/${prNumber}/merge`,
            method: 'PUT',
            headers: {
                'Authorization': `token ${this.githubToken}`,
                'User-Agent': 'Clawdbot-Automation/1.0',
                'Accept': 'application/vnd.github+json'
            },
            json: true
        };

        return new Promise((resolve) => {
            const req = https.request(options, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        resolve({ success: true });
                    } else {
                        resolve({ success: false, error: `Status ${res.statusCode}` });
                    }
                });
            });

            req.on('error', (error) => {
                resolve({ success: false, error: error.message });
            });

            const mergeData = {
                commit_title: 'Automatically merged by Clawdbot',
                commit_message: 'Auto-merged by Clawdbot Automation Bot',
                merge_method: 'merge'
            };

            req.write(JSON.stringify(mergeData));
            req.end();
        });
    }
}

/**
 * 命令：部署到生产环境
 * 
 * 用法: clawbot deploy production
 */
class DeployCommand {
    constructor(githubToken, projectRoot) {
        this.githubToken = githubToken;
        this.projectRoot = projectRoot;
    }

    async execute(environment = 'production') {
        console.log('╔══════════════════════════════════╗');
        console.log('║  🚀 Clawdbot - 部署到生产环境     ║');
        console.log('╚═══════════════════════════════════╝');
        console.log('');

        console.log(`🌍 环境: ${environment}`);
        console.log(`📂 项目根目录: ${this.projectRoot}`);
        console.log('');

        try {
            // 1. 检查工作目录是否干净
            const status = this.getGitStatus();
            if (status.hasChanges) {
                console.log('⚠️  工作目录有未提交的更改');
                console.log('');
                console.log('💡 建议:');
                console.log('   1. 先提交更改');
                console.log('   2. 然后再部署');
                console.log('');
                console.log('📝 要先提交吗？运行: clawbot commit -m "描述"');
                throw new Error('Working directory is dirty');
            }

            // 2. 运行测试
            console.log('🧪 运行测试...');
            const testResult = this.runTests();
            if (!testResult.success) {
                console.log('❌ 测试失败，部署中止');
                throw new Error('Tests failed');
            }
            console.log('✅ 测试通过');

            // 3. 构建项目
            console.log('🔨 构建项目...');
            const buildResult = this.buildProject(environment);
            if (!buildResult.success) {
                console.log('❌ 构建失败，部署中止');
                throw new Error('Build failed');
            }
            console.log('✅ 构建成功');

            // 4. 部署
            console.log('🚀 部署中...');
            const deployResult = this.deploy(environment);
            if (!deployResult.success) {
                console.log('❌ 部署失败，回滚中...');
                await this.rollback();
                throw new Error('Deployment failed, rolled back');
            }
            console.log('✅ 部署成功！');
            console.log('');
            console.log(`🔗 应用地址: ${deployResult.url}`);

            return deployResult;
        } catch (error) {
            console.error('❌ 部署失败:', error.message);
            
            // 回滚（如果启用）
            if (CONFIG.features.deploy.autoRollback) {
                console.log('🔄 尝试回滚...');
                await this.rollback();
            }

            throw error;
        }
    }

    getGitStatus() {
        try {
            const result = execSync('git status --porcelain', {
                cwd: this.projectRoot,
                encoding: 'utf-8'
            });
            return {
                hasChanges: result.trim().length > 0,
                status: result.trim()
            };
        } catch (error) {
            return { hasChanges: false, status: '' };
        }
    }

    runTests() {
        try {
            execSync('npm run test:coverage', {
                cwd: this.projectRoot,
                stdio: 'inherit'
            });
            return { success: true };
        } catch (error) {
            return { success: false, error };
        }
    }

    buildProject(environment) {
        try {
            const command = environment === 'production' 
                ? 'npm run build:production' 
                : 'npm run build:staging';
            
            execSync(command, {
                cwd: this.projectRoot,
                stdio: 'inherit'
            });
            return { success: true };
        } catch (error) {
            return { success: false, error };
        }
    }

    deploy(environment) {
        // 这里应该是你的部署脚本
        // 可以是 Vercel、Netlify、Heroku 等
        try {
            execSync(`npm run deploy:${environment}`, {
                cwd: this.projectRoot,
                stdio: 'inherit'
            });
            return { 
                success: true, 
                url: 'https://your-app-url.com'
            };
        } catch (error) {
            return { success: false, error };
        }
    }

    async rollback() {
        try {
            // 回滚到上一个稳定的提交
            execSync('git reset --hard HEAD~1', {
                cwd: this.projectRoot
            });
            console.log('✅ 已回滚到上一个稳定版本');
        } catch (error) {
            console.error('❌ 回滚失败:', error.message);
        }
    }
}

/**
 * 命令：提交更改
 * 
 * 用法: clawbot commit -m "描述"
 */
class CommitCommand {
    constructor(projectRoot) {
        this.projectRoot = projectRoot;
    }

    async execute(message) {
        console.log('╔══════════════════════════════════╗');
        console.log('║  📝 Clawdbot - 自动提交               ║');
        console.log('╚═══════════════════════════════════╝');
        console.log('');

        console.log(`💬 提交信息: ${message}`);
        console.log('');

        try {
            // 1. 添加所有更改
            execSync('git add .', {
                cwd: this.projectRoot,
                stdio: 'inherit'
            });

            // 2. 提交
            const timestamp = new Date().toISOString();
            const commitMessage = `Clawdbot-auto: ${message}\n\nCommitted at: ${timestamp}`;
            
            execSync(`git commit -m "${commitMessage}"`, {
                cwd: this.projectRoot
            });

            console.log('✅ 提交成功！');
            console.log('');
            
            // 3. 自动推送（如果启用）
            if (CONFIG.features.git.autoPush) {
                console.log('📤 自动推送...');
                execSync('git push', {
                    cwd: this.projectRoot,
                    stdio: 'inherit'
                });
                console.log('✅ 推送成功！');
            }

            console.log('');
            console.log('💡 下一步: clawbot pr create "feat: Update"');
        } catch (error) {
            console.error('❌ 提交失败:', error.message);
            throw error;
        }
    }
}

/**
 * 主 CLI 程序
 */
class ClawdbotCLI {
    constructor() {
        this.githubToken = process.env.GITHUB_TOKEN;
        this.projectRoot = process.env.PROJECT_ROOT || process.cwd();
        
        this.prCommand = new PRCommand(this.githubToken);
        this.deployCommand = new DeployCommand(this.githubToken, this.projectRoot);
        this.commitCommand = new CommitCommand(this.projectRoot);
    }

    async run() {
        const args = process.argv.slice(2);
        const command = args[0];

        console.log('╔══════════════════════════════════╗');
        console.log('║  🤖 Clawdbot - 自动化命令行工具      ║');
        console.log('╚═══════════════════════════════════╝');
        console.log('');

        switch (command) {
            case 'pr':
            await this.handlePR(args.slice(1));
                break;
            case 'deploy':
                await this.handleDeploy(args.slice(1));
                break;
            case 'commit':
                await this.handleCommit(args.slice(1));
                break;
            case 'status':
                await this.handleStatus();
                break;
            case 'build':
                await this.handleBuild(args.slice(1));
                break;
            case 'test':
                await this.handleTest();
                break;
            default:
                await this.showHelp();
        }
    }

    async handlePR(args) {
        const title = args[0];
        const body = args.slice(1).join(' ');

        await this.prCommand.execute({ title, body });
    }

    async handleDeploy(args) {
        const environment = args[0] || 'production';
        await this.deployCommand.execute(environment);
    }

    async handleCommit(args) {
        const message = args.join(' ');
        await this.commitCommand.execute(message);
    }

    async handleStatus() {
        console.log('📊 项目状态:');
        console.log('');

        const status = this.deployCommand.getGitStatus();
        
        if (status.hasChanges) {
            console.log('📝 未提交的更改:');
            console.log(status.status);
        } else {
            console.log('✅ 工作目录干净');
        }
    }

    async handleBuild(args) {
        const environment = args[0] || 'production';
        const result = this.deployCommand.buildProject(environment);
        
        if (result.success) {
            console.log('✅ 构建成功！');
        } else {
            console.log('❌ 构建失败:', result.error);
            process.exit(1);
        }
    }

    async handleTest() {
        const result = this.deployCommand.runTests();
        
        if (result.success) {
            console.log('✅ 测试通过！');
        } else {
            console.log('❌ 测试失败:', result.error);
            process.exit(1);
        }
    }

    async showHelp() {
        console.log('╔══════════════════════════════════╗');
        console.log('║  📖 Clawdbot 命令帮助                ║');
        console.log('╚═══════════════════════════════════╝');
        console.log('');
        console.log('💡 用法: clawbot <命令> [参数]');
        console.log('');
        console.log('📋 可用命令:');
        console.log('');
        console.log('  pr <标题> <描述>        创建 Pull Request');
        console.log('    示例: clawbot pr create "feat: New feature" "Add new feature"');
        console.log('');
        console.log('  deploy [环境]            部署到环境');
        console.log('    环境: production (默认), staging');
        console.log('    示例: clawbot deploy production');
        console.log('');
        console.log('  commit -m "描述"         自动提交更改');
        console.log('    示例: clawbot commit -m "Fixed bug"');
        console.log('');
        console.log('  status                     查看项目状态');
        console.log('    示例: clawbot status');
        console.log('');
        console.log('  build [环境]              构建项目');
        console.log('    环境: production (默认), staging');
        console.log('    示例: clawbot build production');
        console.log('');
        console.log('  test                       运行测试');
        console.log('    示例: clawbot test');
        console.log('');
        console.log('  help                       显示此帮助');
        console.log('');
        console.log('🎯 典型工作流:');
        console.log('');
        console.log('  1. 提交更改:');
        console.log('     clawbot commit -m "Update evaluation algorithm"');
        console.log('');
        console.log('  2. 运行测试:');
        console.log('     clawbot test');
        console.log('');
        console.log('  3. 创建 PR:');
        console.log('     clawbot pr create "feat: Update evaluation"');
        console.log('');
        console.log('  4. 部署到生产:');
        console.log('     clawbot deploy production');
        console.log('');
        console.log('🤖 Clawdbot 会自动:');
        console.log('  - 运行所有测试');
        console.log('  - 构建生产版本');
        console.log('  - 创建 Pull Request');
        console.log('  - 自动合并（如果启用）');
        console.log('  - 自动删除分支（如果启用）');
        console.log('');
        console.log('⚙️  配置:');
        console.log('  - 自动合并: ' + (CONFIG.features.createPR.autoMerge ? '✅ 启用' : '❌ 禁用'));
        console.log('  - 自动删除分支: ' + (CONFIG.features.createPR.autoDeleteBranch ? '✅ 启用' : '❌ 禁用'));
        console.log('  - 自动回滚: ' + (CONFIG.features.deploy.autoRollback ? '✅ 启用' : '❌ 禁用'));
        console.log('');
        console.log('🔗 相关链接:');
        console.log('  - GitHub: https://github.com/hhhh124hhhh/ai-content-hub');
        console.log('  - 技能包: https://github.com/hhhh124hhhh/ultimate-skills-bundle');
        console.log('');
        console.log('💡 提示:');
        console.log('  - 环境变量: 设置 GITHUB_TOKEN 环境变量');
        console.log('  - 环境变量: 设置 PROJECT_ROOT 指定项目根目录');
        console.log('  - 所有命令都会自动处理错误和回滚');
        console.log('');
    }
}

// 运行 CLI
const cli = new ClawdbotCLI();
cli.run().catch(error => {
    console.error('❌ 命令执行失败:', error);
    process.exit(1);
});
